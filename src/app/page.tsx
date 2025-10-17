import HomeComponents from '@/components/home'

import '@/styles/floating-button/floating-button.css'

interface Props {
  searchParams: Promise<{ region?: string; depth?: string; search?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { region, depth, search } = await searchParams

  return (
    <section>
      <HomeComponents region={region} depth={depth} search={search} />
    </section>
  )
}
