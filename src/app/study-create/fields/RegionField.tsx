'use client'
import InlineSelect from '../ui/InlineSelect'

export default function RegionField({
  region,
  setRegion,
  regionDepth,
  setRegionDepth,
  regionData,
}: {
  region: string
  setRegion: (v: string) => void
  regionDepth: string
  setRegionDepth: (v: string) => void
  regionData: Record<string, string[]>
}) {
  const regionOptions = Object.keys(regionData).map((r) => ({
    label: r,
    value: r,
  }))
  const depthOptions = region
    ? regionData[region].map((d) => ({ label: d, value: d }))
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
