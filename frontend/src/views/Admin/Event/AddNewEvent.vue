<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-80"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 class="text-lg font-bold mb-4">
        {{ eventName ? `Add New Category for Event ${eventName}` : 'Add New Event' }}
      </h2>

      <form @submit.prevent="handleSubmit">
        <!-- Event Name -->
        <div class="mb-3">
          <label class="block text-sm font-medium">Event Name</label>
          <input
            v-model="formData.name"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>

        <!-- User (Admin: dropdown, User page: read-only current user) -->
        <div class="mb-3">
          <label class="block text-sm font-medium">User</label>

          <!-- Kalau lockedUserId dikirim dari parent (halaman user), tampil readonly -->
          <div v-if="lockedUserId" class="mt-1">
            <input
              type="text"
              class="w-full border rounded p-2 bg-gray-100 text-gray-700"
              :value="lockedUserName || selectedUserName || 'Current User'"
              disabled
            />
          </div>

          <!-- Kalau TIDAK ada lockedUserId → mode Admin, pakai dropdown -->
          <div v-else class="relative mt-1">
            <button
              type="button"
              @click="toggleDropdown"
              class="w-full border rounded p-2 text-left flex justify-between items-center"
            >
              <span>{{ selectedUserName || 'Select User' }}</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <div
              v-if="isDropdownOpen"
              class="absolute z-10 w-full bg-white border rounded-b shadow-lg max-h-60 overflow-y-auto"
            >
              <div class="p-2">
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search users..."
                    class="w-full border rounded p-2 pl-10 pr-4"
                  />
                  <svg
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                @click="selectUser(user)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {{ user.name }} ({{ user.username }})
              </div>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="mb-3">
          <label class="block text-sm font-medium">Status</label>
          <select v-model="formData.status" class="w-full border rounded p-2">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <!-- Add Category Name (AUTO MODE) -->
        <div class="mb-3">
          <label class="block text-sm font-medium">Add Category Name</label>
          <input
            v-model="newCategory"
            type="text"
            class="w-full border rounded p-2"
            placeholder="Type category name and press Enter to add"
            @keydown.enter="commitCurrentCategoryInput"
            @keydown.backspace="handleBackspaceCategory"
          />
          <p class="mt-1 text-xs text-gray-500">
            Contoh: ketik <span class="font-semibold">VIP</span>, tekan Enter → jadi kategori.
          </p>
        </div>

        <!-- Category Chips -->
        <div v-if="categories.length > 0" class="mb-3">
          <label class="block text-sm font-medium">Categories</label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(category, index) in categories"
              :key="index"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              <template v-if="editingIndex !== index">
                <span @dblclick="startEditing(index)">{{ category }}</span>
                <button
                  @click="removeCategory(index)"
                  type="button"
                  class="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </template>
              <template v-else>
                <input
                  v-model="editingCategory"
                  @keyup.enter="saveEditing"
                  @blur="saveEditing"
                  :data-edit-index="index"
                  class="border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                />
              </template>
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-4">
          <button
            type="button"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import { toast } from 'vue3-toastify'
import api from '@/lib/axios'

interface EventForm {
  id_event?: string
  name?: string
  categories: string[]
  status: string
  id_user?: number
}

interface User {
  id: number
  name: string
  username: string
  email: string
  role: string
  status: string
}

interface Props {
  show: boolean
  initialForm: EventForm
  eventName?: string

  /** Kalau di halaman user, kirim lockedUserId → dropdown dimatikan */
  lockedUserId?: number | null
  lockedUserName?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [formData: EventForm]
}>()

const { isExpanded, isHovered } = useSidebar()

const formData = ref<EventForm>({ ...props.initialForm })
const newCategory = ref('')
const categories = ref<string[]>([])
const editingIndex = ref<number | null>(null)
const editingCategory = ref('')

// user dropdown state
const users = ref<User[]>([])
const searchQuery = ref('')
const isDropdownOpen = ref(false)
const selectedUserName = ref('')



const lockedUserId = computed(() => props.lockedUserId ?? null)
const lockedUserName = computed(() => props.lockedUserName ?? '')

// ============ FETCH USERS (hanya perlu untuk mode admin) ============
onMounted(async () => {
  if (!lockedUserId.value) {
    // hanya fetch users kalau dropdown dipakai
    try {
      const response = await api.get<User[]>('/users')
      users.value = response.data
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  // kalau lockedUserId ada → set ke formData
  if (lockedUserId.value) {
    formData.value.id_user = lockedUserId.value
    selectedUserName.value = lockedUserName.value || ''
  }
})

onBeforeUnmount(() => {
})

// reset modal ketika dibuka
watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      formData.value = { ...props.initialForm }

      if (!formData.value.status) {
        formData.value.status = 'Active'
      }

      if (props.eventName) {
        formData.value.name = props.eventName
      }

      categories.value = [...(props.initialForm.categories || [])]
      newCategory.value = ''
      editingIndex.value = null
      editingCategory.value = ''
      isDropdownOpen.value = false

      // Kalau lockedUserId → set id_user & label
      if (lockedUserId.value) {
        formData.value.id_user = lockedUserId.value
        selectedUserName.value = lockedUserName.value || ''
      } else {
        // mode admin: kosongkan label (user harus pilih)
        selectedUserName.value = ''
      }
    }
  }
)

// ================== CATEGORY LOGIC ==================

const addCategoryToken = (value: string) => {
  const token = value.trim()
  if (!token) return

  const exists = categories.value.some(
    (c) => c.toLowerCase() === token.toLowerCase()
  )
  if (exists) {
    toast.warning('Category already exists')
    return
  }

  categories.value.push(token)
}

const commitCurrentCategoryInput = () => {
  const value = newCategory.value.trim()
  if (!value) return

  // Split by comma and add multiple categories
  const categoriesToAdd = value.split(',').map(cat => cat.trim()).filter(cat => cat)
  categoriesToAdd.forEach(cat => addCategoryToken(cat))
  newCategory.value = ''
}

const handleBackspaceCategory = (event: KeyboardEvent) => {
  if (newCategory.value === '' && categories.value.length > 0) {
    event.preventDefault()
    const last = categories.value.pop()
    if (last) {
      newCategory.value = last
    }
  }
}

// ================== EDITING CHIPS ==================

const startEditing = (index: number) => {
  editingIndex.value = index
  editingCategory.value = categories.value[index]

  nextTick(() => {
    const input = document.querySelector(
      `input[data-edit-index="${index}"]`
    ) as HTMLInputElement | null
    if (input) {
      input.focus()
      input.select()
    }
  })
}

const saveEditing = () => {
  if (editingIndex.value !== null) {
    const value = editingCategory.value.trim()
    if (value) {
      const exists = categories.value.some(
        (c, i) => i !== editingIndex.value && c.toLowerCase() === value.toLowerCase()
      )
      if (exists) {
        toast.warning('Category already exists')
      } else {
        categories.value[editingIndex.value] = value
      }
    }
  }
  editingIndex.value = null
  editingCategory.value = ''
}

const cancelEditing = () => {
  editingIndex.value = null
  editingCategory.value = ''
}

const removeCategory = (index: number) => {
  categories.value.splice(index, 1)
  if (editingIndex.value === index) {
    cancelEditing()
  }
}

// ================== USER DROPDOWN (mode Admin) ==================

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectUser = (user: User) => {
  formData.value.id_user = user.id
  selectedUserName.value = `${user.name} (${user.username})`
  isDropdownOpen.value = false
}

// ================== SUBMIT ==================

const handleSubmit = () => {
  if (newCategory.value.trim()) {
    commitCurrentCategoryInput()
  }

  // Kalau di halaman user → lockedUserId selalu ada, cek juga
  if (!formData.value.id_user) {
    toast.warning('User must be selected')
    return
  }
  if (!formData.value.name || !formData.value.name.trim()) {
    toast.warning('Event name is required')
    return
  }
  if (categories.value.length === 0) {
    toast.warning('Category name must be filled')
    return
  }

  formData.value.categories = categories.value

  console.log('[AddNewEventModal] submit data:', formData.value)

  emit('submit', formData.value)
  emit('close')
}
</script>
