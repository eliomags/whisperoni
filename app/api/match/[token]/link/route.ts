import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const supabase = await createClient()
    const { userId, phone } = await req.json()

    if (!userId || !phone) {
      return NextResponse.json(
        { error: 'User ID and phone number required' },
        { status: 400 }
      )
    }

    // Find the match
    const { data: match, error: fetchError } = await supabase
      .from('match_suggestions')
      .select('*')
      .or(`person1_token.eq.${token},person2_token.eq.${token}`)
      .single()

    if (fetchError || !match) {
      console.error('Match not found:', fetchError)
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Determine which person and validate phone
    const isPerson1 = match.person1_token === token
    const isCorrectPhone = isPerson1
      ? match.person1_phone === phone
      : match.person2_phone === phone

    if (!isCorrectPhone) {
      return NextResponse.json(
        { error: 'Phone number does not match this invitation' },
        { status: 400 }
      )
    }

    // Check if already linked
    if (isPerson1 && match.person1_user_id) {
      return NextResponse.json(
        { error: 'This match link has already been used' },
        { status: 409 }
      )
    }
    if (!isPerson1 && match.person2_user_id) {
      return NextResponse.json(
        { error: 'This match link has already been used' },
        { status: 409 }
      )
    }

    // Update the match with user ID
    const updateData = isPerson1
      ? {
          person1_user_id: userId,
          person1_joined_at: new Date().toISOString(),
          person1_status: 'joined',
        }
      : {
          person2_user_id: userId,
          person2_joined_at: new Date().toISOString(),
          person2_status: 'joined',
        }

    const { data: updated, error: updateError } = await supabase
      .from('match_suggestions')
      .update(updateData)
      .eq('id', match.id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to link match' },
        { status: 500 }
      )
    }

    const bothJoined = updated.status === 'both_joined'

    // Return match info
    return NextResponse.json({
      success: true,
      bothJoined,
      matchId: updated.id,
      otherUser: bothJoined
        ? isPerson1
          ? {
              id: updated.person2_user_id,
              name: updated.person2_name,
              phone: updated.person2_phone,
            }
          : {
              id: updated.person1_user_id,
              name: updated.person1_name,
              phone: updated.person1_phone,
            }
        : null,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
