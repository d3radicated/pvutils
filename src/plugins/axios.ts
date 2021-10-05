import axios from 'axios'

export const pvuInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '').toString(),
})

export default axios
