<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" :breadcrumbs="breadcrumbs" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
       <div class="mb-5 lg:mb-7">
        <div class="flex items-center gap-4 mb-3">
            <button @click="goBack" class="px-4 py-2 flex items-center gap-2">
          <BackArrowIcon class="dark:text-white" />

        </button>
         <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Member {{ selectedUserHeader?.name }}</h3>
       </div>
      </div>
          
      
      
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
      <!-- Header + Add Button -->
      <div class="flex items-center justify-between mb-4 pt-4 pr-4 pl-4">
        <div class="flex items-center gap-2">
          <Button
            class="btn btn-primary"
            size="sm"
            variant="primary"
            :startIcon="PlusIcon"
            @click="showAddForm = true"
          >
            Add New Member User
          </Button>

           <Button
            class="btn btn-primary"
            size="sm"
            variant="primary"
            :startIcon="UploadIcon"
            @click="showUploadForm = true"
          >
            Upload Member User
          </Button>

          <Button
            v-if="selectedUsers.size > 0"
            class="btn btn-danger"
            size="sm"
            variant="primary"
            @click="deleteSelectedUsers"
          >
            Delete Selected ({{ selectedUsers.size }})
          </Button>
        </div>
        <div class="flex items-center gap-2">
          <label for="entries" class="text-gray-700 dark:text-gray-300">Show</label>
          <select
            id="entries"
            v-model="entriesPerPage"
            class="border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option v-for="option in entriesOptions" :key="option" :value="option">{{ option }}</option>
          </select>
          <span class="text-gray-700 dark:text-gray-300">entries</span>
        </div>
      </div>

      <!-- Table -->
      <div class="max-w-full overflow-x-auto p-4">
        <table class="min-w-full border border-separate border-spacing-y-2">
          <thead>
            <tr class="border-b">
              <th class="px-5 py-3 text-left text-gray-900 dark:text-white">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </th>
              <th class="px-5 py-3 text-left text-gray-900 dark:text-white">No</th>
              <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Username</th>
              <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Password</th>
              <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Section</th>
              <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Status</th>
              
              <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in paginatedUsers" :key="user.id" class="border-t bg-gray-50 dark:bg-gray-800/50">
              <td class="px-5 py-6 text-gray-900 dark:text-white">
                <input
                  type="checkbox"
                  :checked="selectedUsers.has(user.id)"
                  @change="toggleSelectUser(user.id)"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </td>
              <td class="px-5 py-6 text-gray-900 dark:text-white">{{ (currentPage - 1) * entriesPerPage + index + 1 }}</td>
              <td class="px-5 py-6 text-gray-900 dark:text-white">{{ user.username }}</td>
              <td class="px-5 py-6 text-gray-900 dark:text-white">{{ user.password }}</td>
              <td class="px-5 py-6 text-gray-900 dark:text-white">{{ user.section }}</td>
              <td class="px-5 py-6 text-gray-900 dark:text-white">
                <span :class="user.status === 'Active' ? 'text-green-600' : 'text-red-600'">
                  {{ user.status }}
                </span>
              </td>
              
              <td class="px-5 py-6 flex gap-2">
                
                <button
                  class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  @click="viewUser(user)"
                >
                  <EyeIcon />
                </button>

              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center gap-2 mb-4">
        <button
          class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          Previous
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white"
          :class="{ 'bg-indigo-500 text-white': currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Add New Member User Modal -->
    <AddNewMemberUser
      :show="showAddForm"
      :initialForm="form"
      :showAddForm="true"
      @close="showAddForm = false"
      @user-added="onUserAdded"
    />

    <!-- Detail Member User Modal -->
    <DetailMemberUser
      :show="showDetail"
      :user="selectedUser"
      @close="showDetail = false"
    />

    <!-- Upload Data Member Modal -->
    <UploadDataMember
      :show="showUploadForm"
      :userId="userId"
      @close="showUploadForm = false"
      @submit="handleUploadSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Selected Users"
      :message="`Are you sure you want to delete ${selectedUsers.size} selected user(s)? This action cannot be undone.`"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    </div>
  </admin-layout>
</template>






<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

import BackArrowIcon from '@/icons/BackArrowIcon.vue'
import Button from '@/components/ui/Button.vue'
import { PlusIcon, EyeIcon, UploadIcon } from '@/icons'

import api from '@/lib/axios'
import AddNewMemberUser from './AddNewMemberUser.vue'
import DetailMemberUser from './DetailMemberUser.vue'
import UploadDataMember from './UploadDataMember.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { toast } from 'vue3-toastify'

interface MemberUser {
  id: number
  username: string
  password: string
  status: string
  section: string
  idUser: number
  created_at: string
  updated_at: string
}

interface User {
  id: string
  name: string
  username: string
  email: string
  role: string
  project?: string
  status?: string
}

const route = useRoute()
const router = useRouter()

const currentPageTitle = ref('Member User')
const userId = ref('')

const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'User', to: '/user' },
  { text: 'Member User', active: true }
]
const users = ref<MemberUser[]>([])
const usersList = ref<User[]>([])
const selectedUser = ref<MemberUser | null>(null)
const showDetail = ref(false)
const showAddForm = ref(false)
const showUploadForm = ref(false)
const selectedUserHeader = ref<User | null>(null)

const form = ref({ username: '', password: '', status: 'Active', section: '', idUser: '' })
const entriesPerPage = ref(10)
const entriesOptions = [5, 10, 25, 50]
const currentPage = ref(1)

const selectedUsers = ref(new Set<number>())
const showDeleteModal = ref(false)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value
  const end = start + entriesPerPage.value
  return users.value.slice(start, end)
})

const isAllSelected = computed(() => {
  return paginatedUsers.value.length > 0 && paginatedUsers.value.every(user => selectedUsers.value.has(user.id))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    paginatedUsers.value.forEach(user => selectedUsers.value.delete(user.id))
  } else {
    paginatedUsers.value.forEach(user => selectedUsers.value.add(user.id))
  }
}

const toggleSelectUser = (userId: number) => {
  if (selectedUsers.value.has(userId)) {
    selectedUsers.value.delete(userId)
  } else {
    selectedUsers.value.add(userId)
  }
}

const totalPages = computed(() => {
  return Math.ceil(users.value.length / entriesPerPage.value)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page: number) => {
  currentPage.value = page
}

// type guard error axios
function isAxiosError(error: unknown): error is { response?: { data?: unknown }; message: string } {
  return typeof error === 'object' && error !== null && 'message' in error
}

console.log("Axios BaseURL:", api.defaults.baseURL)

onMounted(async () => {
  console.log("👉 ENV API URL:", import.meta.env.VITE_API_URL)

  // Fetch user if userId is in query
  const userIdFromQuery = route.query.userId as string
  if (userIdFromQuery) {
    userId.value = userIdFromQuery
    try {
      console.log("👉 Fetching user from /users/" + userIdFromQuery)
      const res = await api.get<User>('/users/' + userIdFromQuery)
      console.log("✅ Response dari user:", res.data)
      selectedUserHeader.value = res.data as User
      console.log("User loaded:", selectedUserHeader.value)
      // Set idUser in form for new member users
      form.value.idUser = userIdFromQuery
    } catch (error: unknown) {
      console.error("❌ Gagal fetch user")

      // fallback hardcoded fetch
      try {
        console.log("👉 Coba fallback fetch hardcoded http://127.0.0.1:3333/users/" + userIdFromQuery)
        const res = await fetch("http://127.0.0.1:3333/users/" + userIdFromQuery)
        const data = await res.json()
        console.log("✅ Response dari hardcode user fetch:", data)
        selectedUserHeader.value = data as User
        console.log("User loaded from fallback:", selectedUserHeader.value)
        // Set idUser in form for new member users
        form.value.idUser = userIdFromQuery
      } catch (err) {
        console.error("❌ Fallback fetch user juga gagal:", err)
      }

      if (isAxiosError(error)) {
        console.error("Axios error detail:", error.response?.data || error.message)
      } else {
        console.error("Unexpected error:", error)
      }
    }
  }

  try {
    console.log("👉 Fetching member users from /member-users...")
    const res = await api.get<MemberUser[]>('/member-users')
    console.log("✅ Response dari api instance:", res.data)
    users.value = res.data
    console.log("Users loaded:", users.value)

    // Check for query parameter and filter after fetching
    const userIdFromQuery = route.query.userId as string
    if (userIdFromQuery) {
      console.log("Filtering by userId:", userIdFromQuery)
      users.value = users.value.filter(u => u.idUser && (u.idUser === parseInt(userIdFromQuery) || u.idUser.toString() === userIdFromQuery))
      console.log("Filtered users:", users.value)
    }
  } catch (error: unknown) {
    console.error("❌ Gagal fetch via api instance")

    // fallback hardcoded fetch
    try {
      console.log("👉 Coba fallback fetch hardcoded http://127.0.0.1:3333/member-users ...")
      const res = await fetch("http://127.0.0.1:3333/member-users")
      const data = await res.json()
      console.log("✅ Response dari hardcode fetch:", data)
      users.value = data as MemberUser[]
      console.log("Users loaded from fallback:", users.value)

      // Check for query parameter and filter after fetching
      const userIdFromQuery = route.query.userId as string
      if (userIdFromQuery) {
        console.log("Filtering by userId:", userIdFromQuery)
        users.value = users.value.filter(u => u.idUser && (u.idUser === parseInt(userIdFromQuery) || u.idUser.toString() === userIdFromQuery))
        console.log("Filtered users:", users.value)
      }
    } catch (err) {
      console.error("❌ Fallback fetch juga gagal:", err)
    }

    if (isAxiosError(error)) {
      console.error("Axios error detail:", error.response?.data || error.message)
    } else {
      console.error("Unexpected error:", error)
    }
  }

  try {
    console.log("👉 Fetching users from /users...")
    const res = await api.get<User[]>('/users')
    console.log("✅ Response dari users:", res.data)
    usersList.value = res.data
    console.log("UsersList loaded:", usersList.value)
  } catch (error: unknown) {
    console.error("❌ Gagal fetch users")

    // fallback hardcoded fetch
    try {
      console.log("👉 Coba fallback fetch hardcoded http://127.0.0.1:3333/users ...")
      const res = await fetch("http://127.0.0.1:3333/users")
      const data = await res.json()
      console.log("✅ Response dari hardcode users fetch:", data)
      usersList.value = data as User[]
      console.log("UsersList loaded from fallback:", usersList.value)
    } catch (err) {
      console.error("❌ Fallback fetch users juga gagal:", err)
    }

    if (isAxiosError(error)) {
      console.error("Axios error detail:", error.response?.data || error.message)
    } else {
      console.error("Unexpected error:", error)
    }
  }
})

const viewUser = (user: MemberUser) => {
  selectedUser.value = user
  showDetail.value = true
}











const onUserAdded = (newUser: MemberUser) => {
  users.value.push(newUser)
  // Optionally reset form or show success message
  form.value = { username: '', password: '', status: 'Active', section: '', idUser: '' }
}

const goBack = () => {
  router.back()
}

const handleUploadSubmit = (data: { file: File; eventId: string; event_category_id: string }) => {
  console.log('Upload data:', data)
  // Refresh the users list after upload
  fetchUsers()
}

async function deleteSelectedUsers() {
  if (selectedUsers.value.size === 0) {
    toast.warning('No users selected for deletion')
    return
  }

  showDeleteModal.value = true
}

async function confirmDelete() {
  try {
    const ids = Array.from(selectedUsers.value)
    const response = await api({
      method: 'DELETE',
      url: '/member-users',
      data: { ids },
    })

    toast.success((response.data as unknown as { message: string }).message)
    selectedUsers.value.clear()
    showDeleteModal.value = false
    // Refresh the users list
    await fetchUsers()
  } catch (error: unknown) {
    console.error('Delete error:', error)
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    const message = err.response?.data?.message || err.message || 'Failed to delete users'
    toast.error(`Gagal menghapus user: ${message}`)
  }
}

async function fetchUsers() {
  try {
    console.log("👉 Fetching member users from /member-users...")
    const res = await api.get<MemberUser[]>('/member-users')
    console.log("✅ Response dari api instance:", res.data)
    users.value = res.data
    console.log("Users loaded:", users.value)

    // Filter by userId from query
    if (userId.value) {
      console.log("Filtering by userId:", userId.value)
      users.value = users.value.filter(u => u.idUser && (u.idUser === parseInt(userId.value) || u.idUser.toString() === userId.value))
      console.log("Filtered users:", users.value)
    }
  } catch (error: unknown) {
    console.error("❌ Gagal fetch via api instance")

    // fallback hardcoded fetch
    try {
      console.log("👉 Coba fallback fetch hardcoded http://127.0.0.1:3333/member-users ...")
      const res = await fetch("http://127.0.0.1:3333/member-users")
      const data = await res.json()
      console.log("✅ Response dari hardcode fetch:", data)
      users.value = data as MemberUser[]
      console.log("Users loaded from fallback:", users.value)

      // Filter by userId from query
      if (userId.value) {
        console.log("Filtering by userId:", userId.value)
        users.value = users.value.filter(u => u.idUser && (u.idUser === parseInt(userId.value) || u.idUser.toString() === userId.value))
        console.log("Filtered users:", users.value)
      }
    } catch (err) {
      console.error("❌ Fallback fetch juga gagal:", err)
    }

    if (isAxiosError(error)) {
      console.error("Axios error detail:", error.response?.data || error.message)
    } else {
      console.error("Unexpected error:", error)
    }
  }
}



</script>

