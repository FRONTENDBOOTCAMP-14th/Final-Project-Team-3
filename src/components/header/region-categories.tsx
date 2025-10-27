'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useRef, useState } from 'react'

import Icons from '@/components/icons'
import useFocusTrap from '@/hooks/useFocusTrap'
import useKeyEvent from '@/hooks/useKeyEvent'
import type { DepthName, RegionName } from '@/types/region'
import REGION_DATA from '@/types/region'

interface Props {
  setCategoryVisible: (value: React.SetStateAction<boolean>) => void
  setSelectCategory: (value: React.SetStateAction<string>) => void
  categoryVisible: boolean
  selectCategory: string
}

function RegionCategories({
  setCategoryVisible,
  setSelectCategory,
  categoryVisible,
  selectCategory,
}: Props) {
  const categoryRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedRegion, setSelectedRegion] = useState<RegionName>(
    (searchParams.get('region') as RegionName) ?? '서울특별시'
  )
  const [selectedDepth, setSelectedDepth] = useState(selectCategory)

  useFocusTrap(categoryRef, categoryVisible)
  useKeyEvent(
    'Escape',
    () => {
      setCategoryVisible(false)
    },
    categoryVisible
  )

  const regionNames = Object.keys(REGION_DATA) as RegionName[]

  const depths: DepthName<RegionName>[] = [...REGION_DATA[selectedRegion]]

  const handleDepthSelect = (region: string = '', depth: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (depth === '전체') {
      params.delete('region')
      params.delete('depth')
    } else {
      params.set('region', region)
      params.set('depth', depth)
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <>
      <div
        className={`region-container ${categoryVisible ? 'is-open' : ''}`}
        aria-modal={true}
        ref={categoryRef}
        aria-label="지역 카테고리"
        inert={!categoryVisible ? true : undefined}
      >
        <div className="region-wrapper">
          <div className="region-header">
            <Icons name="map-pin" aria-hidden width={20} height={20} />
            <h3>지역</h3>
          </div>
          <div className="region-entire">
            <button
              type="button"
              className="region-entire-btn"
              onClick={() => {
                setSelectedDepth('전체')
                setSelectCategory('전체')
                handleDepthSelect('', '전체')
                setSelectedRegion('서울특별시')
                setCategoryVisible(false)
              }}
              tabIndex={categoryVisible ? 0 : -1}
              aria-disabled={!categoryVisible}
            >
              전체
            </button>
          </div>
          <div className="categories-wrapper">
            <ul className="region-lists">
              {regionNames.map((region) => (
                <li
                  key={region}
                  className={`region-lists-item ${selectedRegion === region ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRegion(region)
                    }}
                    tabIndex={categoryVisible ? 0 : -1}
                    aria-disabled={!categoryVisible}
                  >
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
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDepth(depth)
                      setSelectCategory(depth)
                      handleDepthSelect(selectedRegion, depth)
                      setCategoryVisible(false)
                    }}
                    tabIndex={categoryVisible ? 0 : -1}
                    aria-disabled={!categoryVisible}
                  >
                    {depth}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        className={`category-overlay ${categoryVisible ? 'active' : ''}`}
        onClick={() => setCategoryVisible(false)}
        aria-hidden="true"
      ></div>
    </>
  )
}

export default RegionCategories
