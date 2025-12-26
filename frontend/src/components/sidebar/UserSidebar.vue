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
      <!-- untuk user: balik ke dashboard -->
      <router-link to="/">
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
                        <button
                          v-if="subItem.onClick"
                          type="button"
                          @click="subItem.onClick"
                          :class="[
                            'menu-dropdown-item w-full text-left',
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
                        </button>
                        <router-link
                          v-else
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
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import api from "@/lib/axios";
import {
  ChevronDownIcon,
  HorizontalDots,
  LayoutDashboardIcon,
  CalenderIcon,
  ListIcon,
} from "../../icons";
import SidebarWidget from "../layout/SidebarWidget.vue";
import { useSidebar } from "@/composables/useSidebar";

const route = useRoute();
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

interface MenuItem {
  name: string;
  path?: string;
  onClick?: () => void;
  pro?: boolean;
  new?: boolean;
  icon?: unknown;
  subItems?: MenuItem[];
}

const router = useRouter();

const getStoredEventId = (): string | null => {
  try {
    const raw = localStorage.getItem("user");
    const parsed = raw
      ? (JSON.parse(raw) as { event_id?: string | number; eventId?: string | number })
      : null;
    const id =
      parsed?.event_id ??
      parsed?.eventId ??
      localStorage.getItem("event_id") ??
      localStorage.getItem("eventId");
    if (id === undefined || id === null || id === "") return null;
    return String(id);
  } catch {
    return null;
  }
};

const goToUserEventDetail = async () => {
  const stored = getStoredEventId();
  if (stored) {
    router.push(`/user/event/detail/${stored}`);
    return;
  }

  try {
    const response = await api.get("/user/my-events");
    const events = response.data as Array<{ event_id?: string | number }>;
    const firstId = events?.[0]?.event_id;
    if (firstId !== undefined && firstId !== null && String(firstId).trim() !== "") {
      router.push(`/user/event/detail/${firstId}`);
      return;
    }
  } catch (error) {
    console.error("Failed to fetch user events:", error);
  }

  router.push("/event");
};

const goToUserRedeem = async () => {
  const stored = getStoredEventId();
  if (stored) {
    router.push({ path: "/user/event/redeem", query: { eventId: stored } });
    return;
  }

  try {
    const response = await api.get("/user/my-events");
    const events = response.data as Array<{ event_id?: string | number }>;
    const firstId = events?.[0]?.event_id;
    if (firstId !== undefined && firstId !== null && String(firstId).trim() !== "") {
      router.push({ path: "/user/event/redeem", query: { eventId: firstId } });
      return;
    }
  } catch (error) {
    console.error("Failed to fetch user events:", error);
  }

  router.push("/event");
};

const menuGroups = computed<{ title: string; items: MenuItem[] }[]>(() => [
  {
    title: "Main",
    items: [
      {
        icon: LayoutDashboardIcon,
        name: "Dashboard",
        path: "/",
        pro: false,
      },
    ],
  },
  {
    title: "Event Management",
    items: [
      {
        name: "Events",
        icon: CalenderIcon,
        subItems: [
          { name: "All Category", onClick: goToUserEventDetail, pro: false },
          
        ],
      },
    ],
  },
  {
    title: "Gate & Attendance",
    items: [
      {
        name: "Scan & Gate",
        icon: ListIcon,
        subItems: [
          {
            name: "Redeem",
            path: "/user/event/redeem",
            onClick: goToUserRedeem,
            pro: false,
          },
          { name: "Check-in", path: "/checkin", pro: false },
          { name: "Check-out", path: "/checkout", pro: false },
        ],
      },
    ],
  },
]);

const isActive = (path?: string) => path !== undefined && route.path === path;

const toggleSubmenu = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isSubmenuOpen = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`;
  const item = menuGroups.value[groupIndex].items[itemIndex];

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
