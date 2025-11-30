import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    // =========================
    //         ADMIN AREA
    // =========================
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Admin/Dashboard/DashboardAdmin.vue'),
      meta: {
        title: 'Dashboard',
        // tidak pakai layout: 'user' -> artinya ini area admin
      },
    },
    {
      path: '/user',
      name: 'User Account',
      component: () => import('../views/Admin/User/UserAccount.vue'),
      meta: {
        title: 'User Account',
      },
    },
    {
      path: '/groupuser',
      name: 'Group User',
      component: () => import('../views/Admin/User/UserAccountMemberUser.vue'),
      meta: {
        title: 'Group User',
      },
    },
    {
      path: '/event',
      name: 'AdminEvent',
      component: () => import('../views/Admin/Event/AdminEvent.vue'),
      meta: {
        title: 'AdminEvent',
      },
    },
    {
      path: '/event/detail/:id',
      name: 'DetailEvent',
      component: () => import('../views/Admin/Event/DetailEvent.vue'),
      meta: {
        title: 'Event Detail',
      },
    },
    {
      path: '/event/upload-barcode',
      name: 'UploadBarcode',
      component: () => import('../views/Admin/Event/UploadBarcode.vue'),
      meta: {
        title: 'Upload Barcode',
      },
    },
    {
      path: '/event/upload-data-barcode',
      name: 'UploadDataBarcode',
      component: () => import('../views/Admin/Event/UploadDataBarcode.vue'),
      meta: {
        title: 'Upload Data Barcode',
      },
    },
    {
      path: '/event/redeem',
      name: 'RedeemTicket',
      component: () => import('../views/Admin/Event/RedeemTicket.vue'),
      meta: {
        title: 'Redeem Ticket',
      },
    },
    {
      path: '/checkin',
      name: 'CheckinScanner',
      component: () => import('../views/Admin/Event/CheckinScanner.vue'),
      meta: {
        title: 'Check-in',
      },
    },
    {
      path: '/checkout',
      name: 'CheckoutScanner',
      component: () => import('@/views/Admin/Event/CheckoutScanner.vue'),
      meta: {
        requiresAuth: true,
        title: 'Check-out Barcode',
      },
    },
    {
      path: '/checkin/logs',
      name: 'CheckinLogs',
      component: () => import('../views/Admin/Event/CheckinLogs.vue'),
      meta: {
        title: 'Check-in Logs',
      },
    },
    {
      path: '/report',
      name: 'ReportAdminEvent',
      component: () => import('../views/Admin/Event/ReportAdminEvent.vue'),
      meta: {
        title: 'Report',
      },
    },
    {
      path: '/event/group-event',
      name: 'GroupEvent',
      component: () => import('../views/Admin/Event/GroupEvent.vue'),
      meta: {
        title: 'Group Event',
      },
    },
    {
      path: '/event/add-category-group-event',
      name: 'AddCategoryGroupEvent',
      component: () => import('../views/Admin/Event/AddNewCategoryGroupEvent.vue'),
      meta: {
        title: 'Add Category Group Event',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/profile/edit',
      name: 'ProfileEdit',
      component: () => import('../views/Admin/User/EditProfile.vue'),
      meta: {
        title: 'Edit Profile',
      },
    },

    // ========= Contoh halaman lain (forms / ui / pages / errors / auth) =========
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },
    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },
    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login/Login.vue'),
      meta: {
        title: 'Login',
      },
    },

    // =========================
    //         USER AREA
    //    Prefix: /user/:id
    // =========================

    // Dashboard user
    {
      path: '/user/:id',
      name: 'UserDashboard',
      component: () => import('../views/User/DashboardUser.vue'),
      meta: {
        title: 'User Dashboard',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/analytics',
      name: 'UserDashboardAnalytics',
      component: () => import('../views/User/DashboardUser.vue'),
      meta: {
        title: 'Dashboard Analytics',
        layout: 'user',
      },
    },

    // Account / Profile (user)
    {
      path: '/user/:id/profile',
      name: 'UserProfile',
      component: () => import('../views/User/Account/UserProfileUser.vue'),
      meta: {
        title: 'Profile',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/profile/edit',
      name: 'UserEditProfile',
      component: () => import('../views/User/Account/UserEditProfile.vue'),
      meta: {
        title: 'Edit Profile',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/memberuser',
      name: 'MemberUser',
      component: () => import('../views/User/Account/UploadMemberUser.vue'),
      meta: {
        title: 'Member User',
        layout: 'user',
      },
    },

    // Redeem (user)
    {
      path: '/user/:id/redeem/tickets',
      name: 'UserRedeemTickets',
      component: () => import('../views/User/RedeemUser.vue'),
      meta: {
        title: 'Redeem Tickets',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/redeem/rewards',
      name: 'UserRedeemRewards',
      component: () => import('../views/User/RedeemUser.vue'),
      meta: {
        title: 'Redeem Rewards',
        layout: 'user',
      },
    },

    // Event (user mirror)
    {
      path: '/user/:id/event',
      name: 'UserEvent',
      component: () => import('../views/User/Event/UserEvent.vue'),
      meta: {
        title: 'Event',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/event/detail/:eventId',
      name: 'UserDetailEvent',
      component: () => import('../views/User/Event/UserDetailEvent.vue'),
      meta: {
        title: 'Event Detail',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/event/upload-barcode',
      name: 'UserUploadBarcode',
      component: () => import('../views/User/Event/UserUploadBarcode.vue'),
      meta: {
        title: 'Upload Barcode',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/event/upload-data-barcode',
      name: 'UserUploadDataBarcode',
      component: () => import('../views/User/Event/UserUploadDataBarcode.vue'),
      meta: {
        title: 'Upload Data Barcode',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/event/redeem',
      name: 'UserRedeemEvent',
      component: () => import('../views/User/Event/UserRedeemTicket.vue'),
      meta: {
        title: 'Redeem Ticket',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/checkin',
      name: 'UserCheckinScanner',
      component: () => import('../views/User/Event/UserCheckinScanner.vue'),
      meta: {
        title: 'Check-in Barcode',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/checkout',
      name: 'UserCheckoutScanner',
      component: () => import('../views/User/Event/UserCheckoutScanner.vue'),
      meta: {
        title: 'Check-out Barcode',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/checkin/logs',
      name: 'UserCheckinLogs',
      component: () => import('../views/User/Event/UserCheckinLogs.vue'),
      meta: {
        title: 'Check-in Logs',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/report',
      name: 'UserReportEvent',
      component: () => import('../views/User/Event/UserReportEvent.vue'),
      meta: {
        title: 'Report',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/event/group-event',
      name: 'UserGroupEvent',
      component: () => import('../views/User/Event/UserGroupEvent.vue'),
      meta: {
        title: 'Group Event',
        layout: 'user',
      },
    },
    {
      path: '/user/:id/event/add-category-group-event',
      name: 'UserAddCategoryGroupEvent',
      component: () =>
        import('../views/User/Event/UserAddNewCategoryGroupEvent.vue'),
      meta: {
        title: 'Add Category Group Event',
        layout: 'user',
      },
    },
  ],
})

// =========================
//       ROUTE GUARD
// =========================

router.beforeEach((to, from, next) => {
  const storedUser = localStorage.getItem('user')
  const userData = storedUser ? JSON.parse(storedUser) : null

  // helper normalisasi role -> 'admin' / 'user'
  const normalizedRole = (() => {
    if (!userData || userData.role == null) return null
    const r = String(userData.role).toLowerCase().trim()
    if (['admin', 'administrator', 'superadmin'].includes(r)) return 'admin'
    return 'user'
  })()

  // Belum login → apapun selain /login diarahkan ke /login
  if (!userData && to.path !== '/login') {
    return next('/login')
  }

  // Sudah login tapi masih ke /login → arahkan ke dashboard sesuai role
  if (userData && to.path === '/login') {
    if (normalizedRole === 'admin') {
      return next('/')
    } else {
      return next(`/user/${userData.id}`)
    }
  }

  // Route layout 'user' → hanya boleh diakses role 'user' dan id di URL harus sama dengan id login
  if (userData && to.meta.layout === 'user') {
    const routeId = String(to.params.id || '')
    const loggedInId = String(userData.id)

    // kalau bukan role user tapi coba akses layout user → lempar ke admin dashboard
    if (normalizedRole !== 'user') {
      return next('/')
    }

    // kalau id di URL beda dengan id user → paksa pakai id sendiri
    if (routeId && routeId !== loggedInId) {
      return next({
        name: to.name,
        params: { ...to.params, id: loggedInId },
        query: to.query,
      })
    }
  }

  // User biasa mencoba akses halaman admin (meta.layout !== 'user')
  if (
    userData &&
    normalizedRole === 'user' &&
    to.meta.layout !== 'user' &&
    to.path !== '/login'
  ) {
    return next(`/user/${userData.id}`)
  }

  document.title = `${to.meta.title || 'SquadTix'} — SquadTix`

  next()
})

export default router
