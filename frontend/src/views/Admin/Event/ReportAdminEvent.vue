<template>
  <AdminLayout>
    <PageBreadcrumb
      :pageTitle="currentPageTitle"
      :breadcrumbs="[
        { text: 'Home', to: '/' },
        { text: 'Report', active: true }
      ]"
    />

    <div class="w-full flex justify-center px-3 sm:px-4 lg:px-6">
      <div
        class="w-full max-w-5xl xl:max-w-6xl min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-6
               dark:border-gray-800 dark:bg-white/[0.03] md:px-5 md:py-7 xl:px-8 xl:py-8 animate-page-in"
      >
        <!-- HEADER -->
        <div class="mb-5 lg:mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div
              class="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700
                     dark:bg-indigo-500/10 dark:text-indigo-200"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-300" />
              <span class="uppercase tracking-wide">Event Report & Analytics</span>
            </div>
            <h3 class="mt-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              Report Event
            </h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Lihat ringkasan tiket, check-in, checkout, dan utilisasi per kategori untuk setiap event.
            </p>
          </div>

          <div class="flex flex-col items-start gap-1 text-xs text-gray-500 dark:text-gray-400 sm:items-end">
            <span v-if="selectedEventName" class="font-medium text-gray-700 dark:text-gray-200">
              Event terpilih:
              <span class="text-indigo-600 dark:text-indigo-300">{{ selectedEventName }}</span>
            </span>
            <span v-else>Pilih event untuk menampilkan report.</span>
          </div>
        </div>

        <!-- CARD UTAMA -->
        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
        >
          <!-- Toolbar Export -->
          <div
            v-if="selectedEventId"
            class="mb-4 flex flex-wrap items-center justify-between gap-3"
          >
            <div class="text-[11px] text-gray-500 dark:text-gray-400">
              Export laporan untuk event ini.
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <!-- Export Excel (CSV) -->
              <button
                type="button"
                @click="exportExcel"
                :disabled="isExportingExcel || !selectedEventId"
                class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium
                       border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm
                       hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800
                       disabled:cursor-not-allowed disabled:opacity-60
                       dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:border-emerald-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M8 12l4 4m0 0l4-4m-4 4V4"
                  />
                </svg>
                <span v-if="!isExportingExcel">Export Excel</span>
                <span v-else>Processing...</span>
              </button>

              <!-- Summary PDF (Print to PDF) -->
              <button
                type="button"
                @click="exportSummaryPdf"
                :disabled="isExportingPdf || !selectedEventId"
                class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium
                       border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm
                       hover:border-indigo-300 hover:bg-indigo-100 hover:text-indigo-800
                       disabled:cursor-not-allowed disabled:opacity-60
                       dark:border-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 dark:hover:border-indigo-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.828a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0012.172 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 13h6M9 17h3"
                  />
                </svg>
                <span v-if="!isExportingPdf">Summary PDF</span>
                <span v-else>Processing...</span>
              </button>
            </div>
          </div>

          <!-- Event Selector: Search + Slider Pills -->
          <div class="mb-6 space-y-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Pilih Event
                </p>
                <p class="text-[11px] text-gray-500 dark:text-gray-400">
                  Gunakan search atau slider event di bawah untuk memilih event.
                </p>
              </div>
              <div class="w-full sm:w-60">
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Cari event..."
                    class="w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 pl-8 text-xs text-gray-800
                           focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
                           dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  <span
                    class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-4.35-4.35M11 5a6 6 0 100 12 6 6 0 000-12z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <!-- Event Slider Pills -->
            <div class="rounded-2xl bg-gray-50/80 p-2 dark:bg-gray-900/40">
              <!-- Jika tidak ada event -->
              <div
                v-if="filteredEvents.length === 0"
                class="w-full py-4 text-center text-[11px] text-gray-500 dark:text-gray-400"
              >
                Tidak ada event yang cocok dengan kata kunci.
              </div>

              <div v-else class="flex items-center gap-2">
                <!-- Prev button -->
                <button
                  type="button"
                  @click="goPrevEvents"
                  :disabled="currentEventPage === 0"
                  class="hidden xs:inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border text-xs
                         border-gray-200 bg-white text-gray-500 shadow-sm transition
                         hover:border-indigo-300 hover:text-indigo-600
                         disabled:cursor-not-allowed disabled:opacity-40
                         dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <!-- Pills wrapper -->
                <div class="flex-1 overflow-hidden">
                  <div class="no-scrollbar flex gap-2">
                    <!-- All Events (clear) -->
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition
                             border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600
                             dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
                      :class="{
                        'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-200':
                          !selectedEventId
                      }"
                      @click="clearSelection"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-500" />
                      All Events
                    </button>

                    <!-- Event items (paginated) -->
                    <button
                      v-for="event in paginatedEvents"
                      :key="event.event_id"
                      type="button"
                      class="inline-flex min-w-[120px] max-w-[220px] flex-shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-left text-xs transition
                             border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm hover:text-indigo-700
                             dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
                      :class="{
                        'border-indigo-500 bg-indigo-50 text-indigo-800 shadow-sm dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-100':
                          selectedEventId === event.event_id
                      }"
                      @click="selectEvent(event)"
                    >
                      <div
                        class="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-700
                               dark:bg-indigo-900/60 dark:text-indigo-200"
                      >
                        {{ event.event_name.charAt(0).toUpperCase() }}
                      </div>
                      <div class="flex flex-col overflow-hidden">
                        <span class="truncate text-[11px] font-medium">
                          {{ event.event_name }}
                        </span>
                        <span class="truncate text-[10px] text-gray-500 dark:text-gray-400">
                          Event ID: {{ event.event_id.slice(0, 8) }}…
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Next button -->
                <button
                  type="button"
                  @click="goNextEvents"
                  :disabled="currentEventPage >= totalEventPages - 1"
                  class="hidden xs:inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border text-xs
                         border-gray-200 bg-white text-gray-500 shadow-sm transition
                         hover:border-indigo-300 hover:text-indigo-600
                         disabled:cursor-not-allowed disabled:opacity-40
                         dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <!-- Page indicator -->
              <div
                v-if="filteredEvents.length > 0"
                class="mt-2 flex items-center justify-end gap-1 text-[10px] text-gray-500 dark:text-gray-400"
              >
                <span>Page</span>
                <span class="font-semibold text-indigo-600 dark:text-indigo-300">
                  {{ currentEventPage + 1 }}
                </span>
                <span>/ {{ totalEventPages }}</span>
              </div>
            </div>
          </div>

          <!-- DASHBOARD SUMMARY -->
          <div
            v-if="selectedEventId"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4 2xl:gap-6"
          >
            <!-- Total Tickets Card -->
            <div
              class="rounded-2xl border border-gray-100 bg-gradient-to-br from-indigo-50 via-sky-50 to-white p-4 shadow-sm
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                     dark:border-gray-800 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 animate-card"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/60">
                  <svg
                    class="fill-indigo-600 dark:fill-indigo-400"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 10.5C21 17.5 17.5 21 10.5 21C3.5 21 0 17.5 0 10.5C0 3.5 3.5 0 10.5 0C17.5 0 21 3.5 21 10.5Z"
                    />
                    <path
                      d="M10.5 14.5C12.9853 14.5 15 12.4853 15 10C15 7.51472 12.9853 5.5 10.5 5.5C8.01472 5.5 6 7.51472 6 10C6 12.4853 8.01472 14.5 10.5 14.5Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div class="text-right">
                  <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Total Tickets
                  </p>
                  <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {{ totalTickets.toLocaleString() }}
                  </p>
                  <p class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    All generated tickets for this event
                  </p>
                </div>
              </div>
            </div>

            <!-- Checkin Card -->
            <div
              class="rounded-2xl border border-gray-100 bg-gradient-to-br from-emerald-50 via-white to-white p-4 shadow-sm
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                     dark:border-gray-800 dark:bg-gradient-to-br dark:from-emerald-950 dark:via-slate-900 dark:to-slate-950 animate-card delay-1"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60">
                  <svg
                    class="fill-emerald-600 dark:fill-emerald-400"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 10.5C21 17.5 17.5 21 10.5 21C3.5 21 0 17.5 0 10.5C0 3.5 3.5 0 10.5 0C17.5 0 21 3.5 21 10.5Z" />
                    <path d="M7 10.5L10.5 14L16 8.5" stroke="white" stroke-width="2" fill="none" />
                  </svg>
                </div>
                <div class="text-right">
                  <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Check-in
                  </p>
                  <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {{ totalCheckins.toLocaleString() }}
                  </p>
                  <p class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    Unique tickets checked-in (berdasarkan CheckinLog)
                  </p>
                </div>
              </div>
            </div>

            <!-- Checkout Card -->
            <div
              class="rounded-2xl border border-gray-100 bg-gradient-to-br from-rose-50 via-white to-white p-4 shadow-sm
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                     dark:border-gray-800 dark:bg-gradient-to-br dark:from-rose-950 dark:via-slate-900 dark:to-slate-950 animate-card delay-2"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/60">
                  <svg
                    class="fill-rose-600 dark:fill-rose-400"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 10.5C21 17.5 17.5 21 10.5 21C3.5 21 0 17.5 0 10.5C0 3.5 3.5 0 10.5 0C17.5 0 21 3.5 21 10.5Z" />
                    <path d="M8 8L13 13M13 8L8 13" stroke="white" stroke-width="2" />
                  </svg>
                </div>
                <div class="text-right">
                  <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Checkout
                  </p>
                  <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {{ totalRedeemed.toLocaleString() }}
                  </p>
                  <p class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    Tickets already processed via checkout flow
                  </p>
                </div>
              </div>
            </div>

            <!-- Available Card -->
            <div
              class="rounded-2xl border border-gray-100 bg-gradient-to-br from-amber-50 via-white to-white p-4 shadow-sm
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                     dark:border-gray-800 dark:bg-gradient-to-br dark:from-amber-950 dark:via-slate-900 dark:to-slate-950 animate-card delay-3"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/60">
                  <svg
                    class="fill-amber-600 dark:fill-amber-400"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 10.5C21 17.5 17.5 21 10.5 21C3.5 21 0 17.5 0 10.5C0 3.5 3.5 0 10.5 0C17.5 0 21 3.5 21 10.5Z" />
                    <path
                      d="M10.5 6V11M10.5 13.5V13.51"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <div class="text-right">
                  <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Available
                  </p>
                  <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {{ availableTickets.toLocaleString() }}
                  </p>
                  <p class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    Remaining tickets (not yet checked-in)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- No Event Selected Message -->
          <div
            v-else
            class="py-10 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            <p>Pilih event terlebih dahulu untuk melihat report.</p>
          </div>

          <!-- PER CATEGORY DASHBOARD -->
          <div v-if="selectedEventId && categories.length > 0" class="mt-8">
            <div class="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90">
                  Dashboard per Category
                </h3>
                <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  Detail check-in, checkout, dan utilisasi tiket per kategori.
                </p>
              </div>
              <span
                class="rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-300"
              >
                {{ categories.length }} categories
              </span>
            </div>

            <div
              v-for="stat in categoryStats"
              :key="stat.category.id"
              class="mb-5 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/40"
            >
              <div class="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h4 class="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {{ stat.category.name }}
                  </h4>
                  <p class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    Total: {{ stat.totalTickets }} • Available: {{ stat.available }}
                  </p>
                </div>

                <!-- Utilization badge -->
                <div class="text-right text-[11px]">
                  <p class="text-gray-500 dark:text-gray-400">Utilization</p>
                  <p class="font-semibold text-indigo-600 dark:text-indigo-300">
                    {{ categoryUtilization(stat) }}%
                  </p>
                </div>
              </div>

              <!-- Simple utilization bar -->
              <div class="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500"
                  :style="{ width: categoryUtilization(stat) + '%' }"
                ></div>
              </div>

              <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <!-- Checkin per Category -->
                <div
                  class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm
                         transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                         dark:border-gray-800 dark:bg-gray-900/90 animate-card"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/60">
                      <svg
                        class="fill-emerald-600 dark:fill-emerald-400"
                        width="20"
                        height="20"
                        viewBox="0 0 22 22"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M21 10.5C21 17.5 17.5 21 10.5 21C3.5 21 0 17.5 0 10.5C0 3.5 3.5 0 10.5 0C17.5 0 21 3.5 21 10.5Z" />
                        <path d="M7 10.5L10.5 14L16 8.5" stroke="white" stroke-width="2" fill="none" />
                      </svg>
                    </div>
                    <div class="text-right">
                      <p class="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Total Check-in
                      </p>
                      <p class="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                        {{ (stat.checkin + stat.recheckin).toLocaleString() }}
                      </p>
                      <p class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                        Checkin: {{ stat.checkin }} • Recheckin: {{ stat.recheckin }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Checkout per Category -->
                <div
                  class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm
                         transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                         dark:border-gray-800 dark:bg-gray-900/90 animate-card delay-1"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/60">
                      <svg
                        class="fill-rose-600 dark:fill-rose-400"
                        width="20"
                        height="20"
                        viewBox="0 0 22 22"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M21 10.5C21 17.5 17.5 21 10.5 21C3.5 21 0 17.5 0 10.5C0 3.5 3.5 0 10.5 0C17.5 0 21 3.5 21 10.5Z" />
                        <path d="M8 8L13 13M13 8L8 13" stroke="white" stroke-width="2" />
                      </svg>
                    </div>
                    <div class="text-right">
                      <p class="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Total Checkout
                      </p>
                      <p class="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                        {{ (stat.checkout + stat.recheckout).toLocaleString() }}
                      </p>
                      <p class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                        Checkout: {{ stat.checkout }} • Recheckout: {{ stat.recheckout }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Total Tickets per Category -->
                <div
                  class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm
                         transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                         dark:border-gray-800 dark:bg-gray-900/90 animate-card delay-2"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/60">
                      <svg
                        class="fill-indigo-600 dark:fill-indigo-400"
                        width="20"
                        height="20"
                        viewBox="0 0 22 22"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M21 10.5C21 17.5 17.5 21 10.5 21C3.5 21 0 17.5 0 10.5C0 3.5 3.5 0 10.5 0C17.5 0 21 3.5 21 10.5Z" />
                        <path
                          d="M10.5 14.5C12.9853 14.5 15 12.4853 15 10C15 7.51472 12.9853 5.5 10.5 5.5C8.01472 5.5 6 7.51472 6 10C6 12.4853 8.01472 14.5 10.5 14.5Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div class="text-right">
                      <p class="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Tickets
                      </p>
                      <p class="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                        {{ stat.totalTickets.toLocaleString() }}
                      </p>
                      <p class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                        Available: {{ stat.available.toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Jika tidak ada kategori -->
          <div
            v-if="selectedEventId && categories.length === 0"
            class="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-6 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400"
          >
            Belum ada kategori untuk event ini.
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import api from '@/lib/axios'

interface Event {
  event_id: string
  event_name: string
}

interface TotalResponse {
  totalQrcodes?: number
  totalCheckins?: number
  totalRedeemed?: number
}

interface Category {
  id: string
  name: string
}

interface CategoryStats {
  category: Category
  checkin: number
  recheckin: number
  checkout: number
  recheckout: number
  totalTickets: number
  available: number
}

// Bentuk mentah stats dari backend (fleksibel)
interface RawCategoryStats {
  checkin?: number
  recheckin?: number
  checkout?: number
  recheckout?: number
  totalTickets?: number
  available?: number

  totalCheckin?: number
  totalRecheckin?: number
  totalCheckout?: number
  totalRecheckout?: number

  total_qrcodes?: number
  total?: number
  availableTickets?: number
  used?: number
}

// Payload dari /checkin/logs
interface CheckinLogPayload {
  id: number
  qrcode: string
  scanned_at: string | null
  scanned_by: string | null
  barcode: {
    id: number
    qrcode: string
    name: string | null
    other_data: string | null
    event_id: string
    event_category_id: string
  } | null
  eventName: string | null
  categoryName: string | null
}

const currentPageTitle = ref('Report')
const events = ref<Event[]>([])
const selectedEventId = ref<string | null>(null)
const totalTickets = ref(0)
const totalCheckins = ref(0)
const totalRedeemed = ref(0)
const availableTickets = ref(0)
const searchQuery = ref('')
const categories = ref<Category[]>([])
const categoryStats = ref<CategoryStats[]>([])
const checkinLogs = ref<CheckinLogPayload[]>([]) // sumber truth check-in

// export state (buat disable tombol / ganti teks)
const isExportingExcel = ref(false)
const isExportingPdf = ref(false)

// Slider state
const eventsPerPage = ref(4)
const currentEventPage = ref(0)

const filteredEvents = computed(() => {
  if (!searchQuery.value) {
    return events.value
  }
  return events.value.filter((event) =>
    event.event_name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const totalEventPages = computed(() => {
  const len = filteredEvents.value.length
  if (len === 0) return 1
  return Math.ceil(len / eventsPerPage.value)
})

const paginatedEvents = computed(() => {
  const start = currentEventPage.value * eventsPerPage.value
  return filteredEvents.value.slice(start, start + eventsPerPage.value)
})

const selectedEventName = computed(() => {
  if (!selectedEventId.value) return ''
  const ev = events.value.find((e) => e.event_id === selectedEventId.value)
  return ev?.event_name ?? ''
})

const clearSelection = () => {
  selectedEventId.value = null
  totalTickets.value = 0
  totalCheckins.value = 0
  totalRedeemed.value = 0
  availableTickets.value = 0
  categories.value = []
  categoryStats.value = []
  checkinLogs.value = []
  currentEventPage.value = 0
}

const selectEvent = (event: Event) => {
  selectedEventId.value = event.event_id
  fetchDashboardData()
}

const fetchEvents = async () => {
  try {
    const response = await api.get('/admin/events')
    events.value = response.data as Event[]
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }
}

const fetchDashboardData = async () => {
  if (!selectedEventId.value) return

  try {
    const [ticketsRes, redeemedRes, categoriesRes, logsRes] = await Promise.all([
      api.get(`/admin/events/${selectedEventId.value}/total-qrcodes`),
      api.get(`/admin/events/${selectedEventId.value}/total-redeemed`),
      api.get(`/admin/events/${selectedEventId.value}/categories`),
      api.get('/scanner/checkin/logs', { params: { eventId: selectedEventId.value } }), // follow CheckinsController.logs
    ])

    // Summary dari endpoint existing
    totalTickets.value = (ticketsRes.data as TotalResponse)?.totalQrcodes || 0
    totalRedeemed.value = (redeemedRes.data as TotalResponse)?.totalRedeemed || 0

    // Check-in mengikuti CheckinLog
    const logs = (logsRes.data as { logs: CheckinLogPayload[] }).logs || []
    checkinLogs.value = logs

    // Hitung totalCheckins berdasarkan log (unique qrcode)
    const uniqueQrcodes = new Set(logs.map((l) => l.qrcode))
    totalCheckins.value = uniqueQrcodes.size

    // Available summary = total tickets - total checkin
    availableTickets.value = Math.max(totalTickets.value - totalCheckins.value, 0)

    categories.value = (categoriesRes.data as { categories: Category[] }).categories

    // Fetch stats per category (untuk checkout / totalTickets / available)
    categoryStats.value = await Promise.all(
      categories.value.map(async (category) => {
        const statsRes = await api.get(
          `/admin/events/${selectedEventId.value}/categories/${category.id}/stats`,
        )
        const raw = statsRes.data as RawCategoryStats

        // Checkout & total tickets tetap dari stats backend
        const checkout =
          raw.checkout ?? raw.totalCheckout ?? 0
        const recheckout =
          raw.recheckout ?? raw.totalRecheckout ?? 0

        const totalTicketsVal =
          raw.totalTickets ?? raw.total_qrcodes ?? raw.total ?? 0

        // Check-in per category mengikuti CheckinLog
        const logsForCategory = checkinLogs.value.filter(
          (l) => l.barcode?.event_category_id === category.id,
        )
        const checkinCount = logsForCategory.length
        const recheckinCount = 0 // kalau nanti ada konsep recheckin, bisa disesuaikan

        // available per kategori
        let availableVal: number
        if (raw.available !== undefined || raw.availableTickets !== undefined) {
          availableVal = raw.available ?? raw.availableTickets ?? 0
        } else {
          const used = checkinCount + recheckinCount + checkout + recheckout
          availableVal = Math.max(totalTicketsVal - used, 0)
        }

        return {
          category,
          checkin: checkinCount,
          recheckin: recheckinCount,
          checkout,
          recheckout,
          totalTickets: totalTicketsVal,
          available: availableVal,
        }
      }),
    )
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
}

/**
 * ==== EXPORT HELPER (frontend only) ====
 */

const sanitizeCsv = (value: string | number) => {
  const str = String(value ?? '')
  // bungkus dengan " dan escape " di dalam teks
  return `"${str.replace(/"/g, '""')}"`
}

const downloadBlob = (data: BlobPart, fileName: string, mimeType: string) => {
  if (typeof window === 'undefined') return
  const blob = new Blob([data], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

/**
 * Export Excel (CSV) – berdasarkan data yang sudah ada di dashboard
 */
const exportExcel = () => {
  if (!selectedEventId.value) return
  if (categoryStats.value.length === 0) return

  try {
    isExportingExcel.value = true

    const safeName = (selectedEventName.value || 'event-report')
      .replace(/[^\w\-]+/g, '_')

    const lines: string[] = []

    // Summary dulu
    lines.push('Summary')
    lines.push(`Event,${sanitizeCsv(selectedEventName.value || '')}`)
    lines.push(`Total Tickets,${totalTickets.value}`)
    lines.push(`Total Check-in (unique),${totalCheckins.value}`)
    lines.push(`Total Checkout,${totalRedeemed.value}`)
    lines.push(`Available,${availableTickets.value}`)
    lines.push('') // baris kosong

    // Header detail per kategori
    lines.push([
      'Category',
      'Total Tickets',
      'Available',
      'Check-in',
      'Recheckin',
      'Checkout',
      'Recheckout',
      'Utilization (%)',
    ].map(sanitizeCsv).join(','))

    // Isi detail
    categoryStats.value.forEach((stat) => {
      const utilization = categoryUtilization(stat)
      lines.push([
        stat.category.name,
        stat.totalTickets,
        stat.available,
        stat.checkin,
        stat.recheckin,
        stat.checkout,
        stat.recheckout,
        utilization,
      ].map(sanitizeCsv).join(','))
    })

    const csvContent = lines.join('\r\n')

    downloadBlob(
      csvContent,
      `${safeName}_report.csv`, // Excel bisa buka CSV langsung
      'text/csv;charset=utf-8;',
    )
  } catch (error) {
    console.error('Failed to export CSV:', error)
  } finally {
    isExportingExcel.value = false
  }
}

/**
 * Summary PDF – buka tab baru berisi ringkasan, lalu user bisa Save as PDF
 */
const exportSummaryPdf = () => {
  if (!selectedEventId.value) return
  if (typeof window === 'undefined') return

  try {
    isExportingPdf.value = true

    const safeName = (selectedEventName.value || 'event-report')
      .replace(/[^\w\-]+/g, '_')

    const win = window.open('', '_blank')
    if (!win) {
      console.error('Popup blocked')
      return
    }

    const now = new Date()

    const rowsHtml = categoryStats.value.map((stat) => {
      const util = categoryUtilization(stat)
      return `
        <tr>
          <td>${stat.category.name}</td>
          <td style="text-align:right">${stat.totalTickets.toLocaleString()}</td>
          <td style="text-align:right">${stat.available.toLocaleString()}</td>
          <td style="text-align:right">${stat.checkin.toLocaleString()}</td>
          <td style="text-align:right">${stat.recheckin.toLocaleString()}</td>
          <td style="text-align:right">${stat.checkout.toLocaleString()}</td>
          <td style="text-align:right">${stat.recheckout.toLocaleString()}</td>
          <td style="text-align:right">${util}%</td>
        </tr>
      `
    }).join('')

    const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${safeName} – Summary</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 12px;
            color: #111827;
            padding: 24px;
          }
          h1 {
            font-size: 18px;
            margin-bottom: 4px;
          }
          .subtitle {
            font-size: 11px;
            color: #6B7280;
            margin-bottom: 16px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            margin-bottom: 16px;
          }
          .summary-item {
            padding: 8px 10px;
            border-radius: 8px;
            background: #F3F4F6;
          }
          .summary-label {
            font-size: 10px;
            color: #6B7280;
            text-transform: uppercase;
            letter-spacing: .05em;
          }
          .summary-value {
            font-size: 13px;
            font-weight: 600;
            margin-top: 2px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }
          th, td {
            border: 1px solid #E5E7EB;
            padding: 6px 8px;
          }
          th {
            background: #F3F4F6;
            font-size: 11px;
            text-align: left;
          }
          tfoot td {
            font-weight: 600;
            background: #F9FAFB;
          }
        </style>
      </head>
      <body>
        <h1>Event Summary Report</h1>
        <div class="subtitle">
          Event: <strong>${selectedEventName.value || '-'}</strong><br/>
          Generated at: ${now.toLocaleString()}
        </div>

        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">Total Tickets</div>
            <div class="summary-value">${totalTickets.value.toLocaleString()}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Check-in (unique)</div>
            <div class="summary-value">${totalCheckins.value.toLocaleString()}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Checkout</div>
            <div class="summary-value">${totalRedeemed.value.toLocaleString()}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Available</div>
            <div class="summary-value">${availableTickets.value.toLocaleString()}</div>
          </div>
        </div>

        <h2 style="font-size:14px; margin: 12px 0 4px;">Per Category</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th style="text-align:right">Total Tickets</th>
              <th style="text-align:right">Available</th>
              <th style="text-align:right">Check-in</th>
              <th style="text-align:right">Recheckin</th>
              <th style="text-align:right">Checkout</th>
              <th style="text-align:right">Recheckout</th>
              <th style="text-align:right">Utilization (%)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <script>
          window.onload = function () {
            window.print();
          };
        <\/script>
      </body>
      </html>
    `

    win.document.write(html)
    win.document.close()
  } catch (error) {
    console.error('Failed to export summary PDF:', error)
  } finally {
    isExportingPdf.value = false
  }
}

// Slider helpers
const goPrevEvents = () => {
  if (currentEventPage.value > 0) {
    currentEventPage.value -= 1
  }
}

const goNextEvents = () => {
  if (currentEventPage.value < totalEventPages.value - 1) {
    currentEventPage.value += 1
  }
}

// Responsif: jumlah event per page menyesuaikan lebar layar
const updateEventsPerPage = () => {
  if (typeof window === 'undefined') return
  const w = window.innerWidth
  if (w < 640) {
    eventsPerPage.value = 2
  } else if (w < 1024) {
    eventsPerPage.value = 3
  } else {
    eventsPerPage.value = 4
  }
}

// Reset page kalau filter berubah
watch(filteredEvents, () => {
  if (currentEventPage.value >= totalEventPages.value) {
    currentEventPage.value = 0
  }
})

watch(searchQuery, () => {
  currentEventPage.value = 0
})

onMounted(() => {
  fetchEvents()
  updateEventsPerPage()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateEventsPerPage)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateEventsPerPage)
  }
})

// Utilization per category (0–100)
const categoryUtilization = (stat: CategoryStats): number => {
  if (!stat.totalTickets) return 0
  const used =
    stat.checkin + stat.recheckin + stat.checkout + stat.recheckout
  const pct = Math.round((used / stat.totalTickets) * 100)
  return Math.max(0, Math.min(100, pct))
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

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

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-card {
  animation: cardIn 0.4s ease-out both;
}

.delay-1 {
  animation-delay: 0.05s !important;
}
.delay-2 {
  animation-delay: 0.1s !important;
}
.delay-3 {
  animation-delay: 0.15s !important;
}
</style>
