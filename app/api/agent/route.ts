import { anthropic } from '@ai-sdk/anthropic'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { demoSearch, demoFilter } from '@/lib/agent-demo-data'

export const maxDuration = 30

const SYSTEM = `You are the ReentryIQ data assistant. You help reentry and recovery program staff query upcoming Arizona prison releases, understand release trends, and find people they may be able to serve.

Today's date is ${new Date().toISOString().slice(0, 10)}.

You query a database of upcoming releases sourced from public ADCRR records via your tools. ALWAYS use a tool to answer data questions — never invent numbers.

After a tool returns, the UI renders the data as an interactive dashboard automatically (charts, tables, stat cards). So in your text response: do NOT repeat the full table. Give a 1-3 sentence insight summary — the headline number, the leader, anything notable. Like an analyst's annotation under a chart.

Rules:
- Release dates come from public records, refresh daily, and can change at the agency's discretion.
- This data is for outreach and program planning only — never for employment, tenant, credit, or insurance screening. Decline such requests.
- If results came back with source "demo", mention once that this is sample data until the database is connected.`

const supabaseConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: SYSTEM,
    messages,
    maxSteps: 5,
    tools: {
      searchReleases: tool({
        description:
          'Search upcoming releases. Returns individual records with name, county, facility, release date, offense class and match score.',
        parameters: z.object({
          county: z.string().optional().describe('County name, e.g. "Maricopa"'),
          name: z.string().optional().describe('Partial name search'),
          from_date: z.string().optional().describe('Start of release window (YYYY-MM-DD)'),
          to_date: z.string().optional().describe('End of release window (YYYY-MM-DD)'),
          facility: z.string().optional().describe('Facility partial match, e.g. "Lewis"'),
          limit: z.number().optional().describe('Max records (default 20)'),
        }),
        execute: async ({ county, name, from_date, to_date, facility, limit }) => {
          if (supabaseConfigured()) {
            try {
              const supabase = createClient()
              let query = supabase
                .from('releases')
                .select('id, first_name, last_name, county, facility, release_date, offense_class, match_score')
                .order('release_date', { ascending: true })
                .limit(limit ?? 20)
              if (county) query = query.ilike('county', `%${county}%`)
              if (from_date) query = query.gte('release_date', from_date)
              if (to_date) query = query.lte('release_date', to_date)
              if (facility) query = query.ilike('facility', `%${facility}%`)
              if (name) query = query.or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`)
              const { data, error } = await query
              if (!error && data) return { records: data, count: data.length, source: 'live' }
            } catch {
              // fall through to demo
            }
          }
          const records = demoSearch({ county, name, from_date, to_date, facility, limit })
          return { records, count: records.length, source: 'demo' }
        },
      }),

      getCountySummary: tool({
        description: 'Release counts grouped by county for a date range.',
        parameters: z.object({
          from_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
          to_date: z.string().optional().describe('End date (YYYY-MM-DD)'),
        }),
        execute: async ({ from_date, to_date }) => {
          let rows: { county: string }[] | null = null
          let source = 'demo'
          if (supabaseConfigured()) {
            try {
              const supabase = createClient()
              let query = supabase.from('releases').select('county')
              if (from_date) query = query.gte('release_date', from_date)
              if (to_date) query = query.lte('release_date', to_date)
              const { data, error } = await query
              if (!error && data) {
                rows = data
                source = 'live'
              }
            } catch {
              // fall through to demo
            }
          }
          if (!rows) rows = demoFilter({ from_date, to_date })

          const counts: Record<string, number> = {}
          for (const row of rows) counts[row.county] = (counts[row.county] ?? 0) + 1
          return {
            summary: Object.entries(counts)
              .sort((a, b) => b[1] - a[1])
              .map(([county, count]) => ({ county, count })),
            total: rows.length,
            source,
          }
        },
      }),

      getDailyVolume: tool({
        description: 'Release counts grouped by day, for trend analysis over a date range.',
        parameters: z.object({
          county: z.string().optional().describe('Filter to one county'),
          from_date: z.string().describe('Start date (YYYY-MM-DD)'),
          to_date: z.string().describe('End date (YYYY-MM-DD)'),
        }),
        execute: async ({ county, from_date, to_date }) => {
          let rows: { release_date: string }[] | null = null
          let source = 'demo'
          if (supabaseConfigured()) {
            try {
              const supabase = createClient()
              let query = supabase
                .from('releases')
                .select('release_date')
                .gte('release_date', from_date)
                .lte('release_date', to_date)
                .order('release_date')
              if (county) query = query.ilike('county', `%${county}%`)
              const { data, error } = await query
              if (!error && data) {
                rows = data
                source = 'live'
              }
            } catch {
              // fall through to demo
            }
          }
          if (!rows) rows = demoFilter({ county, from_date, to_date })

          const counts: Record<string, number> = {}
          for (const row of rows) counts[row.release_date] = (counts[row.release_date] ?? 0) + 1
          return {
            daily: Object.entries(counts)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([date, count]) => ({ date, count })),
            total: rows.length,
            source,
          }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
