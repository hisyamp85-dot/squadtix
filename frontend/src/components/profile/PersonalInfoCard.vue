<template>
  <div
    class="p-5 mb-6 border border-gray-200 rounded-2xl bg-white shadow-sm
           dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
  >
    <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <!-- Info kiri -->
      <div>
        <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Personal Information
        </h4>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div>
            <p class="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Name
            </p>
            <p class="text-sm font-medium text-gray-800 dark:text-white/90">
              {{ user?.name || '-' }}
            </p>
          </div>

          <div>
            <p class="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Username
            </p>
            <p class="text-sm font-medium text-gray-800 dark:text-white/90">
              {{ user?.username || '-' }}
            </p>
          </div>

          <div>
            <p class="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Email
            </p>
            <p class="text-sm font-medium text-gray-800 dark:text-white/90">
              {{ user?.email || '-' }}
            </p>
          </div>

          <div>
            <p class="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Role
            </p>
            <p class="text-sm font-medium text-gray-800 dark:text-white/90">
              {{ user?.role || 'User' }}
            </p>
          </div>

          <div>
            <p class="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Status
            </p>
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              :class="user?.status === 'Active'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200'"
            >
              <span
                class="mr-1 h-1.5 w-1.5 rounded-full"
                :class="user?.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'"
              ></span>
              {{ user?.status || 'Inactive' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tombol Edit -->
      <button
        class="edit-button inline-flex items-center gap-2 rounded-lg border border-gray-300
               bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50
               dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.06]"
        @click="goToEditProfile"
      >
        <svg
          class="fill-current"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
            fill=""
          />
        </svg>
        Edit Profile
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/axios'
import { toast } from 'vue3-toastify'

interface User {
  id: number
  name: string
  username: string
  email: string
  role: string
  status: string
}

const user = ref<User | null>(null)
const router = useRouter()

const loadCurrentUser = async () => {
  try {
    const stored = localStorage.getItem('user')
    if (!stored) return

    const parsed = JSON.parse(stored) as User
    if (!parsed.id) return

    const resp = await api.get(`/users/${parsed.id}`)
    const data = resp.data as User
    user.value = data

    // sinkron lagi ke localStorage (optional)
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        status: data.status,
      }),
    )
  } catch (error) {
    console.error('Failed to load personal info:', error)
    toast.error('Gagal memuat data profil')
  }
}

const goToEditProfile = () => {
  if (user.value?.role === 'Admin') {
    router.push({ name: 'ProfileEdit' })
  } else if (user.value?.role === 'User') {
    router.push({ name: 'UserEditProfile', params: { id: user.value.id } })
  } else {
    // fallback route or notify user
    router.push('/profile/edit')
  }
}

onMounted(() => {
  loadCurrentUser()
})
</script>
