<template>
  <div class="min-h-screen xl:flex relative">
    <!-- SIDEBAR SCANNER -->
    <ScannerSidebar />
    <AppBackdrop />

    <!-- MAIN AREA -->
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <!-- HEADER -->
      <AppHeader />

      <!-- CONTENT -->
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 pb-20">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ScannerSidebar from '@/components/sidebar/ScannerSidebar.vue'
import AppHeader from '@/components/header/AppHeader.vue'
import AppBackdrop from '@/layouts/AppBackdrop.vue'
import { useSidebar } from '@/composables/useSidebar'

const { isExpanded, isHovered } = useSidebar()
</script>
