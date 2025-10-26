'use client'

import InlineSelect from '@/components/study-create/ui/InlineSelect'
import REGION_DATA from '@/types/region'

interface Props {
  region: string
  setRegion: (v: string) => void
  regionDepth: string
  setRegionDepth: (v: string) => void
}

export default function RegionField({
  region,
  setRegion,
  regionDepth,
  setRegionDepth,
}: Props) {
  const regionOptions = Object.keys(REGION_DATA).map((r) => ({
    label: r,
    value: r,
  }))
  const depthOptions = region
    ? REGION_DATA[region].map((d: string) => ({ label: d, value: d }))
    : []

  return (
    <>
      <div className="form-field">
        <label className="field-label" htmlFor="region">
          활동지역
        </label>
        <InlineSelect
          name="region"
          value={region}
          onChange={(v) => {
            setRegion(v)
            setRegionDepth('')
          }}
          options={regionOptions}
          placeholder="광역시/도 선택"
        />
      </div>

      <div className="form-field">
        <label className="field-label" htmlFor="regionDepth">
          세부지역
        </label>
        <InlineSelect
          name="regionDepth"
          value={regionDepth}
          onChange={setRegionDepth}
          options={depthOptions}
          placeholder="구/군 선택"
          disabled={!region}
        />
      </div>
    </>
  )
}
