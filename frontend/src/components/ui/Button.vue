<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium gap-2 rounded-lg transition',
      sizeClasses[size],
      variantClasses[variant],
      className,
      { 'cursor-not-allowed opacity-50': disabled },
    ]"
    @click="onClick"
    :disabled="disabled"
  >
    <span v-if="startIcon" class="flex items-center">
      <component :is="startIcon" />
    </span>
    <slot></slot>
    <span v-if="endIcon" class="flex items-center">
      <component :is="endIcon" />
    </span>
  </button>
</template>

<script setup lang="ts">

interface ButtonProps {
  size?: 'xs' | 'sm' | 'md'
  variant?: 'primary' | 'outline' | 'danger' | 'success'
  startIcon?: object
  endIcon?: object
  onClick?: () => void
  className?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  size: 'md',
  variant: 'primary',
  className: '',
  disabled: false,
})

const sizeClasses = {
  xs: 'px-3 py-2 text-xs',
  sm: 'px-4 py-3 text-sm',
  md: 'px-5 py-3.5 text-sm',
}

const variantClasses = {
  primary: 'bg-blue-500 text-white shadow-theme-xs hover:bg-blue-600 disabled:bg-blue-300',
  outline:
    'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300',
  danger: 'bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300',
  success: 'bg-green-600 text-white shadow-theme-xs hover:bg-green-700 disabled:bg-green-300',
}

const onClick = () => {
  if (!props.disabled && props.onClick) {
    props.onClick()
  }
}
</script>
