import type { StudyRoom } from '../../libs/supabase'
import Icons from '../icons'

import '@/styles/ui/category-ui.css'

interface Props {
  studyData: StudyRoom
}

function CategoryUI({ studyData }: Props) {
  return (
    <div role="group" className="category-wrapper">
      <p>
        <Icons name="category" aria-hidden="true" />
        <span>{studyData.category}</span>
      </p>
      ∙
      <p>
        <Icons name="map-pin" aria-hidden="true" />
        <span>{studyData.region_depth}</span>
      </p>
      ∙
      <p>
        <Icons name="user" aria-hidden="true" />
        <span>인원 수</span>
      </p>
      ∙
      <p>
        <Icons name="heart" aria-hidden="true" />
        <span>좋아요 수</span>
      </p>
    </div>
  )
}

export default CategoryUI
