import axios, { AxiosInstance } from 'axios'

export const pvuInstance = <AxiosInstance> axios.create({
  baseURL: import.meta.env.VITE_API_URL?.toString(),
})

export default axios
