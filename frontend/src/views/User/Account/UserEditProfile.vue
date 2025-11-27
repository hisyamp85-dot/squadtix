<template>
  <AdminLayout>
    <div class="px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <!-- Header + breadcrumb sederhana -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Profile
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update informasi akun Anda.
          </p>
        </div>

        <button
          type="button"
          @click="goBack"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/5"
        >
          <svg
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.25 5L7.5 8.75L11.25 12.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Back
        </button>
      </div>

      <!-- Card form -->
      <div
        class="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm
               dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 lg:p-8"
      >
        <form @submit.prevent="saveProfile" class="space-y-8">
          <!-- Info akun -->
          <section>
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Account Information
            </h2>

            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div class="lg:col-span-2">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm
                         text-gray-900 placeholder:text-gray-400
                         focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100
                         dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  required
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  v-model="form.username"
                  type="text"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm
                         text-gray-900 placeholder:text-gray-400
                         focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100
                         dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  required
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm
                         text-gray-900 placeholder:text-gray-400
                         focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100
                         dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  required
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <input
                  v-model="form.role"
                  type="text"
                  class="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm
                         text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white/80"
                  disabled
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  v-model="form.status"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm
                         text-gray-900
                         focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100
                         dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </section>

          <!-- Password -->
          <section>
            <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Change Password
            </h2>
            <p class="mb-4 text-xs text-gray-500 dark:text-gray-400">
              Leave blank if you do not want to change your password.
            </p>

            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  v-model="form.password"
                  type="password"
                  autocomplete="new-password"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm
                         text-gray-900 placeholder:text-gray-400
                         focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100
                         dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  v-model="form.passwordConfirmation"
                  type="password"
                  autocomplete="new-password"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm
                         text-gray-900 placeholder:text-gray-400
                         focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100
                         dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
            </div>
          </section>

          <!-- Actions -->
          <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              @click="goBack"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5
                     text-sm font-medium text-gray-700 hover:bg-gray-50
                     dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5
                     sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium
                     text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60
                     sm:w-auto"
            >
              <span v-if="!isSaving">Save Changes</span>
              <span v-else>Saving...</span>
            </button> 
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import api from '@/lib/axios'
import { toast } from 'vue3-toastify'

interface User {
  id: number
  name: string
  username: string
  email: string
  role: string
  status: string
  password?: string
}

interface EditForm {
  name: string
  username: string
  email: string
  role: string
  status: string
  password: string
  passwordConfirmation: string
}

const router = useRouter()
const user = ref<User | null>(null)
const isSaving = ref(false)

const form = ref<EditForm>({
  name: '',
  username: '',
  email: '',
  role: '',
  status: 'Active',
  password: '',
  passwordConfirmation: ''
})

const loadCurrentUser = async () => {
  try {
    const stored = localStorage.getItem('user')
    if (!stored) {
      // kalau tidak ada user di localStorage, arahkan ke login (opsional)
      // router.push('/login')
      return
    }

    const parsed = JSON.parse(stored) as User
    if (!parsed.id) return

    const resp = await api.get(`/users/${parsed.id}`)
    const data = resp.data as User
    user.value = data

    form.value = {
      name: data.name || '',
      username: data.username || '',
      email: data.email || '',
      role: data.role || '',
      status: data.status || 'Active',
      password: '',
      passwordConfirmation: ''
    }
  } catch (error) {
    console.error('Failed to load profile for edit:', error)
    toast.error('Gagal memuat data profil')
  }
}

const goBack = () => {
  const stored = localStorage.getItem('user')
  if (!stored) return router.push('/login')

  const parsed = JSON.parse(stored)
  // jika role User → redirect ke /:id/profile
  if (parsed.role === 'User') {
    router.push(`/${parsed.id}/profile`)
  } else {
    // jika admin → arahkan ke /profile biasa
    router.push('/profile')
  }
}


const saveProfile = async () => {
  if (!user.value) return

  if (form.value.password || form.value.passwordConfirmation) {
    if (form.value.password !== form.value.passwordConfirmation) {
      toast.error('Password confirmation does not match')
      return
    }
  }

  try {
    isSaving.value = true

    const payload: Partial<User> & { status?: string } = {
      name: form.value.name,
      username: form.value.username,
      email: form.value.email,
      role: form.value.role,
      status: form.value.status
    }

    if (form.value.password) {
      payload.password = form.value.password
    }

    const resp = await api.put(`/users/${user.value.id}`, payload)
    const updated = resp.data as User

    user.value = updated

    // update localStorage supaya sinkron dengan sesi login
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: updated.id,
        name: updated.name,
        username: updated.username,
        email: updated.email,
        role: updated.role,
        status: updated.status
      })
    )

    toast.success('Profile updated successfully')
    router.push('/profile')
  } catch (error) {
    console.error('Failed to update profile:', error)
    toast.error('Failed to update profile')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadCurrentUser()
})
</script>
