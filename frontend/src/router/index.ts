import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    // =========================
    // ROOT — ROLE BASED ENTRY
    // =========================
    {
      path: '/',
      name: 'Root',
      component: () => import('../views/RoleHome.vue'),
      meta: { title: 'Dashboard' },
    },


    // =========================
    // AUTH
    // =========================
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login/Login.vue'),
      meta: { title: 'Login' },
    },

    // =========================
    // ADMIN AREA
    // =========================
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: () =>
        import('../views/Admin/Dashboard/DashboardAdmin.vue'),
      meta: { role: 'admin', title: 'Dashboard Admin' },
    },
    {
      path: '/admin/user',
      name: 'AdminUser',
      component: () =>
        import('../views/Admin/User/UserAccount.vue'),
      meta: { role: 'admin', title: 'User Account' },
    },
    {
      path: '/admin/event',
      name: 'AdminEvent',
      component: () =>
        import('../views/Admin/Event/AdminEvent.vue'),
      meta: { role: 'admin', title: 'Event' },
    },
    {
      path: '/admin/event/detail/:id',
      name: 'AdminEventDetail',
      component: () =>
        import('../views/Admin/Event/DetailEvent.vue'),
      meta: { role: 'admin', title: 'Detail Event' },
    },
    {
      path: '/admin/profile',
      name: 'AdminProfile',
      component: () =>
        import('../views/Others/UserProfile.vue'),
      meta: { role: 'admin', title: 'Profile' },
    },

    // =========================
    // USER AREA (NO ID!)
    // =========================
    {
      path: '/dashboard',
      name: 'UserDashboard',
      component: () =>
        import('../views/User/DashboardUser.vue'),
      meta: { role: 'user', title: 'Dashboard User' },
    },
    {
      path: '/profile',
      name: 'UserProfile',
      component: () =>
        import('../views/Others/UserProfileUser.vue'),
      meta: { role: 'user', title: 'Profile' },
    },
    {
      path: '/event',
      name: 'UserEvent',
      component: () =>
        import('../views/User/Event/UserEvent.vue'),
      meta: { role: 'user', title: 'Event' },
    },

    // =========================
    // SCANNER AREA
    // =========================
 

    {
      path: '/scanner',
      name: 'ScannerHome',
      component: () => import('@/views/Scanner/ScannerHome.vue'),
      meta: {
        title: 'Scanner',
        role: 'scanner',
      }
    },

    // =========================
    // FALLBACK
    // =========================
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () =>
        import('../views/Errors/FourZeroFour.vue'),
      meta: { title: 'Not Found' },
    },
  ],
})

/* =========================
   GLOBAL ROUTE GUARD
========================= */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const publicRoutes = ['/login']

  // 1️⃣ BELUM LOGIN → LOGIN
  if (!token && !publicRoutes.includes(to.path)) {
    return next('/login')
  }

  // 2️⃣ ROOT TAPI ROLE TIDAK ADA / RUSAK
  if (to.path === '/' && !role) {
    return next('/login')
  }

  // 3️⃣ SUDAH LOGIN TAPI KE LOGIN
  if (token && to.path === '/login') {
    return next('/')
  }

  // 4️⃣ ROLE TIDAK SESUAI ROUTE
  if (to.meta.role && to.meta.role !== role) {
    return next('/')
  }

  // 5️⃣ SET TITLE
  document.title = `${to.meta.title || 'SquadTix'} — SquadTix`
  next()
})


export default router
