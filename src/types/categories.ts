export const STUDY_CATEGORIES = [
  '개발',
  '프론트엔드',
  '백엔드',
  '디자인',
  '외국어',
  '취업/이직',
  '자격증',
  '독서',
  '건강',
  '취미',
  '운동',
  '공부',
  '자기개발',
  '반려동물',
  '게임',
] as const
export type StudyCategory = (typeof STUDY_CATEGORIES)[number]
