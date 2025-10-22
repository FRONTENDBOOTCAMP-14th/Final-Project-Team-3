export interface ResultType<T> {
  ok: boolean
  data?: T
  message?: string
}
