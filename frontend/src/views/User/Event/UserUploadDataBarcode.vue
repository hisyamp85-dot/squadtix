<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-80"
    :class="isExpanded || isHovered ? 'lg:left-[290px]' : 'lg:left-[90px]'"
  >
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
      <h2 class="text-lg font-bold mb-4">Upload Data Barcode (CSV)</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Upload Box -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">
            Import File (Format
            <span class="text-blue-600 cursor-pointer underline" @click="downloadTemplate">
              Klik Disini
            </span>)
          </label>
          <label class="block text-sm font-medium mb-2">Select CSV File</label>

          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            :class="{ 'border-blue-500 bg-blue-50': isDragOver }"
            @dragover.prevent="isDragOver = true"
            @dragleave="isDragOver = false"
            @drop.prevent="handleDrop"
          >
            <!-- No File Selected -->
            <div v-if="!selectedFile" class="space-y-2">
              <UploadIcon class="w-8 h-8 text-gray-400 mx-auto" />
              <p class="text-gray-600">Drag and drop your CSV file here, or click to select</p>

              <input
                type="file"
                accept=".csv"
                @change="handleFileSelect"
                class="hidden"
                ref="fileInput"
              />

              <button
                type="button"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                @click="triggerFileInput"
              >
                Choose File
              </button>
            </div>

            <!-- File Selected -->
            <div v-else class="space-y-2">
              <SuccessIcon class="w-8 h-8 text-green-500 mx-auto" />
              <p class="text-gray-800 font-medium">{{ selectedFile?.name }}</p>
              <p class="text-sm text-gray-600">
                {{ selectedFile ? (selectedFile.size / 1024).toFixed(2) : 0 }} KB
              </p>
              <p class="text-sm text-gray-600">{{ rowCount }} data rows</p>

              <button
                type="button"
                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                @click="removeFile"
              >
                Remove File
              </button>
            </div>
          </div>
        </div>

        <!-- Error Box -->
        <div
          v-if="errorMessage"
          class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
        >
          {{ errorMessage }}
        </div>

        <!-- Buttons -->
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
            :disabled="!selectedFile || isUploading"
          >
            {{ isUploading ? "Uploading..." : "Upload" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSidebar } from "@/composables/useSidebar";
import { useRoute } from "vue-router";
import UploadIcon from "@/icons/UploadIcon.vue";
import SuccessIcon from "@/icons/SuccessIcon.vue";
import api from "@/lib/axios";
import { toast } from "vue3-toastify";

interface Props {
  show: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "submit"]);

const { isExpanded, isHovered } = useSidebar();

const selectedFile = ref<File | null>(null);
const isDragOver = ref(false);
const errorMessage = ref("");
const isUploading = ref(false);
const rowCount = ref(0);

const route = useRoute();
const eventId = computed(() => (route.query.eventId as string) || "1");

/* Reset when modal opened */
watch(
  () => props.show,
  (v) => {
    if (v) {
      selectedFile.value = null;
      isDragOver.value = false;
      errorMessage.value = "";
      isUploading.value = false;
      rowCount.value = 0;
    }
  }
);

function handleFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) validateAndSetFile(file);
}

function handleDrop(e: DragEvent) {
  isDragOver.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) validateAndSetFile(file);
}

function validateAndSetFile(file: File) {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    errorMessage.value = "Please select a valid CSV file.";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = "File size must be less than 10MB.";
    return;
  }

  selectedFile.value = file;
  errorMessage.value = "";
  calculateRowCount(file);
}

function calculateRowCount(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    if (text) {
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      rowCount.value = lines.length > 1 ? lines.length - 1 : 0;
    }
  };
  reader.readAsText(file);
}

function removeFile() {
  selectedFile.value = null;
  errorMessage.value = "";
  rowCount.value = 0;
}

function triggerFileInput() {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  fileInput?.click();
}

/* USER TEMPLATE → lebih simple */
function downloadTemplate() {
  const csvContent = `id_transaction,qrcode,name,instansi,provinsi,kota,jabatan,no_hp,email,ukuran_jaket,status_kehadiran,tanggal_kehadiran,other_data\nTIX-123ABC,ABC123,test1,Bawaslu RI,DKI Jakarta,Jakarta,Ketua,08123456789,test1@example.com,XL,hadir,2025-12-09,Reguler\nTIX-456DEF,DEF456,test2,Bawaslu Provinsi,Jawa Barat,Bandung,Sekretaris,08987654321,test2@example.com,L,tidak_hadir,,VIP\n`
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'templatebarcode.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function handleSubmit() {
  if (!selectedFile.value || isUploading.value) return

  isUploading.value = true
  errorMessage.value = '' // Clear any previous error messages

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await api.post(`/events/${eventId.value}/categories/${route.query.event_category_id}/qrcodes/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    toast.success((response.data as { message: string }).message)
    emit('submit')
    // Don't close modal here - let parent handle it
  } catch (error: unknown) {
    console.error('Upload failed:', error)
    const err = error as { response?: { data?: { error?: string } } }
    const message = err.response?.data?.error || 'Upload failed'
    errorMessage.value = message
    toast.error(message)
  } finally {
    isUploading.value = false
  }
}
</script>
