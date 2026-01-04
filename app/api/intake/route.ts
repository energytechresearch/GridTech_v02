import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET all intake submissions
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('intake_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST create new intake submission
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Generate submission ID
    const submissionId = `NGT-${Date.now().toString().slice(-6)}`

    const { data, error } = await supabase
      .from('intake_submissions')
      .insert({
        submission_id: submissionId,
        title: body.title,
        description: body.description,
        category: body.category,
        type: body.type,
        submitter_name: body.submitter_name,
        submitter_email: body.submitter_email,
        submitter_department: body.submitter_department,
        grid_layer: body.grid_layer,
        benefits: body.benefits,
        vendors: body.vendors,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH update intake submission
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from('intake_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
