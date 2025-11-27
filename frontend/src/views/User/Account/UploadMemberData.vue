<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-80"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
      <h2 class="text-lg font-bold mb-4">Upload Data Member(CSV)</h2>

      <form @submit.prevent="handleSubmit">
        <!-- File Upload Area -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Import File (Format <span class="text-blue-600 cursor-pointer underline" @click="downloadTemplate">Klik Disini</span>)</label>
          <label class="block text-sm font-medium mb-2">Select CSV File</label>
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            :class="{ 'border-blue-500 bg-blue-50': isDragOver }"
            @dragover.prevent="isDragOver = true"
            @dragleave="isDragOver = false"
            @drop.prevent="handleDrop"
          >
            <div v-if="!selectedFile" class="space-y-2">
              <UploadIcon class="w-8 h-8 text-gray-400 mx-auto" />
              <p class="text-gray-600">Drag and drop your CSV file here, or click to select</p>
              <input
                type="file"
                accept=".csv"
                @change="handleFileSelect"
                class="hidden"
                ref="fileInput"
              />
              <button
                type="button"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                @click="triggerFileInput"
              >
                Choose File
              </button>
            </div>
            <div v-else class="space-y-2">
              <SuccessIcon class="w-8 h-8 text-green-500 mx-auto" />
              <p class="text-gray-800 font-medium">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-600">{{ (selectedFile.size / 1024).toFixed(2) }} KB</p>
              <p class="text-sm text-gray-600">{{ rowCount }} data rows</p>
              <button
                type="button"
                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                @click="removeFile"
              >
                Remove File
              </button>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>

        <!-- Submit Buttons -->
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
            :disabled="!selectedFile || isUploading"
          >
            {{ isUploading ? 'Uploading...' : 'Upload' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import { useRoute } from 'vue-router'
import UploadIcon from '@/icons/UploadIcon.vue'
import SuccessIcon from '@/icons/SuccessIcon.vue'
import api from '@/lib/axios'
import { toast } from 'vue3-toastify'

interface UploadResponse {
  message: string
}

interface Props {
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [data: { file: File; eventId: string; event_category_id: string }]
}>()

const { isExpanded, isHovered } = useSidebar()

const selectedFile = ref<File | null>(null)
const isDragOver = ref(false)
const errorMessage = ref('')
const isUploading = ref(false)
const rowCount = ref(0)

const route = useRoute()

watch(() => props.show, (newShow) => {
  if (newShow) {
    selectedFile.value = null
    isDragOver.value = false
    errorMessage.value = ''
    isUploading.value = false
    rowCount.value = 0
  }
})

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    validateAndSetFile(file)
  }
}

function handleDrop(event: DragEvent) {
  isDragOver.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

function validateAndSetFile(file: File) {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    errorMessage.value = 'Please select a valid CSV file.'
    return
  }
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    errorMessage.value = 'File size must be less than 10MB.'
    return
  }
  selectedFile.value = file
  errorMessage.value = ''
  calculateRowCount(file)
}

function calculateRowCount(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result as string
    if (text) {
      const lines = text.split('\n').filter(line => line.trim() !== '')
      rowCount.value = lines.length > 0 ? lines.length - 1 : 0 // Exclude header
    }
  }
  reader.readAsText(file)
}

function removeFile() {
  selectedFile.value = null
  errorMessage.value = ''
  rowCount.value = 0
}

function triggerFileInput() {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  fileInput?.click()
}

function downloadTemplate() {
  const csvContent = 'username,password,section,status\ntest1,password,Redemption,Active\ntest2,password,Scan Gate,Inactive\n'
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'templategroupuser.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function handleSubmit() {
  if (!selectedFile.value) return

  isUploading.value = true
  const userId = route.query.userId as string

  if (!userId) {
    errorMessage.value = 'User ID is required'
    isUploading.value = false
    return
  }

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('userId', userId)

    const response = await api.post<UploadResponse>('/member-users/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    toast.success(response.data.message)
    emit('submit', { file: selectedFile.value, eventId: '', event_category_id: '' })
    emit('close')
  } catch (error: unknown) {
    console.error('Upload failed:', error)
    const err = error as { response?: { data?: { error?: string | string[] | { errors: Record<string, string> } } } }
    const data = err.response?.data
    let errorMsg = 'Upload failed'
    if (data?.error) {
      if (typeof data.error === 'string') {
        errorMsg = data.error
      } else if (Array.isArray(data.error)) {
        errorMsg = data.error.join(', ')
      } else {
        errorMsg = 'Upload failed'
      }
    }
    errorMessage.value = errorMsg
    toast.error(errorMsg)
  } finally {
    isUploading.value = false
  }
}

onMounted(() => {
  // Any initialization if needed
})
</script>
