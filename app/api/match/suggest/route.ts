import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await req.json()

    const { suggesterName, suggesterMessage, person1, person2 } = body

    // Validation
    if (!person1?.phone || !person2?.phone) {
      return NextResponse.json(
        { error: 'Both phone numbers are required' },
        { status: 400 }
      )
    }

    if (person1.phone === person2.phone) {
      return NextResponse.json(
        { error: 'Cannot match someone with themselves' },
        { status: 400 }
      )
    }

    // Phone number format validation (basic)
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneRegex.test(person1.phone) || !phoneRegex.test(person2.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use international format: +1234567890' },
        { status: 400 }
      )
    }

    // Generate unique tokens for shareable links
    const person1Token = nanoid(16)
    const person2Token = nanoid(16)

    // Insert suggestion into database
    const { data, error } = await supabase
      .from('match_suggestions')
      .insert({
        suggester_name: suggesterName || null,
        suggester_message: suggesterMessage || null,
        person1_phone: person1.phone,
        person1_name: person1.name || null,
        person1_token: person1Token,
        person2_phone: person2.phone,
        person2_name: person2.name || null,
        person2_token: person2Token,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)

      // Check for duplicate constraint
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'These two people have already been matched recently' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to create match suggestion. Please try again.' },
        { status: 500 }
      )
    }

    // Generate shareable links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    return NextResponse.json({
      success: true,
      matchId: data.id,
      links: {
        person1: `${baseUrl}/m/${person1Token}`,
        person2: `${baseUrl}/m/${person2Token}`,
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
