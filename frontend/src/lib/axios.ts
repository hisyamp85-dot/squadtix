import axios from "axios"

const api = axios.create({
  baseURL: 'http://127.0.0.1:3333',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // set true kalau butuh kirim cookie/session
})

// Log baseURL for debugging
console.log('Axios baseURL:', api.defaults.baseURL)

export default api
