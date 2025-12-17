<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Redeem Ticket'" :breadcrumbs="[
      { text: 'Home', to: '/' },
      { text: 'Event', to: '/event' },
      { text: 'Event Detail', to: `/event/detail/${route.query.eventId || '1'}` },
      { text: 'Redeem Ticket', active: true }
    ]" />

    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="flex items-center gap-4 mb-4">
        <button @click="goBack" class="px-4 py-2 flex items-center gap-2">
          <BackArrowIcon class="text-gray-900 dark:text-white" />
        </button>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Redeem Ticket</h3>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
      >
        <!-- Main Content -->
        <div class="grid grid-cols-1 gap-8">
          <!-- Scanner Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Manual Input -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter Barcode/QR Code
                  </label>
                  <input
                    v-model="manualCode"
                    type="text"
                    placeholder="Enter code manually"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    @keyup.enter="processManualCode"
                  />
                </div>
                <button
                  @click="processManualCode"
                  :disabled="!manualCode.trim() || isProcessing"
                  class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Process Code
                </button>
              </div>
            </div>

            <!-- Camera Scanner -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                Barcode Scanner
              </h4>

              <!-- Camera Preview -->
              <div class="relative mb-4">
                <video
                  ref="videoRef"
                  class="w-full h-64 bg-black rounded-lg object-cover"
                  autoplay
                  playsinline
                  muted
                ></video>

                <!-- Scanner Overlay -->
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
                      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-0.5 bg-blue-500 animate-pulse"
                    ></div>
                  </div>
                </div>

                <!-- Loading overlay -->
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

              <!-- Control Buttons -->
              <div class="flex gap-3">
                <button
                  @click="startScanning"
                  :disabled="isScanning"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  {{ isScanning ? 'Scanning...' : 'Start Scan' }}
                </button>

                <button
                  @click="stopScanning"
                  :disabled="!isScanning"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  Stop
                </button>
              </div>
            </div>
          </div>

          <!-- Ticket Information Section -->
          <div class="space-y-6">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                Ticket Information
              </h4>

              <!-- Scanned Code Display -->
              <div v-if="scannedCode" class="mb-6">
                <div class="bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Scanned Code:
                    </span>
                    <span
                      class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                    >
                      {{ scanMethod }}
                    </span>
                  </div>
                  <p
                    class="text-lg font-mono font-bold text-gray-900 dark:text-white break-all"
                  >
                    {{ scannedCode }}
                  </p>

                  <div v-if="ticketData" class="mt-4 space-y-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="mt-4 space-y-1 text-left">
                        <p><span class="font-semibold">QR Code:</span> {{ ticketData.qrcode || '—' }}</p>
                        <p><span class="font-semibold">Nama:</span> {{ ticketData.holderName || '—' }}</p>
                        <p><span class="font-semibold">Other Data:</span> {{ ticketData.otherData || '—' }}</p>
                        <p><span class="font-semibold">Event:</span> {{ ticketData.eventName || '—' }}</p>
                        <p><span class="font-semibold">Category:</span> {{ ticketData.category || '—' }}</p>
                  
                        
                        <p v-if="ticketEntryAmount !== null">
                          <span class="font-semibold">Entry Limit:</span>
                          {{ ticketEntryAmount }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ticket Details Table -->
              <div v-if="ticketData" class="space-y-4">
                <div class="bg-white dark:bg-gray-700 rounded-lg p-4">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-3">Ticket Details</h5>
                  <table class="min-w-full border border-separate border-spacing-y-2">
                    <thead>
                      <tr class="border-b">
                        <th class="px-5 py-3 text-left text-gray-900 dark:text-white">No</th>
                        <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Barcode</th>
                        <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Name</th>
                        <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Other Data</th>
                        <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Redeem Date</th>
                        <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Status</th>
                        <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- Primary Ticket -->
                      <tr class="border-t bg-gray-50 dark:bg-gray-800/50">
                        <td class="px-5 py-6 text-gray-900 dark:text-white">1</td>
                        <td class="px-5 py-6 text-gray-900 dark:text-white">
                          {{ ticketData.qrcode }}
                        </td>
                        <td class="px-5 py-6 text-gray-900 dark:text-white">
                          {{ ticketData.holderName }}
                        </td>
                        <td class="px-5 py-6 text-gray-900 dark:text-white">
                          {{ ticketData.otherData || '—' }}
                        </td>
                        <td class="px-5 py-6 text-gray-900 dark:text-white">
                          {{ formatDate(ticketData.redeemedAt) }}
                        </td>
                        <td class="px-5 py-6">
                          <span
                            class="px-3 py-1 text-xs font-semibold rounded-full"
                            :class="statusBadgeClasses(ticketData.status)"
                          >
                            {{ ticketData.status }}
                          </span>
                        </td>
                        <td class="px-5 py-6">
                          <button
                            v-if="canRedeem"
                            @click="redeemTicket"
                            :disabled="isRedeeming"
                            :class="buttonClass(ticketData.status)"
                          >
                            {{
                              isRedeeming
                                ? 'Processing...'
                                : redeemButtonLabel(ticketData)
                            }}
                          </button>
                          <span v-else class="text-gray-400 dark:text-gray-500">—</span>
                        </td>
                      </tr>

                      <!-- Related Tickets -->
                      <tr
                        v-for="(relatedTicket, index) in relatedTickets"
                        :key="relatedTicket.id"
                        class="border-t bg-gray-50 dark:bg-gray-800/50"
                      >
                        <td class="px-5 py-6 text-gray-900 dark:text-white">
                          {{ index + 2 }}
                        </td>
                        <td class="px-5 py-6 text-gray-900 dark:text-white">
                          {{ relatedTicket.qrcode }}
                        </td>
                        <td class="px-5 py-6 text-gray-900 dark:text-white">
                          {{ relatedTicket.holderName }}
                        </td>
                        <td class="px-5 py-6 text-gray-900 dark:text-white">
                          {{ relatedTicket.otherData || '—' }}
                        </td>
                        <td class="px-5 py-6 text-gray-900 dark:text-white">
                          {{ formatDate(relatedTicket.redeemedAt) }}
                        </td>
                        <td class="px-5 py-6">
                          <span
                            class="px-3 py-1 text-xs font-semibold rounded-full"
                            :class="statusBadgeClasses(relatedTicket.status)"
                          >
                            {{ relatedTicket.status }}
                          </span>
                        </td>
                        <td class="px-5 py-6">
                          <button
                            v-if="canRedeemTicket(relatedTicket)"
                            @click="redeemTicketById(relatedTicket.id)"
                            :disabled="isRedeeming"
                            :class="buttonClass(relatedTicket.status)"
                          >
                            {{
                              isRedeeming
                                ? 'Processing...'
                                : redeemButtonLabel(relatedTicket)
                            }}
                          </button>
                          <span v-else class="text-gray-400 dark:text-gray-500">—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- No Data State -->
              <div v-else class="text-center py-8">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <p class="text-gray-500 dark:text-gray-400">No ticket scanned yet</p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Scan a barcode or enter code manually
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import BackArrowIcon from '@/icons/BackArrowIcon.vue'
import { toast } from 'vue3-toastify'
import api from '@/lib/axios'

const currentUser = ref<{ username: string } | null>(null)

onMounted(() => {
  const saved = localStorage.getItem('user')
  if (saved) {
    currentUser.value = JSON.parse(saved)
  }
})

type BarcodeStatus = 'Pending' | 'Redeemed' | 'Expired'
type TicketStatus = BarcodeStatus | 'Invalid' | 'Re Redeemed'
type RecentScanStatus = TicketStatus | 'Processing...'

interface TicketData {
  id: number
  qrcode: string
  holderName: string
  eventName: string
  category: string
  groupName: string | null
  status: TicketStatus
  statusMessage: string
  otherData: string | null
  redeemedAt: string | null
  id_transaction: string | null
  eventCategoryId: string | null

  nip?: string | null
  ukuran_jaket?: string | null
  instansi?: string | null
  kota?: string | null
  email?: string | null
  no_hp?: string | null
  provinsi?: string | null
  jabatan?: string | null
  status_kehadiran?: string | null
  tanggal_kehadiran?: string | null
}

interface RecentScan {
  code: string
  timestamp: string
  status: RecentScanStatus
}

interface BarcodeResponse {
  id: number
  qrcode: string
  name: string
  other_data: string | null
  status: BarcodeStatus
  statusMessage?: string
  redeemed_at: string | null
  redeemed_by: string | null
  event_category_id: string
  eventName: string | null
  categoryName: string | null
  groupName: string | null
  id_transaction: string | null

  ukuran_jaket?: string | null
  instansi?: string | null
  kota?: string | null
  email?: string | null
  no_hp?: string | null
  provinsi?: string | null
  jabatan?: string | null
  status_kehadiran?: string | null
  tanggal_kehadiran?: string | null
}

// Response kategori: GET /events/:eventId/categories
interface CategoryEntry {
  id: string
  name: string
  entry_amount: number
}

const videoRef = ref<HTMLVideoElement>()
const isScanning = ref(false)
const isProcessing = ref(false)
const isRedeeming = ref(false)
const scannedCode = ref('')
const scanMethod = ref('')
const manualCode = ref('')
const ticketData = ref<TicketData | null>(null)
const relatedTickets = ref<TicketData[]>([])
const recentScans = ref<RecentScan[]>([])

const router = useRouter()
const route = useRoute()
const eventId = computed(() => (route.query.eventId as string) || '')

// Map entry_amount dari backend: { eventCategoryId: entry_amount }
const categoryEntryMap = ref<Record<string, number>>({})
const loadingEntryAmount = ref(false)

// ========== Navigasi ==========
const goBack = () => {
  if (eventId.value) {
    router.push({ name: 'DetailEvent', params: { id: eventId.value } })
  } else {
    router.push({ name: 'AdminEvent' })
  }
}

// ========== Ambil entry_amount dari backend ==========
const fetchEntryAmounts = async () => {
  if (!eventId.value) return
  loadingEntryAmount.value = true
  try {
    const { data } = await api.get<{ categories: CategoryEntry[] }>(
      `/events/${eventId.value}/categories`
    )

    const categories = data.categories || []
    const map: Record<string, number> = {}

    categories.forEach((cat) => {
      const n = Number(cat.entry_amount)
      if (!Number.isNaN(n) && n > 0) {
        map[String(cat.id)] = n
      }
    })

    categoryEntryMap.value = map
  } catch (error) {
    console.error('Failed to fetch entry amounts:', error)
  } finally {
    loadingEntryAmount.value = false
  }
}

// ========== Scanner kamera ==========
let codeReader: BrowserMultiFormatReader | null = null

const initReader = () => {
  codeReader = new BrowserMultiFormatReader()
}

const startScanning = async () => {
  if (!videoRef.value) return

  try {
    isScanning.value = true
    initReader()

    const result = await codeReader!.decodeOnceFromVideoDevice(undefined, videoRef.value)

    if (result) {
      scannedCode.value = result.getText()
      scanMethod.value = 'Camera Scan'
      await processScannedCode(scannedCode.value)
    }
  } catch (error) {
    if (error instanceof NotFoundException) {
      toast.warning('No barcode detected. Please try again.')
    } else {
      console.error('Scanning error:', error)
      toast.error('Failed to access camera. Please check permissions.')
    }
  } finally {
    stopScanning()
  }
}

const stopScanning = () => {
  if (codeReader && videoRef.value) {
    codeReader.reset()
    const stream = videoRef.value.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
  }
  isScanning.value = false
}

// ========== Proses kode ==========
const processScannedCode = async (code: string) => {
  if (!code.trim()) return

  recentScans.value.unshift({
    code,
    timestamp: new Date().toLocaleTimeString(),
    status: 'Processing...',
  })

  if (recentScans.value.length > 5) {
    recentScans.value = recentScans.value.slice(0, 5)
  }

  await validateTicket(code)
}

const processManualCode = async () => {
  if (!manualCode.value.trim()) return

  scannedCode.value = manualCode.value.trim()
  scanMethod.value = 'Manual Entry'
  await processScannedCode(scannedCode.value)
  manualCode.value = ''
}

const updateRecentScanStatus = (code: string, status: RecentScanStatus) => {
  const recentScan = recentScans.value.find((scan) => scan.code === code)
  if (recentScan) {
    recentScan.status = status
  }
}

// ========== Formatter & status UI ==========
const getStatusMessage = (status: TicketStatus) => {
  switch (status) {
    case 'Pending':
      return 'Ticket is valid and ready for redemption'
    case 'Redeemed':
      return 'Ticket has already been redeemed'
    case 'Re Redeemed':
      return 'Ticket is ready for re redemption'
    case 'Expired':
      return 'Ticket has expired'
    case 'Invalid':
    default:
      return 'Invalid ticket code'
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return date.toLocaleString()
}

const statusBadgeClasses = (status: string) => {
  const normalized = status.replace(/\s+/g, '').toLowerCase()
  switch (normalized) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'redeemed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'reredeeemed':

      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'expired':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// ========== Mapping response backend ==========
const mapBarcodeResponse = (barcode: BarcodeResponse): TicketData => {
  const status = barcode.status as BarcodeStatus
  return {
    id: barcode.id,
    qrcode: barcode.qrcode,
    holderName: barcode.name || 'Unknown',
    eventName: barcode.eventName || 'Unknown Event',
    category: barcode.categoryName || 'Unknown Category',
    groupName: barcode.groupName || null,
    status,
    statusMessage: barcode.statusMessage || getStatusMessage(status),
    otherData: barcode.other_data,
    redeemedAt: barcode.redeemed_at,
    id_transaction: barcode.id_transaction || null,
    eventCategoryId: barcode.event_category_id || null,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nip: (barcode as any).nip || null,
    ukuran_jaket: barcode.ukuran_jaket || null,
    instansi: barcode.instansi || null,
    kota: barcode.kota || null,
    email: barcode.email || null,
    no_hp: barcode.no_hp || null,
    provinsi: barcode.provinsi || null,
    jabatan: barcode.jabatan || null,
    status_kehadiran: barcode.status_kehadiran || null,
    tanggal_kehadiran: barcode.tanggal_kehadiran || null,
  }
}

const mapBarcodesResponse = (barcodes: BarcodeResponse[]): TicketData[] => {
  return barcodes.map(mapBarcodeResponse)
}

// ========== Entry Amount (BACKEND) & Redeem Counter (localStorage) ==========

// entry_amount dari backend berdasarkan eventCategoryId
const getEntryAmountForTicket = (ticket: TicketData | null): number | null => {
  if (!ticket || !ticket.eventCategoryId) return null
  const n = categoryEntryMap.value[ticket.eventCategoryId] ?? 0
  if (!n || n <= 0) return null
  return n
}

// key untuk counter per barcode
const getRedeemCountKey = (ticket: TicketData): string => {
  const ev = eventId.value || 'noEvent'
  const cat = ticket.eventCategoryId || 'noCat'
  return `redeemCount:${ev}:${cat}:${ticket.qrcode}`
}

const getRedeemCount = (ticket: TicketData): number => {
  const key = getRedeemCountKey(ticket)
  const saved = localStorage.getItem(key)
  if (!saved) return 0
  const n = Number(saved)
  return Number.isNaN(n) || n < 0 ? 0 : n
}

const setRedeemCount = (ticket: TicketData, count: number) => {
  const key = getRedeemCountKey(ticket)
  localStorage.setItem(key, String(count))
}

// Tambahkan info limit + adjust status untuk multi entry
const attachLimitMessage = (
  ticket: TicketData,
  usedOverride?: number | null
): TicketData => {
  const entryAmount = getEntryAmountForTicket(ticket)
  if (!entryAmount) return ticket

  const used = usedOverride ?? getRedeemCount(ticket)

  let newStatus = ticket.status

  // Kalau sudah habis, paksa status jadi Redeemed final
  if (used >= entryAmount) {
    newStatus = 'Redeemed'
  } else {
    // Masih ada jatah: kalau backend kasih 'Redeemed', kita ganti ke Re Redeemed
    if (ticket.status === 'Redeemed') {
      newStatus = 'Re Redeemed'
    }
  }

  return {
    ...ticket,
    status: newStatus,
    statusMessage: `You have used ${used}/${entryAmount} entries.`,
  }
}

// buat ditampilkan di info
const ticketEntryAmount = computed(() => getEntryAmountForTicket(ticketData.value))

// ========== VALIDATE TICKET ==========
const validateTicket = async (code: string) => {
  if (!eventId.value) {
    toast.error('Event information not found. Please reopen this page from an event detail.')
    updateRecentScanStatus(code, 'Invalid')
    return
  }

  isProcessing.value = true
  try {
    const response = await api.post(`/events/${eventId.value}/qrcodes/validate`, { qrcode: code })
    const data = response.data as { barcodes: BarcodeResponse[] }
    const mappedBarcodes = mapBarcodesResponse(data.barcodes)

    const primaryIndex = mappedBarcodes.findIndex((b) => b.qrcode === code)
    if (primaryIndex === -1) {
      throw new Error('Scanned barcode not found in response')
    }

    ticketData.value = attachLimitMessage(mappedBarcodes[primaryIndex])

    relatedTickets.value = mappedBarcodes
      .filter((_, index) => index !== primaryIndex)
      .map((t) => attachLimitMessage(t))

    updateRecentScanStatus(code, ticketData.value.status)

    if (ticketData.value.status === 'Pending' || ticketData.value.status === 'Re Redeemed') {
      toast.success(ticketData.value.statusMessage || 'Ticket validated successfully!')
    } else if (ticketData.value.status === 'Redeemed') {
      toast.info(ticketData.value.statusMessage || 'Ticket has already been redeemed.')
    } else if (ticketData.value.status === 'Expired') {
      toast.error('Ticket has expired.')
    } else if (ticketData.value.status === 'Invalid') {
      toast.error(ticketData.value.statusMessage || 'Invalid ticket code.')
    }
  } catch (error) {
    console.error('Validation error:', error)
    const err = error as { response?: { data?: { message?: string } } }
    const message = err.response?.data?.message || 'Invalid ticket code'
    ticketData.value = {
      id: 0,
      qrcode: code,
      holderName: 'Unknown',
      eventName: 'Unknown Event',
      category: 'Unknown',
      groupName: null,
      status: 'Invalid',
      statusMessage: message,
      otherData: null,
      redeemedAt: null,
      id_transaction: null,
      eventCategoryId: null,
    }
    relatedTickets.value = []
    updateRecentScanStatus(code, 'Invalid')
    toast.error(message)
  } finally {
    isProcessing.value = false
  }
}

// ========== REDEEM TICKET (UTAMA) ==========
const redeemTicket = async () => {
  if (!ticketData.value) return

  if (!eventId.value) {
    toast.error('Event information not found. Please reopen this page from an event detail.')
    return
  }

  const entryAmount = getEntryAmountForTicket(ticketData.value)
  const used = getRedeemCount(ticketData.value)

  if (entryAmount !== null && used >= entryAmount) {
    toast.error(`Entry limit reached (${entryAmount}x).`)
    ticketData.value = attachLimitMessage(ticketData.value, used)
    return
  }

  isRedeeming.value = true

  try {
    const response = await api.post(`/events/${eventId.value}/qrcodes/redeem`, {
      qrcode: ticketData.value.qrcode,
      redeemedBy: currentUser.value ? String(currentUser.value.username).trim() : 'Unknown',
    })
    const data = response.data as { barcode: BarcodeResponse; message?: string }
    const mapped = mapBarcodeResponse(data.barcode)

    const newCount = used + 1
    setRedeemCount(mapped, newCount)
    ticketData.value = attachLimitMessage(mapped, newCount)

    updateRecentScanStatus(ticketData.value.qrcode, ticketData.value.status)
    toast.success(data.message || 'Ticket redeemed successfully!')
  } catch (error) {
    console.error('Redeem error:', error)
    const err = error as { response?: { data?: { message?: string; barcode?: BarcodeResponse } } }
    const message = err.response?.data?.message || 'Failed to redeem ticket'
    toast.error(message)

    if (err.response?.data?.barcode) {
      const barcode = err.response.data.barcode
      const mapped = mapBarcodeResponse(barcode)
      const usedNow = getRedeemCount(mapped)
      ticketData.value = attachLimitMessage(mapped, usedNow)
      updateRecentScanStatus(barcode.qrcode, ticketData.value.status)
    }
  } finally {
    isRedeeming.value = false
  }
}

// ========== REDEEM TICKET TERKAIT ==========
const redeemTicketById = async (ticketId: number) => {
  if (!eventId.value) {
    toast.error('Event information not found. Please reopen this page from an event detail.')
    return
  }

  const target = relatedTickets.value.find((t) => t.id === ticketId)
  if (!target) return

  const entryAmount = getEntryAmountForTicket(target)
  const used = getRedeemCount(target)

  if (entryAmount !== null && used >= entryAmount) {
    toast.error(`Entry limit reached (${entryAmount}x).`)
    const idx = relatedTickets.value.findIndex((t) => t.id === ticketId)
    if (idx !== -1) {
      relatedTickets.value[idx] = attachLimitMessage(target, used)
    }
    return
  }

  isRedeeming.value = true
  try {
    if (used === 0) {
      const response = await api.post(`/events/${eventId.value}/qrcodes/redeem`, {
        qrcode: target.qrcode,
        redeemedBy: currentUser.value ? String(currentUser.value.username).trim() : 'Unknown',
      })
      const data = response.data as { barcode: BarcodeResponse; message?: string }
      const mapped = mapBarcodeResponse(data.barcode)

      const newCount = used + 1
      setRedeemCount(mapped, newCount)
      const normalized = attachLimitMessage(mapped, newCount)

      const index = relatedTickets.value.findIndex((t) => t.id === ticketId)
      if (index !== -1) {
        relatedTickets.value[index] = normalized
      }
      toast.success(data.message || 'Ticket redeemed successfully!')
    } else {
      const nowIso = new Date().toISOString()
      const baseTicket: TicketData = {
        ...target,
        redeemedAt: nowIso,
        status: 'Re Redeemed',
      }

      const newCount = used + 1
      setRedeemCount(baseTicket, newCount)
      const normalized = attachLimitMessage(baseTicket, newCount)

      const index = relatedTickets.value.findIndex((t) => t.id === ticketId)
      if (index !== -1) {
        relatedTickets.value[index] = normalized
      }

      toast.success(
        entryAmount ? `Entry used ${newCount}/${entryAmount}` : `Entry used ${newCount} times`
      )
    }

    updateRecentScanStatus(target.qrcode, 'Redeemed')
  } catch (error) {
    console.error('Redeem error:', error)
    const err = error as { response?: { data?: { message?: string } } }
    const message = err.response?.data?.message || 'Failed to redeem ticket'
    toast.error(message)
  } finally {
    isRedeeming.value = false
  }
}

// ========== LOGIKA TOMBOL ==========
const canRedeemTicket = (ticket: TicketData): boolean => {
  const entryAmount = getEntryAmountForTicket(ticket)
  const used = getRedeemCount(ticket)

  if (ticket.status === 'Invalid' || ticket.status === 'Expired') {
    return false
  }

  if (entryAmount) {
    if (used >= entryAmount) return false
    return true
  }

  // kalau tidak ada entry_amount dari backend
  return (
    ticket.status === 'Pending' ||
    ticket.status === 'Re Redeemed' ||
    ticket.status === 'Redeemed'
  )
}

const canRedeem = computed(() => {
  if (!ticketData.value) return false
  return canRedeemTicket(ticketData.value)
})

const redeemButtonLabel = (ticket: TicketData | null): string => {
  if (!ticket) return 'Redeem'
  const used = getRedeemCount(ticket)
  if (used > 0) return 'Re Redeemed'
  if (ticket.status === 'Redeemed' || ticket.status === 'Re Redeemed') return 'Re Redeemed'
  return 'Redeem'
}

// Button class
const buttonClass = (status: string): string => {
  const baseClasses =
    'text-white px-3 py-1 text-sm font-medium rounded transition-colors disabled:bg-gray-400'
  if (status === 'Re Redeemed' || status === 'Redeemed') {
    return `bg-blue-600 hover:bg-blue-700 ${baseClasses}`
  } else {
    return `bg-green-600 hover:bg-green-700 ${baseClasses}`
  }
}

onUnmounted(() => {
  stopScanning()
  if (codeReader) {
    codeReader.reset()
  }
})

onMounted(() => {
  initReader()
  if (eventId.value) {
    fetchEntryAmounts()
  }
})
</script>

<style scoped>
.scanner-overlay {
  position: relative;
}

.scanner-corner {
  position: absolute;
  width: 20px;
  height: 20px;
}

.scanner-corner.top-left {
  top: 10px;
  left: 10px;
  border-left: 3px solid #3b82f6;
  border-top: 3px solid #3b82f6;
}

.scanner-corner.top-right {
  top: 10px;
  right: 10px;
  border-right: 3px solid #3b82f6;
  border-top: 3px solid #3b82f6;
}

.scanner-corner.bottom-left {
  bottom: 10px;
  left: 10px;
  border-left: 3px solid #3b82f6;
  border-bottom: 3px solid #3b82f6;
}

.scanner-corner.bottom-right {
  bottom: 10px;
  right: 10px;
  border-right: 3px solid #3b82f6;
  border-bottom: 3px solid #3b82f6;
}
</style>
