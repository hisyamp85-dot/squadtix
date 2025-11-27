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

        <!-- User Dropdown -->
        <div class="mb-3">
          <label class="block text-sm font-medium">User</label>
          <div class="relative">
            <button
              type="button"
              @click="toggleDropdown"
              class="w-full border rounded p-2 text-left flex justify-between items-center"
            >
              <span>{{ selectedUserName || 'Select User' }}</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
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
            placeholder="Type category name, will auto-add after a short pause"
            @input="handleAutoCategoryInput"
            @keydown.enter.prevent
            @keydown.backspace="handleBackspaceCategory"
            @blur="commitCurrentCategoryInput"
          />
          <p class="mt-1 text-xs text-gray-500">
            Contoh: ketik <span class="font-semibold">VIP</span>, diam sebentar → otomatis jadi kategori.
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
  id_user: string
  name: string
  username: string
  email: string
  role: string
  project: string
  status: string
}

interface Props {
  show: boolean
  initialForm: EventForm
  eventName?: string
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

const users = ref<User[]>([])
const searchQuery = ref('')
const isDropdownOpen = ref(false)
const selectedUserName = ref('')

// timeout untuk auto-commit category saat user berhenti mengetik
let categoryTypingTimeout: number | null = null

onMounted(async () => {
  try {
    const response = await api.get<User[]>('/users')
    users.value = response.data
  } catch (err) {
    console.error('Failed to fetch users:', err)
  }
})

onBeforeUnmount(() => {
  clearCategoryTypingTimeout()
})

watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      formData.value = { ...props.initialForm }
      if (props.eventName) {
        formData.value.name = props.eventName
      }
      categories.value = [...props.initialForm.categories]
      newCategory.value = ''
      editingIndex.value = null
      editingCategory.value = ''
      selectedUserName.value = ''
      isDropdownOpen.value = false
      clearCategoryTypingTimeout()
    } else {
      clearCategoryTypingTimeout()
    }
  }
)

// ===== Category auto logic =====

const clearCategoryTypingTimeout = () => {
  if (categoryTypingTimeout !== null) {
    clearTimeout(categoryTypingTimeout)
    categoryTypingTimeout = null
  }
}

// Tambah kategori dengan cek duplikat (case-insensitive)
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

// Auto-commit setelah user berhenti mengetik beberapa saat
const handleAutoCategoryInput = () => {
  clearCategoryTypingTimeout()

  categoryTypingTimeout = window.setTimeout(() => {
    commitCurrentCategoryInput()
  }, 800) // bisa diubah ke 500 kalau mau lebih responsif
}

// Commit input saat auto timeout / blur / sebelum submit
const commitCurrentCategoryInput = () => {
  clearCategoryTypingTimeout()

  const value = newCategory.value.trim()
  if (!value) return

  addCategoryToken(value)
  newCategory.value = ''
}

// Backspace: kalau input kosong, ambil chip terakhir untuk diedit
const handleBackspaceCategory = (event: KeyboardEvent) => {
  if (newCategory.value === '' && categories.value.length > 0) {
    event.preventDefault()
    const last = categories.value.pop()
    if (last) {
      newCategory.value = last // user bisa edit → auto-commit lagi setelah jeda
    }
  }
}

// ===== Editing chips =====

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
      // optional: cegah duplikat saat edit
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

// ===== User dropdown =====

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

// ===== Submit =====

const handleSubmit = () => {
  // pastikan input terakhir yang belum sempat auto-commit ikut tersimpan
  if (newCategory.value.trim()) {
    commitCurrentCategoryInput()
  }

  if (!formData.value.id_user) {
    toast.warning('User must be selected')
    return
  }
  if (categories.value.length === 0) {
    toast.warning('Category name must be filled')
    return
  }

  formData.value.categories = categories.value
  emit('submit', formData.value)
  emit('close')
}
</script>
