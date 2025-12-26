<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Check-in Logs'" :breadcrumbs="breadcrumbs" />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7
             dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <button
          @click="goBack"
          class="px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary"
        >
          <BackArrowIcon class="h-5 w-5" />
        </button>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex-1">
          Check-in Logs
        </h3>
        <div class="flex gap-3">
          <Button variant="outline" size="sm" @click="refreshLogs" :disabled="isLoading">
            Refresh
          </Button>
          <Button variant="primary" size="sm" @click="goToScanner">
            Go to Check-in
          </Button>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <!-- FILTERS -->
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <div class="flex items-center gap-2 w-full md:w-auto">
            <label for="search" class="text-gray-600 dark:text-gray-300">Search</label>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              class="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Barcode, name, event..."
            />
          </div>

          <div class="flex items-center gap-2 w-full md:w-1/3">
            <label class="text-gray-600 dark:text-gray-300 whitespace-nowrap">Event</label>
            <select
              v-model="selectedEventId"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Events</option>
              <option
                v-for="event in events"
                :key="event.event_id"
                :value="event.event_id"
              >
                {{ event.event_name }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-2 w-full md:w-1/3">
            <label class="text-gray-600 dark:text-gray-300 whitespace-nowrap">Category</label>
            <select
              v-model="selectedCategoryId"
              :disabled="!selectedEventId"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
            >
              <option value="">
                {{ selectedEventId ? 'All Categories' : 'Select event first' }}
              </option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <span class="text-sm text-gray-500 dark:text-gray-400">
            Total: {{ filteredLogs.length }}
          </span>
        </div>

        <!-- TABLE -->
        <div class="max-w-full overflow-x-auto">
          <table class="min-w-full border border-gray-200 dark:border-gray-700">
            <thead class="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  No
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Barcode
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Name
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Event
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Category
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scanned By
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scanned At
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Checkout By
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Checkout At
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td
                  colspan="9"
                  class="text-center py-6 text-gray-500 dark:text-gray-300"
                >
                  Loading logs...
                </td>
              </tr>

              <tr v-else-if="filteredLogs.length === 0">
                <td
                  colspan="9"
                  class="text-center py-6 text-gray-500 dark:text-gray-300"
                >
                  No check-in data found.
                </td>
              </tr>

              <tr
                v-else
                v-for="(log, idx) in paginatedLogs"
                :key="log.id"
                class="border-t border-gray-100 dark:border-gray-800"
              >
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {{ (currentPage - 1) * pageSize + idx + 1 }}
                </td>
                <td class="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">
                  {{ log.qrcode }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {{ log.barcode?.name || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {{ log.eventName || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {{ log.categoryName || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {{ log.scanned_by || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {{ formatDateTime(log.scanned_at) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {{ log.checkout_by || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {{ formatDateTime(log.checkout_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGINATION -->
        <div
          v-if="filteredLogs.length > 0"
          class="mt-4 flex flex-col md:flex-row items-center justify-between gap-3"
        >
          <div class="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            Showing
            <span class="font-semibold">
              {{ startItem }}
            </span>
            -
            <span class="font-semibold">
              {{ endItem }}
            </span>
            of
            <span class="font-semibold">
              {{ filteredLogs.length }}
            </span>
            records
          </div>

          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 text-xs md:text-sm border rounded-lg
                     border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
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
              @click="goToPage(currentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import BackArrowIcon from '@/icons/BackArrowIcon.vue'
import Button from '@/components/ui/Button.vue'
import api from '@/lib/axios'
import { toast } from 'vue3-toastify'

interface CheckinLog {
  id: number
  qrcode: string
  scanned_at: string | null
  scanned_by: string | null

  checkout_at: string | null   // NEW
  checkout_by: string | null   // NEW

  barcode: {
    id: number
    qrcode: string
    name: string | null
    other_data: string | null
  } | null
  eventName: string | null
  categoryName: string | null
}

interface EventSummary {
  event_id: string
  event_name: string
}

interface CategorySummary {
  id: string
  name: string
}

const router = useRouter()
const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'Check-in', to: '/checkin' },
  { text: 'Logs', active: true },
]

const logs = ref<CheckinLog[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const events = ref<EventSummary[]>([])
const categories = ref<CategorySummary[]>([])
const selectedEventId = ref('')
const selectedCategoryId = ref('')

// PAGINATION STATE
const currentPage = ref(1)
const pageSize = ref(10) // jumlah row per halaman

// FILTERED LOGS
const filteredLogs = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return logs.value

  return logs.value.filter(log => {
    return (
      log.qrcode.toLowerCase().includes(query) ||
      (log.barcode?.name || '').toLowerCase().includes(query) ||
      (log.eventName || '').toLowerCase().includes(query) ||
      (log.categoryName || '').toLowerCase().includes(query) ||
      (log.checkout_by || '').toLowerCase().includes(query)
    )
  })
})

// PAGINATED LOGS
const totalPages = computed(() =>
  Math.ceil(filteredLogs.value.length / pageSize.value) || 0,
)

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLogs.value.slice(start, end)
})

// Info text "Showing X–Y of Z"
const startItem = computed(() => {
  if (filteredLogs.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const endItem = computed(() => {
  const end = currentPage.value * pageSize.value
  return end > filteredLogs.value.length ? filteredLogs.value.length : end
})

// Page numbers (simple 1..totalPages)
const pageNumbers = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages.value; i += 1) {
    pages.push(i)
  }
  return pages
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const fetchLogs = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/scanner/checkin/logs', {
      params: {
        eventId: selectedEventId.value || undefined,
        eventCategoryId: selectedCategoryId.value || undefined,
      },
    })
    const data = response.data as { logs: CheckinLog[] }
    logs.value = data.logs
    // reset ke halaman 1 tiap ambil data baru
    currentPage.value = 1
  } catch (error) {
    console.error('Failed to fetch logs:', error)
    toast.error('Failed to load check-in logs')
  } finally {
    isLoading.value = false
  }
}

const refreshLogs = () => {
  fetchLogs()
}

const fetchEvents = async () => {
  try {
    const response = await api.get('/admin/events')
    const data = response.data as Array<{ event_id: string; event_name: string }>
    events.value = data
  } catch (error) {
    console.error('Failed to fetch events:', error)
    toast.error('Failed to load events')
  }
}

const fetchCategories = async (eventId: string) => {
  try {
    if (!eventId) {
      categories.value = []
      return
    }
    const response = await api.get(`/events/${eventId}/categories`)
    const data = response.data as {
      categories: Array<{ name: string; id: string }>
    }
    categories.value = data.categories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    toast.error('Failed to load categories')
  }
}

const goBack = () => {
  router.back()
}

const goToScanner = () => {
  router.push('/checkin')
}

const formatDateTime = (value: string | null) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString()
}

// RESET PAGE KETIKA FILTER BERUBAH
watch(searchQuery, () => {
  currentPage.value = 1
})

watch(selectedEventId, async newEventId => {
  selectedCategoryId.value = ''
  categories.value = []
  if (newEventId) {
    await fetchCategories(newEventId)
  }
  await fetchLogs()
  currentPage.value = 1
})

watch(selectedCategoryId, async () => {
  if (selectedEventId.value) {
    await fetchLogs()
    currentPage.value = 1
  }
})

onMounted(() => {
  fetchEvents()
  fetchLogs()
})
</script>
