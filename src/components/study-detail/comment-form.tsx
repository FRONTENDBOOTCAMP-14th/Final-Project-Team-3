import '@/styles/study-detail/comment.css'

function CommentForm() {
  return (
    <div className="comment-wrapper">
      <div className="comment-heading">
        <h3>댓글 (0)</h3>
      </div>

      <div className="comment-form-wrapper">
        <form className="comment-form">
          <label htmlFor="comment-input"></label>
          <input
            type="text"
            placeholder="댓글 쓰기..."
            id="comment-input"
            className="comment-input"
          />

          <div className="comment-btn-group">
            <button className="comment-btn cancel-btn">취소</button>
            <button className="comment-btn">댓글</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommentForm
