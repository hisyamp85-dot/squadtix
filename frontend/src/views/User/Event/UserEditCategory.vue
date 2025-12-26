<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-80"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 class="text-lg font-bold mb-4">Edit Category</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="block text-sm font-medium">Category Name</label>
          <input
            v-model="categoryName"
            type="text"
            class="w-full border rounded p-2"
            placeholder="Enter category name"
            required
          />
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
  category: string
  id: string
  eventId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [categoryName: string]
}>()

const { isExpanded, isHovered } = useSidebar()

const categoryName = ref('')

watch(() => props.show, (newShow) => {
  if (newShow) {
    categoryName.value = props.category
  }
})

const handleSubmit = async () => {
  if (!props.eventId) {
    toast.error('Event ID missing')
    return
  }
  try {
    await api.put(`/admin/events/categories/${props.id}`, { categoryName: categoryName.value })
    toast.success('Category updated successfully!')
    emit('close')
  } catch (error: unknown) {
    const err = error as ApiError
    const message = err.response?.data?.message || err.message || 'Unknown error'
    toast.error('Failed to update category: ' + message)
  }
}
</script>
