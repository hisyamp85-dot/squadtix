<template>
  <AdminLayout>
    <PageBreadcrumb
      :pageTitle="'Upload Barcode'"
      :breadcrumbs="[
        { text: 'Home', to: '/' },
        { text: 'Event', to: '/event' },
        {
          text: 'Event Detail',
          to: `/event/detail/${eventId}?event_category_id=${eventCategoryId}`
        },
        { text: 'Upload Barcode', active: true }
      ]"
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
        <div
          class="max-w-full border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
        >
          <div class="max-h-[600px] overflow-y-auto overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-y-2">
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
                  <th class="px-5 py-3 text-left text-gray-900 dark:text-white">QR Code</th>
                  <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Name</th>
                  <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Instansi</th>
                  <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Provinsi</th>
                  <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Kabupaten/Kota</th>
                  <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Jabatan</th>
                  <th class="px-5 py-3 text-left text-gray-900 dark:text-white">No Hp</th>
                  <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Email</th>
                  <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Ukuran Baju</th>
                  <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Status Kehadiran</th>
                  <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Tanggal Kehadiran</th>
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
                    colspan="18"
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
                    {{ barcode.instansi }}
                  </td>
                  <td class="px-5 py-6 text-gray-900 dark:text-white">
                    {{ barcode.provinsi }}
                  </td>
                  <td class="px-5 py-6 text-gray-900 dark:text-white">
                    {{ barcode.kota }}
                  </td>
                  <td class="px-5 py-6 text-gray-900 dark:text-white">
                    {{ barcode.jabatan }}
                  </td>
                  <td class="px-5 py-6 text-gray-900 dark:text-white">
                    {{ barcode.no_hp }}
                  </td>
                  <td class="px-5 py-6 text-gray-900 dark:text-white">
                    {{ barcode.email }}
                  </td>
                  <td class="px-5 py-6 text-gray-900 dark:text-white">
                    {{ barcode.ukuran_jaket }}
                  </td>
                  <td class="px-5 py-6 text-gray-900 dark:text-white">
                    {{ barcode.status_kehadiran }}
                  </td>
                  <td class="px-5 py-6 text-gray-900 dark:text-white">
                    {{ barcode.tanggal_kehadiran }}
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
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredBarcodes.length > 0"
          class="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
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

          <div class="flex flex-wrap items-center justify-center md:justify-end gap-2">
            <button
              class="px-3 py-1.5 text-xs md:text-sm border rounded-full
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
              class="px-3 py-1.5 text-xs md:text-sm rounded-full border"
              :class="page === currentPage
                ? 'border-primary text-primary font-semibold bg-primary/5'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>

            <button
              class="px-3 py-1.5 text-xs md:text-sm border rounded-full
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

    <!-- Upload Modal -->
    <UploadDataBarcode
      :show="showUploadModal"
      @close="showUploadModal = false"
      @submit="handleUploadSubmit()"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Selected Barcodes"
      :message="`Are you sure you want to delete ${selectedBarcodes.length} selected barcode(s)? This action cannot be undone.`"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <!-- Add Barcode Manually Modal -->
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
import UploadDataBarcode from './UploadDataBarcode.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import AddBarcodeManually from './AddBarcodeManually.vue'
import api from '@/lib/axios'
import { toast } from 'vue3-toastify'

type BarcodeStatus = 'Pending' | 'Redeemed' | 'Expired'

interface Barcode {
  id: number
  id_transaction: string | null
  qrcode: string
  name: string
  instansi: string | null
  provinsi: string | null
  kota: string | null
  jabatan: string | null
  no_hp: string | null
  email: string | null
  ukuran_jaket: string | null
  status_kehadiran: string | null
  tanggal_kehadiran: string | null
  other_data: string | null
  status: BarcodeStatus
  redeemed_at: string | null
  redeemed_by: string | null
}

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

const eventId = computed(() => (route.query.eventId as string) || '1')
const eventCategoryId = computed(() => (route.query.event_category_id as string) || '')

// Pastikan entriesPerPage selalu berupa number
const numericEntriesPerPage = computed(() => {
  const n = Number(entriesPerPage.value)
  return Number.isNaN(n) || n <= 0 ? 10 : n
})

function goBack() {
  const id = eventId.value
  const categoryId = eventCategoryId.value
  if (id) {
    router.push(`/event/detail/${id}?event_category_id=${categoryId}`)
  } else {
    router.push('/event')
  }
}

const filteredBarcodes = computed(() => {
  return barcodes.value.filter(barcode => {
    const query = searchQuery.value.trim().toLowerCase()
    const matchesSearch =
      !query ||
      barcode.qrcode.toLowerCase().includes(query) ||
      barcode.name.toLowerCase().includes(query)
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

// Info "Showing X–Y of Z"
const startItem = computed(() => {
  if (filteredBarcodes.value.length === 0) return 0
  return (currentPage.value - 1) * numericEntriesPerPage.value + 1
})

const endItem = computed(() => {
  if (filteredBarcodes.value.length === 0) return 0
  const end = currentPage.value * numericEntriesPerPage.value
  return end > filteredBarcodes.value.length ? filteredBarcodes.value.length : end
})

// Page numbers (dibatasi supaya tidak jebol kalau total halaman besar)
const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = 5 // jumlah tombol maksimal yang ditampilkan

  const pages: number[] = []

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i += 1) {
      pages.push(i)
    }
    return pages
  }

  const half = Math.floor(maxVisible / 2)
  let start = current - half
  let end = current + half

  if (start < 1) {
    start = 1
    end = maxVisible
  } else if (end > total) {
    end = total
    start = total - maxVisible + 1
  }

  for (let i = start; i <= end; i += 1) {
    pages.push(i)
  }

  return pages
})

const isAllSelected = computed(
  () =>
    selectedBarcodes.value.length === paginatedBarcodes.value.length &&
    paginatedBarcodes.value.length > 0
)

function formatDate(dateString: string | null) {
  if (!dateString) {
    return '-'
  }
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }
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
    const response = await api.get(
      `/events/${eventId.value}/categories/${eventCategoryId.value}/qrcodes`
    )
    console.log('Fetched barcodes:', response.data)
    barcodes.value = response.data as Barcode[]
    // pastikan currentPage valid kalau data berubah
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  } catch (error) {
    console.error('Failed to fetch barcodes:', error)
  }
}

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
    selectedBarcodes.value = paginatedBarcodes.value.map(barcode => barcode.id.toString())
  }
}

async function deleteSelectedBarcodes() {
  if (selectedBarcodes.value.length === 0) {
    toast.warning('No barcodes selected for deletion')
    return
  }

  showDeleteModal.value = true
}

async function confirmDelete() {
  try {
    const ids = selectedBarcodes.value.map(id => parseInt(id, 10))
    const response = (await api({
      method: 'DELETE',
      url: `/events/${eventId.value}/categories/${eventCategoryId.value}/qrcodes`,
      data: { ids }
    })) as unknown as { data: { message: string } }

    toast.success(response.data.message)
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

function addBarcodeManually() {
  showAddBarcodeModal.value = true
}

function viewBarcode(barcode: Barcode) {
  // TODO: ganti alert dengan modal detail kalau sudah ada
  alert(`View details for barcode: ${barcode.qrcode}`)
}

onMounted(async () => {
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
  }
)
</script>
