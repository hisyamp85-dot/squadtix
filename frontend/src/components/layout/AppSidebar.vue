<template>
  <aside
    :class="[
      'fixed mt-16 lg:mt-4 top-0 left-0 flex flex-col',
      'h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-2.5rem)]',
      'px-3 lg:px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl',
      'border border-slate-200/70 dark:border-slate-700/60',
      'shadow-xl rounded-3xl lg:rounded-3xl',
      'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
      'z-[9999]',
      {
        // Lebar sidebar di layar besar
        'lg:w-[280px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[84px]': !isExpanded && !isHovered,
        // Mobile: slide in / out
        'translate-x-0 w-[280px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <!-- garis glow tipis di sisi kanan -->
    <div
      class="pointer-events-none absolute inset-y-3 right-0 w-px bg-gradient-to-b from-transparent via-slate-200/80 to-transparent dark:via-slate-700/80 hidden lg:block"
    />

    <!-- BRAND SQUADTIX (di tengah) -->
    <div class="pb-4 pt-4 flex justify-center">
      <router-link :to="homePath" class="flex items-center gap-3">
        <!-- versi compact: ST di kotak -->
        <div
          v-if="!isExpanded && !isHovered && !isMobileOpen"
          class="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-600 text-white text-sm font-semibold shadow-sm"
        >
          ST
        </div>

        <!-- versi full: SquadTix text -->
        <div v-else class="flex flex-col items-center text-center">
          <span class="text-sm font-semibold tracking-wide text-slate-900 dark:text-white">
            <b>SquadTix</b>
          </span>
        </div>
      </router-link>
    </div>

    <!-- AREA TENGAH: MENU + SCROLL + WIDGET -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-4">
        <nav class="mb-4 flex-1">
          <div class="flex flex-col gap-5">
            <!-- GROUP MENU -->
            <div
              v-for="(menuGroup, groupIndex) in menuGroups"
              :key="menuGroup.title"
              v-show="groupMatches(menuGroup)"
            >
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
                <li
                  v-for="(item, index) in menuGroup.items"
                  :key="item.name"
                  v-show="itemMatches(item)"
                >
                  <!-- Item dengan submenu -->
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
                        {
                          'rotate-180 text-indigo-500': isSubmenuOpen(groupIndex, index),
                        },
                      ]"
                    />
                  </button>

                  <!-- Item single (tanpa submenu) -->
                  <router-link
                    v-else-if="item.path"
                    :to="item.path"
                    @click="openSubmenu = null"
                    :class="[
                      'menu-item group',
                      {
                        'menu-item-active': isActive(item.path),
                        'menu-item-inactive': !isActive(item.path),
                      },
                    ]"
                  >
                    <span
                      :class="[
                        isActive(item.path)
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
                  </router-link>

                  <!-- Dropdown submenu -->
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
                        <li
                          v-for="subItem in item.subItems"
                          :key="subItem.name"
                          v-show="subItemMatches(subItem)"
                        >
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
                                v-if="subItem.new"
                                :class="[
                                  'menu-dropdown-badge',
                                  {
                                    'menu-dropdown-badge-active': isActive(subItem.path),
                                    'menu-dropdown-badge-inactive': !isActive(subItem.path),
                                  },
                                ]"
                              >
                                new
                              </span>
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

        <!-- Widget tambahan -->
        <SidebarWidget
          v-if="isExpanded || isHovered || isMobileOpen"
          class="mt-auto mb-1"
        />
      </div>
    </div>

    <!-- BAGIAN PALING BAWAH: USER MANAGEMENT FOOTER (KHUSUS ADMIN) -->
    <div
      v-if="isAdmin"
      class="border-t border-slate-200/70 dark:border-slate-700/70 px-3 lg:px-4 py-3"
    >
      <h2
        v-if="isExpanded || isHovered || isMobileOpen"
        class="mb-2 text-[11px] tracking-[0.14em] uppercase text-slate-400 dark:text-slate-500"
      >
        Administration
      </h2>

      <button
        class="menu-item group w-full"
        :class="{
          'menu-item-active': isSubmenuOpenUserManagement,
          'menu-item-inactive': !isSubmenuOpenUserManagement,
        }"
        @click="toggleUserManagement"
      >
        <span
          :class="[
            isSubmenuOpenUserManagement
              ? 'menu-item-icon-active'
              : 'menu-item-icon-inactive',
          ]"
        >
          <Users2 class="w-4 h-4" />
        </span>
        <span
          v-if="isExpanded || isHovered || isMobileOpen"
          class="menu-item-text"
        >
          User Management
        </span>
      </button>

      <transition
        @enter="startTransition"
        @after-enter="endTransition"
        @before-leave="startTransition"
        @after-leave="endTransition"
      >
        <div
          v-show="
            isSubmenuOpenUserManagement &&
            (isExpanded || isHovered || isMobileOpen)
          "
        >
          <ul class="mt-2 space-y-1 ml-9">
            <li>
              <router-link
                to="/user"
                :class="[
                  'menu-dropdown-item',
                  {
                    'menu-dropdown-item-active': isActive('/user'),
                    'menu-dropdown-item-inactive': !isActive('/user'),
                  },
                ]"
              >
                Users
              </router-link>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  CalendarDays,
  ScanLine,
  FileBarChart2,
  Users2,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-vue-next'
import SidebarWidget from './SidebarWidget.vue'
import { useSidebar } from '@/composables/useSidebar'

const route = useRoute()
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar()

// ======================
//   USER & ROLE INFO
// ======================

type NormalizedRole = 'admin' | 'user'

interface RawUser {
  id: number | string
  name?: string
  username?: string
  email?: string
  role?: any
  status?: string
}

interface MenuItem {
  name: string
  path?: string
  pro?: boolean
  new?: boolean
  icon?: unknown
  subItems?: MenuItem[]
}

// Ambil user dari localStorage, aman di semua device (cek typeof window)
const storedUser = computed<RawUser | null>(() => {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as RawUser
  } catch {
    return null
  }
})

// Normalisasi role → 'admin' atau 'user'
// Sama logika seperti di router guard
const normalizedRole = computed<NormalizedRole | null>(() => {
  const raw = storedUser.value?.role
  if (raw == null) return null
  const r = String(raw).toLowerCase().trim()
  if (['admin', 'administrator', 'superadmin'].includes(r)) return 'admin'
  return 'user'
})

const isAdmin = computed(() => normalizedRole.value === 'admin')
const isUser = computed(() => normalizedRole.value === 'user')
const userId = computed(() => storedUser.value?.id ?? null)

// base path utk user, misal "/user/44"
const userBase = computed(() => {
  if (!isUser.value || !userId.value) return ''
  return `/user/${userId.value}`
})

// home path utk brand SquadTix
const homePath = computed(() => {
  if (isAdmin.value) return '/'
  if (isUser.value && userBase.value) return userBase.value
  return '/'
})

// ======================
//     MENU DEFINITIONS
// ======================

const adminMenuGroups: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Main',
    items: [
      {
        icon: LayoutDashboard,
        name: 'Dashboard',
        path: '/',
        pro: false,
      },
    ],
  },
  {
    title: 'Event Management',
    items: [
      {
        name: 'Events',
        icon: CalendarDays,
        subItems: [{ name: 'All Events', path: '/event', pro: false }],
      },
    ],
  },
  {
    title: 'Gate & Attendance',
    items: [
      {
        name: 'Scan & Gate',
        icon: ScanLine,
        subItems: [
          { name: 'Check-in', path: '/checkin', pro: false },
          { name: 'Check-out', path: '/checkout', pro: false },
        ],
      },
    ],
  },
  {
    title: 'Reports',
    items: [
      {
        name: 'Attendance Logs',
        icon: FileBarChart2,
        subItems: [
          {
            name: 'Report',
            path: '/report',
            pro: false,
          },
          {
            name: 'Check-in & Check-out Logs',
            path: '/checkin/logs',
            pro: false,
          },
        ],
      },
    ],
  },
]

const userMenuGroups = computed<{ title: string; items: MenuItem[] }[]>(() => {
  if (!userBase.value) return []

  return [
    {
      title: 'Main',
      items: [
        {
          icon: LayoutDashboard,
          name: 'Dashboard',
          path: `${userBase.value}`,
          pro: false,
        },
      ],
    },
    {
      title: 'Event Management',
      items: [
        {
          name: 'Events',
          icon: CalendarDays,
          subItems: [
            {
              name: 'All Events',
              path: `${userBase.value}/event`,
              pro: false,
            },
          ],
        },
      ],
    },
    {
      title: 'Gate & Attendance',
      items: [
        {
          name: 'Scan & Gate',
          icon: ScanLine,
          subItems: [
            {
              name: 'Check-in',
              path: `${userBase.value}/checkin`,
              pro: false,
            },
            {
              name: 'Check-out',
              path: `${userBase.value}/checkout`,
              pro: false,
            },
          ],
        },
      ],
    },
  ]
})

// menu yang dipakai tergantung role
const menuGroups = computed(() => {
  if (isAdmin.value) return adminMenuGroups
  if (isUser.value) return userMenuGroups.value
  // fallback kalau entah bagaimana role nggak kebaca
  return adminMenuGroups
})

// ======================
//     SEARCH MENU
// ======================

const searchQuery = ref('')

const normalizeText = (s: string | undefined) => (s ?? '').trim().toLowerCase()

const matchesQuery = (text: string | undefined) => {
  const q = normalizeText(searchQuery.value)
  if (!q) return true
  return normalizeText(text).includes(q)
}

const subItemMatches = (subItem: MenuItem) => {
  const q = normalizeText(searchQuery.value)
  if (!q) return true
  return matchesQuery(subItem.name)
}

const itemMatches = (item: MenuItem) => {
  const q = normalizeText(searchQuery.value)
  if (!q) return true

  if (matchesQuery(item.name)) return true

  if (item.subItems && item.subItems.length > 0) {
    return item.subItems.some((sub) => matchesQuery(sub.name))
  }

  return false
}

const groupMatches = (group: { title: string; items: MenuItem[] }) => {
  const q = normalizeText(searchQuery.value)
  if (!q) return true

  if (matchesQuery(group.title)) return true

  return group.items.some((item) => itemMatches(item))
}

// ======================
//     ACTIVE / SUBMENU
// ======================

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

// khusus user management di bawah (footer admin)
const isSubmenuOpenUserManagement = ref(false)
const toggleUserManagement = () => {
  isSubmenuOpenUserManagement.value = !isSubmenuOpenUserManagement.value
}

// ======================
//      TRANSITIONS
// ======================

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
@reference "tailwindcss";

.menu-item {
  @apply flex items-center gap-3 w-full
    rounded-2xl px-3 py-2.5
    text-[13px] font-medium
    text-slate-600 dark:text-slate-200/80
    transition-colors transition-transform duration-150
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

/* icon bulat di kiri */
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

/* DROPDOWN / SUBMENU */
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

/* badge "new" / "pro" */
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

/* sedikit spacing di list */
nav ul li {
  @apply relative;
}

/* no-scrollbar lokal buat sidebar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
