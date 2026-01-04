import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get count of active pilots
    const { count: activeProjects } = await supabase
      .from('pilots')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get count of completed pilots
    const { count: completed } = await supabase
      .from('pilots')
      .select('*', { count: 'exact', head: true })
      .eq('phase', 'completed')

    // Get count of pending/in-review submissions
    const { count: pendingReview } = await supabase
      .from('intake_submissions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'in-review'])

    // Get count of at-risk pilots (active with progress < 50%)
    const { count: atRisk } = await supabase
      .from('pilots')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .lt('progress', 50)

    return NextResponse.json({
      activeProjects: activeProjects || 0,
      completed: completed || 0,
      pendingReview: pendingReview || 0,
      atRisk: atRisk || 0
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
