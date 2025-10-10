import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const supabase = await createClient()

    // Get all matches where this user is either person1 or person2
    const { data, error } = await supabase
      .from('match_suggestions')
      .select('*')
      .or(`person1_user_id.eq.${userId},person2_user_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching matches:', error)
      return NextResponse.json(
        { error: 'Failed to fetch matches' },
        { status: 500 }
      )
    }

    // Transform data to include relevant info for the current user
    const matches = data.map((match) => {
      const isPersonsent1 = match.person1_user_id === userId
      const isPending = match.status === 'pending' || match.status === 'one_joined'

      return {
        id: match.id,
        status: match.status,
        suggesterName: match.suggester_name,
        message: match.suggester_message,
        createdAt: match.created_at,
        otherUser: isPending
          ? null
          : {
              id: isPersonsent1 ? match.person2_user_id : match.person1_user_id,
              name: isPersonsent1 ? match.person2_name : match.person1_name,
              phone: isPersonsent1 ? match.person2_phone : match.person1_phone,
            },
      }
    })

    return NextResponse.json({ matches })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
