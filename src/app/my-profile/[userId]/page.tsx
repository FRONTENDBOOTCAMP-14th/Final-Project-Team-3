import ProfilePageClient from '@/components/ProfilePageClient/ProfilePageClient'

interface PageProps {
  params: {
    userId: string
  }
}

export default async function MyProfilePage({ params }: PageProps) {
  const { userId } = params

  const user = {
    name: `사용자 ${userId}`,
    email: `user${userId}@example.com`,
    avatarUrl: '/avatar-default.png',
  }

  const studies = [
    {
      id: 1,
      title: 'React 스터디',
      role: '참가자',
      imageUrl: '/images/no-image.png',
      category: '프론트엔드',
      location: '서울',
      members: 5,
      likes: 12,
    },
    {
      id: 2,
      title: 'TypeScript 스터디',
      role: '리더',
      imageUrl: '/images/no-image.png',
      category: '프론트엔드',
      location: '온라인',
      members: 8,
      likes: 20,
    },
  ]

  const favorites = [
    {
      id: 3,
      title: 'Next.js 스터디',
      imageUrl: '/images/no-image.png',
      category: '프론트엔드',
      location: '서울',
      members: 10,
      likes: 5,
    },
    {
      id: 4,
      title: 'GraphQL 스터디',
      imageUrl: '/images/no-image.png',
      category: '백엔드',
      location: '온라인',
      members: 7,
      likes: 7,
    },
  ]

  return (
    <ProfilePageClient user={user} studies={studies} favorites={favorites} />
  )
}
