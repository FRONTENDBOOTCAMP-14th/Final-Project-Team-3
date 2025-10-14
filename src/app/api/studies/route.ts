import { NextResponse } from 'next/server'

import { readStudyRoom } from '@/libs/supabase/api/study-room'

export async function GET() {
  return readStudyRoom()
    .then((data) => NextResponse.json(data))
    .catch((error) => new NextResponse(JSON.stringify(error), { status: 500 }))
}
