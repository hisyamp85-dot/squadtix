<template>
  <AdminLayout>
    <PageBreadcrumb
      :pageTitle="currentPageTitle"
      :breadcrumbs="breadcrumbs"
    />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7
             dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="flex items-center gap-4 mb-4">
        <button @click="goBack" class="px-4 py-2 flex items-center gap-2">
          <BackArrowIcon class="text-gray-900 dark:text-white" />
        </button>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Group Event
        </h3>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5
               dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
      >
        <div class="space-y-6">
          <!-- Group Selection Dropdown -->
          <div class="flex items-center gap-4">
            <label
              class="text-sm font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap"
            >
              Select Group
            </label>
            <div class="relative z-20 bg-transparent">
              <select
                v-model="selectedGroup"
                class="dark:bg-dark-900 h-11 w-64 appearance-none rounded-lg border border-gray-300
                       bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs
                       placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3
                       focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90
                       dark:placeholder:text-white/30 dark:focus:border-brand-800"
                :class="{ 'text-gray-800 dark:text-white/90': selectedGroup }"
                @change="handleGroupChange"
              >
                <option value="" disabled>Select Group</option>
                <option
                  v-for="group in groups"
                  :key="group.id"
                  :value="group.id"
                  class="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                  {{ group.name_group }}
                </option>
              </select>
              <span
                class="absolute z-30 text-gray-700 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400"
              >
                <svg
                  class="stroke-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                    stroke=""
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          <!-- Categories Table -->
          <div class="mt-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-md font-semibold text-gray-800 dark:text-white/90">
                Categories
              </h4>
              <div class="flex items-center gap-2">
                <label for="entries" class="text-gray-700 dark:text-gray-300">
                  Show
                </label>
                <select
                  id="entries"
                  v-model="entriesPerPage"
                  class="border border-gray-300 rounded px-2 py-1
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option
                    v-for="option in entriesOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
                <span class="text-gray-700 dark:text-gray-300">entries</span>
              </div>
            </div>

            <div class="max-w-full overflow-x-auto p-4">
              <table class="min-w-full border border-separate border-spacing-y-2">
                <thead>
                  <tr class="border-b">
                    <th class="px-5 py-3 text-left text-gray-900 dark:text-white">
                      No
                    </th>
                    <th class="px-5 py-3 text-left text-gray-900 dark:text-white">
                      <input
                        type="checkbox"
                        :checked="isAllSelected"
                        @change="toggleAll"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
                               focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                               focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </th>
                    <th class="px-5 py-3 text-left text-gray-900 dark:text-white">
                      Category Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-if="paginatedCategories.length === 0"
                    class="bg-gray-50 dark:bg-gray-800/50"
                  >
                    <td
                      colspan="3"
                      class="px-5 py-6 text-center text-gray-500 dark:text-gray-300"
                    >
                      No categories found.
                    </td>
                  </tr>

                  <tr
                    v-else
                    v-for="(category, index) in paginatedCategories"
                    :key="category.id"
                    class="border-t bg-gray-50 dark:bg-gray-800/50"
                  >
                    <td class="px-5 py-6 text-gray-900 dark:text-white">
                      {{ (currentPage - 1) * numericEntriesPerPage + index + 1 }}
                    </td>
                    <td class="px-5 py-6">
                      <input
                        type="checkbox"
                        v-model="selectedCategories"
                        :value="category.id"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
                               focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                               focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        @change="handleCategoryChange(category.id, $event)"
                      />
                    </td>
                    <td class="px-5 py-6 text-gray-900 dark:text-white">
                      {{ category.name }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div
              v-if="categories.length > 0"
              class="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 px-4 pb-1"
            >
              <div class="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                Showing
                <span class="font-semibold">{{ startItem }}</span>
                -
                <span class="font-semibold">{{ endItem }}</span>
                of
                <span class="font-semibold">{{ categories.length }}</span>
                records
              </div>

              <div class="flex items-center gap-2">
                <button
                  class="px-3 py-1.5 text-xs md:text-sm border rounded-lg
                         border-gray-300 dark:border-gray-600
                         text-gray-700 dark:text-gray-200
                         disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="currentPage === 1 || totalPages === 0"
                  @click="prevPage"
                >
                  Prev
                </button>

                <button
                  v-for="page in pageNumbers"
                  :key="page"
                  class="px-3 py-1.5 text-xs md:text-sm border rounded-lg"
                  :class="page === currentPage
                    ? 'border-primary text-primary font-semibold'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>

                <button
                  class="px-3 py-1.5 text-xs md:text-sm border rounded-lg
                         border-gray-300 dark:border-gray-600
                         text-gray-700 dark:text-gray-200
                         disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="currentPage === totalPages || totalPages === 0"
                  @click="nextPage"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/lib/axios'
import { toast } from 'vue3-toastify'

import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import BackArrowIcon from '@/icons/BackArrowIcon.vue'

interface Group {
  id: number
  name_group: string
  event_id: string
  status: string
}

interface Category {
  id: string
  name: string
}

const route = useRoute()
const router = useRouter()
const currentPageTitle = ref('Add Category Group Event')

const selectedGroup = ref('')
const groups = ref<Group[]>([])
const categories = ref<Category[]>([])
const selectedCategories = ref<string[]>([])

// pagination
const entriesPerPage = ref<number | string>(10)
const entriesOptions = ref([5, 10, 25, 50])
const currentPage = ref(1)

// ambil id user & eventId dari route user
// path: "/:id/event/add-category-group-event?eventId=xxx"
const userId = computed(() => route.params.id as string | undefined)
const eventId = computed(() => route.query.eventId as string | undefined)

// breadcrumbs versi user
const breadcrumbs = computed(() => {
  const uid = userId.value
  const eid = eventId.value

  return [
    {
      text: 'Home',
      to: uid ? `/${uid}` : '/',
    },
    {
      text: 'Event',
      to: uid ? `/${uid}/event` : '/event',
    },
    {
      text: 'Event Detail',
      to: uid && eid ? `/${uid}/event/detail/${eid}` : undefined,
    },
    {
      text: 'Add Category Group Event',
      active: true,
    },
  ]
})

// pastikan entriesPerPage selalu number
const numericEntriesPerPage = computed(() => {
  const n = Number(entriesPerPage.value)
  return Number.isNaN(n) || n <= 0 ? 10 : n
})

const totalPages = computed(() => {
  if (categories.value.length === 0) return 0
  return Math.ceil(categories.value.length / numericEntriesPerPage.value)
})

const paginatedCategories = computed(() => {
  if (categories.value.length === 0) return []
  const start = (currentPage.value - 1) * numericEntriesPerPage.value
  const end = start + numericEntriesPerPage.value
  return categories.value.slice(start, end)
})

// info "Showing X–Y of Z"
const startItem = computed(() => {
  if (categories.value.length === 0) return 0
  return (currentPage.value - 1) * numericEntriesPerPage.value + 1
})

const endItem = computed(() => {
  if (categories.value.length === 0) return 0
  const end = currentPage.value * numericEntriesPerPage.value
  return end > categories.value.length ? categories.value.length : end
})

// page numbers
const pageNumbers = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages.value; i += 1) {
    pages.push(i)
  }
  return pages
})

const isAllSelected = computed(
  () =>
    selectedCategories.value.length === categories.value.length &&
    categories.value.length > 0
)

const toggleAll = () => {
  if (isAllSelected.value) {
    selectedCategories.value = []
  } else {
    selectedCategories.value = categories.value.map(cat => cat.id)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// 🡒 GO BACK versi USER
const goBack = () => {
  const uid = userId.value
  const eid = eventId.value

  if (uid && eid) {
    // balik ke detail event user
    router.push({
      name: 'UserDetailEvent',
      params: { id: uid, eventId: eid },
    })
  } else if (uid) {
    // fallback: ke list event user
    router.push({ name: 'UserEvent', params: { id: uid } })
  } else {
    // fallback paling aman
    router.push('/login')
  }
}

const fetchGroups = async () => {
  try {
    const eid = eventId.value
    if (!eid) {
      toast.error('Event ID not found')
      return
    }
    const response = await axios.get(`/events/${eid}/group-scans`)
    groups.value = response.data as Group[]
  } catch (error) {
    console.error('Error fetching groups:', error)
    toast.error('Failed to load groups')
  }
}

const fetchCategories = async () => {
  try {
    const eid = eventId.value
    if (!eid) {
      toast.error('Event ID not found')
      return
    }
    const response = await axios.get(`/events/${eid}/categories`)
    categories.value = (response.data as { categories: Category[] }).categories

    // pastikan currentPage valid
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    toast.error('Failed to load categories')
  }
}

const fetchGroupCategories = async (groupId: string) => {
  try {
    const eid = eventId.value
    if (!eid || !groupId) return

    const response = await axios.get(
      `/events/${eid}/group-scans/${groupId}/group-categories`
    )
    const groupCategories = response.data as { event_category_id: string }[]
    selectedCategories.value = groupCategories.map(gc => gc.event_category_id)
  } catch (error) {
    console.error('Error fetching group categories:', error)
    selectedCategories.value = []
  }
}

const handleGroupChange = async () => {
  if (selectedGroup.value) {
    await fetchGroupCategories(selectedGroup.value)
  } else {
    selectedCategories.value = []
  }
}

const handleCategoryChange = async (categoryId: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const isChecked = target.checked

  if (!selectedGroup.value) {
    toast.error('Please select a group first')
    target.checked = false
    return
  }

  try {
    const eid = eventId.value as string
    if (isChecked) {
      // Add category to group
      await axios.post(
        `/events/${eid}/group-scans/${selectedGroup.value}/group-categories`,
        {
          eventCategoryId: categoryId,
        }
      )
      toast.success('Category added to group')
    } else {
      // Remove category from group
      await axios.delete(
        `/events/${eid}/group-scans/${selectedGroup.value}/group-categories/${categoryId}`
      )
      toast.success('Category removed from group')
    }
  } catch (error) {
    console.error('Error updating category:', error)
    toast.error('Failed to update category')

    // Revert checkbox state + selectedCategories
    target.checked = !isChecked
    const index = selectedCategories.value.indexOf(categoryId)
    if (isChecked && index === -1) {
      selectedCategories.value.push(categoryId)
    } else if (!isChecked && index !== -1) {
      selectedCategories.value.splice(index, 1)
    }
  }
}

onMounted(() => {
  fetchGroups()
  fetchCategories()
})

// reset page kalau entriesPerPage berubah
watch(entriesPerPage, () => {
  currentPage.value = 1
})

// pastikan currentPage valid kalau jumlah categories berubah
watch(
  () => categories.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  }
)
</script>
