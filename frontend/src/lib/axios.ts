import axios from 'axios'
import router from '@/router'

const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ||
  window.location.origin

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Bersihkan sesi lokal dan arahkan ke login
const forceLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('auth_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('role')
  localStorage.removeItem('user')

  if (router.currentRoute.value.path !== '/login') {
    router.replace('/login')
  }
}

// Inject token ke header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') ?? localStorage.getItem('auth_token')
  const scheme = (localStorage.getItem('token_type') || 'Bearer').trim() || 'Bearer'

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `${scheme} ${token}`,
    }
  }

  return config
})

// Auto-logout bila token invalid/expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 419) {
      forceLogout()
    }
    return Promise.reject(error)
  },
)

export default api
