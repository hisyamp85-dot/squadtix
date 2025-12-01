<template>
  <AdminLayout>
    <PageBreadcrumb
      :pageTitle="currentPageTitle"
      :breadcrumbs="[
        { text: 'Home', to: '/' },
        { text: 'Event', to: '/event' },
        { text: 'Event Detail', active: true }
      ]"
    />
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7
             dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="mb-5 lg:mb-7">
        <div class="flex items-center gap-4 mb-3">
          <button @click="goBack" class="px-4 py-2 flex items-center gap-2">
            <BackArrowIcon class="dark:text-white" />
          </button>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
            Event {{ event?.name }}
          </h3>
        </div>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5
               dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
      >
        <!-- TOP BAR: BUTTONS + SHOW ENTRIES -->
        <div class="flex flex-wrap items-center justify-between mb-4 pt-4 pr-4 pl-4 gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <Button
              class="btn btn-primary"
              size="sm"
              variant="primary"
              :startIcon="PlusIcon"
              @click="showAddForm = true"
            >
              Add New Category
            </Button>

            <Button
              class="btn btn-primary"
              size="sm"
              variant="primary"
              :startIcon="PlusIcon"
              @click="goToGroupEvent"
            >
              Add Group Event
            </Button>

            <Button
              class="btn btn-primary"
              size="sm"
              variant="primary"
              :startIcon="PlusIcon"
              @click="goToCategoryGroupEvent"
            >
              Add Category Group Event
            </Button>

            <Button
              class="btn btn-primary"
              size="sm"
              variant="primary"
              :startIcon="PlusIcon"
              @click="goToRedeem"
            >
              Redeem
            </Button>
          </div>

          <div class="flex items-center gap-2">
            <label for="entries" class="text-gray-700 dark:text-gray-300">Show</label>
            <select
              id="entries"
              v-model="entriesPerPage"
              class="border border-gray-300 rounded px-2 py-1
                     dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option v-for="option in entriesOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <span class="text-gray-700 dark:text-gray-300">entries</span>
          </div>
        </div>

        <!-- TABLE -->
        <div class="max-w-full overflow-x-auto p-4">
          <table class="min-w-full border border-separate border-spacing-y-2">
            <thead>
              <tr class="border-b">
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">No</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Category Name</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Entry Amount</th>
                <th class="px-5 py-3 text-left text-gray-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="paginatedEvents.length === 0"
                class="bg-gray-50 dark:bg-gray-800/50"
              >
                <td
                  colspan="4"
                  class="px-5 py-6 text-center text-gray-500 dark:text-gray-300"
                >
                  No categories found.
                </td>
              </tr>

              <tr
                v-else
                v-for="(category, index) in paginatedEvents"
                :key="category.id"
                class="border-t bg-gray-50 dark:bg-gray-800/50"
              >
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ (currentPage - 1) * numericEntriesPerPage + index + 1 }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  {{ category.name }}
                </td>
                <td class="px-5 py-6 text-gray-900 dark:text-white">
                  <input
                    type="number"
                    min="0"
                    v-model.number="entryAmounts[category.id]"
                    @input="onEntryAmountInput(category)"
                    class="w-20 p-1 border rounded text-center dark:bg-gray-700 dark:text-white"
                  />
                </td>
                <td class="px-5 py-6">
                  <div class="flex items-center gap-2">
                    <!-- Upload Barcode Button -->
                    <button
                      aria-label="Upload Barcode"
                      class="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600
                             dark:bg-blue-600 dark:hover:bg-blue-700 transition rounded-md flex items-center gap-1.5"
                      @click="uploadBarcode(category.name)"
                    >
                      <UploadIcon class="w-4 h-4" />
                      Upload Barcode
                    </button>

                    <!-- Manage Dropdown Button -->
                    <div class="relative">
                      <button
                        @click="toggleDropdown(index)"
                        class="px-3 py-1.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600
                               dark:bg-green-600 dark:hover:bg-green-700 transition rounded-md flex items-center gap-1.5"
                        aria-label="Manage"
                      >
                        <SettingsIcon class="w-4 h-4 dark:text-white" />
                        Manage
                        <ChevronDownIcon class="w-4 h-4 dark:text-white" />
                      </button>

                      <!-- Dropdown Menu -->
                      <div
                        v-if="openDropdownIndex === index"
                        class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg
                               border border-gray-200 dark:border-gray-700 z-10"
                      >
                        <button
                          @click="editCategory(category.name); closeDropdown()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300
                                 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 rounded-t-lg"
                        >
                          Edit
                        </button>
                        <button
                          @click="deleteCategory(category.name); closeDropdown()"
                          class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400
                                 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 rounded-b-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGINATION: SAMA GAYA DENGAN CHECKIN LOGS -->
        <div
          v-if="categoryObjects.length > 0"
          class="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 px-4 pb-4"
        >
          <div class="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            Showing
            <span class="font-semibold">{{ startItem }}</span>
            -
            <span class="font-semibold">{{ endItem }}</span>
            of
            <span class="font-semibold">{{ categoryObjects.length }}</span>
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

        <!-- MODAL ADD CATEGORY -->
        <AddNewCategoryModal
          :show="showAddForm"
          :initial-form="form"
          @close="showAddForm = false"
          @submit="handleAddCategory"
        />

        <!-- MODAL EDIT CATEGORY -->
        <EditCategoryModal
          :show="showEditForm"
          :category="selectedCategory"
          :id="selectedCategoryId"
          :event-id="event?.id_event"
          @close="showEditForm = false"
          @save="handleEditCategory"
        />

        <!-- Confirmation Modal -->
        <div
          v-if="showConfirm"
          class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
        >
          <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Confirm Action</h3>
            <p class="text-gray-600 mb-6">{{ confirmMessage }}</p>
            <div class="flex justify-end gap-3">
              <button
                @click="cancelConfirm"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                @click="confirmAction"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter, type HistoryState } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { PlusIcon, UploadIcon, SettingsIcon, ChevronDownIcon } from '@/icons'
import Button from '@/components/ui/Button.vue'
import AddNewCategoryModal from '@/views/Admin/Event/AddNewCategory.vue'
import EditCategoryModal from '@/views/Admin/Event/EditCategory.vue'
import BackArrowIcon from '@/icons/BackArrowIcon.vue'
import api from '@/lib/axios'
import { toast } from 'vue3-toastify'

function isAxiosError(error: unknown): error is { response?: { data?: unknown }; message: string } {
  return typeof error === 'object' && error !== null && 'message' in error
}

interface EventForm extends HistoryState {
  id_event?: string
  name?: string
  categories: string[]
  status: string
  entry_amount?: number
}

interface Category {
  name: string
  id: string
  entry_amount?: number
}

const totalQrcodeCount = ref(0)

const route = useRoute()
const router = useRouter()
const { isExpanded, isHovered } = useSidebar()
const currentPageTitle = ref('Event Detail')
const event = ref<EventForm | null>(null)
const categoryObjects = ref<Category[]>([])
const entryAmounts = ref<Record<string, number>>({})
const showAddForm = ref(false)
const showEditForm = ref(false)
const selectedCategory = ref('')
const selectedCategoryId = ref('')
const form = ref<EventForm>({ categories: [], status: 'Active' })
const showConfirm = ref(false)
const confirmMessage = ref('')
const confirmCallback = ref<() => void>(() => {})

const entriesPerPage = ref<number | string>(10)
const currentPage = ref(1)
const entriesOptions = ref([5, 10, 20, 50])
const openDropdownIndex = ref<number | null>(null)

// Pastikan entriesPerPage selalu jadi number
const numericEntriesPerPage = computed(() => {
  const n = Number(entriesPerPage.value)
  return Number.isNaN(n) || n <= 0 ? 10 : n
})

const onEntryAmountInput = async (category: Category) => {
  if (!event.value) return

  const eventId = event.value.id_event
  const amount = entryAmounts.value[category.id] ?? 0

  try {
    await api.put(
      `/events/${eventId}/categories/${category.id}/entry-amount`,
      { entry_amount: amount }
    )
    // optional: kasih notifikasi kalau mau
    // toast.success('Entry amount updated')
  } catch (error) {
    console.error('Failed to update entry amount:', error)
    toast.error('Failed to update entry amount')
    // balik ke data server biar sinkron lagi (opsional)
    await fetchCategories()
  }
}


const toggleDropdown = (index: number) => {
  openDropdownIndex.value = openDropdownIndex.value === index ? null : index
}

const closeDropdown = () => {
  openDropdownIndex.value = null
}

const paginatedEvents = computed(() => {
  if (categoryObjects.value.length === 0) return []
  const start = (currentPage.value - 1) * numericEntriesPerPage.value
  return categoryObjects.value.slice(start, start + numericEntriesPerPage.value)
})

const totalPages = computed(() => {
  if (categoryObjects.value.length === 0) return 0
  return Math.ceil(categoryObjects.value.length / numericEntriesPerPage.value)
})

// Info "Showing X–Y of Z"
const startItem = computed(() => {
  if (categoryObjects.value.length === 0) return 0
  return (currentPage.value - 1) * numericEntriesPerPage.value + 1
})

const endItem = computed(() => {
  if (categoryObjects.value.length === 0) return 0
  const end = currentPage.value * numericEntriesPerPage.value
  return end > categoryObjects.value.length ? categoryObjects.value.length : end
})

// Page numbers ala checkin logs
const pageNumbers = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages.value; i += 1) {
    pages.push(i)
  }
  return pages
})

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

const fetchCategories = async () => {
  if (!event.value) return
  try {
    const response = await api.get(`/events/${route.params.id}/categories?t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }
    })
    console.log('fetchCategories called', response.data)

    const categories = (response.data as { categories: Category[] }).categories

    categoryObjects.value = [...categories]
    event.value.categories = categories.map(c => c.name)

entryAmounts.value = {}

categories.forEach(category => {
  entryAmounts.value[category.id] = category.entry_amount ?? 0
})


    // pastikan currentPage masih valid
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const handleAddCategory = async (eventData: EventForm) => {
  try {
    if (!event.value?.id_event) {
      alert('Event ID not found')
      return
    }

    const payload = {
      categories: eventData.categories,
      status: eventData.status || 'Active'
    }

    await api.post(`/events/${event.value.id_event}/categories`, payload)
    await fetchCategories()
    showAddForm.value = false
    form.value = { categories: [], status: 'Active' }

    toast.success('Categories added successfully!')
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to add categories:', error.response?.data || error.message)
      const data = error.response?.data
      const errorMsg =
        typeof data === 'object' && data !== null && 'error' in data
          ? String((data as { error: unknown }).error)
          : error.message
      toast.error('Failed to add categories: ' + errorMsg)
    } else {
      console.error('Unexpected error:', error)
      toast.error('Unexpected error')
    }
  }
}

const uploadBarcode = async (category: string) => {
  console.log('Upload barcode for category:', category)
  const categoryObj = categoryObjects.value.find(c => c.name === category)
  const categoryId = categoryObj ? categoryObj.id : ''

  try {
    const groupScansResponse = await api.get(`/events/${route.params.id}/group-scans`)
    const groupScansData = Array.isArray(groupScansResponse.data) ? groupScansResponse.data : []
    const hasGroupScans = groupScansData.length > 0

    const groupCategoriesResponse = await api.get(
      `/events/categories/${categoryId}/group-categories-count`
    )
    const groupCategoriesData = groupCategoriesResponse.data as { count: number }
    const hasGroupCategories = groupCategoriesData.count > 0

    if (!hasGroupScans || !hasGroupCategories) {
      toast.error('Please add Group Event and Category Group Event before uploading barcodes.')
      return
    }

    router.push({
      path: '/event/upload-barcode',
      query: { eventId: route.params.id, event_category_id: categoryId }
    })
  } catch (error) {
    console.error('Error checking prerequisites:', error)
    toast.error('Failed to check prerequisites for uploading barcodes.')
  }
}

const editCategory = (category: string) => {
  selectedCategory.value = category
  const categoryObj = categoryObjects.value.find(c => c.name === category)
  if (categoryObj) {
    selectedCategoryId.value = categoryObj.id
  }
  showEditForm.value = true
}

const handleEditCategory = async (newCategoryName: string) => {
  if (!event.value) return
  try {
    const categoryObj = categoryObjects.value.find(c => c.name === selectedCategory.value)
    if (!categoryObj) return

    await api.put(
      `/events/${event.value.id_event}/categories/${categoryObj.id}`,
      { categoryName: newCategoryName }
    )

    await fetchCategories()
    showEditForm.value = false
    selectedCategory.value = ''
    toast.success('Category updated successfully!')
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to update category:', error.response?.data || error.message)
      const data = error.response?.data
      const errorMsg =
        typeof data === 'object' && data !== null && 'error' in data
          ? String((data as { error: unknown }).error)
          : error.message
      toast.error('Failed to update category: ' + errorMsg)
    } else {
      console.error('Unexpected error:', error)
      toast.error('Unexpected error')
    }
  }
}

const deleteCategory = (category: string) => {
  confirmMessage.value = `Are you sure you want to delete category: ${category}?`
  confirmCallback.value = async () => {
    try {
      const categoryObj = categoryObjects.value.find(c => c.name === category)
      if (!categoryObj) return

      await api.delete(`/events/${event.value?.id_event}/categories/${categoryObj.id}`)
      await fetchCategories()
      toast.success('Category deleted successfully!')
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error('Failed to delete category:', error.response?.data || error.message)
        const data = error.response?.data
        const errorMsg =
          typeof data === 'object' && data !== null && 'error' in data
            ? String((data as { error: unknown }).error)
            : error.message
        toast.error('Failed to delete category: ' + errorMsg)
      } else {
        console.error('Unexpected error:', error)
        toast.error('Unexpected error')
      }
    }
  }
  showConfirm.value = true
}

const cancelConfirm = () => {
  showConfirm.value = false
  confirmMessage.value = ''
  confirmCallback.value = () => {}
}

const confirmAction = async () => {
  await confirmCallback.value()
  showConfirm.value = false
  confirmMessage.value = ''
  confirmCallback.value = () => {}
}

onMounted(async () => {
  if (route.params.id) {
    const eventData = history.state?.event as EventForm
    if (eventData) {
      event.value = { ...eventData, categories: [] }
      categoryObjects.value = []
      await fetchCategories()
      await fetchTotalQrcodes()
    } else {
      try {
        const response = await api.get(`/events/${route.params.id}`)
        const eventData = response.data as EventForm
        event.value = { ...eventData, categories: [] }
        await fetchCategories()
        await fetchTotalQrcodes()
      } catch (error) {
        console.error('Failed to fetch event:', error)
      }
    }
  }
})

// navigation helpers
const goBack = () => {
  router.push('/event')
}

const goToRedeem = () => {
  router.push({ path: '/event/redeem', query: { eventId: route.params.id } })
}

const goToGroupEvent = () => {
  router.push({ path: '/event/group-event', query: { eventId: route.params.id } })
}

const goToCategoryGroupEvent = () => {
  router.push({
    path: '/event/add-category-group-event',
    query: { eventId: route.params.id }
  })
}

const fetchTotalQrcodes = async () => {
  if (!event.value) return
  try {
    const response = await api.get(`/events/${route.params.id}/total-qrcodes`)
    totalQrcodeCount.value = (response.data as { totalQrcodes: number }).totalQrcodes
  } catch (error) {
    console.error('Failed to fetch total QR codes:', error)
  }
}

// reset ke page 1 kalau entriesPerPage berubah
watch(entriesPerPage, () => {
  currentPage.value = 1
})

// pastikan currentPage valid kalau jumlah kategori berubah
watch(
  () => categoryObjects.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  }
)
</script>
