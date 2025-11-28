<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Barcode Check-out'" :breadcrumbs="breadcrumbs" />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <button
          @click="goBack"
          class="px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary"
        >
          <BackArrowIcon class="h-5 w-5" />
        </button>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex-1">
          Barcode Check-out
        </h3>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT SIDE -->
        <div class="space-y-6">
          <!-- Event & Ticket Selection -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Event & Ticket Selection
            </h4>

            <div
              v-if="storedUser"
              class="mb-2 text-xs text-gray-500 dark:text-gray-400"
            >
              Only events for: <span class="font-semibold">{{ storedUser.name }}</span>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Event
                </label>
                <select
                  v-model="selectedEventId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Event</option>
                  <option v-for="event in events" :key="event.event_id" :value="event.event_id">
                    {{ event.event_name }}
                  </option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Ticket Category
                </label>
                <select
                  v-model="selectedCategoryId"
                  :disabled="!selectedEventId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                >
                  <option value="">
                    {{ selectedEventId ? 'Select Category' : 'Select event first' }}
                  </option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Manual Entry -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">Manual Entry</h4>
            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
                >
                  Enter Barcode to Check-out
                </label>
                <input
                  v-model="manualCode"
                  type="text"
                  placeholder="Scan or enter barcode"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  @keyup.enter="processManualCode"
                />
              </div>
              <Button
                class="w-full"
                variant="danger"
                @click="processManualCode"
                :disabled="!manualCode.trim() || isProcessing || !canSubmit"
              >
                {{ isProcessing ? 'Processing...' : 'Process Check-out' }}
              </Button>
            </div>
          </div>

          <!-- Camera Scanner -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Check-out with Camera
            </h4>
            <div class="relative mb-4">
              <video
                ref="videoRef"
                class="w-full h-64 bg-black rounded-lg object-cover"
                autoplay
                playsinline
                muted
              ></video>

              <div class="absolute inset-0 pointer-events-none">
                <div class="relative w-full h-full">
                  <div
                    class="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-blue-500 rounded-tl-lg"
                  ></div>
                  <div
                    class="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"
                  ></div>
                  <div
                    class="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-blue-500 rounded-bl-lg"
                  ></div>
                  <div
                    class="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-blue-500 rounded-br-lg"
                  ></div>
                  <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-0.5 bg-blue-500 animate-pulse"
                  ></div>
                </div>
              </div>

              <div
                v-if="isScanning"
                class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
              >
                <div class="text-white text-center">
                  <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"
                  ></div>
                  <p class="text-sm">Initializing camera...</p>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <Button
                class="flex-1"
                variant="primary"
                @click="startScanning"
                :disabled="isScanning || !canSubmit"
              >
                Start Scanning
              </Button>
              <Button variant="outline" @click="stopScanning" :disabled="!isScanning">
                Stop
              </Button>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDE: RESULT + LIST YANG MASIH CHECK-IN -->
        <div class="space-y-6">
          <!-- Result -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 min-h-[220px]">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">Result</h4>

            <div v-if="scanResult" class="space-y-4">
              <div
                class="rounded-lg p-4 border"
                :class="
                  scanResult.status === 'success'
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30'
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30'
                "
              >
                <p
                  class="text-sm font-semibold"
                  :class="
                    scanResult.status === 'success'
                      ? 'text-green-700 dark:text-green-200'
                      : 'text-red-700 dark:text-red-200'
                  "
                >
                  {{ scanResult.message }}
                </p>
              </div>

              <div
                v-if="scanResult.barcode"
                class="bg-white dark:bg-gray-900/60 rounded-lg p-4 space-y-3 border border-gray-100 dark:border-gray-800"
              >
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Barcode</span>
                  <span class="font-mono text-gray-900 dark:text-white">
                    {{ scanResult.barcode.qrcode }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Name</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ scanResult.barcode.name || '-' }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Event</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ scanResult.barcode.eventName || '-' }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Category</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ scanResult.barcode.categoryName || '-' }}
                  </span>
                </div>
                <div v-if="scanResult.log?.checkout_at" class="flex justify-between text-sm">
                  <span class="text-gray-500">Checked-out At</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ formatDateTime(scanResult.log.checkout_at) }}
                  </span>
                </div>
              </div>
            </div>

            <p v-else class="text-sm text-gray-500 dark:text-gray-400">
              Scan or enter a barcode to process check-out.
            </p>
          </div>

          <!-- List yang masih Checked-in -->
          <div
            class="bg-white dark:bg-gray-900/60 rounded-lg p-6 border border-gray-100 dark:border-gray-800"
          >
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-md font-semibold text-gray-900 dark:text-white">
                Currently Checked-in
              </h4>
              <Button size="sm" variant="outline" @click="loadCheckedInList" :disabled="isLoadingList">
                {{ isLoadingList ? 'Refreshing...' : 'Refresh' }}
              </Button>
            </div>

            <div v-if="checkedInTickets.length === 0" class="text-sm text-gray-500">
              No active checked-in tickets for selected event & category.
            </div>

            <div v-else class="max-h-[340px] overflow-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="py-2 text-left text-gray-500">Barcode</th>
                    <th class="py-2 text-left text-gray-500">Name</th>
                    <th class="py-2 text-left text-gray-500">Checked-in At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="ticket in checkedInTickets"
                    :key="ticket.id"
                    class="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td class="py-2 font-mono text-gray-900 dark:text-white">
                      {{ ticket.qrcode }}
                    </td>
                    <td class="py-2 text-gray-900 dark:text-white">
                      {{ ticket.barcode?.name || '-' }}
                    </td>
                    <td class="py-2 text-gray-600 dark:text-gray-300">
                      {{ formatDateTime(ticket.scanned_at) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import BackArrowIcon from '@/icons/BackArrowIcon.vue'
import Button from '@/components/ui/Button.vue'
import api from '@/lib/axios'
import { toast } from 'vue3-toastify'

const router = useRouter()
const route = useRoute()

// ============ ROLE & USER DARI LOCALSTORAGE ============
type Role = 'Admin' | 'User' | 'Redemption' | 'Scan Wristband' | string

interface StoredUser {
  id: number | string
  name: string
  username: string
  email: string
  role: Role
  status: string
}

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

const loggedInUserId = computed(() => storedUser.value?.id ?? null)

// ============ USER ID DARI PARAM ROUTE ============
const userId = computed(() => (route.params.id as string) || '')

// ============ BREADCRUMBS VERSI USER ============
const breadcrumbs = computed(() => {
  if (!userId.value) {
    return [
      { text: 'Home', to: '/' },
      { text: 'Barcode Check-out', active: true },
    ]
  }

  return [
    { text: 'Home', to: `/${userId.value}` },
    { text: 'Barcode Check-out', active: true },
  ]
})

// ============ CURRENT USER UNTUK scannedBy ============
const currentUser = ref<{ username: string } | null>(null)
onMounted(() => {
  const saved = localStorage.getItem('user')
  if (saved) {
    currentUser.value = JSON.parse(saved)
  }
})

interface ScanLogInfo {
  scanned_at: string | null
  scanned_by: string | null
  checkout_at?: string | null
  checkout_by?: string | null
}

interface BarcodeInfo {
  id: number
  qrcode: string
  name: string
  other_data: string | null
  event_id: string | null
  event_category_id: string | null
  eventName?: string | null
  categoryName?: string | null
}

interface ScanResultState {
  status: 'success' | 'error'
  message: string
  barcode: BarcodeInfo | null
  log: ScanLogInfo | null
}

interface EventSummary {
  event_id: string
  event_name: string
  id_user?: number | string
}

interface CategorySummary {
  id: string
  name: string
}

interface CheckedInTicket {
  id: number
  qrcode: string
  scanned_at: string | null
  scanned_by: string | null
  barcode: {
    id: number
    qrcode: string
    name: string
    other_data: string | null
    event_id: string | null
    event_category_id: string | null
  } | null
}

// ========= STATE ==========
const videoRef = ref<HTMLVideoElement>()
const manualCode = ref('')
const isProcessing = ref(false)
const isScanning = ref(false)

const scanResult = ref<ScanResultState | null>(null)
const events = ref<EventSummary[]>([])
const categories = ref<CategorySummary[]>([])
const selectedEventId = ref('')
const selectedCategoryId = ref('')
const selectedTypeScan = ref<'CheckOut'>('CheckOut')

const checkedInTickets = ref<CheckedInTicket[]>([])
const isLoadingList = ref(false)

let codeReader: BrowserMultiFormatReader | null = null

const canSubmit = computed(
  () => Boolean(selectedEventId.value && selectedCategoryId.value && selectedTypeScan.value)
)

// ========= NAVIGASI USER =========
const goBack = () => {
  if (userId.value) {
    router.push(`/${userId.value}`)
  } else {
    router.push('/login')
  }
}

/* ==========================
 *  CAMERA SCANNER
 * ========================*/
const startScanning = async () => {
  if (!videoRef.value || isProcessing.value || !canSubmit.value) return

  try {
    isScanning.value = true
    codeReader = new BrowserMultiFormatReader()
    const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoRef.value)
    if (result) {
      await handleScannedCode(result.getText())
    }
  } catch (error) {
    if (error instanceof NotFoundException) {
      toast.warning('No barcode detected. Please try again.')
    } else {
      console.error('Scanning error:', error)
      toast.error('Failed to access camera.')
    }
  } finally {
    stopScanning()
  }
}

const stopScanning = () => {
  if (codeReader) {
    codeReader.reset()
  }
  if (videoRef.value) {
    const stream = videoRef.value.srcObject as MediaStream
    stream?.getTracks().forEach((track) => track.stop())
  }
  isScanning.value = false
}

/* ==========================
 *  MANUAL ENTRY
 * ========================*/
const processManualCode = async () => {
  if (!manualCode.value.trim() || isProcessing.value || !canSubmit.value) return
  const code = manualCode.value.trim()
  manualCode.value = ''
  await handleScannedCode(code)
}

const handleScannedCode = async (code: string) => {
  if (!code || !canSubmit.value) {
    if (!canSubmit.value) {
      toast.error('Please select event and ticket category first.')
    }
    return
  }

  await submitCheckOut(code)
}

/* ==========================
 *  SUBMIT CHECK-OUT
 * ========================*/
const submitCheckOut = async (code: string) => {
  try {
    isProcessing.value = true

    const response = await api.post('/checkin/scan', {
      qrcode: code,
      eventId: selectedEventId.value,
      eventCategoryId: selectedCategoryId.value,
      typeScan: selectedTypeScan.value, // "CheckOut"
      scannedBy: currentUser.value ? String(currentUser.value.username).trim() : 'Unknown',
    })

    const data = response.data as {
      message: string
      barcode: BarcodeInfo
      log: ScanLogInfo
    }

    scanResult.value = {
      status: 'success',
      message: data.message,
      barcode: data.barcode,
      log: data.log,
    }

    toast.success('Check-out successful!')
    await loadCheckedInList()
  } catch (error: any) {
    console.error('Check-out error:', error)
    const message =
      error?.response?.data?.message ||
      (typeof error?.message === 'string' ? error.message : 'Failed to process check-out')

    scanResult.value = {
      status: 'error',
      message,
      barcode: error?.response?.data?.barcode || null,
      log: error?.response?.data?.log || null,
    }
    toast.error(message)
  } finally {
    isProcessing.value = false
  }
}

/* ==========================
 *  UTIL & FETCH DATA
 * ========================*/
const formatDateTime = (value: string | null | undefined) => {
  if (!value) return '-'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString()
}

const fetchEvents = async () => {
  try {
    if (!loggedInUserId.value) {
      toast.error('User not found, please login again.')
      router.push('/login')
      return
    }

    const response = await api.get('/events')
    const data = response.data as Array<{
      event_id: string
      event_name: string
      id_user?: number | string
    }>

    const currentId = String(loggedInUserId.value)

    // HANYA EVENT MILIK USER LOGIN
    events.value = data.filter((ev) => {
      if (ev.id_user === undefined || ev.id_user === null) return false
      return String(ev.id_user) === currentId
    })
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
    const data = response.data as { categories: Array<{ name: string; id: string }> }
    categories.value = data.categories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    toast.error('Failed to load categories')
  }
}

const loadCheckedInList = async () => {
  if (!selectedEventId.value || !selectedCategoryId.value) {
    checkedInTickets.value = []
    return
  }

  try {
    isLoadingList.value = true
    const response = await api.get('/checkin/checked-in-list', {
      params: {
        eventId: selectedEventId.value,
        eventCategoryId: selectedCategoryId.value,
      },
    })

    const data = response.data as { tickets: CheckedInTicket[] }
    checkedInTickets.value = data.tickets
  } catch (error) {
    console.error('Failed to load checked-in list:', error)
    toast.error('Failed to load checked-in tickets')
  } finally {
    isLoadingList.value = false
  }
}

watch(selectedEventId, async (newEventId) => {
  selectedCategoryId.value = ''
  categories.value = []
  checkedInTickets.value = []
  if (newEventId) {
    await fetchCategories(newEventId)
  }
})

watch(selectedCategoryId, () => {
  loadCheckedInList()
})

onMounted(() => {
  codeReader = new BrowserMultiFormatReader()
  fetchEvents()
})

onUnmounted(() => {
  stopScanning()
})
</script>
