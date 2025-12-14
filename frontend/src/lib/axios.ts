import axios from 'axios'

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

// 🔐 Inject token ke header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  const type = localStorage.getItem('token_type') ?? 'Bearer'

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `${type} ${token}`,
    }
  }

  return config
})

export default api
