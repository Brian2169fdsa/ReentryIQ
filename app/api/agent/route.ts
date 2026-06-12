import { anthropic } from '@ai-sdk/anthropic'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

const SYSTEM = `You are a ReentryIQ data assistant. You help reentry and recovery program staff query upcoming Arizona prison releases, understand release trends, and find people they may be able to serve.

You have access to a database of upcoming releases sourced from public ADCRR records. You can search by county, date range, name, facility, and more.

Always remember:
- Release data is sourced from public records and refreshed daily.
- Dates can change at the agency's discretion.
- This data is for outreach and program planning only — never for employment, tenant, credit, or insurance screening.

Be concise. When returning lists, summarize counts and highlight the most relevant records. Never display more than 10 individual records at once unless explicitly asked.`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: SYSTEM,
    messages,
    maxSteps: 5,
    tools: {
      searchReleases: tool({
        description: 'Search upcoming releases from the database.',
        parameters: z.object({
          county: z.string().optional().describe('County name, e.g. "Maricopa"'),
          name: z.string().optional().describe('Partial name search'),
          from_date: z.string().optional().describe('Start of release date window (YYYY-MM-DD)'),
          to_date: z.string().optional().describe('End of release date window (YYYY-MM-DD)'),
          facility: z.string().optional().describe('Facility name partial match'),
          limit: z.number().optional().default(20),
        }),
        execute: async ({ county, name, from_date, to_date, facility, limit }) => {
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
          if (error) return { error: error.message }
          return { records: data, count: data?.length ?? 0 }
        },
      }),

      getCountySummary: tool({
        description: 'Get release counts by county for a date range.',
        parameters: z.object({
          from_date: z.string().optional(),
          to_date: z.string().optional(),
        }),
        execute: async ({ from_date, to_date }) => {
          const supabase = createClient()
          let query = supabase.from('releases').select('county')
          if (from_date) query = query.gte('release_date', from_date)
          if (to_date) query = query.lte('release_date', to_date)

          const { data, error } = await query
          if (error) return { error: error.message }

          const counts: Record<string, number> = {}
          for (const row of data ?? []) {
            counts[row.county] = (counts[row.county] ?? 0) + 1
          }
          return {
            summary: Object.entries(counts)
              .sort((a, b) => b[1] - a[1])
              .map(([county, count]) => ({ county, count })),
            total: data?.length ?? 0,
          }
        },
      }),

      getDailyVolume: tool({
        description: 'Get release counts grouped by day for trend analysis.',
        parameters: z.object({
          county: z.string().optional(),
          from_date: z.string(),
          to_date: z.string(),
        }),
        execute: async ({ county, from_date, to_date }) => {
          const supabase = createClient()
          let query = supabase
            .from('releases')
            .select('release_date')
            .gte('release_date', from_date)
            .lte('release_date', to_date)
            .order('release_date')

          if (county) query = query.ilike('county', `%${county}%`)

          const { data, error } = await query
          if (error) return { error: error.message }

          const counts: Record<string, number> = {}
          for (const row of data ?? []) {
            counts[row.release_date] = (counts[row.release_date] ?? 0) + 1
          }
          return {
            daily: Object.entries(counts).map(([date, count]) => ({ date, count })),
            total: data?.length ?? 0,
          }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
