<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'My Dashboard'" :breadcrumbs="breadcrumbs" />

    <div class="w-full flex justify-center px-3 sm:px-4 lg:px-6">
      <div
        class="w-full max-w-5xl xl:max-w-6xl min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-6
               dark:border-gray-800 dark:bg-white/[0.03] md:px-5 md:py-7 xl:px-8 xl:py-8 animate-page-in"
      >
        <!-- ===== HERO SLIDER (USER) ===== -->
        <div
          v-if="highlightSlides.length"
          class="mb-6 rounded-2xl border border-gray-200 shadow-sm
                 bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50
                 dark:border-gray-800 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-sky-900"
        >
          <!-- Viewport -->
          <div class="overflow-hidden w-full">
            <!-- Track -->
            <div
              class="flex transition-transform duration-500 ease-out"
              :style="{ transform: `translateX(-${currentSlideIndex * 100}%)` }"
            >
              <!-- Slide item -->
              <div
                v-for="(slide, idx) in highlightSlides"
                :key="idx"
                class="w-full shrink-0 flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center"
                :data-slide-active="idx === currentSlideIndex"
              >
                <!-- Left: text -->
                <div class="flex-1 space-y-1.5">
                  <div
                    class="inline-flex items-center gap-2 rounded-full
                           bg-white/80 px-3 py-1 text-[11px] font-medium text-gray-700
                           dark:bg-white/10 dark:text-sky-50"
                  >
                    <span
                      class="inline-flex h-2 w-2 rounded-full"
                      :class="idx === 0 ? 'bg-emerald-400' : idx === 1 ? 'bg-sky-400' : 'bg-amber-400'"
                    ></span>
                    <span class="uppercase tracking-wide">{{ slide.pill }}</span>
                  </div>

                  <h2 class="text-base md:text-lg font-semibold leading-snug text-gray-900 dark:text-white">
                    {{ slide.title }}
                  </h2>

                  <p class="text-[12px] text-gray-600 dark:text-sky-100/80">
                    {{ slide.subtitle }}
                  </p>

                  <div class="mt-2 flex flex-wrap items-center gap-3 text-[13px]">
                    <span class="text-2xl font-semibold md:text-3xl text-gray-900 dark:text-white">
                      {{ slide.value }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-sky-100/80">
                      {{ slide.footer }}
                    </span>
                  </div>
                </div>

                <!-- Right: mini badge / info -->
                <div class="mt-3 w-full md:mt-0 md:w-auto">
                  <div
                    class="w-full rounded-xl bg-white/80 px-4 py-3 text-xs text-gray-800 shadow-sm
                           dark:bg-black/25 dark:text-sky-50 md:min-w-[180px] backdrop-blur-sm"
                  >
                    <p class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-200">
                      {{ slide.badgeTitle }}
                    </p>
                    <p class="text-[12px]">
                      {{ slide.badgeLine1 }}
                    </p>
                    <p class="text-[11px] text-gray-500 dark:text-sky-200/80">
                      {{ slide.badgeLine2 }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dots -->
          <div class="mt-2 mb-3 flex items-center justify-center gap-1.5">
            <button
              v-for="(slide, idx) in highlightSlides"
              :key="idx"
              type="button"
              class="h-1.5 rounded-full transition-all duration-300"
              :class="idx === currentSlideIndex
                ? 'w-4 bg-gray-900 dark:bg-white'
                : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-white/40 dark:hover:bg-white/70'"
              @click="goToSlide(idx)"
            />
          </div>
        </div>

        <!-- HEADER (judul + tombol scanner) -->
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div class="animate-fade-up">
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hi, {{ displayUserName }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Ini ringkasan aktivitas tiket yang kamu scan hari ini.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 animate-fade-up delay-1">
            <router-link
              to="/checkin"
              class="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <span class="text-sm">▢</span>
              <span>Open Scanner</span>
            </router-link>
          </div>
        </div>

        <!-- GRID KONTEN USER (tanpa menu admin) -->
        <div class="grid grid-cols-12 gap-4 md:gap-6">
          <!-- KIRI -->
          <div class="col-span-12 space-y-5 xl:col-span-8">
            <!-- ROW KPI -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
              <!-- My scans today -->
              <div
                class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-1"
              >
                <div class="relative">
                  <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    My Scans Today
                  </p>
                  <p class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ myScansToday.toLocaleString() }}
                  </p>
                  <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {{ todayLabel }}
                  </p>
                </div>
              </div>

              <!-- My total scans -->
              <div
                class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-2"
              >
                <div class="relative">
                  <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    My Total Scans
                  </p>
                  <p class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ myLogs.length.toLocaleString() }}
                  </p>
                  <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    Dari semua event yang kamu handle
                  </p>
                </div>
              </div>

              <!-- Active events (hanya event milik user) -->
              <div
                class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-3"
              >
                <div class="relative">
                  <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    My Active Events
                  </p>
                  <p class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ activeMyEventsCount.toLocaleString() }}
                  </p>
                  <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    Dari total {{ myEvents.length.toLocaleString() }} event yang pernah kamu scan
                  </p>
                </div>
              </div>

              <!-- Last activity -->
              <div
                class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-4"
              >
                <div class="relative">
                  <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Last Activity
                  </p>
                  <p class="mt-1 text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ lastActivityLabel }}
                  </p>
                  <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {{ lastActivityEventLabel }}
                  </p>
                </div>
              </div>
            </div>

            <!-- ROW: My scan activity today -->
            <div
              class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-2"
            >
              <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                    My Scan Activity Today
                  </h2>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Distribusi scan per jam ({{ todayLabel }}) untuk user ini.
                  </p>
                </div>
              </div>

              <div v-if="!myHourlyActivity.length" class="text-xs text-gray-500 dark:text-gray-400">
                Belum ada aktivitas scan hari ini.
              </div>

              <div v-else class="space-y-2 text-xs">
                <div
                  v-for="point in myHourlyActivity"
                  :key="point.label"
                  class="space-y-1 animate-fade-up"
                >
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-[11px] text-gray-500 dark:text-gray-300">
                      {{ point.label }}
                    </span>
                    <span class="text-[11px] font-medium text-gray-700 dark:text-gray-100">
                      {{ point.count }}x
                    </span>
                  </div>
                  <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 animate-bar"
                      :style="{ width: point.width + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ROW: Simple “My top events” -->
            <div
              class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-3"
            >
              <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                    Events Most Scanned by You
                  </h2>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Peringkat event berdasarkan jumlah scan yang kamu lakukan.
                  </p>
                </div>
              </div>

              <div v-if="!myTopEvents.length" class="text-xs text-gray-500 dark:text-gray-400">
                Belum ada data scan milikmu.
              </div>

              <div v-else class="space-y-2 text-xs">
                <div
                  v-for="evt in myTopEvents"
                  :key="evt.label"
                  class="flex items-center justify-between gap-3 rounded-xl bg-gray-50/70 px-3 py-2 dark:bg-gray-900/70 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition animate-fade-up"
                >
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-[12px] font-medium text-gray-900 dark:text-white">
                      {{ evt.label }}
                    </p>
                    <p class="truncate text-[10px] text-gray-500 dark:text-gray-400">
                      {{ evt.count }} scans • {{ evt.percent }}%
                    </p>
                  </div>
                  <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    #{{ evt.rank }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- KANAN: recent my logs + global simple info (tapi tetap hanya event milik user) -->
          <div class="col-span-12 space-y-5 xl:col-span-4">
            <!-- Recent my scans -->
            <div
              class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-2"
            >
              <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                    My Recent Scans
                  </h2>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {{ myLatestLogs.length }} scan terakhir yang kamu lakukan.
                  </p>
                </div>
                <router-link
                  to="/checkin-logs"
                  class="text-xs font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
                >
                  Lihat logs
                </router-link>
              </div>

              <div class="max-h-72 overflow-y-auto">
                <table class="min-w-full text-left text-xs">
                  <thead>
                    <tr
                      class="border-b border-gray-100 text-[11px] text-gray-500 dark:border-gray-800 dark:text-gray-400"
                    >
                      <th class="py-2 pr-3 font-medium">QR Code</th>
                      <th class="px-3 py-2 font-medium">Event</th>
                      <th class="px-3 py-2 text-right font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="log in myLatestLogs"
                      :key="log.id"
                      class="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 dark:border-gray-800 dark:hover:bg-gray-900/70 transition animate-fade-up"
                    >
                      <td class="py-2 pr-3 align-middle">
                        <p class="truncate font-mono text-[11px] font-medium text-gray-900 dark:text-white">
                          {{ log.qrcode }}
                        </p>
                        <p class="truncate text-[10px] text-gray-500 dark:text-gray-400">
                          {{ log.nameLabel }}
                        </p>
                      </td>
                      <td class="px-3 py-2 align-middle text-[10px] text-gray-500 dark:text-gray-400">
                        {{ log.eventLabel }}
                      </td>
                      <td class="px-3 py-2 align-middle text-right text-[10px] text-gray-500 dark:text-gray-400">
                        {{ log.timeLabel }}
                      </td>
                    </tr>

                    <tr v-if="!myLatestLogs.length && !isLoading">
                      <td
                        colspan="3"
                        class="py-4 text-center text-[11px] text-gray-500 dark:text-gray-400"
                      >
                        Belum ada scan.
                      </td>
                    </tr>

                    <tr v-if="isLoading">
                      <td
                        colspan="3"
                        class="py-4 text-center text-[11px] text-gray-500 dark:text-gray-400"
                      >
                        Loading...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Snapshot event milik user -->
            <div
              class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-3"
            >
              <div class="mb-3">
                <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                  My Event Snapshot
                </h2>
                <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  Ringkasan event yang pernah kamu scan (read-only).
                </p>
              </div>

              <ul class="space-y-1.5 text-xs">
                <li class="flex items-center justify-between">
                  <span class="text-gray-500 dark:text-gray-300">Total Events (kamu)</span>
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{ myEvents.length.toLocaleString() }}
                  </span>
                </li>
                <li class="flex items-center justify-between">
                  <span class="text-gray-500 dark:text-gray-300">Active</span>
                  <span class="font-semibold text-emerald-600 dark:text-emerald-400">
                    {{ activeMyEventsCount.toLocaleString() }}
                  </span>
                </li>
                <li class="flex items-center justify-between">
                  <span class="text-gray-500 dark:text-gray-300">Inactive</span>
                  <span class="font-semibold text-gray-700 dark:text-gray-200">
                    {{ (myEvents.length - activeMyEventsCount).toLocaleString() }}
                  </span>
                </li>
              </ul>

              <p class="mt-3 text-[10px] text-gray-400 dark:text-gray-500">
                * Untuk mengubah data event atau user, hubungi admin. Tampilan ini hanya untuk monitoring saja,
                dan hanya menampilkan event yang terkait dengan scan milikmu.
              </p>
            </div>
          </div>
        </div>
      </div> <!-- end inner -->
    </div>   <!-- end outer -->
  </AdminLayout>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/lib/axios'

const router = useRouter()

// ========== TYPES ==========
interface CheckinLog {
  id: number
  qrcode: string
  scanned_at: string | null
  scanned_by: string | null
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
  status?: string | null
}

interface HighlightSlide {
  pill: string
  title: string
  subtitle: string
  value: string
  footer: string
  badgeTitle: string
  badgeLine1: string
  badgeLine2: string
}

interface CurrentUser {
  id?: number | string
  name?: string
  username?: string
  email?: string
}

// ========== BREADCRUMB ==========
const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'My Dashboard', active: true },
]

// ========== STATE ==========
const events = ref<EventSummary[]>([])
const logs = ref<CheckinLog[]>([])
const isLoading = ref(false)

// user sekarang
const currentUser = ref<CurrentUser | null>(null)
const currentUserName = ref<string>('')

const currentSlideIndex = ref(0)
const slideInterval = ref<number | null>(null)

// ========== FETCH ==========
const fetchEvents = async () => {
  try {
    const response = await api.get('/events')
    const data = response.data as Array<{
      event_id: string
      event_name: string
      status?: string
    }>
    events.value = data.map((e) => ({
      event_id: e.event_id,
      event_name: e.event_name,
      status: e.status ?? null,
    }))
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }
}

const fetchLogs = async () => {
  try {
    isLoading.value = true

    // Ambil SEMUA logs, filter milik user di frontend
    const response = await api.get('/checkin/logs')
    let rawLogs: CheckinLog[] = []

    if (Array.isArray(response.data)) {
      rawLogs = response.data as CheckinLog[]
    } else if (response.data && Array.isArray(response.data.logs)) {
      rawLogs = response.data.logs as CheckinLog[]
    }

    logs.value = rawLogs
  } catch (error) {
    console.error('Failed to fetch logs:', error)
  } finally {
    isLoading.value = false
  }
}

// ========== LIFECYCLE ==========
onMounted(async () => {
  // Ambil user dari localStorage (versi object)
  try {
    const rawUser = localStorage.getItem('user')
    if (rawUser) {
      const parsed = JSON.parse(rawUser) as CurrentUser
      currentUser.value = parsed
      currentUserName.value =
        parsed.name ||
        parsed.username ||
        parsed.email ||
        ''
    } else {
      // fallback lama: cuma string username / user_name
      const stored = localStorage.getItem('username') || localStorage.getItem('user_name')
      if (stored) {
        currentUserName.value = stored
      }
    }
  } catch (e) {
    console.error('Failed to parse user from localStorage:', e)
  }

  await Promise.all([fetchEvents(), fetchLogs()])
  startAutoSlide()
})

onBeforeUnmount(() => {
  stopAutoSlide()
})

// ========== COMPUTED BASIC ==========
const displayUserName = computed(() =>
  currentUserName.value || currentUser.value?.name || currentUser.value?.username || 'User',
)

const todayLabel = computed(() =>
  new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
)

// helper: dapatkan set possible scanned_by milik user
const userScannedKeys = computed<Set<string>>(() => {
  const set = new Set<string>()

  if (currentUser.value) {
    const c = currentUser.value as any
    ;['id', 'name', 'username', 'email'].forEach((key) => {
      if (c[key] !== undefined && c[key] !== null && c[key] !== '') {
        set.add(String(c[key]).toLowerCase().trim())
      }
    })
  }

  if (currentUserName.value) {
    set.add(currentUserName.value.toLowerCase().trim())
  }

  return set
})

// Semua logs milik user ini (berdasarkan scanned_by cocok ke salah satu key user)
const myLogs = computed(() => {
  const keys = userScannedKeys.value
  if (!keys.size) return []

  return logs.value.filter((log) => {
    if (!log.scanned_by) return false
    const val = log.scanned_by.toLowerCase().trim()
    return keys.has(val)
  })
})

// util: tanggal lokal "YYYY-MM-DD"
const todayLocalStr = computed(() => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

const myScansToday = computed(() => {
  const todayStr = todayLocalStr.value
  return myLogs.value.filter((log) =>
    log.scanned_at && log.scanned_at.slice(0, 10) === todayStr,
  ).length
})

// Event milik user = event yang pernah muncul di myLogs (berdasarkan nama event)
const myEvents = computed<EventSummary[]>(() => {
  if (!events.value.length || !myLogs.value.length) return []

  const eventNames = new Set(
    myLogs.value
      .map((l) => l.eventName)
      .filter((n): n is string => !!n),
  )

  return events.value.filter((e) => eventNames.has(e.event_name))
})

const activeMyEventsCount = computed(
  () =>
    myEvents.value.filter(
      (e) => (e.status || '').toLowerCase() === 'active',
    ).length,
)

// Last activity
const lastActivity = computed(() => {
  if (!myLogs.value.length) return null
  const sorted = [...myLogs.value].sort((a, b) => {
    const ta = a.scanned_at ? new Date(a.scanned_at).getTime() : 0
    const tb = b.scanned_at ? new Date(b.scanned_at).getTime() : 0
    return tb - ta
  })
  return sorted[0]
})

const lastActivityLabel = computed(() => {
  if (!lastActivity.value || !lastActivity.value.scanned_at) return '-'
  const d = new Date(lastActivity.value.scanned_at)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const lastActivityEventLabel = computed(() => {
  if (!lastActivity.value) return '-'
  const e = lastActivity.value
  if (!e.eventName && !e.categoryName) return 'No event info'
  return `${e.eventName || ''}${e.categoryName ? ' • ' + e.categoryName : ''}`
})

// My recent logs (table)
const myLatestLogs = computed(() => {
  const slice = [...myLogs.value].sort((a, b) => {
    const ta = a.scanned_at ? new Date(a.scanned_at).getTime() : 0
    const tb = b.scanned_at ? new Date(b.scanned_at).getTime() : 0
    return tb - ta
  }).slice(0, 8)

  return slice.map((log) => ({
    id: log.id,
    qrcode: log.qrcode,
    nameLabel: log.barcode?.name || '-',
    eventLabel: log.eventName
      ? `${log.eventName}${log.categoryName ? ' • ' + log.categoryName : ''}`
      : log.categoryName ?? '-',
    timeLabel: log.scanned_at
      ? new Date(log.scanned_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
      : '-',
  }))
})

// My hourly activity today
const myHourlyActivity = computed(() => {
  const map = new Map<number, number>()
  if (!myLogs.value.length) return []

  const todayStr = todayLocalStr.value

  myLogs.value.forEach((log) => {
    if (!log.scanned_at) return
    if (!log.scanned_at.startsWith(todayStr)) return

    const d = new Date(log.scanned_at)
    if (Number.isNaN(d.getTime())) return

    const hour = d.getHours()
    map.set(hour, (map.get(hour) ?? 0) + 1)
  })

  const arr = Array.from(map.entries()).map(([hour, count]) => ({
    hour,
    count,
  }))

  arr.sort((a, b) => a.hour - b.hour)

  const maxCount = arr.reduce((max, p) => (p.count > max ? p.count : max), 0) || 1

  return arr.map((p) => ({
    label: `${String(p.hour).padStart(2, '0')}:00`,
    count: p.count,
    width: Math.max(5, Math.round((p.count / maxCount) * 100)),
  }))
})

// My top events
const myTopEvents = computed(() => {
  if (!myLogs.value.length) return []

  const map = new Map<string, number>()
  myLogs.value.forEach((log) => {
    const key = log.eventName || 'No Event'
    map.set(key, (map.get(key) ?? 0) + 1)
  })

  const total = myLogs.value.length || 1

  let arr = Array.from(map.entries()).map(([label, count]) => ({
    label,
    count,
    percent: Math.round((count / total) * 100),
  }))

  arr.sort((a, b) => b.count - a.count)
  arr = arr.slice(0, 5)

  return arr.map((e, idx) => ({
    ...e,
    rank: idx + 1,
  }))
})

// ========== SLIDER KONTEN ==========
const highlightSlides = computed<HighlightSlide[]>(() => {
  const slides: HighlightSlide[] = []

  // Slide 1 - overview user
  slides.push({
    pill: 'My Overview',
    title: myScansToday.value
      ? `Kamu scan ${myScansToday.value} tiket hari ini`
      : 'Belum ada scan hari ini',
    subtitle: myScansToday.value
      ? 'Lanjut pantau antrian dan pastikan semua tiket tervalidasi.'
      : 'Siap scan tiket pertama untuk hari ini.',
    value: `${myLogs.value.length.toLocaleString()} total scans`,
    footer: `${myScansToday.value.toLocaleString()} today • ${myEvents.value.length.toLocaleString()} events`,
    badgeTitle: 'Account',
    badgeLine1: displayUserName.value,
    badgeLine2: 'Role & hak akses diatur oleh admin',
  })

  // Slide 2 - top event kamu
  if (myTopEvents.value.length) {
    const top = myTopEvents.value[0]
    slides.push({
      pill: 'Most Scanned Event',
      title: top.label,
      subtitle: 'Event yang paling sering kamu scan tiketnya.',
      value: `${top.count.toLocaleString()} scans`,
      footer: `${top.percent}% dari semua scan kamu`,
      badgeTitle: 'Focus Area',
      badgeLine1: 'Pastikan flow masuk aman & lancar',
      badgeLine2: 'Koordinasi dengan tim gate lain bila ramai',
    })
  }

  return slides
})

// ========== SLIDER CONTROL ==========
const goToSlide = (idx: number) => {
  if (!highlightSlides.value.length) return
  currentSlideIndex.value = idx % highlightSlides.value.length
  startAutoSlide()
}

const startAutoSlide = () => {
  stopAutoSlide()
  if (!highlightSlides.value.length) return
  slideInterval.value = window.setInterval(() => {
    if (!highlightSlides.value.length) return
    currentSlideIndex.value =
      (currentSlideIndex.value + 1) % highlightSlides.value.length
  }, 6000)
}

const stopAutoSlide = () => {
  if (slideInterval.value !== null) {
    clearInterval(slideInterval.value)
    slideInterval.value = null
  }
}
</script>

<style scoped>
/* Page enter */
@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-page-in {
  animation: pageIn 0.45s ease-out;
}

/* Cards fade + slide */
@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-card {
  animation: cardIn 0.4s ease-out both;
}

/* Simple fade up */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-up {
  animation: fadeUp 0.35s ease-out both;
}

/* Bar grow animation */
@keyframes barGrow {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
.animate-bar {
  animation: barGrow 0.6s ease-out;
}

/* Slide fade in (opsional) */
@keyframes slideFadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
[data-slide-active="true"] {
  animation: slideFadeIn 0.4s ease-out;
}

/* Delay helpers */
.delay-1 {
  animation-delay: 0.05s !important;
}
.delay-2 {
  animation-delay: 0.1s !important;
}
.delay-3 {
  animation-delay: 0.15s !important;
}
.delay-4 {
  animation-delay: 0.2s !important;
}
</style>
