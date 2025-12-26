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
      path: '/admin/event/group-event',
      name: 'AdminGroupEvent',
      component: () =>
        import('../views/Admin/Event/GroupEvent.vue'),
      meta: { role: 'admin', title: 'Group Event' },
    },
    {
      path: '/admin/event/add-category-group-event',
      name: 'AdminAddCategoryGroupEvent',
      component: () =>
        import('../views/Admin/Event/AddNewCategoryGroupEvent.vue'),
      meta: { role: 'admin', title: 'Add Category Group Event' },
    },
    {
      path: '/admin/event/redeem',
      name: 'AdminRedeemTicket',
      component: () =>
        import('../views/Admin/Event/RedeemTicket.vue'),
      meta: { role: 'admin', title: 'Redeem Ticket' },
    },
    {
      path: '/admin/event/upload-barcode',
      name: 'AdminUploadBarcode',
      component: () =>
        import('../views/Admin/Event/UploadBarcode.vue'),
      meta: { role: 'admin', title: 'Upload Barcode' },
    },
    {
      path: '/admin/profile',
      name: 'AdminProfile',
      component: () =>
        import('../views/Others/UserProfile.vue'),
      meta: { role: 'admin', title: 'Profile' },
    },
    {
      path: '/checkin',
      name: 'AdminCheckin',
      component: () =>
        import('../views/Admin/Event/CheckinScanner.vue'),
      meta: { role: 'admin', title: 'Check-in' },
    },
    {
      path: '/checkout',
      name: 'AdminCheckout',
      component: () =>
        import('../views/Admin/Event/CheckoutScanner.vue'),
      meta: { role: 'admin', title: 'Check-out' },
    },
    {
      path: '/report',
      name: 'AdminReport',
      component: () =>
        import('../views/Admin/Event/ReportAdminEvent.vue'),
      meta: { role: 'admin', title: 'Report' },
    },
    {
      path: '/checkin/logs',
      name: 'AdminCheckinLogs',
      component: () =>
        import('../views/Admin/Event/CheckinLogs.vue'),
      meta: { role: 'admin', title: 'Check-in Logs' },
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
    {
      path: '/user/event/detail/:id',
      name: 'UserDetailEvent',
      component: () =>
        import('../views/Admin/Event/DetailEvent.vue'),
      meta: { role: 'user', title: 'Event Detail' },
      alias: ['/user/event/detail/:eventId', '/user/detail/:eventId', '/:id/event/detail/:eventId'],
    },
    {
      path: '/user/event/group-event',
      name: 'UserGroupEvent',
      component: () =>
        import('../views/Admin/Event/GroupEvent.vue'),
      meta: { role: 'user', title: 'Group Event' },
    },
    {
      path: '/user/event/add-category-group-event',
      name: 'UserAddCategoryGroupEvent',
      component: () =>
        import('../views/Admin/Event/AddNewCategoryGroupEvent.vue'),
      meta: { role: 'user', title: 'Add Category Group Event' },
    },
    {
      path: '/user/event/redeem',
      name: 'UserRedeemTicket',
      component: () =>
        import('../views/Admin/Event/RedeemTicket.vue'),
      meta: { role: 'user', title: 'Redeem Ticket' },
    },
    {
      path: '/user/event/upload-barcode',
      name: 'UserUploadBarcode',
      component: () =>
        import('../views/Admin/Event/UploadBarcode.vue'),
      meta: { role: 'user', title: 'Upload Barcode' },
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

const normalizeApiBase = (raw?: string | null) => {
  const cleaned = (raw ?? window.location.origin).replace(/\/+$/, '')
  return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`
}

/* =========================
   GLOBAL ROUTE GUARD
========================= */
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const normalizeRole = (raw: unknown): string | null => {
    if (raw == null) return null
    const r = String(raw).toLowerCase().trim()
    if (['admin', 'administrator', 'superadmin'].includes(r)) return 'admin'
    return r
  }

  // Baca role yang paling andal dari localStorage
  const storedRole = localStorage.getItem('role')
  let role = normalizeRole(storedRole)
  if (!role) {
    try {
      const rawUser = localStorage.getItem('user')
      if (rawUser) {
        const parsed = JSON.parse(rawUser) as { role?: unknown }
        role = normalizeRole(parsed.role)
      }
    } catch {
      role = null
    }
  }

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

  // 4.1 Redirect user from /event to /user/event/detail/:id
  if (role === 'user' && to.path === '/event') {
    try {
      const rawUser = localStorage.getItem('user')
      const parsed = rawUser ? (JSON.parse(rawUser) as { event_id?: string | number; eventId?: string | number }) : null
      const eventId =
        parsed?.event_id ??
        parsed?.eventId ??
        localStorage.getItem('event_id') ??
        localStorage.getItem('eventId')
      if (eventId !== undefined && eventId !== null && String(eventId).trim() !== '') {
        return next(`/user/event/detail/${eventId}`)
      }
      const apiBase = normalizeApiBase(import.meta.env.VITE_API_URL as string | undefined)
      const authToken = localStorage.getItem('token') ?? localStorage.getItem('auth_token')
      const scheme = (localStorage.getItem('token_type') || 'Bearer').trim() || 'Bearer'
      if (authToken) {
        const response = await fetch(`${apiBase}/user/my-events`, {
          headers: {
            Accept: 'application/json',
            Authorization: `${scheme} ${authToken}`,
          },
        })
        if (response.ok) {
          const events = (await response.json()) as Array<{ event_id?: string | number }>
          const firstId = events?.[0]?.event_id
          if (firstId !== undefined && firstId !== null && String(firstId).trim() !== '') {
            return next(`/user/event/detail/${firstId}`)
          }
        }
      }
    } catch {
      // fall through to normal navigation
    }
  }

  // 5️⃣ SET TITLE
  document.title = `${to.meta.title || 'SquadTix'} — SquadTix`
  next()
})


export default router
