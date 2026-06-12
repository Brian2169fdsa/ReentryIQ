import { anthropic } from '@ai-sdk/anthropic'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { runQueryReleases } from '@/lib/release-query'
import { fetchInmateRecord, demoRecord } from '@/lib/inmate-record'
import { resolveAccess, meterReveal } from '@/lib/data-gate'

export const maxDuration = 30

// The model NEVER writes SQL. It calls query_releases with whitelisted
// filters (lib/release-query.ts), and reveal_record for individual records —
// which routes through the same metered-reveal chokepoint as the panel.

const SYSTEM = `You are the ReentryIQ Assistant, embedded in the dashboard of a release-intelligence product for reentry & recovery programs.

Today's date is ${new Date().toISOString().slice(0, 10)}.

ALWAYS answer data questions by calling query_releases — never invent numbers. The UI renders your tool results as charts and tables automatically, so your text should be ONE bold-leading insight sentence (optionally a second sentence of context), like an analyst's annotation. Do not repeat the table.

For "next quarter"/"6 months"/"90 days" map to window_days_from/window_days_to (e.g. next 6 months → 0..180). Use intent "breakdown" with group_by for distribution questions, "count" for how-many, "list" for show-me requests.

Only call reveal_record when the user explicitly asks to open one specific person's full record; it consumes a metered record view — say so briefly when you use it.

Rules: data is from public ADCRR records and dates can change at the agency's discretion. Never assist with employment, tenant, credit, or insurance screening or any FCRA-covered purpose — decline and point to the FCRA notice. If results say source "demo", note once that sample data is shown until the database is connected.`

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const { messages } = await req.json()

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: SYSTEM,
    messages,
    maxSteps: 5,
    tools: {
      query_releases: tool({
        description:
          'Run a scoped, read-only query over upcoming releases. intent: "count" (how many), "list" (rows, max 25), or "breakdown" (grouped counts for charts).',
        parameters: z.object({
          intent: z.enum(['count', 'list', 'breakdown']),
          group_by: z.enum(['county', 'complex', 'status', 'week', 'score_band']).optional()
            .describe('Required for breakdown'),
          county: z.string().optional().describe('County name, e.g. "Maricopa"'),
          complex: z.string().optional().describe('Facility/complex partial match, e.g. "Perryville"'),
          status: z.string().optional().describe('Inmate status, e.g. "Active"'),
          window_days_from: z.number().optional().describe('Window start in days from today (default 0)'),
          window_days_to: z.number().optional().describe('Window end in days from today (default 180)'),
          min_score: z.number().optional().describe('Minimum match score 0-99'),
          limit: z.number().optional().describe('Row limit for list intent (max 25)'),
        }),
        execute: async params => runQueryReleases(params),
      }),

      reveal_record: tool({
        description:
          "Open one person's full record by ADC number. Consumes a metered record view — only call when explicitly requested.",
        parameters: z.object({
          adc_number: z.string().describe('The ADC number, e.g. "380700"'),
        }),
        execute: async ({ adc_number }) => {
          const access = await resolveAccess()
          // Sample-mode orgs can only ever reveal synthetic records.
          const lookup =
            access.mode === 'real'
              ? await fetchInmateRecord(adc_number)
              : { record: demoRecord(adc_number), source: 'demo' as const }
          const { record, source } = lookup
          if (!record) return { error: `No record found for ADC ${adc_number}.` }
          await meterReveal(access, adc_number)
          // Summary fields only in chat; the panel shows the full grouped record.
          return {
            source,
            record: {
              adc_number: record.adc_number,
              name: `${record.last_name}, ${record.first_name}${record.middle_initial ? ' ' + record.middle_initial : ''}`,
              status: record.status,
              custody_class: record.custody_class,
              prison_release_date: record.prison_release_date,
              release_type: record.release_type,
              complex: record.complex,
              unit: record.unit,
              counts: Object.fromEntries(record.sections.map(s => [s.key, s.rows.length])),
            },
          }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
