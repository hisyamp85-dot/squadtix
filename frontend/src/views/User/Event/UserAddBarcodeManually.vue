<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-80"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
      <h2 class="text-lg font-bold mb-4">Add Barcode Manually</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="block text-sm font-medium">Id Transaction</label>
          <input
            v-model="formData.id_transaction"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium">Barcode</label>
          <input
            v-model="formData.qrcode"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium">Name</label>
          <input
            v-model="formData.name"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium">Other Data</label>
          <input
            v-model="formData.other_data"
            type="text"
            class="w-full border rounded p-2"
          />
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
import { ref } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import { toast } from 'vue3-toastify'
import api from '@/lib/axios'

interface BarcodeForm {
  id_transaction: string
  qrcode: string
  name: string
  other_data: string | null
}

interface Props {
  show: boolean
  eventId: string
  eventCategoryId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [formData: BarcodeForm]
}>()

const { isExpanded, isHovered } = useSidebar()

const formData = ref<BarcodeForm>({
  id_transaction: '',
  qrcode: '',
  name: '',
  other_data: null
})

async function handleSubmit() {
  try {
    const response = await api.post(`/events/${props.eventId}/categories/${props.eventCategoryId}/qrcodes`, formData.value)
    toast.success((response.data as unknown as { message: string }).message || 'Barcode added successfully')
    emit('submit', formData.value)
    emit('close')
  } catch (error: unknown) {
    console.error('Failed to add barcode:', error)
    const err = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
    const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to add barcode'
    toast.error(message)
  }
}
</script>
