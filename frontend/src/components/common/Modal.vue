<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div
      class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
    >
      <!-- Close Button -->
      <button
        class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        @click="$emit('close')"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Slot Content -->
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup></script>
