<template>
  <aside
    :class="[
      'fixed left-0 flex flex-col',
      'top-[4.5rem] lg:top-[2.5rem]',
      'h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-2.5rem)]',
      'px-3 lg:px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl',
      'border border-slate-200/70 dark:border-slate-700/60',
      'shadow-xl rounded-3xl lg:rounded-3xl',
      'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
      'z-[9500]',
      {
        'lg:w-[280px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[84px]': !isExpanded && !isHovered,
        'translate-x-0 w-[280px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      class="pointer-events-none absolute inset-y-3 right-0 w-px bg-gradient-to-b from-transparent via-slate-200/80 to-transparent dark:via-slate-700/80 hidden lg:block"
    />

    <!-- BRAND -->
    <div class="pb-4 pt-4 flex justify-center">
      <router-link :to="homePath" class="flex items-center gap-3">
        <div
          v-if="!isExpanded && !isHovered && !isMobileOpen"
          class="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-600 text-white text-sm font-semibold shadow-sm"
        >
          ST
        </div>
        <div v-else class="flex flex-col items-center text-center">
          <span class="text-sm font-semibold tracking-wide text-slate-900 dark:text-white">
            <b>SquadTix</b>
          </span>
          <span class="text-[11px] text-slate-500 dark:text-slate-400">Scanner</span>
        </div>
      </router-link>
    </div>

    <!-- MENU -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-4">
        <nav class="mb-4 flex-1">
          <div class="flex flex-col gap-5">
            <div v-for="(menuGroup, groupIndex) in menuGroups" :key="menuGroup.title">
              <h2
                :class="[
                  'mb-2 text-[11px] tracking-[0.14em] uppercase flex items-center text-slate-400 dark:text-slate-500',
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
                ]"
              >
                <template v-if="isExpanded || isHovered || isMobileOpen">
                  {{ menuGroup.title }}
                </template>
                <MoreHorizontal v-else class="w-4 h-4 opacity-70" />
              </h2>

              <ul class="flex flex-col gap-1.5">
                <li v-for="(item, index) in menuGroup.items" :key="item.name">
                  <button
                    v-if="item.subItems"
                    @click="toggleSubmenu(groupIndex, index)"
                    :class="[
                      'menu-item group w-full',
                      {
                        'menu-item-active': isSubmenuOpen(groupIndex, index),
                        'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                      },
                      !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                    ]"
                  >
                    <span
                      :class="[
                        isSubmenuOpen(groupIndex, index)
                          ? 'menu-item-icon-active'
                          : 'menu-item-icon-inactive',
                      ]"
                    >
                      <component :is="item.icon" class="w-4 h-4" />
                    </span>
                    <span
                      v-if="isExpanded || isHovered || isMobileOpen"
                      class="menu-item-text"
                    >
                      {{ item.name }}
                    </span>
                    <ChevronDown
                      v-if="isExpanded || isHovered || isMobileOpen"
                      :class="[
                        'ml-auto w-4 h-4 transition-transform duration-200',
                        { 'rotate-180 text-indigo-500': isSubmenuOpen(groupIndex, index) },
                      ]"
                    />
                  </button>

                  <transition
                    @enter="startTransition"
                    @after-enter="endTransition"
                    @before-leave="startTransition"
                    @after-leave="endTransition"
                  >
                    <div
                      v-show="
                        isSubmenuOpen(groupIndex, index) &&
                        (isExpanded || isHovered || isMobileOpen)
                      "
                    >
                      <ul class="mt-2 space-y-1 ml-9">
                        <li v-for="subItem in item.subItems" :key="subItem.name">
                          <router-link
                            :to="subItem.path ?? ''"
                            :class="[
                              'menu-dropdown-item',
                              {
                                'menu-dropdown-item-active': isActive(subItem.path),
                                'menu-dropdown-item-inactive': !isActive(subItem.path),
                              },
                            ]"
                          >
                            {{ subItem.name }}
                            <span class="flex items-center gap-1 ml-auto">
                              <span
                                v-if="subItem.pro"
                                :class="[
                                  'menu-dropdown-badge',
                                  {
                                    'menu-dropdown-badge-active': isActive(subItem.path),
                                    'menu-dropdown-badge-inactive': !isActive(subItem.path),
                                  },
                                ]"
                              >
                                pro
                              </span>
                            </span>
                          </router-link>
                        </li>
                      </ul>
                    </div>
                  </transition>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronDown, MoreHorizontal } from 'lucide-vue-next'
import { ListIcon } from '@/icons'
import { useSidebar } from '@/composables/useSidebar'
import type { Component } from 'vue'

const route = useRoute()
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar()

const homePath = '/scanner'

const userId = computed(() => {
  const paramId = route.params.id as string | undefined
  return paramId && paramId.length ? paramId : 'scanner'
})

interface MenuItem {
  name: string
  path?: string
  pro?: boolean
  icon?: Component
  subItems?: MenuItem[]
}

const menuGroups = computed<{ title: string; items: MenuItem[] }[]>(() => [
  {
    title: 'Redeem',
    items: [
      {
        name: 'Redeem',
        icon: ListIcon,
        subItems: [
          { name: 'Tickets', path: `/${userId.value}/redeem/tickets`, pro: false },
          { name: 'Rewards', path: `/${userId.value}/redeem/rewards`, pro: false },
        ],
      },
    ],
  },
])

const isActive = (path?: string) => path !== undefined && route.path === path

const toggleSubmenu = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`
  openSubmenu.value = openSubmenu.value === key ? null : key
}

const isSubmenuOpen = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`
  const group = menuGroups.value[groupIndex]
  if (!group) return openSubmenu.value === key
  const item = group.items[itemIndex]
  if (!item) return openSubmenu.value === key
  const hasActiveSubItem = item.subItems?.some((subItem) => isActive(subItem.path))
  return openSubmenu.value === key || !!hasActiveSubItem
}

const startTransition = (el: Element, done?: () => void) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
  const height = element.scrollHeight
  element.style.height = '0px'
  void element.offsetHeight
  element.style.height = height + 'px'
  if (done) done()
}

const endTransition = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = ''
}
</script>

<style scoped>
.menu-item {
  @apply flex items-center gap-3 w-full
    rounded-2xl px-3 py-2.5
    text-[13px] font-medium
    text-slate-600 dark:text-slate-200/80
    transition-all duration-150
    hover:bg-slate-100/80 dark:hover:bg-slate-800/80
    hover:text-slate-900 dark:hover:text-white
    hover:-translate-y-[1px];
}

.menu-item-active {
  @apply bg-indigo-600 text-white shadow-md
    hover:bg-indigo-600;
}

.menu-item-inactive {
  @apply bg-transparent;
}

.menu-item-icon-active {
  @apply inline-flex h-8 w-8 items-center justify-center
    rounded-xl bg-white/20 text-white;
}

.menu-item-icon-inactive {
  @apply inline-flex h-8 w-8 items-center justify-center
    rounded-xl bg-slate-100 dark:bg-slate-800
    text-slate-500 dark:text-slate-300
    group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700
    group-hover:text-slate-900 dark:group-hover:text-white;
}

.menu-item-text {
  @apply truncate;
}

.menu-dropdown-item {
  @apply flex items-center gap-2 rounded-xl px-2.5 py-1.5
    text-[12px] text-slate-500 dark:text-slate-300
    transition-colors duration-150
    hover:bg-slate-100/80 dark:hover:bg-slate-800/80
    hover:text-slate-900 dark:hover:text-white;
}

.menu-dropdown-item-active {
  @apply bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900;
}

.menu-dropdown-item-inactive {
  @apply bg-transparent;
}

.menu-dropdown-badge {
  @apply inline-flex items-center rounded-full px-2 py-[2px]
    text-[10px] font-semibold uppercase tracking-wide;
}

.menu-dropdown-badge-active {
  @apply bg-white/20 text-white;
}

.menu-dropdown-badge-inactive {
  @apply bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-100;
}

nav ul li {
  @apply relative;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
