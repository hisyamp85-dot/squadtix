/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/ping', async () => {
  return { status: 'ok', message: 'backend is alive' }
})

// ==================== USERS ====================

Route.get('/users', 'UsersController.index')
Route.post('/users', 'UsersController.store')
//Route.post('/users/login', 'UsersController.login')
Route.get('/users/roles', 'UsersController.roles')
Route.get('/users/projects', 'UsersController.projects')

Route.get('/users/check-username', 'UsersController.checkUsername')
Route.get('/users/check-email', 'UsersController.checkEmail')
Route.get('/users/count', 'UsersController.count')
Route.get('/users/:id', 'UsersController.show')
Route.put('/users/:id', 'UsersController.update')
Route.delete('/users/:id', 'UsersController.delete')

// ==================== EVENTS + CATEGORIES ====================

Route.get('/events', 'EventsController.index')
Route.post('/events', 'EventsController.store')
Route.get('/events/count', 'EventsController.count')
Route.get('/events/:eventId', 'EventsController.show')
Route.put('/events/:eventId', 'EventsController.update')
Route.delete('/events/:eventId', 'EventsController.deleteEvent')

Route.get('/events/:eventId/categories', 'EventsController.getCategories')
Route.post('/events/:eventId/categories', 'EventsController.addCategories')
Route.put('/events/:eventId/categories/:eventCategoryId', 'EventsController.updateCategory')
Route.delete('/events/:eventId/categories/:eventCategoryId', 'EventsController.deleteCategory')

// 🔥 ENTRY AMOUNT (disimpan di file, bukan DB)
Route.put(
  '/events/:eventId/categories/:categoryId/entry-amount',
  'EventEntryAmountsController.update' // ⬅️ NEW
)

// ==================== GROUP SCANS & GROUP CATEGORIES ====================

Route.get('/events/:eventId/group-scans', 'EventsController.getGroupScans')
Route.get('/events/:eventId/group-scans/:groupScanId', 'EventsController.getGroupScan')
Route.post('/events/:eventId/group-scans', 'EventsController.addGroupScans')
Route.put('/events/:eventId/group-scans/:groupScanId', 'EventsController.updateGroupScan')
Route.delete('/events/:eventId/group-scans/:groupScanId', 'EventsController.deleteGroupScan')

Route.get(
  '/events/:eventId/group-scans/:groupScanId/group-categories',
  'EventsController.getGroupCategories'
)
Route.post(
  '/events/:eventId/group-scans/:groupScanId/group-categories',
  'EventsController.addGroupCategory'
)
Route.delete(
  '/events/:eventId/group-scans/:groupScanId/group-categories/:eventCategoryId',
  'EventsController.deleteGroupCategory'
)

// ==================== QR CODES & CHECKIN STATS ====================

Route.get(
  '/events/:eventId/categories/:eventCategoryId/qrcodes',
  'EventsController.getCategoryQrcodes'
)
Route.post(
  '/events/:eventId/categories/:eventCategoryId/qrcodes',
  'EventsController.addCategoryQrcode'
)
Route.post(
  '/events/:eventId/categories/:eventCategoryId/qrcodes/upload',
  'EventsController.uploadCategoryQrcodes'
)
Route.delete(
  '/events/:eventId/categories/:eventCategoryId/qrcodes',
  'EventsController.deleteCategoryQrcodes'
)

Route.post('/events/:eventId/qrcodes/validate', 'EventsController.validateCategoryQrcode')
Route.post('/events/:eventId/qrcodes/redeem', 'EventsController.redeemCategoryQrcode')

Route.get('/events/:eventId/total-qrcodes', 'EventsController.getTotalQrcodes')
Route.get('/events/:eventId/total-checkins', 'EventsController.getTotalCheckins')
Route.get('/events/:eventId/total-redeemed', 'EventsController.getTotalRedeemed')

Route.get(
  '/events/:eventId/categories/:eventCategoryId/stats',
  'EventsController.getCategoryStats'
)
Route.get(
  '/events/:eventId/categories/:eventCategoryId/total-qrcodes',
  'EventsController.getCategoryTotalQrcodes'
)
Route.get(
  '/events/:eventId/categories/:eventCategoryId/total-checkins',
  'EventsController.getCategoryTotalCheckins'
)
Route.get(
  '/events/:eventId/categories/:eventCategoryId/total-redeemed',
  'EventsController.getCategoryTotalRedeemed'
)

Route.get(
  '/events/categories/:eventCategoryId/group-categories-count',
  'EventsController.checkGroupCategoriesForCategory'
)

// ==================== CHECKIN ====================

Route.post('/checkin/scan', 'CheckinsController.scan')
Route.get('/checkin/logs', 'CheckinsController.logs')
Route.get('/checkin/checked-in-list', 'CheckinsController.checkedInList')

// ==================== MEMBER USERS ====================

Route.get('/member-users', 'MemberUsersController.index')
Route.post('/member-users', 'MemberUsersController.store')
Route.post('/member-users/upload-csv', 'MemberUsersController.uploadCsv')
Route.get('/member-users/count', 'MemberUsersController.count')
Route.get('/member-users/check/:userId', 'MemberUsersController.checkExists')
Route.get('/member-users/:id', 'MemberUsersController.show')
Route.put('/member-users/:id', 'MemberUsersController.update')
Route.delete('/member-users/:id', 'MemberUsersController.delete')
Route.delete('/member-users', 'MemberUsersController.bulkDelete')

// ==================== Android Login ====================

// ==================== AUTH ====================

Route.post('/login', 'AuthController.login')
Route.post('/logout', 'AuthController.logout').middleware('auth:api')
Route.get('/me', 'AuthController.me').middleware('auth:api')


//Route.post('/login', 'UsersController.login')
//Route.post('/logout', 'UsersController.logout').middleware('auth:api')

// Route.group(() => {
//   // EVENTS
//   Route.get('/events', 'EventsController.index')
//   Route.post('/events', 'EventsController.store')
//   Route.get('/events/count', 'EventsController.count')
//   Route.get('/events/:eventId', 'EventsController.show')
//   Route.put('/events/:eventId', 'EventsController.update')
//   Route.delete('/events/:eventId', 'EventsController.deleteEvent')
// }).middleware(['auth:api'])




// ROOT

Route.get('/', async () => {
  return { hello: 'world' }
})
