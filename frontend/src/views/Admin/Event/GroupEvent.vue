<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Group Event'" :breadcrumbs="[
      { text: 'Home', to: '/' },
      { text: 'Event', to: '/admin/event' },
      { text: 'Event Detail', to: `/admin/event/detail/${route.query.eventId || '1'}` },
      { text: 'Group Event', active: true }
    ]" />

    <div class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div class="flex items-center gap-4 mb-4">
        <button @click="goBack" class="px-4 py-2 flex items-center gap-2">
          <BackArrowIcon class="text-gray-900 dark:text-white" />
        </button>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Group Event</h3>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <!-- Add Group Event Button -->
        <div class="mb-6">
          <Button
            class="btn btn-primary"
            size="sm"
            variant="primary"
            :startIcon="PlusIcon"
            @click="showAddForm = true"
          >
            Add Group New Event
          </Button>
        </div>

        <!-- Table Section -->
        <div class="max-w-full overflow-x-auto p-4">
          <table class="min-w-full border border-separate border-spacing-y-2">
            <thead>
              <tr class="border-b">
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">No</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Group Name</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Status</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(group, index) in groups" :key="group.id" class="border-t bg-gray-50 dark:bg-gray-800/50">
                <td class="px-5 py-6 text-gray-900 dark:text-white">{{ index + 1 }}</td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">{{ group.name_group }}</td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  <span :class="group.status === 'Active' ? 'text-green-600' : 'text-red-600'">
                    {{ group.status }}
                  </span>
                </td>
                <td class="px-5 py-6">
                  <div class="flex items-center gap-2">
                    <button @click="editGroup(group)" class="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition rounded-md">
                      Edit
                    </button>
                    <button @click="deleteGroup(group)" class="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition rounded-md">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- No Data State -->
        <div v-if="groups.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <p class="text-gray-500 dark:text-gray-400">No groups found</p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Add a new group to get started</p>
        </div>
      </div>
    </div>

    <AddNewGroupEvent
      :show="showAddForm"
      :initialForm="initialForm"
      @close="showAddForm = false"
      @submit="handleSubmit"
    />

    <EditGroupEvent
      v-if="editingGroup"
      :show="showEditForm"
      :Group="editingGroup.name_group"
      :id="editingGroup.id.toString()"
      :eventId="route.query.eventId as string"
      :status="editingGroup.status"
      @close="showEditForm = false; editingGroup = null"
      @save="handleEditSave"
    />

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirm"
      class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
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
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import BackArrowIcon from '@/icons/BackArrowIcon.vue'
import { PlusIcon } from '@/icons'
import Button from '@/components/ui/Button.vue'
import AddNewGroupEvent from '@/views/Admin/Event/AddNewGroupEvent.vue'
import EditGroupEvent from '@/views/Admin/Event/EditGroupEvent.vue'
import { toast } from 'vue3-toastify'
import axios from '@/lib/axios'
import { useSidebar } from '@/composables/useSidebar'

interface Group {
  id: number
  name_group: string
  event_id: string
  status: string
}

// Refs
const groups = ref<Group[]>([])
const showAddForm = ref(false)
const showEditForm = ref(false)
const editingGroup = ref<Group | null>(null)
const showConfirm = ref(false)
const confirmMessage = ref('')
const groupToDelete = ref<Group | null>(null)

// Initial form for AddNewGroupEvent
const initialForm = ref({
  groups: [] as string[],
  status: 'Active'
})

// Router
const router = useRouter()
const route = useRoute()

// Go back function
const goBack = () => {
  const eventId = route.query.eventId as string
  if (eventId) {
    router.push({ name: 'AdminEventDetail', params: { id: eventId } })
  } else {
    router.push({ name: 'AdminEvent' })
  }
}

// Edit group
const editGroup = (group: Group) => {
  editingGroup.value = group
  showEditForm.value = true
}

// Delete group
const deleteGroup = (group: Group) => {
  groupToDelete.value = group
  confirmMessage.value = `Are you sure you want to delete "${group.name_group}"? This action cannot be undone.`
  showConfirm.value = true
}

// Get sidebar state
const { isExpanded, isHovered } = useSidebar()

// Cancel confirm
const cancelConfirm = () => {
  showConfirm.value = false
  groupToDelete.value = null
}

// Confirm action
const confirmAction = async () => {
  if (groupToDelete.value) {
    try {
      const eventId = route.query.eventId as string
      if (!eventId) {
        toast.error('Event ID not found')
        return
      }
      await axios.delete(`/admin/events/${eventId}/group-scans/${groupToDelete.value.id}`)
      toast.success('Group deleted successfully!')
      fetchGroups() // Refresh the list
    } catch (error) {
      console.error('Error deleting group:', error)
      toast.error('Failed to delete group')
    }
  }
  showConfirm.value = false
  groupToDelete.value = null
}

// Fetch groups from API
const fetchGroups = async () => {
  try {
    const eventId = route.query.eventId as string
    if (!eventId) {
      toast.error('Event ID not found')
      return
    }
    const response = await axios.get(`/scanner/events/${eventId}/group-scans`)
    groups.value = response.data as Group[]
  } catch (error) {
    console.error('Error fetching groups:', error)
    toast.error('Failed to load groups')
  }
}

// Handle submit from AddNewGroupEvent
const handleSubmit = async (formData: { groups: string[], status: string }) => {
  try {
    const eventId = route.query.eventId as string
    if (!eventId) {
      toast.error('Event ID not found')
      return
    }
    // Assuming the API expects an array of group names
    const payload = {
      groups: formData.groups,
      status: formData.status
    }
    await axios.post(`/admin/events/${eventId}/group-scans`, payload)
    toast.success('Group Event added successfully')
    fetchGroups() // Refresh the list
  } catch (error) {
    console.error('Error adding group:', error)
    toast.error('Failed to add group')
  }
}

// Handle edit save from EditGroupEvent
const handleEditSave = async (newName: string) => {
  if (editingGroup.value) {
    // Update the local array
    editingGroup.value.name_group = newName
    // Refresh the list to get updated data from server
    await fetchGroups()
  }
}

// Initialize on mount
onMounted(() => {
  fetchGroups()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
