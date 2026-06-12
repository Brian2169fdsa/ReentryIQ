import { DashboardApp } from '@/components/dashboard/DashboardApp'

export const metadata = {
  title: 'Dashboard — ReentryIQ',
  description: 'Search every upcoming Arizona release by county, facility, date window, and match score.',
}

export default function DashboardPage() {
  return <DashboardApp />
}
