import axios from 'axios'

// const Base_url = import.meta.env.VITE_SERVER_URL
const Base_url = import.meta.env.MODE === 'development' ? '/api' : import.meta.env.VITE_SERVER_URL

const request = axios.create({
  baseURL: Base_url,
  timeout: 5000,
})

request.interceptors.response.use((res) => {
  return res.data
})

export default request
