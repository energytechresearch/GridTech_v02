import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET all vendors
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST create new vendor
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Generate vendor ID
    const vendorId = `VEN-${Date.now().toString().slice(-6)}`

    const { data, error } = await supabase
      .from('vendors')
      .insert({
        vendor_id: vendorId,
        name: body.name,
        focus: body.focus,
        maturity: body.maturity || 'growth',
        region: body.region,
        active_pilots: body.active_pilots || 0,
        related_technologies: body.related_technologies || [],
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

// PATCH update vendor
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from('vendors')
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

// DELETE vendor
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('vendors')
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
