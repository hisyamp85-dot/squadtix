<template>
  <div
    v-if="isMobileOpen"
    class="fixed inset-x-0 top-[4.5rem] bottom-0
           bg-slate-900/40 backdrop-blur-sm
           z-[9000] lg:hidden"
    @click="toggleMobileSidebar"
  ></div>
</template>

<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'

const { toggleMobileSidebar, isMobileOpen } = useSidebar()
</script>
