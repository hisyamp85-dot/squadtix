<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const userStr = localStorage.getItem('user')

  if (!userStr) {
    router.replace('/login')
    return
  }

  let user: { role?: string } | null = null

  try {
    user = JSON.parse(userStr)
  } catch {
    localStorage.removeItem('user')
    router.replace('/login')
    return
  }

  switch (user?.role) {
    case 'Admin':
      router.replace('/admin')
      break
    case 'User':
      router.replace('/user')
      break
    case 'Scanner':
      router.replace('/scanner')
      break
    default:
      router.replace('/login')
  }
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    Redirecting...
  </div>
</template>
