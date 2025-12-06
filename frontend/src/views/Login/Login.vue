<template>
  <div
    class="page-animate min-h-screen flex items-center justify-center bg-slate-50 px-4"
  >
    <div class="relative w-full max-w-5xl py-10">
      <!-- GRID HALUS -->
      <div
        class="pointer-events-none absolute inset-6 -z-20 opacity-[0.15] [background-image:linear-gradient(to_right,#cbd5f533_1px,transparent_1px),linear-gradient(to_bottom,#cbd5f533_1px,transparent_1px)] bg-[length:26px_26px]"
      ></div>

      <!-- BLOBS ANIMASI -->
      <div class="pointer-events-none absolute inset-0 -z-10">
        <div
          class="absolute -top-24 -left-10 h-44 w-44 rounded-full bg-sky-300/60 blur-3xl animate-blob-slow"
        ></div>
        <div
          class="absolute -bottom-28 -right-10 h-52 w-52 rounded-full bg-blue-300/60 blur-3xl animate-blob-slow animation-delay-2000"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/60 blur-3xl animate-blob-slow animation-delay-4000"
        ></div>
      </div>

      <!-- GRID 2 KOLOM -->
      <div
        class="grid gap-6 lg:grid-cols-[minmax(0,_1.1fr)_minmax(0,_1fr)] items-stretch"
      >
        <!-- KIRI: BRAND + ANIMASI -->
        <div
          class="card-brand relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-100 via-slate-50 to-blue-100 shadow-xl"
        >
          <!-- GLOW -->
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_60%)]"
          ></div>

          <!-- SCAN LINE -->
          <div class="scan-line pointer-events-none"></div>

          <!-- ORBIT ANIMASI -->
          <div class="pointer-events-none absolute inset-0">
            <div class="orbit">
              <span class="orbit-dot orbit-dot-1"></span>
              <span class="orbit-dot orbit-dot-2"></span>
              <span class="orbit-dot orbit-dot-3"></span>
            </div>
          </div>

          <!-- PULSE RING DI BELAKANG TEKS -->
          <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div class="pulse-ring"></div>
          </div>

          <!-- CONTENT SINGKAT -->
          <div
            class="relative flex h-full flex-col items-center justify-center p-8 sm:p-10 gap-3"
          >
            <div
              class="floating-pill mb-4 inline-flex items-center rounded-full bg-white/80 px-4 py-2 shadow-sm border border-slate-200"
            >
              <span class="mr-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span
                class="text-[11px] font-medium tracking-[0.18em] text-sky-600 uppercase"
              >
                SquadTix
              </span>
            </div>

            <h1
              class="animated-title text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 text-center"
            >
              Smart
              <span
                class="animated-title-gradient bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
              >
                Ticketing
              </span>
            </h1>

            <p class="animated-subtitle text-sm text-slate-500 text-center">
              Scan. Check-in. Done.
            </p>

            <!-- BADGE STATUS ANIMASI -->
            <div
              class="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px]"
            >
              <div
                class="floating-chip inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 border border-slate-200 shadow-sm"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                <span class="text-slate-600">Live events</span>
              </div>
              <div
                class="floating-chip-delay inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 border border-slate-200 shadow-sm"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-slate-600">Secure access</span>
              </div>
            </div>
          </div>
        </div>

        <!-- KANAN: LOGIN -->
        <div
          class="card-login relative rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-7 shadow-2xl backdrop-blur"
          :class="{ 'shake-card': errorMessage }"
        >
          <!-- BORDER GRADIENT PULSE -->
          <div
            class="pointer-events-none absolute inset-[1px] rounded-[22px] border border-transparent bg-[conic-gradient(from_180deg_at_50%_50%,rgba(56,189,248,0.35),rgba(59,130,246,0.1),rgba(129,140,248,0.35),rgba(56,189,248,0.35))] opacity-60 animate-border-rotate mix-blend-screen"
          ></div>

          <div class="relative z-10">
            <div class="mb-6 text-center">
              <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">
                Login
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                SquadTix account only.
              </p>

              <transition name="fade-slide">
                <p
                  v-if="errorMessage"
                  class="mt-4 rounded-2xl border border-red-300/70 bg-red-50 px-3 py-2 text-xs text-red-600 text-left flex items-start gap-2"
                >
                  <span
                    class="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-[10px] font-semibold text-red-500"
                  >
                    !
                  </span>
                  <span>{{ errorMessage }}</span>
                </p>
              </transition>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- USERNAME -->
              <div class="field-float">
                <label
                  for="username"
                  class="block text-xs font-medium text-slate-700 mb-1"
                >
                  Username
                </label>
                <div
                  class="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 px-3 transition-all duration-200
                         focus-within:border-sky-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100"
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
              <div class="field-float field-float-delay">
                <label
                  for="password"
                  class="block text-xs font-medium text-slate-700 mb-1"
                >
                  Password
                </label>
                <div
                  class="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 px-3 transition-all duration-200
                         focus-within:border-sky-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100"
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
                           hover:bg-slate-100 hover:text-slate-700 transition-colors"
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
              <div class="pt-2">
                <button
                  type="submit"
                  :disabled="loading"
                  class="btn-login inline-flex w-full items-center justify-center rounded-2xl
                         px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30
                         focus:outline-none focus:ring-2 focus:ring-sky-400/70 disabled:opacity-70 disabled:cursor-wait relative overflow-hidden"
                >
                  <span
                    class="pointer-events-none absolute inset-0 opacity-0 login-ripple"
                  ></span>

                  <span v-if="!loading" class="flex items-center gap-2">
                    <span
                      class="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-400/30"
                    >
                      <span
                        class="absolute h-3 w-3 rounded-full bg-white/90 animate-ping-slow"
                      ></span>
                    </span>
                    <span>Login</span>
                  </span>

                  <span v-else class="flex items-center gap-2">
                    <span
                      class="h-4 w-4 animate-spin rounded-full border-[2px] border-sky-100 border-t-transparent"
                    ></span>
                    <span>Signing in…</span>
                  </span>
                </button>
              </div>

              <p class="text-center text-[11px] text-slate-400">
                Internal SquadTix only
              </p>
            </form>
          </div>
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
const loading = ref(false)

type NormalizedRole = 'admin' | 'user'

interface LoginUser {
  id: number | string
  role: NormalizedRole
  [key: string]: any
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

function normalizeRole(rawRole: unknown): NormalizedRole {
  const r = String(rawRole ?? '').toLowerCase().trim()

  if (['admin', 'administrator', 'superadmin'].includes(r)) {
    return 'admin'
  }
  return 'user'
}

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const res = await api.post('/users/login', {
      username: username.value,
      password: password.value,
    })

    const data: any = res.data ?? {}
    const rawUser: any = data.user ?? data.data?.user ?? data

    const rawRole =
      rawUser.role ?? rawUser.role_name ?? rawUser.role_id ?? rawUser.group

    const normalizedRole = normalizeRole(rawRole)

    const user: LoginUser = {
      ...rawUser,
      role: normalizedRole,
    }

    localStorage.setItem('user', JSON.stringify(user))

    if (user.role === 'admin') {
      await router.push('/')
    } else {
      await router.push(`/${user.id}`)
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Login gagal. Periksa username / password Anda.'
    errorMessage.value = message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* page fade-in */
@keyframes pageFadeIn {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.99);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.page-animate {
  animation: pageFadeIn 0.45s ease-out;
}

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
  animation: blobSlow 26s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}

/* orbit effect kiri */
.orbit {
  position: absolute;
  inset: 18% 10%;
  border-radius: 999px;
  border: 1px dashed rgba(148, 163, 184, 0.65);
  transform-style: preserve-3d;
  animation: orbitTilt 20s linear infinite;
}
.orbit-dot {
  position: absolute;
  height: 10px;
  width: 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.9);
  box-shadow: 0 0 0 8px rgba(56, 189, 248, 0.2);
}
.orbit-dot-1 {
  top: -5px;
  left: 16%;
}
.orbit-dot-2 {
  right: 10%;
  top: 50%;
}
.orbit-dot-3 {
  bottom: -5px;
  left: 35%;
}
@keyframes orbitTilt {
  0% {
    transform: rotateX(62deg) rotateZ(0deg);
  }
  50% {
    transform: rotateX(62deg) rotateZ(180deg);
  }
  100% {
    transform: rotateX(62deg) rotateZ(360deg);
  }
}

/* scan line di card kiri */
.scan-line {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  mix-blend-mode: screen;
  opacity: 0.7;
  transform: translateY(-100%);
  animation: scanMove 6s linear infinite;
}
@keyframes scanMove {
  0% {
    transform: translateY(-110%);
  }
  50% {
    transform: translateY(40%);
  }
  100% {
    transform: translateY(110%);
  }
}

/* pulse ring di tengah kiri */
.pulse-ring {
  width: 260px;
  height: 260px;
  border-radius: 999px;
  border: 1px solid rgba(59, 130, 246, 0.35);
  box-shadow: 0 0 40px rgba(56, 189, 248, 0.25);
  animation: pulseRing 4.8s ease-in-out infinite;
}
@keyframes pulseRing {
  0%,
  100% {
    transform: scale(0.9);
    opacity: 0.35;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
}

/* card entrance + floating */
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
@keyframes cardFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.card-login {
  animation:
    cardInRight 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) both,
    cardFloat 8s ease-in-out 0.7s infinite;
}
.card-brand {
  animation:
    cardInLeft 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) both,
    cardFloat 9s ease-in-out 1s infinite;
}

/* Floating elements */
@keyframes floatSlow {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}
.floating-pill {
  animation: floatSlow 4.8s ease-in-out infinite;
}
.floating-chip {
  animation: floatSlow 5.2s ease-in-out infinite;
}
.floating-chip-delay {
  animation: floatSlow 5.6s ease-in-out infinite;
}

/* Animated text kiri */
.animated-title {
  opacity: 0;
  animation: fadeSlideUp 0.8s ease-out forwards;
}
.animated-title-gradient {
  animation: shineText 3s ease-in-out infinite alternate;
}
.animated-subtitle {
  opacity: 0;
  animation: fadeSlideUp 1s ease-out forwards;
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

/* shimmer / letter spacing */
@keyframes shineText {
  0% {
    filter: brightness(1);
    letter-spacing: 0px;
    background-position: 0% 50%;
  }
  100% {
    filter: brightness(1.18);
    letter-spacing: 1px;
    background-position: 100% 50%;
  }
}

/* slow ping for icon */
@keyframes pingSlow {
  0% {
    transform: scale(0.7);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
.animate-ping-slow::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 1px solid rgba(248, 250, 252, 0.8);
  animation: pingSlow 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* field muncul sedikit delay */
.field-float {
  opacity: 0;
  animation: fadeSlideUp 0.7s ease-out 0.25s forwards;
}
.field-float-delay {
  animation-delay: 0.4s;
}

/* button gradient berjalan */
.btn-login {
  background-image: linear-gradient(
    90deg,
    #0ea5e9,
    #3b82f6,
    #6366f1,
    #0ea5e9
  );
  background-size: 250% 100%;
  transition:
    transform 150ms ease,
    filter 150ms ease,
    box-shadow 150ms ease,
    background-position 1s ease;
  animation: gradientMove 5s ease-in-out infinite;
}
.btn-login:hover:not(:disabled) {
  background-position: 100% 0;
}
@keyframes gradientMove {
  0% {
    background-position: 0% 0;
  }
  50% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0% 0;
  }
}

/* border conic rotate */
@keyframes borderRotate {
  0% {
    transform: rotate(0deg);
    opacity: 0.4;
  }
  50% {
    opacity: 0.9;
  }
  100% {
    transform: rotate(360deg);
    opacity: 0.4;
  }
}
.animate-border-rotate {
  animation: borderRotate 14s linear infinite;
}

/* error shake */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(3px);
  }
}
.shake-card {
  animation: shake 0.28s ease-in-out;
}

/* transition error message */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.18s ease-out;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ripple kecil (bisa dipicu manual kalau mau) */
.login-ripple {
  animation: loginRipple 1s ease-out;
}
@keyframes loginRipple {
  0% {
    opacity: 0.3;
    transform: scale(0.9);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}
</style>
