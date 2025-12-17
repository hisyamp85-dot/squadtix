<template>
  <div class="min-h-screen xl:flex relative">
    <!-- SIDEBAR + BACKDROP -->
    <AppSidebar />
    <AppBackdrop />

    <!-- MAIN AREA -->
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <!-- HEADER -->
      <AppHeader />

      <!-- CONTENT -->
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 pb-24">
        <router-view />
      </div>

    </div>

    <!-- FOOTER -->
    <footer
      class="fixed bottom-0 left-0 right-0 z-[9000]
             bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl
             border-t border-transparent
             py-3 flex items-center justify-center"
    >
      <span class="text-xs text-slate-600 dark:text-slate-400 tracking-wide">
        © {{ currentYear }} SquadTix — All rights reserved.
      </span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/sidebar/AdminSidebar.vue'
import AppHeader from '@/components/header/AppHeader.vue'
import AppBackdrop from '@/layouts/AppBackdrop.vue'
import { useSidebar } from '@/composables/useSidebar'

const { isExpanded, isHovered } = useSidebar()
const currentYear = new Date().getFullYear()
</script>
