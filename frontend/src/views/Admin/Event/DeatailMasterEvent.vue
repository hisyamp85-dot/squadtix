<template>
  <!-- Confirmation Modal -->
  <div
    v-if="showConfirm"
    class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-90"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">Confirm Action</h3>
      <p class="text-gray-600 mb-6">{{ confirmMessage }}</p>
      <div class="flex justify-end gap-3">
        <button
          @click="cancelConfirm"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          @click="confirmAction"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-80"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 class="text-lg font-bold mb-4">Edit Event</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="block text-sm font-medium">Event Name</label>
          <input
            v-model="eventName"
            type="text"
            class="w-full border rounded p-2"
            placeholder="Enter category name"
            required
          />
        </div>
        <div class="mb-3">
          <label class="block text-gray-700 mb-1" for="status">Status</label>
          <select
            id="status"
            v-model="localEvent.status"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button
            type="button"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            @click="$emit('close')"
          >
            Close
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            @click="deleteEvent"
          >
            Delete
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
import { ref, watch } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import api from '@/lib/axios'
import { toast } from 'vue3-toastify'

type ApiError = {
  message: string
  response?: {
    data?: {
      message?: string
    }
  }
}

interface Props {
  show: boolean
  category: string
  id: string
  eventId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [eventName: string, status: string]
  delete: []
}>()

const { isExpanded, isHovered } = useSidebar()

const eventName = ref('')
const localEvent = ref({ status: '' })
const statuses = ref(['Active', 'Inactive'])
const showConfirm = ref(false)
const confirmMessage = ref('')

watch(() => props.show, async (newShow) => {
  if (newShow) {
    eventName.value = props.category
    // Fetch current event status if needed, or set default
    localEvent.value.status = 'Active' // Assuming default, or fetch from API
  }
})

const handleSubmit = async () => {
  if (!props.eventId) {
    toast.error('Event ID missing')
    return
  }
  try {
    await api.put(`/admin/events/${props.eventId}`, { name: eventName.value, status: localEvent.value.status })
    emit('save', eventName.value, localEvent.value.status)
    emit('close')
  } catch (error: unknown) {
    const err = error as ApiError
    const message = err.response?.data?.message || err.message || 'Unknown error'
    toast.error('Failed to update event: ' + message)
  }
}

const deleteEvent = () => {
  confirmMessage.value = 'Are you sure you want to delete this event? This action cannot be undone.'
  showConfirm.value = true
}

const confirmAction = () => {
  showConfirm.value = false
  emit('delete')
}

const cancelConfirm = () => {
  showConfirm.value = false
}
</script>
