import axios from 'axios'

export interface Response<T> {
  data: T
  status: number
}

export const pvuInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '').toString(),
})

export default axios
