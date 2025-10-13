import type { Tables, TablesInsert, TablesUpdate } from './database.types'

// 프로필 타입
export type Profile = Tables<'profile'>
export type ProfileInsert = TablesInsert<'profile'>
export type ProfileUpdate = TablesUpdate<'profile'>

// 스터디 룸 타입
export type StudyRoom = Tables<'study_room'>
export type StudyRoomInsert = TablesInsert<'study_room'>
export type StudyRoomUpdate = TablesUpdate<'study_room'>
