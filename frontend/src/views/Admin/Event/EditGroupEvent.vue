<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-80"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 class="text-lg font-bold mb-4">Edit Group</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="block text-sm font-medium">Group Name</label>
          <input
            v-model="GroupName"
            type="text"
            class="w-full border rounded p-2"
            placeholder="Enter Group name"
            required
          />
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Status</label>
          <select v-model="GroupStatus" class="w-full border rounded p-2">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
  Group: string
  id: string
  eventId?: string
  status?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [GroupName: string]
}>()

const { isExpanded, isHovered } = useSidebar()

const GroupName = ref('')
const GroupStatus = ref('Active')

watch(() => props.show, async (newShow) => {
  if (newShow && props.eventId && props.id) {
    // Set initial values from props
    GroupName.value = props.Group
    GroupStatus.value = props.status || 'Active'
    try {
      const response = await api.get(`/events/${props.eventId}/group-scans/${props.id}`)
      const groupData = response.data as { name_group: string; status: string }
      GroupName.value = groupData.name_group
      GroupStatus.value = groupData.status
    } catch (error) {
      toast.error('Failed to load group data')
      console.error('Error fetching group:', error)
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!props.eventId) {
    toast.error('Event ID missing')
    return
  }
  try {
    await api.put(`/events/${props.eventId}/group-scans/${props.id}`, { name_group: GroupName.value, status: GroupStatus.value })
    toast.success('Group updated successfully!')
    emit('save', GroupName.value)
    emit('close')
  } catch (error: unknown) {
    const err = error as ApiError
    const message = err.response?.data?.message || err.message || 'Unknown error'
    toast.error('Failed to update Group: ' + message)
  }
}
</script>
