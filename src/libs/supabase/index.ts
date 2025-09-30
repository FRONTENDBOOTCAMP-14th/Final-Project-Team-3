import { createClient } from '@supabase/supabase-js'

import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAPIKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY as string

const supabase = createClient<Database>(supabaseUrl, supabaseAPIKey)

export default supabase

// 프로필 타입
export type Profile = Tables<'profile'>
export type ProfileInsert = TablesInsert<'profile'>
export type ProfileUpdate = TablesUpdate<'profile'>

// 스터디 룸 타입
export type StudyRoom = Tables<'study_room'>
export type StudyRoomInsert = TablesInsert<'study_room'>
export type StudyRoomUpdate = TablesUpdate<'study_room'>
