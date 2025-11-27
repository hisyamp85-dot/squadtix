<template>
  <div>
    <!-- Kartu profil ringkas (display only) -->
    <div
      class="p-5 mb-6 border border-gray-200 rounded-2xl bg-white shadow-sm
             dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <!-- Avatar + info utama -->
        <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
          <!-- Avatar inisial -->
          <div
            class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full
                   text-xl font-semibold text-white
                   bg-gradient-to-br from-indigo-500 to-sky-500
                   border border-gray-200 dark:border-gray-700"
          >
            <span>{{ initials }}</span>
          </div>

          <!-- Nama, role, email, status -->
          <div class="order-3 xl:order-2">
            <h4
              class="mb-1 text-lg font-semibold text-center text-gray-900
                     dark:text-white/90 xl:text-left"
            >
              {{ user?.name || '-' }}
            </h4>

            <div
              class="flex flex-col items-center gap-1 text-center
                     xl:flex-row xl:gap-3 xl:text-left"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ user?.role || 'User' }}
              </p>
              <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <svg
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 2C7.03 2 3 6.03 3 11c0 5.52 4.34 9.41 8.33 10.86.44.16.9.16 1.34 0C16.66 20.41 21 16.52 21 11c0-4.97-4.03-9-9-9z"
                  />
                </svg>
                {{ user?.email || '-' }}
              </p>
            </div>

            <div class="mt-2 flex items-center justify-center gap-2 xl:justify-start">
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

          <div class="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
            <!-- Bisa diisi badge lain nanti kalau perlu -->
          </div>
        </div>

        <!-- Tidak ada tombol Edit lagi di sini -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

// Ambil current user dari localStorage lalu refresh ke server
const loadCurrentUser = async () => {
  try {
    const stored = localStorage.getItem('user')
    if (!stored) return

    const parsed = JSON.parse(stored) as User
    if (!parsed.id) return

    const resp = await api.get(`/users/${parsed.id}`)
    user.value = resp.data as User
  } catch (error) {
    console.error('Failed to load profile:', error)
    toast.error('Gagal memuat profil')
  }
}

// Inisial untuk avatar
const initials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
})

onMounted(() => {
  loadCurrentUser()
})
</script>
