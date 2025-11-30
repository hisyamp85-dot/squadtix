import axios from 'axios'

// Interceptor global untuk normalisasi bentuk response
axios.interceptors.response.use(
  (response: any) => {
    const raw: any = response.data

    // Kalau sudah array, biarin
    if (Array.isArray(raw)) {
      return response
    }

    // Kalau object, coba cari property yang isinya array
    if (raw && typeof raw === 'object') {
      if (Array.isArray(raw.data)) {
        response.data = raw.data
        return response
      }

      if (Array.isArray(raw.result)) {
        response.data = raw.result
        return response
      }

      if (Array.isArray(raw.items)) {
        response.data = raw.items
        return response
      }
    }

    // Kalau bukan list / bukan pattern di atas, biarkan apa adanya
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)
