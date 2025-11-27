<template>
  <AdminLayout>
    <PageBreadcrumb
      :pageTitle="'Upload Barcode'"
      :breadcrumbs="breadcrumbs"
    />

    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7
             dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <!-- Back Button and Title -->
      <div class="flex items-center gap-4 mb-4">
        <button @click="goBack" class="px-4 py-2 flex items-center gap-2">
          <BackArrowIcon class="text-gray-900 dark:text-white" />
        </button>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Upload Barcode
        </h3>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5
               dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
      >
        <!-- Info kalau event bukan milik user, tapi tombol tetap aktif
             (kalau backend tidak mengizinkan, akan balas error sendiri) -->
        <div
          v-if="!isOwner && eventId && eventCategoryId"
          class="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3
                 text-xs sm:text-sm text-yellow-800 dark:border-yellow-700
                 dark:bg-yellow-900/30 dark:text-yellow-100"
        >
          You are not the owner of this event. Data table is hidden, but you may still try
          to upload or add barcodes if your account is allowed.
        </div>

        <!-- Filters / Top Controls -->
        <div class="flex flex-wrap items-center justify-between mb-4 pt-4 pr-4 pl-4 gap-3">
          <div class="flex flex-wrap items-center gap-4">
            <Button
              class="btn btn-primary"
              size="sm"
              variant="primary"
              :startIcon="UploadIcon"
              @click="uploadDataBarcode"
            >
              Upload Data Barcode
            </Button>

            <Button
              class="btn btn-primary"
              size="sm"
              variant="primary"
              :startIcon="PlusIcon"
              @click="addBarcodeManually"
            >
              Add Barcode Manually
            </Button>

            <Button
              v-if="selectedBarcodes.length > 0"
              class="btn btn-danger"
              size="sm"
              variant="primary"
              @click="deleteSelectedBarcodes"
            >
              Delete Selected ({{ selectedBarcodes.length }})
            </Button>

            <div class="flex items-center gap-2">
              <label for="search" class="text-gray-700 dark:text-gray-300">Search</label>
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                class="px-3 py-2 border border-gray-300 rounded-md
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search by barcode or name"
              />
            </div>

            <div class="flex items-center gap-2">
              <label for="status" class="text-gray-700 dark:text-gray-300">Status</label>
              <select
                id="status"
                v-model="statusFilter"
                class="px-3 py-2 border border-gray-300 rounded-md
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All</option>
                <option value="Redeemed">Redeemed</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
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

        <!-- Table -->
        <div class="max-w-full overflow-x-auto">
          <table class="min-w-full border border-separate border-spacing-y-2">
            <thead>
              <tr class="border-b">
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
                           focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                           focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">No</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">ID Transaction</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Barcode</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Name</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Other Data</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Redeem Date</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Status</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="paginatedBarcodes.length === 0"
                class="bg-gray-50 dark:bg-gray-800/50"
              >
                <td
                  colspan="9"
                  class="px-5 py-6 text-center text-gray-500 dark:text-gray-300"
                >
                  No barcodes found.
                </td>
              </tr>

              <tr
                v-else
                v-for="(barcode, index) in paginatedBarcodes"
                :key="barcode.id"
                class="border-t bg-gray-50 dark:bg-gray-800/50"
              >
                <td class="px-5 py-6">
                  <input
                    type="checkbox"
                    v-model="selectedBarcodes"
                    :value="barcode.id.toString()"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
                           focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                           focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    @change="handleBarcodeChange(barcode.id.toString(), $event)"
                  />
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ (currentPage - 1) * numericEntriesPerPage + index + 1 }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ barcode.id_transaction }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ barcode.qrcode }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ barcode.name }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ barcode.other_data }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ formatDate(barcode.redeemed_at) }}
                </td>
                <td class="px-5 py-6">
                  <span
                    class="px-3 py-1 text-xs font-semibold rounded-full"
                    :class="statusBadgeClasses(barcode.status)"
                  >
                    {{ barcode.status }}
                  </span>
                </td>
                <td class="px-5 py-6">
                  <button
                    class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                           transition p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    @click="viewBarcode(barcode)"
                  >
                    <EyeIcon />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredBarcodes.length > 0"
          class="mt-4 flex flex-col md:flex-row items-center justify-between gap-3"
        >
          <div class="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            Showing
            <span class="font-semibold">{{ startItem }}</span>
            -
            <span class="font-semibold">{{ endItem }}</span>
            of
            <span class="font-semibold">{{ filteredBarcodes.length }}</span>
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
      </div>
    </div>

    <!-- Upload Modal (USER) -->
    <UploadDataBarcode
      :show="showUploadModal"
      :eventId="eventId"
      :eventCategoryId="eventCategoryId"
      @close="showUploadModal = false"
      @submit="handleUploadSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Selected Barcodes"
      :message="confirmDeleteMessage"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <!-- Add Barcode Manually Modal (USER) -->
    <AddBarcodeManually
      :show="showAddBarcodeModal"
      :eventId="eventId"
      :eventCategoryId="eventCategoryId"
      @close="showAddBarcodeModal = false"
      @submit="handleAddBarcodeSubmit"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Button from '@/components/ui/Button.vue'
import UploadIcon from '@/icons/UploadIcon.vue'
import PlusIcon from '@/icons/PlusIcon.vue'
import EyeIcon from '@/icons/EyeIcon.vue'
import { useRouter, useRoute } from 'vue-router'
import BackArrowIcon from '@/icons/BackArrowIcon.vue'
import UploadDataBarcode from './UserUploadDataBarcode.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import AddBarcodeManually from './UserAddBarcodeManually.vue'
import api from '@/lib/axios'
import { toast } from 'vue3-toastify'

type BarcodeStatus = 'Pending' | 'Redeemed' | 'Expired'

interface Barcode {
  id: number
  id_transaction: string | null
  qrcode: string
  name: string
  other_data: string | null
  status: BarcodeStatus
  redeemed_at: string | null
  redeemed_by: string | null
}

// ========= STATE =========
const barcodes = ref<Barcode[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const entriesPerPage = ref<number | string>(10)
const currentPage = ref(1)
const entriesOptions = [5, 10, 25, 50]
const selectedBarcodes = ref<string[]>([])
const showUploadModal = ref(false)
const showDeleteModal = ref(false)
const showAddBarcodeModal = ref(false)

const router = useRouter()
const route = useRoute()

// route param user & query event
const userId = computed(() => (route.params.id as string) || '')
const eventId = computed(() => (route.query.eventId as string) || '')
const eventCategoryId = computed(() => (route.query.event_category_id as string) || '')

// ====== USER LOGIN & EVENT OWNER ======
const loggedInUserId = ref<string | number | null>(null)
const eventOwnerId = ref<string | number | null>(null)

// hanya cek owner untuk table (data milik user)
const isOwner = computed(() => {
  if (loggedInUserId.value == null || eventOwnerId.value == null) return false
  return String(loggedInUserId.value) === String(eventOwnerId.value)
})

// breadcrumbs khusus user
const breadcrumbs = computed(() => {
  const uid = userId.value
  const evId = eventId.value
  const catId = eventCategoryId.value

  if (!uid) {
    return [
      { text: 'Home', to: '/' },
      { text: 'Event', to: '/event' },
      { text: 'Upload Barcode', active: true },
    ]
  }

  const items: Array<{ text: string; to?: string; active?: boolean }> = [
    { text: 'Home', to: `/${uid}` },
    { text: 'Event', to: `/${uid}/event` },
  ]

  if (evId) {
    items.push({
      text: 'Event Detail',
      to: `/${uid}/event/detail/${evId}?event_category_id=${catId}`,
    })
  }

  items.push({ text: 'Upload Barcode', active: true })

  return items
})

// Pastikan entriesPerPage selalu berupa number
const numericEntriesPerPage = computed(() => {
  const n = Number(entriesPerPage.value)
  return Number.isNaN(n) || n <= 0 ? 10 : n
})

function goBack() {
  const uid = userId.value
  const id = eventId.value
  const categoryId = eventCategoryId.value

  if (uid && id) {
    router.push({
      name: 'UserDetailEvent',
      params: { id: uid, eventId: id },
      query: { event_category_id: categoryId },
    })
  } else if (uid) {
    router.push({ name: 'UserEvent', params: { id: uid } })
  } else {
    router.push('/login')
  }
}

// ========= OWNER EVENT =========
async function fetchEventOwner() {
  if (!eventId.value) {
    eventOwnerId.value = null
    return
  }
  try {
    const res = await api.get(`/events/${eventId.value}`)
    const data = res.data as { id_user?: number | string }
    eventOwnerId.value = data.id_user ?? null
  } catch (error) {
    console.error('Failed to fetch event owner:', error)
    eventOwnerId.value = null
  }
}

// ========= FILTER & PAGINATION =========
const filteredBarcodes = computed(() => {
  return barcodes.value.filter((barcode) => {
    const query = searchQuery.value.trim().toLowerCase()
    const matchesSearch =
      !query ||
      (barcode.qrcode ?? '').toLowerCase().includes(query) ||
      (barcode.name ?? '').toLowerCase().includes(query)
    const matchesStatus = !statusFilter.value || barcode.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => {
  if (filteredBarcodes.value.length === 0) return 0
  return Math.ceil(filteredBarcodes.value.length / numericEntriesPerPage.value)
})

const paginatedBarcodes = computed(() => {
  if (filteredBarcodes.value.length === 0) return []
  const start = (currentPage.value - 1) * numericEntriesPerPage.value
  return filteredBarcodes.value.slice(start, start + numericEntriesPerPage.value)
})

const startItem = computed(() => {
  if (filteredBarcodes.value.length === 0) return 0
  return (currentPage.value - 1) * numericEntriesPerPage.value + 1
})

const endItem = computed(() => {
  if (filteredBarcodes.value.length === 0) return 0
  const end = currentPage.value * numericEntriesPerPage.value
  return end > filteredBarcodes.value.length ? filteredBarcodes.value.length : end
})

const pageNumbers = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages.value; i += 1) {
    pages.push(i)
  }
  return pages
})

const isAllSelected = computed(
  () =>
    selectedBarcodes.value.length === paginatedBarcodes.value.length &&
    paginatedBarcodes.value.length > 0,
)

function formatDate(dateString: string | null) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

function statusBadgeClasses(status: BarcodeStatus) {
  switch (status) {
    case 'Redeemed':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
    case 'Expired':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200'
    default:
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200'
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

// ========= UPLOAD & ADD =========
function uploadDataBarcode() {
  showUploadModal.value = true
}

async function handleUploadSubmit() {
  showUploadModal.value = false
  await fetchBarcodes()
}

async function handleAddBarcodeSubmit() {
  showAddBarcodeModal.value = false
  await fetchBarcodes()
}

async function fetchBarcodes() {
  try {
    if (!eventId.value || !eventCategoryId.value) {
      barcodes.value = []
      return
    }

    const response = await api.get(
      `/events/${eventId.value}/categories/${eventCategoryId.value}/qrcodes`,
    )

    const raw = response.data as Barcode[]

    // DATA TABEL hanya kalau event milik user
    barcodes.value = isOwner.value ? raw : []

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  } catch (error) {
    console.error('Failed to fetch barcodes:', error)
    toast.error('Failed to load barcodes')
    barcodes.value = []
  }
}

// ========= DELETE =========
function handleBarcodeChange(barcodeId: string, event: Event) {
  const target = event.target as HTMLInputElement
  const isChecked = target.checked
  const index = selectedBarcodes.value.indexOf(barcodeId)
  if (isChecked && index === -1) {
    selectedBarcodes.value.push(barcodeId)
  } else if (!isChecked && index !== -1) {
    selectedBarcodes.value.splice(index, 1)
  }
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedBarcodes.value = []
  } else {
    selectedBarcodes.value = paginatedBarcodes.value.map((barcode) => barcode.id.toString())
  }
}

async function deleteSelectedBarcodes() {
  if (selectedBarcodes.value.length === 0) {
    toast.warning('No barcodes selected for deletion')
    return
  }

  showDeleteModal.value = true
}

const confirmDeleteMessage = computed(
  () =>
    `Are you sure you want to delete ${selectedBarcodes.value.length} selected barcode(s)? This action cannot be undone.`,
)

async function confirmDelete() {
  try {
    const ids = selectedBarcodes.value.map((id) => parseInt(id, 10))
    const response = await api({
      method: 'DELETE',
      url: `/events/${eventId.value}/categories/${eventCategoryId.value}/qrcodes`,
      data: { ids },
    })

    toast.success((response.data as { message: string }).message)
    selectedBarcodes.value = []
    showDeleteModal.value = false
    await fetchBarcodes()
  } catch (error: unknown) {
    console.error('Delete error:', error)
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    const message = err.response?.data?.message || err.message || 'Failed to delete barcodes'
    toast.error(`Gagal menghapus barcode: ${message}`)
  }
}

// ========= ADD MANUAL =========
function addBarcodeManually() {
  showAddBarcodeModal.value = true
}

function viewBarcode(barcode: Barcode) {
  // sementara pakai alert; bisa diganti modal detail
  alert(`View details for barcode: ${barcode.qrcode}`)
}

// ========= INIT =========
onMounted(async () => {
  // ambil user id dari localStorage
  try {
    const saved = localStorage.getItem('user')
    if (saved) {
      const parsed = JSON.parse(saved) as { id?: number | string }
      if (parsed && parsed.id !== undefined) {
        loggedInUserId.value = parsed.id
      }
    }
  } catch (e) {
    console.error('Failed to parse user from localStorage:', e)
  }

  await fetchEventOwner()
  await fetchBarcodes()
})

// reset ke page 1 kalau entriesPerPage berubah
watch(entriesPerPage, () => {
  currentPage.value = 1
})

// reset ke page 1 kalau filter search / status berubah
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

// pastikan currentPage valid kalau jumlah data berubah
watch(
  () => filteredBarcodes.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  },
)
</script>
