import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET all industry insights
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('industry_insights')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST create new insight
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Generate insight ID
    const insightId = `INS-${Date.now().toString().slice(-6)}`

    const { data, error } = await supabase
      .from('industry_insights')
      .insert({
        insight_id: insightId,
        title: body.title,
        source: body.source,
        date: body.date,
        summary: body.summary,
        url: body.url,
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

// PATCH update insight
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from('industry_insights')
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

// DELETE insight
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('industry_insights')
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
