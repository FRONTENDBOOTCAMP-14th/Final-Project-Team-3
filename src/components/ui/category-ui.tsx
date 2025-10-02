import Icons from '../icons'

import '@/styles/ui/category-ui.css'

function CategoryUI() {
  return (
    <div role="group" className="category-wrapper">
      <p>
        <Icons name="category" aria-hidden="true" />
        <span>카테고리</span>
      </p>
      ∙
      <p>
        <Icons name="map-pin" aria-hidden="true" />
        <span>지역</span>
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
