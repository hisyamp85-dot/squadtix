import Route from '@ioc:Adonis/Core/Route'

// ==================== PUBLIC ====================
Route.get('/ping', async () => {
  return { status: 'ok', message: 'backend is alive' }
})

Route.post('/login', 'AuthController.login')
Route.post('/refresh-token', 'AuthController.refresh')

// ==================== AUTH (SEMUA ROLE) ====================
Route.group(() => {
  Route.get('/me', 'AuthController.me')
  Route.post('/logout', 'AuthController.logout')
}).middleware(['auth:api'])

// ==================== ADMIN ONLY ====================
Route.group(() => {
  // USERS
  Route.get('/users', 'UsersController.index')
  Route.get('/users/count', 'UsersController.count')
  Route.get('/users/:id', 'UsersController.show')

  // EVENTS
  Route.get('/events', 'EventsController.index')
  Route.get('/events/count', 'EventsController.count')
  Route.get('/events/:eventId', 'EventsController.show')
  Route.post('/events', 'EventsController.store')
  Route.put('/events/:eventId', 'EventsController.update')
  Route.delete('/events/:eventId', 'EventsController.deleteEvent')

  // CATEGORIES
  Route.post('/events/:eventId/categories', 'EventsController.addCategories')
  Route.put(
    '/events/:eventId/categories/:eventCategoryId',
    'EventsController.updateCategory'
  )
  Route.delete(
    '/events/:eventId/categories/:eventCategoryId',
    'EventsController.deleteCategory'
  )

  // GROUP SCANS (GATE)
  Route.post('/events/:eventId/group-scans', 'EventsController.addGroupScans')
  Route.put(
    '/events/:eventId/group-scans/:groupScanId',
    'EventsController.updateGroupScan'
  )
  Route.delete(
    '/events/:eventId/group-scans/:groupScanId',
    'EventsController.deleteGroupScan'
  )
}).middleware(['auth:api', 'role:admin'])

// ==================== USER ONLY ====================
Route.group(() => {
  // Event milik user login
  Route.get('/my-events', 'EventsController.myEvents')
}).middleware(['auth:api', 'role:user'])

// ==================== SCANNER ONLY ====================
Route.group(() => {
  // Gate / Group scan
  Route.get('/events/:eventId/group-scans', 'EventsController.getGroupScans')
  Route.get(
    '/events/:eventId/group-scans/:groupScanId/group-categories',
    'EventsController.getGroupCategories'
  )

  // CHECKIN
  Route.post('/checkin/scan', 'CheckinsController.scan')
  Route.get('/checkin/logs', 'CheckinsController.logs')
  Route.get('/checkin/checked-in-list', 'CheckinsController.checkedInList')
}).middleware(['auth:api', 'role:scanner'])

// ==================== ROOT ====================
Route.get('/', async () => {
  return { hello: 'world' }
})
