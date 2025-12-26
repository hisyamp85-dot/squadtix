import axios from 'axios'
import router from '@/router'

const normalizeBaseUrl = (raw?: string | null) => {
  const cleaned = (raw ?? window.location.origin).replace(/\/+$/, '')
  return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`
}

const baseURL = normalizeBaseUrl(import.meta.env.VITE_API_URL as string | undefined)

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// =======================
// FORCE LOGOUT
// =======================
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

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ??
    localStorage.getItem('auth_token')

  const scheme =
    (localStorage.getItem('token_type') || 'Bearer').trim() || 'Bearer'

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `${scheme} ${token}`,
    }
  }

  return config
})

// =======================
// RESPONSE INTERCEPTOR
// =======================
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
