<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-80"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative max-h-[60vh] overflow-y-auto">
      <h2 class="text-lg font-bold mb-4">Add Barcode Manually</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="block text-sm font-medium">Id Transaction</label>
          <input
            v-model="formData.id_transaction"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium">Barcode</label>
          <input
            v-model="formData.qrcode"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium">Name</label>
          <input
            v-model="formData.name"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium">Instansi</label>
          <select
            v-model="formData.instansi"
            class="w-full border rounded p-2"
            required
          >
            <option disabled value="">Pilih Instansi</option>
            <option value="Bawaslu RI">Bawaslu RI</option>
            <option value="Bawaslu Provinsi">Bawaslu Provinsi</option>
            <option value="Bawaslu Kab/kota">Bawaslu Kab/kota</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium">Provinsi</label>
          <input
            v-model="formData.provinsi"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium">Kabupaten/Kota</label>
          <input
            v-model="formData.kota"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Jabatan</label>
          <input
            v-model="formData.jabatan"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Ho Handphone</label>
          <input
            v-model="formData.no_hp"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Email</label>
          <input
            v-model="formData.email"
            type="text"
            class="w-full border rounded p-2"
            required
          />
        </div>



        <div class="mb-3">
          <label class="block text-sm font-medium">Ukuran Baju</label>
          <select
            v-model="formData.ukuran_jaket"
            class="w-full border rounded p-2"
            required
          >
            <option disabled value="">Pilih Ukuran Baju</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="XXXL">XXXL</option>
            <option value="L">XXXXL</option>
            <option value="XL">XXXXXL</option>
            <option value="XXL">XXXXXXL</option>
            <option value="XXXL">XXXXXXXL</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Status Kehadiran</label>
          <select
            v-model="formData.status_kehadiran"
            class="w-full border rounded p-2"
            required
          >
            <option disabled value="">Pilih Status Kehadiran</option>
            <option value="hadir">Hadir</option>
            <option value="tidak_hadir">Tidak Hadir</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Tanggal Kehadiran</label>
          <div class="relative">
            <flat-pickr
              v-model="formData.tanggal_kehadiran"
              :config="flatpickrConfig"
              class="w-full border rounded p-2"
              placeholder="Pilih tanggal kehadiran"
            />
            <span
              class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
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
                  d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.99984V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                  fill=""
                />
              </svg>
            </span>
          </div>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium">Other Data</label>
          <input
            v-model="formData.other_data"
            type="text"
            class="w-full border rounded p-2"
          />
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button
            type="button"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import { toast } from 'vue3-toastify'
import api from '@/lib/axios'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

interface BarcodeForm {
  id_transaction: string
  qrcode: string
  name: string
  instansi: string
  provinsi: string | null
  kota: string
  jabatan: string | null
  email: string
  no_hp: string
  ukuran_jaket: string
  status_kehadiran: string
  tanggal_kehadiran: string | null
  other_data: string | null
}

interface Props {
  show: boolean
  eventId: string
  eventCategoryId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [formData: BarcodeForm]
}>()

const { isExpanded, isHovered } = useSidebar()

const formData = ref<BarcodeForm>({
  id_transaction: '',
  qrcode: '',
  name: '',
  instansi: '',
  provinsi: null,
  kota: '',
  jabatan: null,
  email: '',
  no_hp: '',
  ukuran_jaket: '',
  status_kehadiran: '',
  tanggal_kehadiran: null,
  other_data: null
})

const flatpickrConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y',
  wrap: true,
}

async function handleSubmit() {
  try {
    const response = await api.post(`/events/${props.eventId}/categories/${props.eventCategoryId}/qrcodes`, formData.value)
    toast.success((response.data as unknown as { message: string }).message || 'Barcode added successfully')
    emit('submit', formData.value)
    emit('close')
  } catch (error: unknown) {
    console.error('Failed to add barcode:', error)
    const err = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
    const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to add barcode'
    toast.error(message)
  }
}
</script>
