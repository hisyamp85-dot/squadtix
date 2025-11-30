<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Dashboard'" :breadcrumbs="breadcrumbs" />

    <div class="w-full flex justify-center px-3 sm:px-4 lg:px-6">
      <div
        class="w-full max-w-5xl xl:max-w-6xl min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-6
               dark:border-gray-800 dark:bg-white/[0.03] md:px-5 md:py-7 xl:px-8 xl:py-8 animate-page-in"
      >

        <!-- ===== HERO SLIDER DASHBOARD (RAPIH, 1 SLIDE PENUH) ===== -->
        <div
          v-if="highlightSlides.length"
          class="mb-6 rounded-2xl border border-gray-200 shadow-sm
                 bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50
                 dark:border-gray-800 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-sky-900"
        >
          <!-- Viewport khusus slider: di sini yang overflow-hidden -->
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

        <!-- HEADER (judul + filter + tombol) -->
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div class="animate-fade-up">
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Monitoring event, kategori tiket, user, dan aktivitas check-in / checkout secara real-time.
            </p>
          </div>

          <!-- FILTER EVENT + CATEGORY + REFRESH -->
          <div class="flex flex-wrap items-center gap-3 animate-fade-up delay-1">
            <div
              class="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-xs text-gray-600 ring-1 ring-gray-200 dark:bg-gray-900/60 dark:text-gray-300 dark:ring-gray-700"
            >
              <span class="hidden text-[11px] text-gray-500 dark:text-gray-400 sm:inline">
                Event
              </span>
              <select
                v-model="selectedEventId"
                class="bg-transparent text-xs font-medium text-gray-800 outline-none dark:text-gray-100"
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

            <div
              class="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-xs text-gray-600 ring-1 ring-gray-200 dark:bg-gray-900/60 dark:text-gray-300 dark:ring-gray-700"
            >
              <span class="hidden text-[11px] text-gray-500 dark:text-gray-400 sm:inline">
                Category
              </span>
              <select
                v-model="selectedCategoryId"
                :disabled="!selectedEventId"
                class="bg-transparent text-xs font-medium text-gray-800 outline-none disabled:opacity-40 dark:text-gray-100"
              >
                <option value="">
                  {{ selectedEventId ? 'All Categories' : 'Select Event first' }}
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

            <Button
              size="sm"
              variant="outline"
              class="rounded-full"
              :disabled="isLoading"
              @click="refreshAll"
            >
              Refresh
            </Button>

            <router-link
              to="/checkin"
              class="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <span class="text-sm">▢</span>
              <span>Open Scanner</span>
            </router-link>
          </div>
        </div>

        <!-- GRID BESAR -->
        <div class="grid grid-cols-12 gap-4 md:gap-6">
          <!-- KOLUMEN KIRI: KPI, Ticket Utilization, Activity, Top Events/Categories -->
          <div class="col-span-12 space-y-5 xl:col-span-8">
            <!-- ROW KPI -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
              <!-- Total Events -->
              <div
                class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-1"
              >
                <div
                  class="pointer-events-none absolute inset-x-4 -top-10 h-20 rounded-full bg-gradient-to-br from-indigo-500/25 via-sky-400/20 to-emerald-400/20 blur-2xl animate-gradient-float"
                ></div>
                <div class="relative">
                  <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Total Events
                  </p>
                  <p class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ events.length.toLocaleString() }}
                  </p>
                  <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {{ activeEventsCount }} Active • {{ inactiveEventsCount }} Inactive
                  </p>
                </div>
              </div>

              <!-- Total Checkin / Checkout Logs -->
              <div
                class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-2"
              >
                <div
                  class="pointer-events-none absolute inset-x-4 -top-10 h-20 rounded-full bg-gradient-to-br from-emerald-500/25 via-sky-400/20 to-indigo-400/20 blur-2xl animate-gradient-float"
                ></div>
                <div class="relative">
                  <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Check-in / Checkout Logs
                  </p>
                  <p class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ logs.length.toLocaleString() }}
                  </p>
                  <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {{ todayLogsCount.toLocaleString() }} log hari ini •
                    {{ totalCheckout.toLocaleString() }} checkout total
                  </p>
                </div>
              </div>

              <!-- Total Users -->
              <div
                class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-3"
              >
                <div
                  class="pointer-events-none absolute inset-x-4 -top-10 h-20 rounded-full bg-gradient-to-br from-amber-500/25 via-rose-400/20 to-indigo-400/20 blur-2xl animate-gradient-float"
                ></div>
                <div class="relative">
                  <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Users
                  </p>
                  <p class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ userCountDisplay }}
                  </p>
                  <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {{ activeUsersCount }} Active • {{ totalRoles }} Roles
                  </p>
                </div>
              </div>

              <!-- Unique Scanners -->
              <div
                class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-4"
              >
                <div
                  class="pointer-events-none absolute inset-x-4 -top-10 h-20 rounded-full bg-gradient-to-br from-emerald-500/25 via-sky-400/20 to-purple-400/20 blur-2xl animate-gradient-float"
                ></div>
                <div class="relative">
                  <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Unique Scanners
                  </p>
                  <p class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ uniqueScannersCount.toLocaleString() }}
                  </p>
                  <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    Operator / device yang pernah scan
                  </p>
                </div>
              </div>
            </div>

            <!-- ROW 2: Ticket Utilization + Scan Today -->
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <!-- Ticket Utilization -->
              <div
                class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-2"
              >
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                      Ticket Utilization
                    </h2>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Distribusi scan berdasarkan
                      <span class="font-semibold">
                        {{ utilizationMode === 'event' ? 'Event' : 'Category' }}
                      </span>
                      dari data check-in / checkout.
                    </p>
                  </div>
                  <span
                    v-if="isLoading"
                    class="text-[11px] text-gray-400 dark:text-gray-500"
                  >
                    Loading...
                  </span>
                </div>

                <div v-if="!logs.length" class="text-xs text-gray-500 dark:text-gray-400">
                  Belum ada data scan untuk filter ini.
                </div>

                <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <!-- Ring total scans -->
                  <div class="flex items-center justify-center">
                    <div class="relative h-24 w-24 animate-pop">
                      <svg viewBox="0 0 36 36" class="h-full w-full -rotate-90">
                        <path
                          class="text-gray-200 dark:text-gray-800"
                          stroke="currentColor"
                          stroke-width="3.5"
                          fill="none"
                          d="M18 2.0845
                             a 15.9155 15.9155 0 0 1 0 31.831
                             a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          class="text-sky-500 animate-ring"
                          stroke="currentColor"
                          stroke-width="3.5"
                          stroke-linecap="round"
                          fill="none"
                          :stroke-dasharray="'100, 100'"
                          d="M18 2.0845
                             a 15.9155 15.9155 0 0 1 0 31.831
                             a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <p class="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                          Total Scans
                        </p>
                        <p class="text-base font-semibold text-gray-900 dark:text-white">
                          {{ totalScans.toLocaleString() }}
                        </p>
                        <p class="text-[10px] text-gray-400 dark:text-gray-500">
                          {{ utilizationMode === 'event' ? 'All Events' : 'Per Category' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Top groups (bars) -->
                  <div class="md:col-span-2 space-y-3 text-xs">
                    <div class="flex items-center justify-between">
                      <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                        {{ utilizationMode === 'event' ? 'Top Events' : 'Top Categories' }}
                      </p>
                      <p class="text-[11px] text-gray-400 dark:text-gray-500">
                        Showing {{ utilizationGroups.length }} of {{ totalGroupsCount }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <div
                        v-for="group in utilizationGroups"
                        :key="group.label"
                        class="space-y-1 animate-fade-up"
                      >
                        <div class="flex items-center justify-between gap-3">
                          <div class="flex-1 truncate text-[11px] text-gray-600 dark:text-gray-200">
                            {{ group.label }}
                          </div>
                          <div class="flex items-center gap-2 text-[11px]">
                            <span class="text-gray-500 dark:text-gray-400">
                              {{ group.count.toLocaleString() }}x
                            </span>
                            <span class="font-medium text-sky-600 dark:text-sky-400">
                              {{ group.percent }}%
                            </span>
                          </div>
                        </div>
                        <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                          <div
                            class="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 animate-bar"
                            :style="{ width: group.percent + '%' }"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <p
                      v-if="othersPercent > 0"
                      class="text-[10px] text-gray-400 dark:text-gray-500"
                    >
                      * {{ othersPercent }}% sisanya digabung sebagai "Others".
                    </p>
                  </div>
                </div>
              </div>

              <!-- Scan Activity Hari Ini -->
              <div
                class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-3"
              >
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                      Scan Activity Today
                    </h2>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Distribusi scan per jam ({{ todayLabel }}).
                    </p>
                  </div>
                </div>

                <div v-if="!hourlyActivity.length" class="text-xs text-gray-500 dark:text-gray-400">
                  Belum ada aktivitas scan hari ini untuk filter ini.
                </div>

                <div v-else class="space-y-2 text-xs">
                  <div
                    v-for="point in hourlyActivity"
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
            </div>

            <!-- ROW 3: Top Events & Categories -->
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <!-- Top Events by Scan -->
              <div
                class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-4"
              >
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                      Top Events by Scan
                    </h2>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Ranking event berdasarkan jumlah scan (filter yang aktif).
                    </p>
                  </div>
                  <router-link
                    to="/event"
                    class="text-xs font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
                  >
                    Manage Event
                  </router-link>
                </div>

                <div v-if="!topEvents.length" class="text-xs text-gray-500 dark:text-gray-400">
                  Belum ada data scan event.
                </div>

                <div v-else class="space-y-2 text-xs">
                  <div
                    v-for="evt in topEvents"
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
                    <span class="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                      #{{ evt.rank }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Top Categories (per event / global) -->
              <div
                class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-5"
              >
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                      Top Categories
                    </h2>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Ranking kategori berdasarkan scan pada filter aktif.
                    </p>
                  </div>
                </div>

                <div v-if="!topCategories.length" class="text-xs text-gray-500 dark:text-gray-400">
                  Belum ada data kategori dari scan.
                </div>

                <div v-else class="space-y-2 text-xs">
                  <div
                    v-for="cat in topCategories"
                    :key="cat.label"
                    class="flex items-center justify-between gap-3 rounded-xl bg-gray-50/70 px-3 py-2 dark:bg-gray-900/70 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition animate-fade-up"
                  >
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-[12px] font-medium text-gray-900 dark:text-white">
                        {{ cat.label }}
                      </p>
                      <p class="truncate text-[10px] text-gray-500 dark:text-gray-400">
                        {{ cat.count }} scans • {{ cat.percent }}%
                      </p>
                    </div>
                    <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      #{{ cat.rank }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- KOLUMEN KANAN: Live Snapshot, Logs, Top Scanners, User Roles -->
          <div class="col-span-12 space-y-5 xl:col-span-4">
            <!-- Live Snapshot -->
            <div
              class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-2"
            >
              <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                    Live Check-in / Checkout Snapshot
                  </h2>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Diambil dari log terakhir di <code>/checkin/logs</code>.
                  </p>
                </div>
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                >
                  <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                  Live
                </span>
              </div>

              <div v-if="latestLog" class="rounded-xl bg-gray-50/80 p-3 dark:bg-gray-900/70 animate-fade-up">
                <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Log Terbaru (Check-in / Checkout)
                </p>
                <p class="mt-1 text-[13px] font-semibold text-gray-900 dark:text-white">
                  {{ latestLog.qrcode }}
                </p>
                <p class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                  {{ latestLog.nameLabel }}
                </p>
                <p class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                  {{ latestLog.eventLabel }}
                </p>
                <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                  {{ latestLog.timeLabel }} • scanned by {{ latestLog.scanned_by || '-' }}
                </p>
              </div>
              <p v-else class="text-xs text-gray-500 dark:text-gray-400">
                Belum ada data check-in / checkout untuk filter ini.
              </p>
            </div>

            <!-- Latest Logs -->
            <div
              class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-3"
            >
              <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                    Check-in / Checkout Log Terbaru
                  </h2>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {{ latestLogs.length }} aktivitas check-in / checkout terakhir dari <code>/checkin/logs</code>.
                  </p>
                </div>
                <router-link
                  to="/checkin/logs"
                  class="text-xs font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
                >
                  Lihat semua
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
                      <th class="px-3 py-2 font-medium">By</th>
                      <th class="px-3 py-2 text-right font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="log in latestLogs"
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
                      <td class="px-3 py-2 align-middle text-[10px] text-gray-500 dark:text-gray-400">
                        {{ log.scanned_by || '-' }}
                      </td>
                      <td class="px-3 py-2 align-middle text-right text-[10px] text-gray-500 dark:text-gray-400">
                        {{ log.timeLabel }}
                      </td>
                    </tr>

                    <tr v-if="!latestLogs.length && !isLoading">
                      <td
                        colspan="4"
                        class="py-4 text-center text-[11px] text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada log check-in / checkout untuk filter ini.
                      </td>
                    </tr>

                    <tr v-if="isLoading">
                      <td
                        colspan="4"
                        class="py-4 text-center text-[11px] text-gray-500 dark:text-gray-400"
                      >
                        Loading logs...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Top Scanners & User Role Distribution -->
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <!-- Top Scanners -->
              <div
                class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-4"
              >
                <div class="mb-3 flex items-center justify-between gap-3">
                  <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                    Top Scanners
                  </h2>
                </div>

                <div v-if="!topScanners.length" class="text-xs text-gray-500 dark:text-gray-400">
                  Belum ada data scanner (scanned_by).
                </div>

                <div v-else class="space-y-2 text-xs">
                  <div
                    v-for="scanner in topScanners"
                    :key="scanner.label"
                    class="flex items-center justify-between gap-3 rounded-xl bg-gray-50/70 px-3 py-2 dark:bg-gray-900/70 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition animate-fade-up"
                  >
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-[12px] font-medium text-gray-900 dark:text-white">
                        {{ scanner.label }}
                      </p>
                      <p class="truncate text-[10px] text-gray-500 dark:text-gray-400">
                        {{ scanner.count }} scans • {{ scanner.percent }}%
                      </p>
                    </div>
                    <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      #{{ scanner.rank }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- User Roles -->
              <div
                class="overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800/70 dark:bg-gray-900/80 animate-card delay-5"
              >
                <div class="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                      User Roles
                    </h2>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Distribusi role di <code>/users</code>.
                    </p>
                  </div>
                  <router-link
                    to="/user"
                    class="text-xs font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
                  >
                    Manage User
                  </router-link>
                </div>

                <div v-if="!roleSummary.length" class="text-xs text-gray-500 dark:text-gray-400">
                  Belum ada data user.
                </div>

                <div v-else class="space-y-1.5 text-xs">
                  <div
                    v-for="role in roleSummary"
                    :key="role.name"
                    class="flex items-center gap-2 animate-fade-up"
                  >
                    <div class="w-24 truncate text-[11px] text-gray-600 dark:text-gray-200">
                      {{ role.name }}
                    </div>
                    <div class="flex-1">
                      <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        <div
                          class="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 animate-bar"
                          :style="{ width: role.percent + '%' }"
                        ></div>
                      </div>
                    </div>
                    <div class="w-16 text-right text-[11px] text-gray-500 dark:text-gray-300">
                      {{ role.count }} ({{ role.percent }}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> <!-- END RIGHT COLUMN -->
        </div> <!-- END GRID -->
      </div> <!-- end inner max-w container -->
    </div>   <!-- end outer flex center -->
  </AdminLayout>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Button from '@/components/ui/Button.vue'
import api from '@/lib/axios'

// ================= TYPES =================
interface CheckinLog {
  id: number
  qrcode: string
  scanned_at: string | null
  scanned_by: string | null
  status?: string | null
  type?: string | null
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

interface CategorySummary {
  id: string
  name: string
}

interface UserItem {
  id: number
  name: string
  role: string | null
  status: string | null
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

// ================= BREADCRUMB =================
const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'Dashboard', active: true },
]

// ================= STATE =================
const events = ref<EventSummary[]>([])
const categories = ref<CategorySummary[]>([])
const logs = ref<CheckinLog[]>([])
const users = ref<UserItem[]>([])
const userCount = ref<number | null>(null)

const selectedEventId = ref<string>('')
const selectedCategoryId = ref<string>('')

const isLoading = ref(false)

// Slider state
const currentSlideIndex = ref(0)
const slideInterval = ref<number | null>(null)

// ================== HELPERS: NORMALISASI RESPONSE ==================
function normalizeArray<T = any>(raw: any, preferKey?: string): T[] {
  // Kalau sudah array, langsung balikin
  if (Array.isArray(raw)) return raw as T[]

  if (raw && typeof raw === 'object') {
    // Kalau diminta preferKey dulu (mis. "events", "logs", dll)
    if (preferKey && Array.isArray((raw as any)[preferKey])) {
      return (raw as any)[preferKey] as T[]
    }

    // Pola umum lain
    if (Array.isArray((raw as any).data)) return (raw as any).data as T[]
    if (Array.isArray((raw as any).items)) return (raw as any).items as T[]
    if (Array.isArray((raw as any).result)) return (raw as any).result as T[]
  }

  console.warn('normalizeArray: unexpected shape, return []', raw)
  return []
}

function normalizeCount(raw: any): number {
  if (typeof raw === 'number') return raw
  if (!raw || typeof raw !== 'object') return 0
  return Number((raw as any).count ?? (raw as any).total ?? 0) || 0
}

// ================= FETCHERS =================
const fetchEvents = async () => {
  try {
    const response = await api.get('/events')
    const list = normalizeArray<{
      event_id: string
      event_name: string
      status?: string
    }>(response.data, 'events')

    events.value = list.map((e) => ({
      event_id: e.event_id,
      event_name: e.event_name,
      status: e.status ?? null,
    }))
  } catch (error) {
    console.error('Failed to fetch events:', error)
    events.value = []
  }
}

const fetchCategories = async (eventId: string) => {
  try {
    if (!eventId) {
      categories.value = []
      return
    }
    const response = await api.get(`/events/${eventId}/categories`)
    // Bisa jadi: { categories: [...] } atau langsung [...]
    const raw = response.data
    let list: CategorySummary[] = []

    if (Array.isArray(raw)) {
      list = raw as CategorySummary[]
    } else if (raw && Array.isArray((raw as any).categories)) {
      list = (raw as any).categories as CategorySummary[]
    } else if (raw && Array.isArray((raw as any).data)) {
      list = (raw as any).data as CategorySummary[]
    } else {
      console.warn('Unexpected category response shape:', raw)
      list = []
    }

    categories.value = list
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = []
  }
}

const fetchLogs = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/checkin/logs', {
      params: {
        eventId: selectedEventId.value || undefined,
        eventCategoryId: selectedCategoryId.value || undefined,
      },
    })

    const raw = response.data
    // Bisa { logs: [...] } atau [...] atau { data: [...] }
    let list: CheckinLog[] = []

    if (Array.isArray(raw)) {
      list = raw as CheckinLog[]
    } else if (raw && Array.isArray((raw as any).logs)) {
      list = (raw as any).logs as CheckinLog[]
    } else if (raw && Array.isArray((raw as any).data)) {
      list = (raw as any).data as CheckinLog[]
    } else {
      console.warn('Unexpected logs response shape:', raw)
      list = []
    }

    logs.value = list
  } catch (error) {
    console.error('Failed to fetch logs:', error)
    logs.value = []
  } finally {
    isLoading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const response = await api.get('/users')
    const list = normalizeArray<any>(response.data, 'users')
    users.value = list.map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role ?? null,
      status: u.status ?? null,
    }))
  } catch (error) {
    console.error('Failed to fetch users:', error)
    users.value = []
  }
}

const fetchUserCount = async () => {
  try {
    const response = await api.get('/users/count')
    userCount.value = normalizeCount(response.data)
  } catch (error) {
    console.error('Failed to fetch user count:', error)
    userCount.value = 0
  }
}

const refreshAll = async () => {
  await Promise.all([fetchEvents(), fetchLogs(), fetchUsers(), fetchUserCount()])
}

// ================= LIFECYCLE =================
onMounted(async () => {
  await Promise.all([fetchEvents(), fetchLogs(), fetchUsers(), fetchUserCount()])
  startAutoSlide()
})

onBeforeUnmount(() => {
  stopAutoSlide()
})

// ================= WATCHERS =================
watch(selectedEventId, async (newEventId) => {
  selectedCategoryId.value = ''
  categories.value = []
  if (newEventId) {
    await fetchCategories(newEventId)
  }
  await fetchLogs()
})

watch(selectedCategoryId, async () => {
  await fetchLogs()
})

// ================= BASIC COMPUTEDS =================
const selectedEventLabel = computed(() => {
  if (!selectedEventId.value) return ''
  const found = events.value.find((e) => e.event_id === selectedEventId.value)
  return found ? found.event_name : ''
})

const selectedCategoryLabel = computed(() => {
  if (!selectedCategoryId.value) return ''
  const found = categories.value.find((c) => c.id === selectedCategoryId.value)
  return found ? found.name : ''
})

const todayLabel = computed(() =>
  new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
)

const latestLogs = computed(() => {
  const slice = logs.value.slice(0, 8)
  return slice.map((log) => ({
    id: log.id,
    qrcode: log.qrcode,
    scanned_by: log.scanned_by,
    timeLabel: log.scanned_at
      ? new Date(log.scanned_at).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-',
    nameLabel: log.barcode?.name || '-',
    eventLabel: log.eventName
      ? `${log.eventName}${log.categoryName ? ' • ' + log.categoryName : ''}`
      : log.categoryName ?? '-',
  }))
})

const latestLog = computed(() =>
  latestLogs.value.length ? latestLogs.value[0] : null,
)

const todayLogsCount = computed(() => {
  if (!logs.value.length) return 0
  const todayStr = new Date().toISOString().slice(0, 10)
  return logs.value.filter((log) => log.scanned_at?.slice(0, 10) === todayStr)
    .length
})

const activeEventsCount = computed(
  () =>
    events.value.filter(
      (e) => (e.status || '').toLowerCase() === 'active',
    ).length,
)
const inactiveEventsCount = computed(
  () => events.value.length - activeEventsCount.value,
)

const userCountDisplay = computed(() =>
  userCount.value !== null ? userCount.value.toLocaleString() : '—',
)

const activeUsersCount = computed(
  () =>
    users.value.filter(
      (u) => (u.status || '').toLowerCase() === 'active',
    ).length,
)

const totalRoles = computed(() => {
  const set = new Set<string>()
  users.value.forEach((u) => {
    const role = (u.role || '').trim()
    if (role) set.add(role)
  })
  return set.size
})

const uniqueScannersCount = computed(() => {
  const set = new Set<string>()
  logs.value.forEach((l) => {
    if (l.scanned_by && l.scanned_by.trim()) {
      set.add(l.scanned_by.trim())
    }
  })
  return set.size
})

const totalCheckout = computed(() => {
  if (!logs.value.length) return 0
  return logs.value.filter((log) => {
    const raw = ((log.status || log.type || '') as string).toLowerCase()
    return raw.includes('checkout') || raw.includes('checked-out') || raw.includes('redeem')
  }).length
})

// ================= TICKET UTILIZATION =================
const utilizationMode = computed<'event' | 'category'>(() =>
  selectedEventId.value ? 'category' : 'event',
)

const totalScans = computed(() => logs.value.length)

const rawGroups = computed(() => {
  const map = new Map<string, number>()

  logs.value.forEach((log) => {
    let key = ''
    if (utilizationMode.value === 'event') {
      key = log.eventName || 'No Event'
    } else {
      key = log.categoryName || 'No Category'
    }
    map.set(key, (map.get(key) ?? 0) + 1)
  })

  const arr = Array.from(map.entries()).map(([label, count]) => ({
    label,
    count,
  }))

  arr.sort((a, b) => b.count - a.count)
  return arr
})

const totalGroupsCount = computed(() => rawGroups.value.length)

const utilizationGroups = computed(() => {
  const groups = rawGroups.value
  if (!groups.length || !totalScans.value) return []

  const top = groups.slice(0, 5)
  const others = groups.slice(5)

  const total = totalScans.value
  let usedPercentSum = 0

  const mapped = top.map((g) => {
    const percent = Math.round((g.count / total) * 100)
    usedPercentSum += percent
    return {
      label: g.label,
      count: g.count,
      percent,
    }
  })

  if (others.length) {
    const othersCount = others.reduce((sum, g) => sum + g.count, 0)
    let othersPercent = Math.round((othersCount / total) * 100)
    if (usedPercentSum + othersPercent > 100) {
      othersPercent = 100 - usedPercentSum
    }
    mapped.push({
      label: 'Others',
      count: othersCount,
      percent: othersPercent,
    })
  }

  return mapped
})

const othersPercent = computed(() => {
  const others = utilizationGroups.value.find((g) => g.label === 'Others')
  return others ? others.percent : 0
})

// ================= HOURLY ACTIVITY TODAY =================
const hourlyActivity = computed(() => {
  const map = new Map<number, number>()
  if (!logs.value.length) return []

  const todayStr = new Date().toISOString().slice(0, 10)

  logs.value.forEach((log) => {
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

// ================= TOP EVENTS & CATEGORIES =================
const topEvents = computed(() => {
  if (!logs.value.length || !totalScans.value) return []

  const map = new Map<string, number>()
  logs.value.forEach((log) => {
    const key = log.eventName || 'No Event'
    map.set(key, (map.get(key) ?? 0) + 1)
  })

  let arr = Array.from(map.entries()).map(([label, count]) => ({
    label,
    count,
    percent: 0,
  }))

  arr.forEach((e) => {
    e.percent = Math.round((e.count / totalScans.value) * 100)
  })

  arr.sort((a, b) => b.count - a.count)
  arr = arr.slice(0, 5)

  return arr.map((e, idx) => ({
    ...e,
    rank: idx + 1,
  }))
})

const topCategories = computed(() => {
  if (!logs.value.length || !totalScans.value) return []

  const map = new Map<string, number>()
  logs.value.forEach((log) => {
    const key = log.categoryName || 'No Category'
    map.set(key, (map.get(key) ?? 0) + 1)
  })

  let arr = Array.from(map.entries()).map(([label, count]) => ({
    label,
    count,
    percent: 0,
  }))

  arr.forEach((c) => {
    c.percent = Math.round((c.count / totalScans.value) * 100)
  })

  arr.sort((a, b) => b.count - a.count)
  arr = arr.slice(0, 5)

  return arr.map((c, idx) => ({
    ...c,
    rank: idx + 1,
  }))
})

// ================= TOP SCANNERS =================
const topScanners = computed(() => {
  if (!logs.value.length) return []

  const map = new Map<string, number>()
  logs.value.forEach((log) => {
    const key = (log.scanned_by || 'Unknown').trim() || 'Unknown'
    map.set(key, (map.get(key) ?? 0) + 1)
  })

  const total = Array.from(map.values()).reduce((sum, c) => sum + c, 0) || 1

  let arr = Array.from(map.entries()).map(([label, count]) => ({
    label,
    count,
    percent: Math.round((count / total) * 100),
  }))

  arr.sort((a, b) => b.count - a.count)
  arr = arr.slice(0, 5)

  return arr.map((s, idx) => ({
    ...s,
    rank: idx + 1,
  }))
})

// ================= USER ROLE SUMMARY =================
const roleSummary = computed(() => {
  if (!users.value.length) return []

  const map = new Map<string, number>()
  users.value.forEach((u) => {
    const role = (u.role || 'Unknown').trim() || 'Unknown'
    map.set(role, (map.get(role) ?? 0) + 1)
  })

  const total = users.value.length || 1

  const arr = Array.from(map.entries()).map(([name, count]) => ({
    name,
    count,
    percent: Math.round((count / total) * 100),
  }))

  arr.sort((a, b) => b.count - a.count)
  return arr
})

// ================= SLIDER CONTENT =================
const highlightSlides = computed<HighlightSlide[]>(() => {
  const slides: HighlightSlide[] = []

  slides.push({
    pill: selectedEventId.value
      ? 'Event Filter Active'
      : 'All Events Overview',
    title: selectedEventLabel.value || 'Semua Event Aktif',
    subtitle: selectedEventId.value
      ? 'Menampilkan statistik scan & aktivitas check-in / checkout untuk event yang dipilih.'
      : 'Menampilkan ringkasan scan & check-in / checkout dari seluruh event.',
    value: `${totalScans.value.toLocaleString()} scans`,
    footer: `${todayLogsCount.value.toLocaleString()} log hari ini • ${uniqueScannersCount.value.toLocaleString()} scanners • ${totalCheckout.value.toLocaleString()} checkout`,
    badgeTitle: 'Filter Sekarang',
    badgeLine1: selectedEventLabel.value || 'All events',
    badgeLine2: selectedCategoryLabel.value
      ? `Category: ${selectedCategoryLabel.value}`
      : 'All categories',
  })

  if (topEvents.value.length) {
    const top = topEvents.value[0]
    slides.push({
      pill: 'Top Event by Scan',
      title: top.label,
      subtitle: 'Event dengan aktivitas check-in / checkout terbanyak pada periode/filter ini.',
      value: `${top.count.toLocaleString()} scans`,
      footer: `${top.percent}% dari total scan`,
      badgeTitle: 'Posisi Ranking',
      badgeLine1: `#${top.rank} di semua event`,
      badgeLine2: 'Cek detail di halaman Event',
    })
  }

  if (topCategories.value.length) {
    const cat = topCategories.value[0]
    slides.push({
      pill: 'Hot Category',
      title: cat.label,
      subtitle: 'Kategori tiket dengan penggunaan tertinggi.',
      value: `${cat.count.toLocaleString()} scans`,
      footer: `${cat.percent}% dari total scan`,
      badgeTitle: 'Kategori Teratas',
      badgeLine1: 'Ideal untuk pantau kapasitas & crowd',
      badgeLine2: 'Rekomendasi untuk fokus monitoring di gate',
    })
  }

  if (topScanners.value.length) {
    const scanner = topScanners.value[0]
    slides.push({
      pill: 'Top Scanner',
      title: scanner.label,
      subtitle: 'Operator / device dengan jumlah scan tertinggi.',
      value: `${scanner.count.toLocaleString()} scans`,
      footer: `${scanner.percent}% kontribusi dari total scan`,
      badgeTitle: 'Performa Tim',
      badgeLine1: 'Pantau produktivitas team lapangan',
      badgeLine2: 'Pastikan pembagian beban kerja seimbang',
    })
  }

  return slides
})

// ================= SLIDER CONTROL =================
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
