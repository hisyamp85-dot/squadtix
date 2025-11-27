import api from '@/lib/axios'

export function testPing() {
  api.get('/ping')
    .then(res => console.log("Backend OK:", res.data))
    .catch(err => console.error("ERROR:", err))
}
