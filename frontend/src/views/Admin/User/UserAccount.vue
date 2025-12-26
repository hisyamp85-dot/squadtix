<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import DetailUserAccount from './DetailUserAccount.vue'
import AddNewUserModal from '@/views/Admin/User/AddNewUser.vue'
import Button from '@/components/ui/Button.vue'
import { PlusIcon, EyeIcon, ListIcon } from '@/icons'
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

interface UserForm {
  name: string
  username: string
  email: string
  password: string
  role: string
  project: string
  status?: 'Active' | 'Inactive'
}

const router = useRouter()

const currentPageTitle = ref('User')
const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'User', active: true },
]

const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const showDetail = ref(false)
const showAddForm = ref(false)

const entriesOptions = [5, 10, 25, 50]
const entriesPerPage = ref<number | string>(10)
const currentPage = ref(1)

const numericEntriesPerPage = computed(() => {
  const n = Number(entriesPerPage.value)
  return Number.isNaN(n) || n <= 0 ? 10 : n
})

const totalPages = computed(() => {
  if (!users.value.length) return 0
  return Math.ceil(users.value.length / numericEntriesPerPage.value)
})

const paginatedUsers = computed(() => {
  if (!users.value.length) return []
  const start = (currentPage.value - 1) * numericEntriesPerPage.value
  return users.value.slice(start, start + numericEntriesPerPage.value)
})

const startItem = computed(() => {
  if (!users.value.length) return 0
  return (currentPage.value - 1) * numericEntriesPerPage.value + 1
})

const endItem = computed(() => {
  if (!users.value.length) return 0
  const end = currentPage.value * numericEntriesPerPage.value
  return end > users.value.length ? users.value.length : end
})

const pageNumbers = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages.value; i += 1) {
    pages.push(i)
  }
  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// type guard error axios
function isAxiosError(error: unknown): error is { response?: { data?: unknown }; message: string } {
  return typeof error === 'object' && error !== null && 'message' in error
}

const form = ref<UserForm>({
  name: '',
  username: '',
  email: '',
  password: '',
  role: '',
  project: '',
  status: undefined,
})

const handleUserAdded = (user: User) => {
  users.value.push(user)
  showAddForm.value = false
}

watchEffect(() => {
  console.log('Users in UserAccount.vue:', users.value)
})

// reset page ke 1 kalau entriesPerPage berubah
watch(entriesPerPage, () => {
  currentPage.value = 1
})

// jaga currentPage tetap valid kalau jumlah users berubah
watch(
  () => users.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  },
)

console.log('Axios BaseURL:', api.defaults.baseURL)

onMounted(async () => {
  console.log('ENV API URL:', import.meta.env.VITE_API_URL)

  try {
    console.log('Fetching users via api instance...')
    const res = await api.get<User[]>('/admin/users')
    console.log('Response dari api instance:', res.data)
    users.value = res.data
  } catch (error: unknown) {
    console.error('Gagal fetch via api instance')

    // fallback hardcoded fetch
    try {
      console.log('Coba fallback fetch ke endpoint /admin/users ...')
      const token = localStorage.getItem('token') ?? localStorage.getItem('auth_token')
      const base = (api.defaults.baseURL ?? '').replace(/\/+$/, '')
      const url = base ? `${base}/admin/users` : '/admin/users'
      const scheme = token ? 'Bearer' : null
      const res = await fetch(url, {
        headers: token
          ? { Authorization: `${scheme ?? 'Bearer'} ${token}` }
          : undefined,
      })
      const data = await res.json()
      console.log('Response dari hardcode fetch:', data)
      users.value = data
    } catch (err) {
      console.error('Fallback fetch juga gagal:', err)
    }

    if (isAxiosError(error)) {
      console.error('Axios error detail:', error.response?.data || error.message)
    } else {
      console.error('Unexpected error:', error)
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
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Data Master User
      </h3>

      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white
               dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <!-- Header + Add Button -->
        <div class="flex items-center justify-between mb-4 pt-4 pr-4 pl-4">
          <Button
            class="btn btn-primary"
            size="sm"
            variant="primary"
            :startIcon="PlusIcon"
            @click="showAddForm = true"
          >
            Add New User
          </Button>

          <div class="flex items-center gap-2">
            <label for="entries" class="text-gray-700 dark:text-gray-300">
              Show
            </label>
            <select
              id="entries"
              v-model="entriesPerPage"
              class="border border-gray-300 rounded px-2 py-1
                     dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option v-for="option in entriesOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <span class="text-gray-700 dark:text-gray-300">entries</span>
          </div>
        </div>

        <!-- Table -->
        <div class="max-w-full overflow-x-auto p-4">
          <table class="min-w-full border border-separate border-spacing-y-2">
            <thead>
              <tr class="border-b">
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">No</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Name</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Email</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Role</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Status</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="paginatedUsers.length === 0"
                class="bg-gray-50 dark:bg-gray-800/50"
              >
                <td
                  colspan="6"
                  class="px-5 py-6 text-center text-gray-500 dark:text-gray-300"
                >
                  No users found.
                </td>
              </tr>

              <tr
                v-else
                v-for="(user, index) in paginatedUsers"
                :key="user.id"
                class="border-t bg-gray-50 dark:bg-gray-800/50"
              >
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ (currentPage - 1) * numericEntriesPerPage + index + 1 }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ user.name }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ user.email }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ user.role }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  <span :class="user.status === 'Active' ? 'text-green-600' : 'text-red-600'">
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-5 py-6">
                  <button
                    class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                           transition p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    @click="viewUser(user)"
                  >
                    <EyeIcon />
                  </button>
                  <button
                    class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                           transition p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    :disabled="true"
                    @click="viewGroups(user)"
                  >
                    <ListIcon />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="users.length > 0"
          class="mt-2 mb-4 flex flex-col md:flex-row items-center justify-between gap-3 px-4"
        >
          <div class="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            Showing
            <span class="font-semibold">{{ startItem }}</span>
            -
            <span class="font-semibold">{{ endItem }}</span>
            of
            <span class="font-semibold">{{ users.length }}</span>
            records
          </div>

          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 text-xs md:text-sm border rounded-lg
                     border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="currentPage === 1 || totalPages === 0"
              @click="prevPage"
            >
              Prev
            </button>

            <button
              v-for="page in pageNumbers"
              :key="page"
              class="px-3 py-1.5 text-xs md:text-sm border rounded-lg"
              :class="page === currentPage
                ? 'border-primary text-primary font-semibold'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>

            <button
              class="px-3 py-1.5 text-xs md:text-sm border rounded-lg
                     border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="currentPage === totalPages || totalPages === 0"
              @click="nextPage"
            >
              Next
            </button>
          </div>
        </div>

        <AddNewUserModal
          :show="showAddForm"
          :initial-form="form"
          @close="showAddForm = false"
          @user-added="handleUserAdded"
        />
      </div>
    </div>

    <DetailUserAccount
      :show="showDetail"
      :user="selectedUser"
      @close="showDetail = false"
    />
  </admin-layout>
</template>
