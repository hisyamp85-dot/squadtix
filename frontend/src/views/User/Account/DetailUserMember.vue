<template>
  <div
    v-if="show"
    :class="[
      'fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-80 transition-all duration-300',
      { 'lg:pl-[290px]': isExpanded, 'lg:pl-[90px]': !isExpanded }
    ]"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md transition-all duration-300">
      <h2 class="text-xl font-semibold mb-4">Member User Details</h2>
      <form v-if="localUser" @submit.prevent="saveChanges">
        
        <div class="mb-4">
          <label class="block text-gray-700 mb-1" for="username">Username</label>
          <input
            id="username"
            v-model="localUser.username"
            type="text"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Password</label>
          <input
            v-model="localUser.password"
            type="text"
            class="w-full border rounded p-2"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1" for="section">Section</label>
          <select
            id="section"
            v-model="localUser.section"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Section</option>
            <option value="Scanner">Scanner</option>
            
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1" for="status">Status</label>
          <select
            id="status"
            v-model="localUser.status"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Section</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            @click="deleteUser"
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

<!-- Delete Confirmation Modal -->
<div
  v-if="showDeleteModal"
  :class="[
    'fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-80 transition-all duration-300',
    isExpanded ? 'lg:pl-[290px]' : 'lg:pl-[90px]'
  ]"
>
  <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
    <h3 class="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
    <p class="mb-6 text-gray-600">Are you sure you want to delete this user? This action cannot be undone.</p>
    <div class="flex justify-end space-x-3">
      <button
        @click="cancelDelete"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
      >
        No
      </button>
      <button
        @click="confirmDelete"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Yes
      </button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import api from '@/lib/axios'
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

interface Props {
  show: boolean
  user: MemberUser | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [user: MemberUser]
  delete: [userId: number]
}>()

const route = useRoute()
const { isExpanded } = useSidebar()

const localUser = ref<MemberUser | null>(null)
const showDeleteModal = ref(false)


watch(() => props.user, (newUser) => {
  if (newUser) {
    localUser.value = { ...newUser }
  }
}, { immediate: true })



function deleteUser() {
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (localUser.value) {
    try {
      await api.delete(`/member-users/${localUser.value.id}`)
      toast.success('Member user deleted successfully!')
      emit('close')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Failed to delete member user: ' + message)
    }
    showDeleteModal.value = false
  }
}

function cancelDelete() {
  showDeleteModal.value = false
}

async function saveChanges() {
  if (localUser.value) {
    try {
      // Set idUser from route params
      localUser.value.idUser = parseInt(route.params.id as string)
      // Add updated_at with current date-time
      localUser.value.updated_at = new Date().toISOString()
      await api.put(`/member-users/${localUser.value.id}`, localUser.value)
      toast.success('Member user updated successfully!')
      emit('close')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Failed to update member user: ' + message)
    }
  }
}
</script>
