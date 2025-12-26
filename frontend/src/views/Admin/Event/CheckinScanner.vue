<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Check-in Barcode'" :breadcrumbs="breadcrumbs" />
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
          Barcode Check-in
        </h3>
        <Button variant="primary" size="sm" @click="goToLogs">
          View Check-in Logs
        </Button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT SIDE -->
        <div class="space-y-6">
          <!-- Event & Ticket Selection -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Event & Ticket Selection
            </h4>
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
                    {{ category.name }} ({{ formatEntryLimit(category.entry_amount) }})
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
                  Enter Barcode
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
                variant="success"
                @click="processManualCode"
                :disabled="!manualCode.trim() || isProcessing || !canSubmit"
              >
                {{ isProcessing ? 'Processing...' : 'Process Barcode' }}
              </Button>
            </div>
          </div>

          <!-- Camera Scanner -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">Scan with Camera</h4>
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
              <Button variant="danger" @click="stopScanning" :disabled="!isScanning">
                Stop
              </Button>
            </div>
          </div>

          <!-- Recent Attempts -->
          <div
            class="bg-white dark:bg-gray-900/60 rounded-lg p-6 border border-gray-100 dark:border-gray-800"
          >
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-md font-semibold text-gray-900 dark:text-white">
                Recent Attempts
              </h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">Last 5</span>
            </div>
            <ul class="space-y-3" v-if="recentAttempts.length">
              <li
                v-for="attempt in recentAttempts"
                :key="attempt.timestamp"
                class="flex items-center justify-between text-sm"
              >
                <div>
                  <p class="font-mono text-gray-900 dark:text-white">
                    {{ attempt.code }}
                  </p>
                  <p class="text-xs text-gray-500">{{ attempt.timestamp }}</p>
                </div>
                <span
                  class="text-xs font-semibold px-2 py-1 rounded-full"
                  :class="
                    attempt.status === 'success'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  "
                >
                  {{ attempt.status === 'success' ? 'Success' : 'Failed' }}
                </span>
              </li>
            </ul>
            <p v-else class="text-sm text-gray-500">No attempts yet.</p>
          </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="space-y-6">
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 min-h-[320px]">
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

                <div v-if="scanResult.entryLimit !== undefined" class="flex justify-between text-sm">
                  <span class="text-gray-500">Entry Limit</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ formatEntryLimit(scanResult.entryLimit ?? null) }}
                  </span>
                </div>
                <div v-if="scanResult.entryUsed !== undefined" class="flex justify-between text-sm">
                  <span class="text-gray-500">Entry Used</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ scanResult.entryUsed ?? '-' }}
                  </span>
                </div>

                <div v-if="scanResult.log" class="flex justify-between text-sm">
                  <span class="text-gray-500">Checked-in At</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ formatDateTime(scanResult.log.scanned_at) }}
                  </span>
                </div>
              </div>
            </div>

            <p v-else class="text-sm text-gray-500 dark:text-gray-400">
              Scan or enter a barcode to see details here.
            </p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import BackArrowIcon from '@/icons/BackArrowIcon.vue'
import Button from '@/components/ui/Button.vue'
import api from '@/lib/axios'
import { toast } from 'vue3-toastify'

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
  entryUsed?: number | null
  entryLimit?: number | null
}

interface RecentAttempt {
  code: string
  status: 'success' | 'error'
  timestamp: string
}

interface EventSummary {
  event_id: string
  event_name: string
}

interface CategorySummary {
  id: string
  name: string
  entry_amount: number | null
}

const router = useRouter()
const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'Check-in', active: true },
]

const videoRef = ref<HTMLVideoElement>()
const manualCode = ref('')
const isProcessing = ref(false)
const isScanning = ref(false)

const scanResult = ref<ScanResultState | null>(null)
const recentAttempts = ref<RecentAttempt[]>([])
const events = ref<EventSummary[]>([])
const categories = ref<CategorySummary[]>([])
const selectedEventId = ref('')
const selectedCategoryId = ref('')
const selectedTypeScan = ref<'CheckIn'>('CheckIn')

let codeReader: BrowserMultiFormatReader | null = null

const canSubmit = computed(
  () => Boolean(selectedEventId.value && selectedCategoryId.value && selectedTypeScan.value)
)

const goBack = () => {
  router.back()
}

const goToLogs = () => {
  router.push('/checkin/logs')
}

/* ==========================
 *  SCANNER CAMERA
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
 *  MANUAL ENTRY & HANDLER
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

  await submitCode(code)
}

/* ==========================
 *  RECENT ATTEMPTS
 * ========================*/
const addRecentAttempt = (code: string, status: 'success' | 'error') => {
  recentAttempts.value.unshift({
    code,
    status,
    timestamp: new Date().toLocaleString(),
  })
  if (recentAttempts.value.length > 5) {
    recentAttempts.value = recentAttempts.value.slice(0, 5)
  }
}

/* ==========================
 *  FORMATTER ENTRY LIMIT
 * ========================*/
const formatEntryLimit = (value: number | null | undefined): string => {
  if (value === null || typeof value === 'undefined' || value <= 0) {
    return 'Unlimited'
  }
  return `${value}x`
}

/* ==========================
 *  SUBMIT (LIMIT DI BACKEND)
 * ========================*/
const submitCode = async (code: string) => {
  try {
    isProcessing.value = true

    const payload: any = {
      qrcode: code,
      eventId: selectedEventId.value,
      eventCategoryId: selectedCategoryId.value,
      typeScan: selectedTypeScan.value, // "CheckIn"
      scannedBy: currentUser.value ? String(currentUser.value.username).trim() : 'Unknown',
    }

    // ❌ tidak kirim entryAmount lagi, backend ambil dari EntryAmountStore JSON

    const response = await api.post('/scanner/checkin/scan', payload)

    const data = response.data as {
      message: string
      barcode: BarcodeInfo
      log: ScanLogInfo
      entryUsed?: number
      entryLimit?: number | null
    }

    scanResult.value = {
      status: 'success',
      message: data.message,
      barcode: data.barcode,
      log: data.log,
      entryUsed: typeof data.entryUsed === 'number' ? data.entryUsed : null,
      entryLimit:
        typeof data.entryLimit === 'number' || data.entryLimit === null
          ? data.entryLimit
          : null,
    }

    addRecentAttempt(code, 'success')
    toast.success(data.message)
  } catch (error: any) {
    console.error('Check-in error:', error)
    const message =
      error?.response?.data?.message ||
      (typeof error?.message === 'string' ? error.message : 'Failed to process check-in')

    const errBarcode: BarcodeInfo | null = error?.response?.data?.barcode || null
    const errLog: ScanLogInfo | null = error?.response?.data?.log || null
    const errEntryUsed: number | null =
      typeof error?.response?.data?.entryUsed === 'number'
        ? error.response.data.entryUsed
        : null
    const errEntryLimitRaw = error?.response?.data?.entryLimit
    const errEntryLimit: number | null =
      typeof errEntryLimitRaw === 'number' || errEntryLimitRaw === null
        ? errEntryLimitRaw
        : null

    scanResult.value = {
      status: 'error',
      message,
      barcode: errBarcode,
      log: errLog,
      entryUsed: errEntryUsed,
      entryLimit: errEntryLimit,
    }

    addRecentAttempt(code, 'error')
    toast.error(message)
  } finally {
    isProcessing.value = false
  }
}

/* ==========================
 *  UTIL & FETCH DATA
 * ========================*/
const formatDateTime = (value: string | null) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString()
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
      categories: Array<{ name: string; id: string; entry_amount: number | null }>
    }

    // backend sudah kirim entry_amount dari EntryAmountStore JSON
    categories.value = data.categories.map((c) => ({
      id: c.id,
      name: c.name,
      entry_amount: c.entry_amount ?? null,
    }))
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    toast.error('Failed to load categories')
  }
}

watch(selectedEventId, async (newEventId) => {
  selectedCategoryId.value = ''
  categories.value = []
  if (newEventId) {
    await fetchCategories(newEventId)
  }
})

onMounted(() => {
  codeReader = new BrowserMultiFormatReader()
  fetchEvents()
})

onUnmounted(() => {
  stopScanning()
})
</script>
