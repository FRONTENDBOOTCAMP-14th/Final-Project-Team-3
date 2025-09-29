import React, { useRef, useState } from 'react'

import useFocusTrap from '../../hooks/useFocusTrap'
import useKeyEvent from '../../hooks/useKeyEvent'
import REGION_DATA, {
  type DepthName,
  type RegionName,
} from '../../types/region'
import Icons from '../icons'

interface Props {
  setCategoryVisible: (value: React.SetStateAction<boolean>) => void
  categoryVisible: boolean
}

function RegionCategories({ setCategoryVisible, categoryVisible }: Props) {
  const categoryRef = useRef<HTMLDivElement | null>(null)

  const [selectedRegion, setSelectedRegion] = useState<RegionName>('서울특별시')
  const [selectedDepth, setSelectedDepth] = useState('')

  useFocusTrap(categoryRef)
  useKeyEvent(
    'Escape',
    () => {
      setCategoryVisible(false)
    },
    categoryVisible
  )

  const regionNames = Object.keys(REGION_DATA) as RegionName[]
  const depths: DepthName<RegionName>[] = [...REGION_DATA[selectedRegion]]

  return (
    <>
      <div
        className="region-container"
        aria-modal={true}
        ref={categoryRef}
        aria-label="지역 카테고리"
        aria-hidden={!categoryVisible}
      >
        <div className="region-header">
          <Icons name="map-pin" aria-hidden width={20} height={20} />
          <h3>지역</h3>
        </div>
        <div className="categories-wrapper">
          <ul className="region-lists">
            {regionNames.map((region) => (
              <li
                key={region}
                className={`region-lists-item ${selectedRegion === region ? 'active' : ''}`}
              >
                <button type="button" onClick={() => setSelectedRegion(region)}>
                  {region}
                </button>
              </li>
            ))}
          </ul>
          <ul className="depth-lists">
            {depths.map((depth) => (
              <li
                key={depth}
                className={`depth-lists-item ${selectedDepth === depth ? 'active' : ''}`}
              >
                <button type="button" onClick={() => setSelectedDepth(depth)}>
                  {depth}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        role="button"
        className="category-overlay active"
        onClick={() => setCategoryVisible(false)}
      ></div>
    </>
  )
}

export default RegionCategories
