import type { Tables, TablesInsert, TablesUpdate } from './database.types'

// 프로필 타입
export type Profile = Tables<'profile'>
export type ProfileInsert = TablesInsert<'profile'>
export type ProfileUpdate = TablesUpdate<'profile'>

// 스터디 룸 타입
export type StudyRoom = Tables<'study_room'>
export type StudyRoomInsert = TablesInsert<'study_room'>
export type StudyRoomUpdate = TablesUpdate<'study_room'>

// 스터디 룸 신청 타입
export type StudyRoomRequests = Tables<'study_requests'>
export type StudyRoomRequestsInsert = TablesInsert<'study_requests'>
export type StudyRoomRequestsUpdate = TablesUpdate<'study_requests'>

// 스터디 룸 참가 정보 타입
export type StudyRoomParticipants = Tables<'study_participants'>
export type StudyRoomParticipantsInsert = TablesInsert<'study_participants'>
export type StudyRoomParticipantsUpdate = TablesUpdate<'study_participants'>

// 스터디 룸 즐겨찾기 타입
export type Bookmark = Tables<'bookmark'>
export type BookmarkInsert = TablesInsert<'bookmark'>
export type BookmarkUpdate = TablesUpdate<'bookmark'>

// 스터디 룸 좋아요 타입
export type Likes = Tables<'likes'>
export type LikesInsert = TablesInsert<'likes'>
export type LikesUpdate = TablesUpdate<'likes'>

// 스터디 룸 코멘트 타입
export type Comments = Tables<'comments'>
export type CommentsInsert = TablesInsert<'comments'>
export type CommentsUpdate = TablesUpdate<'comments'>

// 스터디 룸 채팅 타입
export type Chat = Tables<'chat'>
export type ChatInsert = TablesInsert<'chat'>
export type ChatUpdate = TablesUpdate<'chat'>
