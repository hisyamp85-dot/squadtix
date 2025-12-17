<template>
  <component v-if="activeComponent" :is="activeComponent" />

  <div
    v-else
    class="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 px-4"
  >
    <div class="max-w-md text-center space-y-3">
      <p class="text-sm font-semibold text-slate-500">Tidak bisa menentukan tampilan</p>
      <p class="text-base text-slate-700">
        Role tidak dikenali atau sesi belum tersedia. Silakan login ulang.
      </p>
      <button
        type="button"
        @click="goToLogin"
        class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
      >
        Ke halaman login
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onMounted,
  ref,
  type AsyncComponentLoader,
  type Component,
} from 'vue'
import { useRouter } from 'vue-router'

type NormalizedRole = 'admin' | 'user' | 'scanner' | null

const router = useRouter()
const role = ref<NormalizedRole>(null)

const normalizeRole = (rawRole: unknown): NormalizedRole => {
  const r = String(rawRole ?? '').toLowerCase().trim()
  if (['admin', 'administrator', 'superadmin'].includes(r)) return 'admin'
  if (r === 'scanner') return 'scanner'
  return r ? 'user' : null
}

const readRole = (): NormalizedRole => {
  try {
    const storedRole = localStorage.getItem('role')
    if (storedRole) return normalizeRole(storedRole)

    const rawUser = localStorage.getItem('user')
    if (rawUser) {
      const parsed = JSON.parse(rawUser) as { role?: unknown }
      return normalizeRole(parsed.role)
    }
  } catch {
    return null
  }
  return null
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.replace('/login')
    return
  }
  role.value = readRole()
})

const goToLogin = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('auth_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
  router.replace('/login')
}

const roleComponents: Record<
  Exclude<NormalizedRole, null>,
  AsyncComponentLoader<Component>
> = {
  admin: () => import('./Admin/Dashboard/DashboardAdmin.vue'),
  user: () => import('./User/DashboardUser.vue'),
  scanner: () => import('@/views/Scanner/ScannerHome.vue'),
}

const activeComponent = computed(() => {
  const key = role.value
  if (!key || !(key in roleComponents)) return null
  return defineAsyncComponent(roleComponents[key])
})
</script>
