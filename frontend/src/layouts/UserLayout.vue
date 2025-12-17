<template>
  <div class="min-h-screen xl:flex relative">
    <!-- SIDEBAR USER -->
    <UserSidebar />
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
  </div>
</template>

<script setup lang="ts">
import UserSidebar from '@/components/sidebar/UserSidebar.vue'
import AppHeader from '@/components/header/AppHeader.vue'
import AppBackdrop from '@/layouts/AppBackdrop.vue'
import { useSidebar } from '@/composables/useSidebar'

const { isExpanded, isHovered } = useSidebar()
</script>
