import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

/* ========================
   REQUEST: attach token
======================== */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})


/* ========================
   RESPONSE: auto logout
======================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 🔥 AUTO LOGOUT
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      router.push('/login')
    }

    return Promise.reject(error)
  }
)

export default api
