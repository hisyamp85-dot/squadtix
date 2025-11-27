<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-80"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <div
      class="w-full max-w-md mx-4 rounded-2xl border border-gray-200 bg-white
             shadow-xl p-6 relative
             dark:border-gray-800 dark:bg-gray-900"
    >
      <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Add New Group Event
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            v-model="formData.status"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                   text-gray-900 bg-white
                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                   dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <!-- Add Group Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Add Group Name
          </label>
          <input
            v-model="newGroup"
            type="text"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                   text-gray-900 bg-white
                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                   dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            placeholder="Enter group name and press Enter"
            @keydown.enter.prevent="addGroup"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Tekan <span class="font-semibold">Enter</span> untuk menambah group ke daftar.
          </p>
        </div>

        <!-- Groups List -->
        <div v-if="groups.length > 0">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Groups
          </label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(group, index) in groups"
              :key="index"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs
                     bg-blue-100 text-blue-800
                     dark:bg-blue-900/30 dark:text-blue-200"
            >
              <template v-if="editingIndex !== index">
                <span
                  class="cursor-text"
                  title="Double-click to edit"
                  @dblclick="startEditing(index)"
                >
                  {{ group }}
                </span>
                <button
                  type="button"
                  @click="removeGroup(index)"
                  class="ml-2 text-blue-600 hover:text-blue-800
                         dark:text-blue-300 dark:hover:text-blue-100"
                  aria-label="Remove group"
                >
                  ×
                </button>
              </template>

              <template v-else>
                <input
                  v-model="editingGroup"
                  @keyup.enter="saveEditing"
                  @blur="saveEditing"
                  class="border border-gray-300 rounded px-2 py-1 text-xs
                         focus:outline-none focus:ring-1 focus:ring-blue-500
                         dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  type="text"
                  autofocus
                />
              </template>
            </span>
          </div>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Double-click nama group untuk mengedit. Tekan Enter atau klik di luar untuk menyimpan.
          </p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm font-medium
                   bg-gray-100 text-gray-700 hover:bg-gray-200
                   dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700
                   border border-transparent"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-lg text-sm font-medium
                   bg-blue-600 text-white hover:bg-blue-700
                   border border-blue-600 shadow-sm"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import { toast } from 'vue3-toastify'
import type { HistoryState } from 'vue-router'

interface EventForm extends HistoryState {
  id_event?: string
  groups: string[]
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
const newGroup = ref('')
const groups = ref<string[]>([])
const editingIndex = ref<number | null>(null)
const editingGroup = ref('')

// Reset data setiap modal dibuka
watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      formData.value = { ...props.initialForm }
      groups.value = [...props.initialForm.groups]
      newGroup.value = ''
      editingIndex.value = null
      editingGroup.value = ''
    }
  }
)

const addGroup = () => {
  const value = newGroup.value.trim()
  if (!value) return

  // optional: hindari duplikat
  if (groups.value.includes(value)) {
    toast.warning('Group name already exists')
    return
  }

  groups.value.push(value)
  newGroup.value = ''
}

const startEditing = (index: number) => {
  editingIndex.value = index
  editingGroup.value = groups.value[index]
}

const saveEditing = () => {
  if (editingIndex.value === null) return

  const value = editingGroup.value.trim()
  if (!value) {
    // kalau kosong, batalin edit
    editingIndex.value = null
    editingGroup.value = ''
    return
  }

  groups.value[editingIndex.value] = value
  editingIndex.value = null
  editingGroup.value = ''
}

const cancelEditing = () => {
  editingIndex.value = null
  editingGroup.value = ''
}

const removeGroup = (index: number) => {
  groups.value.splice(index, 1)
  if (editingIndex.value === index) {
    cancelEditing()
  }
}

const handleSubmit = () => {
  if (groups.value.length === 0) {
    toast.warning('Group name must be filled')
    return
  }

  formData.value.groups = [...groups.value]
  emit('submit', formData.value)
  emit('close')
}
</script>
