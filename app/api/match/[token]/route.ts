import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const supabase = await createClient()

    // Find match by either person1_token or person2_token
    const { data, error } = await supabase
      .from('match_suggestions')
      .select('*')
      .or(`person1_token.eq.${token},person2_token.eq.${token}`)
      .single()

    if (error || !data) {
      console.error('Match not found:', error)
      return NextResponse.json(
        { error: 'Match not found or link is invalid' },
        { status: 404 }
      )
    }

    // Determine which person this token belongs to
    const isPerson1 = data.person1_token === token
    const personNumber = isPerson1 ? 1 : 2

    // Return match details (without sensitive info)
    return NextResponse.json({
      matchId: data.id,
      personNumber,
      suggesterName: data.suggester_name,
      message: data.suggester_message,
      otherPersonName: isPerson1 ? data.person2_name : data.person1_name,
      status: data.status,
      createdAt: data.created_at,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
