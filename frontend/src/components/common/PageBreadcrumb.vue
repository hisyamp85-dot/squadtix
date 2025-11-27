<template>
  <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90" x-text="pageTitle">
      {{ pageTitle }}
    </h2>
    <nav v-if="breadcrumbs && breadcrumbs.length > 0">
      <ol class="flex items-center gap-1.5">
        <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center gap-1.5">
          <router-link
            v-if="crumb.to && !crumb.active"
            :to="crumb.to"
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            {{ crumb.text }}
          </router-link>
          <span v-else class="text-sm text-gray-800 dark:text-white/90">
            {{ crumb.text }}
          </span>
          <svg
            v-if="index < breadcrumbs.length - 1"
            class="text-gray-500 dark:text-white"
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  text: string
  to?: string
  active?: boolean
}

interface BreadcrumbProps {
  pageTitle: string
  breadcrumbs?: BreadcrumbItem[]
}

defineProps<BreadcrumbProps>()
</script>
