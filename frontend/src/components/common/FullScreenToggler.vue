<template>
  <button
    @click="toggleFullScreen"
    class="flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
  >
    <svg
      class="fill-current"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.5 5.41667C2.5 4.58964 3.17098 3.91667 4 3.91667H7.5C7.91421 3.91667 8.25 4.25245 8.25 4.66667C8.25 5.08088 7.91421 5.41667 7.5 5.41667H4V8.91667C4 9.33088 3.66421 9.66667 3.25 9.66667C2.83579 9.66667 2.5 9.33088 2.5 8.91667V5.41667ZM11.75 4.66667C11.75 4.25245 12.0858 3.91667 12.5 3.91667H16C16.829 3.91667 17.5 4.58964 17.5 5.41667V8.91667C17.5 9.33088 17.1642 9.66667 16.75 9.66667C16.3358 9.66667 16 9.33088 16 8.91667V5.41667H12.5C12.0858 5.41667 11.75 5.08088 11.75 4.66667ZM3.25 10.3333C3.66421 10.3333 4 10.6691 4 11.0833V14.5833H7.5C7.91421 14.5833 8.25 14.9191 8.25 15.3333C8.25 15.7475 7.91421 16.0833 7.5 16.0833H4C3.17098 16.0833 2.5 15.4104 2.5 14.5833V11.0833C2.5 10.6691 2.83579 10.3333 3.25 10.3333ZM16.75 10.3333C17.1642 10.3333 17.5 10.6691 17.5 11.0833V14.5833C17.5 15.4104 16.829 16.0833 16 16.0833H12.5C12.0858 16.0833 11.75 15.7475 11.75 15.3333C11.75 14.9191 12.0858 14.5833 12.5 14.5833H16V11.0833C16 10.6691 16.3358 10.3333 16.75 10.3333Z"
        fill=""
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>
