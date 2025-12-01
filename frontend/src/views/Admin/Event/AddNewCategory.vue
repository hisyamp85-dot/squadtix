<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-80"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
      <h2 class="text-lg font-bold mb-4">Add New Category</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Status -->
        <div class="mb-3">
          <label class="block text-sm font-medium">Status</label>
          <select v-model="formData.status" class="w-full border rounded p-2">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <!-- Add Category Name -->
        <div class="mb-3">
          <label class="block text-sm font-medium">Add Category Name</label>
          <input
            v-model="newCategory"
            type="text"
            class="w-full border rounded p-2"
            placeholder="Type category name and press Enter to add"
            @keydown.enter.prevent="commitCurrentInput"
            @keydown.backspace="handleBackspace"
          />
          <p class="mt-1 text-xs text-gray-500">
            Contoh: ketik <span class="font-semibold">VIP</span>, tekan Enter → jadi kategori.
          </p>
        </div>

        <!-- Chip list -->
        <div v-if="categories.length > 0" class="mb-3">
          <label class="block text-sm font-medium">Categories</label>
          <div class="flex flex-wrap gap-2 mt-1">
            <span
              v-for="(category, index) in categories"
              :key="index"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              <template v-if="editingIndex !== index">
                <span
                  class="cursor-text"
                  @dblclick="startEditing(index)"
                  title="Double click to edit"
                >
                  {{ category }}
                </span>
                <button
                  type="button"
                  @click="removeCategory(index)"
                  class="ml-2 text-blue-600 hover:text-blue-800"
                  aria-label="Remove category"
                >
                  ×
                </button>
              </template>

              <template v-else>
                <input
                  v-model="editingCategory"
                  @keyup.enter="saveEditing"
                  @blur="saveEditing"
                  class="border rounded p-1 text-sm"
                  type="text"
                  autofocus
                />
              </template>
            </span>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button
            type="button"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="handleSubmit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import { toast } from 'vue3-toastify'
import { type HistoryState } from 'vue-router'

interface EventForm extends HistoryState {
  id_event?: string
  categories: string[]
  status: string
}

interface Props {
  show: boolean
  initialForm: EventForm
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



// Reset setiap modal dibuka
watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      formData.value = { ...props.initialForm }
      categories.value = [...props.initialForm.categories]
      newCategory.value = ''
      editingIndex.value = null
      editingCategory.value = ''
    }
  }
)

// bersihkan timeout kalau komponen di-unmount
onBeforeUnmount(() => {
})

// tambah token ke list, cegah duplikat (case-insensitive)
const addTokens = (tokens: string[]) => {
  for (const raw of tokens) {
    const token = raw.trim()
    if (!token) continue

    const alreadyExists = categories.value.some(
      (c) => c.toLowerCase() === token.toLowerCase()
    )
    if (!alreadyExists) {
      categories.value.push(token)
    }
  }
}



// Commit input saat:
// - user berhenti mengetik (dipanggil dari handleAutoInput)
// - input blur
// - sebelum submit (di handleSubmit)
const commitCurrentInput = () => {
  const value = newCategory.value.trim()
  if (!value) return

  // Split by comma and add multiple categories
  const categoriesToAdd = value.split(',').map(cat => cat.trim()).filter(cat => cat)
  addTokens(categoriesToAdd)
  newCategory.value = ''
}

// Backspace: kalau input kosong, ambil chip terakhir untuk diedit
const handleBackspace = (event: KeyboardEvent) => {
  if (newCategory.value === '' && categories.value.length > 0) {
    event.preventDefault()
    const last = categories.value.pop()
    if (last) {
      newCategory.value = last // user bisa edit, nanti auto-commit lagi
    }
  }
}

// Edit chip (double-click)
const startEditing = (index: number) => {
  editingIndex.value = index
  editingCategory.value = categories.value[index]
}

const saveEditing = () => {
  if (editingIndex.value !== null) {
    const value = editingCategory.value.trim()
    if (value) {
      const exists = categories.value.some(
        (c, i) => i !== editingIndex.value && c.toLowerCase() === value.toLowerCase()
      )
      if (!exists) {
        categories.value[editingIndex.value] = value
      } else {
        toast.warning('Category already exists')
      }
    }
    editingIndex.value = null
    editingCategory.value = ''
  }
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

const handleSubmit = () => {
  // Pastikan input terakhir yang belum sempat auto-commit ikut tersimpan
  if (newCategory.value.trim()) {
    commitCurrentInput()
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
