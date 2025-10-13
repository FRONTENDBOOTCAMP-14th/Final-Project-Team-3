import type { StudyRoom } from '..'
import supabase from '../client'

export const readStudyRoom = async (): Promise<StudyRoom[]> => {
  const { data: studyRoomData, error } = await supabase
    .from('study_room')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return studyRoomData ?? []
}

export const getStudyRoomDetail = async (
  studyRoomId: string
): Promise<StudyRoom> => {
  const { data: studyRoomDetailData, error } = await supabase
    .from('study_room')
    .select('*')
    .eq('id', studyRoomId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return studyRoomDetailData
}

export const filterStudyRoom = async (
  region?: string,
  depth?: string,
  search?: string
): Promise<StudyRoom[]> => {
  let query = supabase.from('study_room').select('*')

  if (region && depth && search) {
    query = query
      .eq('region', region)
      .eq('region_depth', depth)
      .or(
        `title.ilike.%${search}%,category.ilike.%${search}%,region_depth.ilike.%${search}%,region.ilike.%${search}%`
      )
  } else if (!region && !depth && search) {
    query = query.or(
      `title.ilike.%${search}%,category.ilike.%${search}%,region_depth.ilike.%${search}%,region.ilike.%${search}%`
    )
  } else if (region && depth && !search) {
    query = query.eq('region', region).eq('region_depth', depth)
  }

  const { data: queryData, error } = await query

  if (error) {
    throw new Error(error.message)
  }
  return queryData
}
