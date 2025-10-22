import Link from 'next/link'

import Icons from '@/components/icons'
import '@/styles/study-detail/edit-button.css'

interface Props {
  studyId: string
}

export default async function EditButton({ studyId }: Props) {
  return (
    <div className="edit-button-wrap" title="수정 하기">
      <Link href={`/study-edit/${studyId}`} className="edit-button-link">
        <Icons name="edit" width={24} height={24} />
      </Link>
    </div>
  )
}
