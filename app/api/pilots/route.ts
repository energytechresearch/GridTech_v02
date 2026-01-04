import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET all pilots
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const phase = searchParams.get('phase')

    let query = supabase
      .from('pilots')
      .select('*')
      .order('created_at', { ascending: false })

    if (phase) {
      query = query.eq('phase', phase)
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

// POST create new pilot
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Generate pilot ID
    const pilotId = `PIL-${Date.now().toString().slice(-6)}`

    const { data, error } = await supabase
      .from('pilots')
      .insert({
        pilot_id: pilotId,
        title: body.title,
        technology_id: body.technology_id,
        phase: body.phase || 'initiation',
        status: body.status,
        sponsor: body.sponsor,
        location: body.location,
        start_date: body.start_date,
        end_date: body.end_date,
        objectives: body.objectives,
        progress: body.progress || 0,
        lessons_learned: body.lessons_learned,
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

// PATCH update pilot
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from('pilots')
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

// DELETE pilot
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('pilots')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
