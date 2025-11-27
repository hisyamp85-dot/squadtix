<template>
  <AdminLayout>
    <PageBreadcrumb
      :pageTitle="'Group Event'"
      :breadcrumbs="breadcrumbs"
    />

    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7
             dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="flex items-center gap-4 mb-4">
        <button @click="goBack" class="px-4 py-2 flex items-center gap-2">
          <BackArrowIcon class="text-gray-900 dark:text-white" />
        </button>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Group Event
        </h3>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5
               dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
      >
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
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">
                  No
                </th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">
                  Group Name
                </th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">
                  Status
                </th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(group, index) in groups"
                :key="group.id"
                class="border-t bg-gray-50 dark:bg-gray-800/50"
              >
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ index + 1 }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ group.name_group }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  <span
                    :class="group.status === 'Active' ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ group.status }}
                  </span>
                </td>
                <td class="px-5 py-6">
                  <div class="flex items-center gap-2">
                    <button
                      @click="editGroup(group)"
                      class="px-3 py-1.5 text-sm font-medium text-white
                             bg-blue-500 hover:bg-blue-600
                             dark:bg-blue-600 dark:hover:bg-blue-700
                             transition rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteGroup(group)"
                      class="px-3 py-1.5 text-sm font-medium text-white
                             bg-red-500 hover:bg-red-600
                             dark:bg-red-600 dark:hover:bg-red-700
                             transition rounded-md"
                    >
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
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
          <p class="text-gray-500 dark:text-gray-400">No groups found</p>
          <p
            class="text-sm text-gray-400 dark:text-gray-500 mt-1"
          >
            Add a new group to get started
          </p>
        </div>
      </div>
    </div>

    <!-- ADD MODAL -->
    <AddNewGroupEvent
      :show="showAddForm"
      :initialForm="initialForm"
      @close="showAddForm = false"
      @submit="handleSubmit"
    />

    <!-- EDIT MODAL -->
    <EditGroupEvent
      v-if="editingGroup"
      :show="showEditForm"
      :Group="editingGroup.name_group"
      :id="editingGroup.id.toString()"
      :eventId="eventId || ''"
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
        <h3 class="text-lg font-semibold mb-4 text-gray-800">
          Confirm Action
        </h3>
        <p class="text-gray-600 mb-6">
          {{ confirmMessage }}
        </p>
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
import { ref, onMounted, computed } from 'vue'
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
  id_user?: number | string   // kalau backend kirim id user pemilik
}

interface StoredUser {
  id: number | string
  name: string
  username: string
  email: string
  role: string
  status: string
}

// STATE UTAMA
const groups = ref<Group[]>([])
const showAddForm = ref(false)
const showEditForm = ref(false)
const editingGroup = ref<Group | null>(null)
const showConfirm = ref(false)
const confirmMessage = ref('')
const groupToDelete = ref<Group | null>(null)

const initialForm = ref({
  groups: [] as string[],
  status: 'Active',
})

const router = useRouter()
const route = useRoute()

// id user & event dari URL
const userIdFromRoute = computed(() => route.params.id as string | undefined)
const eventId = computed(() => route.query.eventId as string | undefined)

// user dari localStorage
const storedUser = computed<StoredUser | null>(() => {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
})

const currentUserId = computed(() => storedUser.value?.id ?? null)

// breadcrumbs versi user
const breadcrumbs = computed(() => {
  const uid = userIdFromRoute.value
  const eid = eventId.value

  return [
    {
      text: 'Home',
      to: uid ? `/${uid}` : '/',
    },
    {
      text: 'Event',
      to: uid ? `/${uid}/event` : '/event',
    },
    {
      text: 'Event Detail',
      to: uid && eid ? `/${uid}/event/detail/${eid}` : undefined,
    },
    {
      text: 'Group Event',
      active: true,
    },
  ]
})

// sidebar state untuk offset modal
const { isExpanded, isHovered } = useSidebar()

// back ke detail event user
const goBack = () => {
  const uid = userIdFromRoute.value
  const eid = eventId.value

  if (uid && eid) {
    router.push({
      name: 'UserDetailEvent',
      params: { id: uid, eventId: eid },
    })
  } else if (uid) {
    router.push({ name: 'UserEvent', params: { id: uid } })
  } else {
    router.push('/login')
  }
}

// ================= EDIT & DELETE =================
const editGroup = (group: Group) => {
  editingGroup.value = group
  showEditForm.value = true
}

const deleteGroup = (group: Group) => {
  groupToDelete.value = group
  confirmMessage.value = `Are you sure you want to delete "${group.name_group}"? This action cannot be undone.`
  showConfirm.value = true
}

const cancelConfirm = () => {
  showConfirm.value = false
  groupToDelete.value = null
}

const confirmAction = async () => {
  if (groupToDelete.value) {
    try {
      const eid = eventId.value
      if (!eid) {
        toast.error('Event ID not found')
        return
      }
      await axios.delete(`/events/${eid}/group-scans/${groupToDelete.value.id}`)
      toast.success('Group deleted successfully!')
      await fetchGroupsOnlyForCurrentUser()
    } catch (error) {
      console.error('Error deleting group:', error)
      toast.error('Failed to delete group')
    }
  }
  showConfirm.value = false
  groupToDelete.value = null
}

// ================= FETCH DATA HANYA MILIK USER =================
const fetchGroupsOnlyForCurrentUser = async () => {
  const eid = eventId.value
  const uid = currentUserId.value

  if (!eid) {
    toast.error('Event ID not found')
    return
  }
  if (!uid) {
    toast.error('User not found, please login again.')
    return
  }

  try {
    // 1. Cek dulu detail event → apakah ada id_user
    // kalau id_user != currentUserId → anggap bukan event milik user → groups = [] (tanpa error “not allowed”)
    const eventRes = await axios.get(`/events/${eid}`)
    const eventData = eventRes.data as { event_id: string; id_user?: number | string }

    if (eventData.id_user && String(eventData.id_user) !== String(uid)) {
      groups.value = []
      // DI SINI SENGAJA TIDAK ADA TOAST "not allowed"
      return
    }
  } catch (error) {
    console.error('Error fetching event detail:', error)
    // kalau gagal ambil detail event, kita anggap tidak ada data saja
    groups.value = []
    return
  }

  // 2. Kalau event milik user (atau id_user tidak dikirim) → ambil group
  try {
    const response = await axios.get(`/events/${eid}/group-scans`)
    const data = response.data as Group[]

    // kalau backend kirim id_user di group, filter lagi by user untuk jaga-jaga
    if (currentUserId.value != null) {
      groups.value = data.filter((g) =>
        g.id_user == null ? true : String(g.id_user) === String(currentUserId.value),
      )
    } else {
      groups.value = data
    }
  } catch (error) {
    console.error('Error fetching groups:', error)
    toast.error('Failed to load groups')
  }
}

// ================= HANDLE ADD & EDIT =================
const handleSubmit = async (formData: { groups: string[]; status: string }) => {
  try {
    const eid = eventId.value
    if (!eid) {
      toast.error('Event ID not found')
      return
    }
    const payload = {
      groups: formData.groups,
      status: formData.status,
    }
    await axios.post(`/events/${eid}/group-scans`, payload)
    toast.success('Group Event added successfully')
    await fetchGroupsOnlyForCurrentUser()
  } catch (error) {
    console.error('Error adding group:', error)
    toast.error('Failed to add group')
  }
}

const handleEditSave = async (newName: string, newStatus?: string) => {
  if (!editingGroup.value) return

  try {
    const eid = eventId.value
    if (!eid) {
      toast.error('Event ID not found')
      return
    }

    const payload: { name_group: string; status?: string } = {
      name_group: newName,
    }
    if (typeof newStatus === 'string') {
      payload.status = newStatus
    }

    await axios.put(`/events/${eid}/group-scans/${editingGroup.value.id}`, payload)
    toast.success('Group updated successfully')
    showEditForm.value = false
    editingGroup.value = null
    await fetchGroupsOnlyForCurrentUser()
  } catch (error) {
    console.error('Error updating group:', error)
    toast.error('Failed to update group')
  }
}

// INIT
onMounted(async () => {
  await fetchGroupsOnlyForCurrentUser()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
