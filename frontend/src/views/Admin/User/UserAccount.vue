<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import UserAccountTable from './UserAccountTable.vue'
import DetailUserAccount from './DetailUserAccount.vue'

import api from '@/lib/axios'

interface User {
  id: number
  name: string
  username: string
  email: string
  password: string
  role: string
  project?: string
  status?: 'Active' | 'Inactive' | ''
}

const router = useRouter()

const currentPageTitle = ref('User')

const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'User', active: true }
]
const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const showDetail = ref(false)

// type guard error axios
function isAxiosError(error: unknown): error is { response?: { data?: unknown }; message: string } {
  return typeof error === 'object' && error !== null && 'message' in error
}

console.log("Axios BaseURL:", api.defaults.baseURL)

onMounted(async () => {
  console.log("👉 ENV API URL:", import.meta.env.VITE_API_URL)

  try {
    console.log("👉 Fetching users pakai api instance...")
    const res = await api.get<User[]>('/users')
    console.log("✅ Response dari api instance:", res.data)
    users.value = res.data
  } catch (error: unknown) {
    console.error("❌ Gagal fetch via api instance")

    // fallback hardcoded fetch
    try {
      console.log("👉 Coba fallback fetch ke endpoint /users ...")
      const token = localStorage.getItem('token') ?? localStorage.getItem('auth_token')
      const base = (api.defaults.baseURL ?? '').replace(/\/+$/, '')
      const url = base ? `${base}/users` : '/users'
      const scheme = token ? 'Bearer' : null
      const res = await fetch(url, {
        headers: token
          ? { Authorization: `${scheme ?? 'Bearer'} ${token}` }
          : undefined,
      })
      const data = await res.json()
      console.log("✅ Response dari hardcode fetch:", data)
      users.value = data
    } catch (err) {
      console.error("❌ Fallback fetch juga gagal:", err)
    }

    if (isAxiosError(error)) {
      console.error("Axios error detail:", error.response?.data || error.message)
    } else {
      console.error("Unexpected error:", error)
    }
  }
})

const viewUser = (user: User) => {
  selectedUser.value = user
  showDetail.value = true
}

const viewGroups = (user: User) => {
  router.push({ path: '/groupuser', query: { userId: user.id.toString() } })
}


</script>

<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" :breadcrumbs="breadcrumbs" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Data Master User</h3>
      <UserAccountTable :users="users" @view-user="viewUser" @view-groups="viewGroups" @user-added="users.push($event)" />
    </div>

    <DetailUserAccount
      :show="showDetail"
      :user="selectedUser"
      @close="showDetail = false"
    />
  </admin-layout>
</template>
