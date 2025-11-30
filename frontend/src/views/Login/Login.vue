<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="relative w-full max-w-5xl py-10">
      <!-- BACKGROUND DEKOR TIPIS + BLOBS -->
      <div class="pointer-events-none absolute inset-0 -z-10">
        <div
          class="absolute -top-20 -left-10 h-40 w-40 rounded-full bg-blue-200/60 blur-3xl animate-blob-slow"
        ></div>
        <div
          class="absolute -bottom-24 -right-10 h-48 w-48 rounded-full bg-sky-200/70 blur-3xl animate-blob-slow animation-delay-2000"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-100/70 blur-3xl animate-blob-slow animation-delay-4000"
        ></div>
      </div>

      <!-- GRID 2 BOX -->
      <div class="grid gap-6 lg:grid-cols-2 items-stretch">
        <!-- BOX KIRI: ANIMATED TEXT MINIMALIST -->
        <div
          class="card-brand relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-400 text-white shadow-xl flex items-center justify-center"
        >
          <!-- Glow lembut -->
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_transparent_70%)] opacity-80"
          ></div>

          <!-- Teks Animasi -->
          <div class="relative p-10 text-center">
            <h1
              class="animated-title text-3xl sm:text-4xl font-semibold tracking-wide text-white mb-4"
            >
              Welcome to
              <span
                class="bg-gradient-to-r from-white via-sky-100 to-blue-200 bg-clip-text text-transparent"
              >
                SquadTix
              </span>
            </h1>

            <p
              class="animated-subtitle text-base sm:text-lg text-white/90 font-light max-w-sm mx-auto"
            >
              A clean, modern gateway for smart ticketing and attendance.
            </p>
          </div>
        </div>

        <!-- BOX KANAN: LOGIN FORM -->
        <div
          class="card-login rounded-3xl bg-white shadow-xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-center"
        >
          <div class="mb-6 text-center">
            <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">
              Login to SquadTix
            </h2>
            <p class="mt-1 text-sm text-slate-500">
              Enter your username and password to access the dashboard.
            </p>

            <p
              v-if="errorMessage"
              class="mt-3 rounded-2xl border border-red-500/40 bg-red-50 px-3 py-2 text-xs text-red-600 text-left"
            >
              {{ errorMessage }}
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- USERNAME -->
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-slate-700 mb-1"
              >
                Username <span class="text-red-500">*</span>
              </label>
              <div
                class="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/50 px-3 transition-all duration-150
                       focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/15"
              >
                <span class="mr-2 text-slate-400">
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 10C11.7949 10 13.25 8.54493 13.25 6.75C13.25 4.95507 11.7949 3.5 10 3.5C8.20507 3.5 6.75 4.95507 6.75 6.75C6.75 8.54493 8.20507 10 10 10Z"
                      stroke="currentColor"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4.25 16.5C4.25 14.4289 6.05379 12.75 8.25 12.75H11.75C13.9462 12.75 15.75 14.4289 15.75 16.5"
                      stroke="currentColor"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <input
                  v-model="username"
                  type="text"
                  id="username"
                  name="username"
                  placeholder="your.name"
                  class="h-11 w-full border-none bg-transparent px-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <!-- PASSWORD -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-slate-700 mb-1"
              >
                Password <span class="text-red-500">*</span>
              </label>
              <div
                class="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/50 px-3 transition-all duration-150
                       focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/15"
              >
                <span class="mr-2 text-slate-400">
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3.5"
                      y="8.25"
                      width="13"
                      height="8.25"
                      rx="2"
                      stroke="currentColor"
                      stroke-width="1.3"
                    />
                    <path
                      d="M6.25 8.25V6.75C6.25 4.95507 7.70507 3.5 9.5 3.5H10.5C12.2949 3.5 13.75 4.95507 13.75 6.75V8.25"
                      stroke="currentColor"
                      stroke-width="1.3"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>

                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  class="h-11 w-full border-none bg-transparent px-1 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  required
                />

                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-slate-400
                         hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <svg
                    v-if="!showPassword"
                    class="w-4 h-4"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- BUTTON -->
            <div class="pt-1">
              <button
                type="submit"
                class="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500
                       px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30
                       transition-transform duration-150 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99]
                       focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                Login
              </button>
              <p class="mt-3 text-center text-[11px] text-slate-500">
                For internal SquadTix users only
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')

type NormalizedRole = 'admin' | 'user' | 'panitia'

interface LoginUser {
  id: number | string
  role: NormalizedRole
  [key: string]: any
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

function normalizeRole(rawRole: any): NormalizedRole {
  if (rawRole == null) {
    return 'user'
  }

  if (typeof rawRole === 'number') {
    if (rawRole === 1) return 'admin'
    if (rawRole === 2) return 'panitia'
    return 'user'
  }

  const r = String(rawRole).toLowerCase().trim()

  if (['admin', 'administrator', 'superadmin'].includes(r)) {
    return 'admin'
  }

  if (['panitia', 'staff', 'operator'].includes(r)) {
    return 'panitia'
  }

  // default: user
  return 'user'
}

const handleSubmit = async () => {
  errorMessage.value = ''
  try {
    const res = await api.post('/users/login', {
      username: username.value,
      password: password.value,
    })

    const data: any = res.data ?? {}

    // Ambil user dari beberapa kemungkinan bentuk response
    const rawUser: any = data.user ?? data.data?.user ?? data

    const rawRole =
      rawUser.role ??
      rawUser.role_name ??
      rawUser.role_id ??
      rawUser.group

    const normalizedRole = normalizeRole(rawRole)

    const user: LoginUser = {
      ...rawUser,
      role: normalizedRole,
    }

    localStorage.setItem('user', JSON.stringify(user))

    // Routing berdasarkan role sudah dinormalisasi
    if (user.role === 'admin' || user.role === 'panitia') {
      await router.push('/')
    } else if (user.role === 'user') {
      await router.push(`/${user.id}`)
    } else {
      // ini hampir nggak kepakai karena normalizeRole selalu return salah satu di atas
      errorMessage.value = 'Role tidak dikenali, silakan hubungi admin.'
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Login gagal. Periksa username / password Anda.'
    errorMessage.value = message
  }
}
</script>

<style scoped>
/* blob background animation */
@keyframes blobSlow {
  0%,
  100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(14px, -10px) scale(1.05);
  }
  66% {
    transform: translate(-10px, 16px) scale(0.97);
  }
}

.animate-blob-slow {
  animation: blobSlow 20s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* card entrance */
@keyframes cardInRight {
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.97);
  }
  60% {
    opacity: 1;
    transform: translateY(0) scale(1.02);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

@keyframes cardInLeft {
  0% {
    opacity: 0;
    transform: translateY(-12px) translateX(-14px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
}

.card-login {
  animation: cardInRight 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.card-brand {
  animation: cardInLeft 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

/* Animated text kiri */
.animated-title {
  opacity: 0;
  animation: fadeSlideUp 0.9s ease-out forwards;
}

.animated-title span {
  animation: shineText 3s ease-in-out infinite alternate;
}

.animated-subtitle {
  opacity: 0;
  animation: fadeSlideUp 1.2s ease-out forwards;
}

@keyframes fadeSlideUp {
  0% {
    opacity: 0;
    transform: translateY(16px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* subtle shimmer / letter spacing */
@keyframes shineText {
  0% {
    filter: brightness(1);
    letter-spacing: 0px;
  }
  100% {
    filter: brightness(1.35);
    letter-spacing: 1px;
  }
}
</style>
