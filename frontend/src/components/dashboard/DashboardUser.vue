<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
    <!-- CARD USER -->
    <div
      class="relative overflow-hidden rounded-2xl border border-slate-100/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800/70 dark:bg-slate-900/70 md:p-6"
    >
      <!-- Glow background -->
      <div
        class="pointer-events-none absolute inset-x-6 -top-10 h-24 rounded-full bg-gradient-to-br from-emerald-400/15 via-sky-400/10 to-indigo-500/10 blur-2xl"
      ></div>

      <div class="relative flex items-start justify-between gap-3">
        <!-- Icon -->
        <div
          class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-indigo-500/10 text-emerald-600 dark:from-emerald-500/20 dark:via-sky-500/20 dark:to-indigo-500/20 dark:text-emerald-300"
        >
          <svg
            class="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.80443 5.60156C7.59109 5.60156 6.60749 6.58517 6.60749 7.79851C6.60749 9.01185 7.59109 9.99545 8.80443 9.99545C10.0178 9.99545 11.0014 9.01185 11.0014 7.79851C11.0014 6.58517 10.0178 5.60156 8.80443 5.60156ZM5.10749 7.79851C5.10749 5.75674 6.76267 4.10156 8.80443 4.10156C10.8462 4.10156 12.5014 5.75674 12.5014 7.79851C12.5014 9.84027 10.8462 11.4955 8.80443 11.4955C6.76267 11.4955 5.10749 9.84027 5.10749 7.79851ZM4.86252 15.3208C4.08769 16.0881 3.70377 17.0608 3.51705 17.8611C3.48384 18.0034 3.5211 18.1175 3.60712 18.2112C3.70161 18.3141 3.86659 18.3987 4.07591 18.3987H13.4249C13.6343 18.3987 13.7992 18.3141 13.8937 18.2112C13.9797 18.1175 14.017 18.0034 13.9838 17.8611C13.7971 17.0608 13.4132 16.0881 12.6383 15.3208C11.8821 14.572 10.6899 13.955 8.75042 13.955C6.81096 13.955 5.61877 14.572 4.86252 15.3208ZM3.8071 14.2549C4.87163 13.2009 6.45602 12.455 8.75042 12.455C11.0448 12.455 12.6292 13.2009 13.6937 14.2549C14.7397 15.2906 15.2207 16.5607 15.4446 17.5202C15.7658 18.8971 14.6071 19.8987 13.4249 19.8987H4.07591C2.89369 19.8987 1.73504 18.8971 2.05628 17.5202C2.28015 16.5607 2.76117 15.2906 3.8071 14.2549ZM15.3042 11.4955C14.4702 11.4955 13.7006 11.2193 13.0821 10.7533C13.3742 10.3314 13.6054 9.86419 13.7632 9.36432C14.1597 9.75463 14.7039 9.99545 15.3042 9.99545C16.5176 9.99545 17.5012 9.01185 17.5012 7.79851C17.5012 6.58517 16.5176 5.60156 15.3042 5.60156C14.7039 5.60156 14.1597 5.84239 13.7632 6.23271C13.6054 5.73284 13.3741 5.26561 13.082 4.84371C13.7006 4.37777 14.4702 4.10156 15.3042 4.10156C17.346 4.10156 19.0012 5.75674 19.0012 7.79851C19.0012 9.84027 17.346 11.4955 15.3042 11.4955ZM19.9248 19.8987H16.3901C16.7014 19.4736 16.9159 18.969 16.9827 18.3987H19.9248C20.1341 18.3987 20.2991 18.3141 20.3936 18.2112C20.4796 18.1175 20.5169 18.0034 20.4837 17.861C20.2969 17.0607 19.913 16.088 19.1382 15.3208C18.4047 14.5945 17.261 13.9921 15.4231 13.9566C15.2232 13.6945 14.9995 13.437 14.7491 13.1891C14.5144 12.9566 14.262 12.7384 13.9916 12.5362C14.3853 12.4831 14.8044 12.4549 15.2503 12.4549C17.5447 12.4549 19.1291 13.2008 20.1936 14.2549C21.2395 15.2906 21.7206 16.5607 21.9444 17.5202C22.2657 18.8971 21.107 19.8987 19.9248 19.8987Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <!-- Action pill -->
        <router-link
          to="/useraccount"
          @click="closeSubmenu"
          class="inline-flex items-center gap-1 rounded-full bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30 dark:hover:bg-emerald-500/25"
        >
          <span>Manage User</span>
          <span class="text-[10px]">›</span>
        </router-link>
      </div>

      <!-- Content -->
      <div class="relative mt-6 space-y-3">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Total User
            </p>
            <h4 class="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {{ userCount }}
            </h4>
          </div>

          <div class="flex flex-col items-end text-right">
            <span class="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              Active today
            </span>
            <span class="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Overview of all accounts
            </span>
          </div>
        </div>

        <!-- Small animated bar for “live” feel -->
        <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            class="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 animate-pulse"
          ></div>
        </div>
      </div>
    </div>

    <!-- CARD EVENT -->
    <div
      class="relative overflow-hidden rounded-2xl border border-slate-100/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800/70 dark:bg-slate-900/70 md:p-6"
    >
      <!-- Glow background -->
      <div
        class="pointer-events-none absolute inset-x-6 -top-10 h-24 rounded-full bg-gradient-to-br from-indigo-500/15 via-sky-500/10 to-emerald-400/10 blur-2xl"
      ></div>

      <div class="relative flex items-start justify-between gap-3">
        <!-- Icon -->
        <div
          class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-emerald-500/10 text-indigo-600 dark:from-indigo-500/20 dark:via-sky-500/20 dark:to-emerald-500/20 dark:text-indigo-300"
        >
          <svg
            class="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.665 3.75621C11.8762 3.65064 12.1247 3.65064 12.3358 3.75621L18.7807 6.97856L12.3358 10.2009C12.1247 10.3065 11.8762 10.3065 11.665 10.2009L5.22014 6.97856L11.665 3.75621ZM4.29297 8.19203V16.0946C4.29297 16.3787 4.45347 16.6384 4.70757 16.7654L11.25 20.0366V11.6513C11.1631 11.6205 11.0777 11.5843 10.9942 11.5426L4.29297 8.19203ZM12.75 20.037L19.2933 16.7654C19.5474 16.6384 19.7079 16.3787 19.7079 16.0946V8.19202L13.0066 11.5426C12.9229 11.5844 12.8372 11.6208 12.75 11.6516V20.037ZM13.0066 2.41456C12.3732 2.09786 11.6277 2.09786 10.9942 2.41456L4.03676 5.89319C3.27449 6.27432 2.79297 7.05342 2.79297 7.90566V16.0946C2.79297 16.9469 3.27448 17.726 4.03676 18.1071L10.9942 21.5857C11.6277 21.9024 12.3732 21.9024 13.0066 21.5857L19.9641 18.1071C20.7264 17.726 21.2079 16.9469 21.2079 16.0946V7.90566C21.2079 7.05342 20.7264 6.27432 19.9641 5.89319L13.0066 2.41456Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <!-- Action pill -->
        <router-link
          to="/event"
          @click="closeSubmenu"
          class="inline-flex items-center gap-1 rounded-full bg-indigo-50/80 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100 transition-colors hover:bg-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-500/30 dark:hover:bg-indigo-500/25"
        >
          <span>Manage Event</span>
          <span class="text-[10px]">›</span>
        </router-link>
      </div>

      <!-- Content -->
      <div class="relative mt-6 space-y-3">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Total Event
            </p>
            <h4 class="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {{ eventCount }}
            </h4>
          </div>

          <div class="flex flex-col items-end text-right">
            <span class="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
              Live & Upcoming
            </span>
            <span class="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              All events in your org
            </span>
          </div>
        </div>

        <!-- Small animated bar -->
        <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            class="h-full w-3/4 rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 animate-pulse"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '@/lib/axios'
import { useSidebar } from '@/composables/useSidebar'

const { openSubmenu } = useSidebar()

const userCount = ref('Loading...')
const eventCount = ref('Loading...')

const fetchUserCount = async () => {
  try {
    const response = await axios.get('/users/count')
    userCount.value = (response.data as { count: number }).count.toLocaleString()
  } catch (error) {
    console.error('Failed to fetch user count:', error)
    userCount.value = 'Error'
  }
}

const fetchEventCount = async () => {
  try {
    const response = await axios.get('/events/count')
    eventCount.value = (response.data as { count: number }).count.toLocaleString()
  } catch (error) {
    console.error('Failed to fetch event count:', error)
    eventCount.value = 'Error'
  }
}

const closeSubmenu = () => {
  openSubmenu.value = null
}

onMounted(() => {
  fetchUserCount()
  fetchEventCount()
})
</script>
