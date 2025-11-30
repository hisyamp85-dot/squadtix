<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" :breadcrumbs="breadcrumbs" />

    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7
             dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        My Events
      </h3>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5
               dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
      >
        <!-- Boleh dihapus kalau tidak dipakai -->
        <ProfileCard />

        <!-- TOP BAR: ADD BUTTON + SHOW ENTRIES -->
	 <div
          class="flex flex-wrap items-center justify-between mb-4 pt-4 pr-4 pl-4 gap-3"
        >
          <div class="flex items-center gap-2">
            <Button
              class="btn btn-primary"
              size="sm"
              variant="primary"
              :startIcon="PlusIcon"
              @click="openAddForm"
            >
              Add New Event
            </Button>
          </div>	
     
          <div class="flex items-center gap-2">
            <label for="entries" class="text-gray-700 dark:text-gray-300">Show</label>
            <select
              id="entries"
              v-model="entriesPerPage"
              class="border border-gray-300 rounded px-2 py-1
                     dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option v-for="option in entriesOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <span class="text-gray-700 dark:text-gray-300">entries</span>
          </div>
        </div>

        <div class="mb-2 text-xs text-gray-500 dark:text-gray-400 px-4">
          Only showing events for:
          <span class="font-semibold">{{ storedUser?.name }}</span>
        </div>

        <!-- TABLE -->
        <div class="max-w-full overflow-x-auto p-4">
          <table class="min-w-full border border-separate border-spacing-y-2">
            <thead>
              <tr class="border-b">
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">No</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Event Name</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">
                  Total Category
                </th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Status</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="paginatedEvents.length === 0"
                class="bg-gray-50 dark:bg-gray-800/50"
              >
                <td
                  colspan="5"
                  class="px-5 py-6 text-center text-gray-500 dark:text-gray-300"
                >
                  No events found for your account.
                </td>
              </tr>

              <tr
                v-else
                v-for="(event, index) in paginatedEvents"
                :key="event.id_event"
                class="border-t bg-gray-50 dark:bg-gray-800/50"
              >
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ (currentPage - 1) * numericEntriesPerPage + index + 1 }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ event.name }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ event.categories.length }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  <span
                    :class="event.status === 'Active' ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ event.status }}
                  </span>
                </td>
                <td class="px-5 py-6">
                  <!-- View detail lengkap event (versi user) -->
                  <button
                    aria-label="View Event Detail"
                    class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                           transition p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    @click="viewEventDetail(event)"
                  >
                    <ListIcon />
                  </button>

                  <!-- Edit / Delete pakai modal -->
                  <button
                    aria-label="Open Event Info"
                    class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                           transition p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    @click="viewEvent(event)"
                  >
                    <EyeIcon />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGINATION -->
        <div
          v-if="events.length > 0"
          class="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 px-4 pb-4"
        >
          <div class="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            Showing
            <span class="font-semibold">{{ startItem }}</span>
            -
            <span class="font-semibold">{{ endItem }}</span>
            of
            <span class="font-semibold">{{ events.length }}</span>
            records
          </div>

          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 text-xs md:text-sm border rounded-lg
                     border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="currentPage === 1 || totalPages === 0"
              @click="prevPage"
            >
              Prev
            </button>

            <button
              v-for="page in pageNumbers"
              :key="page"
              class="px-3 py-1.5 text-xs md:text-sm border rounded-lg"
              :class="page === currentPage
                ? 'border-primary text-primary font-semibold'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>

            <button
              class="px-3 py-1.5 text-xs md:text-sm border rounded-lg
                     border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="currentPage === totalPages || totalPages === 0"
              @click="nextPage"
            >
              Next
            </button>
          </div>
        </div>

        <!-- MODALS (User juga bisa add/edit/delete) -->
        <AddNewEventModal
          :show="showAddForm"
          :initial-form="form"
          @close="closeAddForm"
          @submit="handleAddEvent"
        />

        <DeatailMasterEvent
          :show="showDetailModal"
          :category="selectedEvent?.name || ''"
          :id="selectedEvent?.id_event || ''"
          :event-id="selectedEvent?.id_event"
          @close="closeDetailModal"
          @save="handleSaveEvent"
          @delete="handleDeleteEvent"
        />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { EyeIcon, ListIcon, PlusIcon } from '@/icons'
import AddNewEventModal from '@/views/Admin/Event/AddNewEvent.vue'
import DeatailMasterEvent from '@/views/Admin/Event/DeatailMasterEvent.vue'
import ProfileCard from '@/components/common/ProfileCard.vue'
import api from '@/lib/axios'
import { toast } from 'vue3-toastify'
import Button from "@/components/ui/Button.vue";

// ======================== USER DARI LOCAL STORAGE ========================
type Role = 'Admin' | 'User' | 'Redemption' | 'Scan Wristband' | string

interface StoredUser {
  id: number | string
  name: string
  username: string
  email: string
  role: Role
  status: string
}

const router = useRouter()

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

const userId = computed<number | undefined>(() => {
  const id = storedUser.value?.id
  if (typeof id === 'string') {
    const parsed = Number(id)
    return isNaN(parsed) ? undefined : parsed
  }
  if (typeof id === 'number') return id
  return undefined
})

// ======================== BREADCRUMBS (VERSI USER) ========================
const currentPageTitle = ref('Event')

const breadcrumbs = computed(() => {
  if (!userId.value) {
    return [
      { text: 'Home', to: '/' },
      { text: 'Event', active: true },
    ]
  }

  return [
    { text: 'Home', to: `/${userId.value}` },
    { text: 'Event', active: true },
  ]
})

// ======================== TIPE & STATE EVENT ========================

interface EventForm {
  id_event?: string
  name?: string
  categories: string[]
  status: string
  id_user?: number | undefined
}

const events = ref<EventForm[]>([])

const showAddForm = ref(false)
const showDetailModal = ref(false)
const selectedEvent = ref<EventForm | null>(null)

const form = ref<EventForm>({
  name: '',
  categories: [],
  status: 'Active',
})

// ======================== PAGINATION ========================
const entriesPerPage = ref<number | string>(10)
const entriesOptions = [5, 10, 20, 50]
const currentPage = ref(1)

const numericEntriesPerPage = computed(() => {
  const n = Number(entriesPerPage.value)
  return Number.isNaN(n) || n <= 0 ? 10 : n
})

const totalPages = computed(() => {
  if (events.value.length === 0) return 0
  return Math.ceil(events.value.length / numericEntriesPerPage.value)
})

const paginatedEvents = computed(() => {
  if (events.value.length === 0) return []
  const start = (currentPage.value - 1) * numericEntriesPerPage.value
  return events.value.slice(start, start + numericEntriesPerPage.value)
})

const startItem = computed(() => {
  if (events.value.length === 0) return 0
  return (currentPage.value - 1) * numericEntriesPerPage.value + 1
})

const endItem = computed(() => {
  if (events.value.length === 0) return 0
  const end = currentPage.value * numericEntriesPerPage.value
  return end > events.value.length ? events.value.length : end
})

const pageNumbers = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages.value; i += 1) {
    pages.push(i)
  }
  return pages
})

// ======================== NAV & ACTIONS ========================

const openAddForm = () => {
  if (!userId.value) {
    toast.error('User not found. Please login again.')
    router.push('/login')
    return
  }

  form.value = {
    name: '',
    categories: [],
    status: 'Active',
    id_user:
      typeof storedUser.value?.id === 'string'
        ? Number(storedUser.value.id)
        : (storedUser.value?.id as number | undefined),
  }
  showAddForm.value = true
}

const closeAddForm = () => {
  showAddForm.value = false
}

const viewEvent = (event: EventForm) => {
  selectedEvent.value = event
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedEvent.value = null
}

// Detail event versi user (route UserDetailEvent)
const viewEventDetail = (event: EventForm) => {
  if (!event.id_event || !userId.value) return

  router.push({
    name: 'UserDetailEvent',
    params: {
      id: userId.value,
      eventId: event.id_event,
    },
    state: { event: event as any },
  })
}

// ======================== CRUD EVENT ========================
function isAxiosError(error: unknown): error is { response?: { data?: unknown }; message: string } {
  return typeof error === 'object' && error !== null && 'message' in error
}

const handleAddEvent = async (formData: EventForm) => {
  try {
    if (!userId.value) {
      toast.error('User not found. Please login again.')
      router.push('/login')
      return
    }

    const payload = {
      name: formData.name,
      categories: formData.categories,
      status: formData.status || 'Active',
      id_user: userId.value, // PASTIKAN event milik user ini
    }

    await api.post('/events', payload)
    await fetchEvents()
    showAddForm.value = false
    form.value = { name: '', categories: [], status: 'Active' }
    toast.success('Event added successfully!')
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to add event:', error.response?.data || error.message)
      const data = error.response?.data
      const errorMsg =
        typeof data === 'object' && data !== null && 'error' in data
          ? String((data as { error: unknown }).error)
          : error.message
      toast.error('Failed to add event: ' + errorMsg)
    } else {
      console.error('Unexpected error:', error)
      toast.error('Unexpected error')
    }
  }
}

const handleSaveEvent = async (eventName: string, status: string) => {
  if (!selectedEvent.value?.id_event) return
  try {
    await api.put(`/events/${selectedEvent.value.id_event}`, {
      name: eventName,
      status,
    })
    await fetchEvents()
    showDetailModal.value = false
    toast.success('Event updated successfully!')
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to update event:', error.response?.data || error.message)
      const data = error.response?.data
      const errorMsg =
        typeof data === 'object' && data !== null && 'error' in data
          ? String((data as { error: unknown }).error)
          : error.message
      toast.error('Failed to update event: ' + errorMsg)
    } else {
      console.error('Unexpected error:', error)
      toast.error('Unexpected error')
    }
  }
}

const handleDeleteEvent = async () => {
  if (!selectedEvent.value?.id_event) return
  try {
    await api.delete(`/events/${selectedEvent.value.id_event}`)
    await fetchEvents()
    showDetailModal.value = false
    toast.success('Event deleted successfully!')
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to delete event:', error.response?.data || error.message)
      const data = error.response?.data
      const errorMsg =
        typeof data === 'object' && data !== null && 'error' in data
          ? String((data as { error: unknown }).error)
          : error.message
      toast.error('Failed to delete event: ' + errorMsg)
    } else {
      console.error('Unexpected error:', error)
      toast.error('Unexpected error')
    }
  }
}

// ======================== FETCH HANYA EVENT USER ========================
const fetchEvents = async () => {
  try {
    if (!userId.value) {
      router.push('/login')
      return
    }

    const response = await api.get('/events')
    const data = response.data as Array<{
      event_id: string
      event_name: string
      status: string
      id_user: number | string
      totalCategories: number
    }>

    const currentUserIdNum = Number(userId.value)

    const userEvents = data.filter((event) => {
      const evUser = Number(event.id_user)
      return !Number.isNaN(evUser) && evUser === currentUserIdNum
    })

    events.value = userEvents.map((event) => ({
      id_event: event.event_id,
      name: event.event_name,
      categories: new Array(event.totalCategories).fill(''), // untuk .length di tabel
      status: event.status,
      id_user: Number(event.id_user),
    }))

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }
}

onMounted(() => {
  fetchEvents()
})

// reset ke page 1 ketika entriesPerPage berubah
watch(entriesPerPage, () => {
  currentPage.value = 1
})

// kalau jumlah events berubah dan currentPage jadi kebesaran → geser ke page terakhir yg valid
watch(
  () => events.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  },
)

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<style></style>
