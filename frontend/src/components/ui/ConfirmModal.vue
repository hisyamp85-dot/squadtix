<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-80"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
      aria-hidden="true"
      @click="$emit('close')"
    ></div>

    <!-- Modal Content -->
    <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Icon -->
      <div class="mb-4 flex justify-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h3 class="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h3>

      <!-- Message -->
      <p class="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {{ message }}
      </p>

      <!-- Buttons -->
      <div class="flex gap-3">
        <button
          @click="$emit('close')"
          class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          {{ cancelText }}
        </button>
        <button
          @click="$emit('confirm')"
          class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-600 dark:hover:bg-red-700"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'

interface ConfirmModalProps {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

withDefaults(defineProps<ConfirmModalProps>(), {
  confirmText: 'Delete',
  cancelText: 'Cancel',
})

defineEmits<{
  close: []
  confirm: []
}>()

const { isExpanded, isHovered } = useSidebar()
</script>
