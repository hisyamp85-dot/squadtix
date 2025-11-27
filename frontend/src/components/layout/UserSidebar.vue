<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <!-- LOGO -->
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <!-- untuk user: balik ke /:id (dashboard user) -->
      <router-link :to="`/${userId}`">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-else
          src="/images/logo/logo-icon.svg"
          alt="Logo"
          width="32"
          height="32"
        />
      </router-link>
    </div>

    <!-- MENU -->
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <!-- TITLE -->
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>

            <!-- ITEMS -->
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
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
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                  >
                    {{ item.name }}
                  </span>
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
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
                    <component :is="item.icon" />
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
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path ?? ''"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
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
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
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
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
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

      <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  GridIcon,
  UserCircleIcon,
  ChevronDownIcon,
  HorizontalDots,
  ListIcon,
} from "../../icons";
import SidebarWidget from "./SidebarWidget.vue";
import { useSidebar } from "@/composables/useSidebar";

const route = useRoute();
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

// ambil :id dari URL sebagai base path user
const userId = route.params.id as string;

interface MenuItem {
  name: string;
  path?: string;
  pro?: boolean;
  new?: boolean;
  icon?: unknown;
  subItems?: MenuItem[];
}

const menuGroups: { title: string; items: MenuItem[] }[] = [
  {
    title: "Main",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        path: `/${userId}`,
        pro: false,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        icon: UserCircleIcon,
        name: "Account",
        subItems: [
          { name: "Profile", path: `/${userId}/profile`, pro: false },
          { name: "User", path: `/${userId}/account/user`, pro: false },
          {
            name: "Group User",
            path: `/${userId}/account/group-user`,
            pro: false,
          },
        ],
      },
    ],
  },
  {
    title: "Redeem",
    items: [
      {
        name: "Redeem",
        icon: ListIcon,
        subItems: [
          { name: "Tickets", path: `/${userId}/redeem/tickets`, pro: false },
          { name: "Rewards", path: `/${userId}/redeem/rewards`, pro: false },
        ],
      },
    ],
  },
];

const isActive = (path?: string) => path !== undefined && route.path === path;

const toggleSubmenu = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isSubmenuOpen = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`;
  const item = menuGroups[groupIndex].items[itemIndex];

  const hasActiveSubItem = item.subItems?.some((subItem) =>
    isActive(subItem.path)
  );

  return openSubmenu.value === key || hasActiveSubItem;
};

const startTransition = (el: Element, done?: () => void) => {
  const element = el as HTMLElement;
  element.style.height = "auto";
  const height = element.scrollHeight;
  element.style.height = "0px";
  void element.offsetHeight; // force reflow
  element.style.height = height + "px";
  if (done) done();
};

const endTransition = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "";
};
</script>
