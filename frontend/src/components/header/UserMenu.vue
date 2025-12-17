<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 flex items-center justify-center rounded-full h-11 w-11 bg-gray-200 dark:bg-gray-700">
        <UserCircleIcon class="h-8 w-8 text-gray-600 dark:text-gray-300" />
      </span>

      <span class="block mr-1 font-medium text-theme-sm">{{ userData?.name || 'User' }}</span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div class="flex flex-col xl:flex-row xl:items-center xl:gap-1">
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ userData?.name || 'User' }}
        </span>
        
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ userData?.email || 'user@example.com' }}
        </span>
       
      </div>
      


      

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.routeName">
          <router-link
            :to="item.routeName === 'UserEditProfile'
              ? { name: item.routeName, params: { id: userData?.id } }
              : { name: item.routeName }"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <!-- SVG icon would go here -->
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <router-link
        to="/login"
        @click.prevent="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Sign out
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon, ChevronDownIcon, LogoutIcon } from '@/icons'
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const router = useRouter()
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const userData = computed(() => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
})

const menuItems = computed(() => {
  if (userData.value?.role?.toLowerCase() === 'admin') {
    return [
      { routeName: 'ProfileEdit', icon: UserCircleIcon, text: 'Edit profile' },
      // { routeName: 'Chat', icon: SettingsIcon, text: 'Account settings' },
      // { routeName: 'Support', icon: InfoCircleIcon, text: 'Support' }
    ]
  } else {
    return [
      { routeName: 'UserProfile', icon: UserCircleIcon, text: 'Edit profile' },
      // { routeName: 'Chat', icon: SettingsIcon, text: 'Account settings' },
      // { routeName: 'Support', icon: InfoCircleIcon, text: 'Support' }
    ]
  }
})


const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('auth_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
  closeDropdown()
  router.replace('/login')
}

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
