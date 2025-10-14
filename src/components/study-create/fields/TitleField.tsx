export default function TitleField() {
  return (
    <div className="form-field form-field--full">
      <label className="field-label" htmlFor="title">스터디&모임명</label>
      <input id="title" name="title" className="field-control" type="text" required />
    </div>
  )
}