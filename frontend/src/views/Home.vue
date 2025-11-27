import api from '@/lib/axios'

api.get('/ping')
  .then(res => console.log("Axios OK:", res.data))
  .catch(err => console.error("Axios ERROR:", err))
