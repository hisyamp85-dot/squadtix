import Route from '@ioc:Adonis/Core/Route'

/*
|--------------------------------------------------------------------------
| PUBLIC (NO AUTH)
|--------------------------------------------------------------------------
*/
Route.get('/ping', async () => {
  return { status: 'ok', message: 'backend is alive' }
})

Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/refresh-token', 'AuthController.refresh')
}).prefix('/api')

/*
|--------------------------------------------------------------------------
| AUTHENTICATED (ALL ROLES)
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/me', 'AuthController.me')
  Route.post('/logout', 'AuthController.logout')
})
  .middleware(['auth:api'])
  .prefix('/api')

/*
|--------------------------------------------------------------------------
| ADMIN ONLY
|--------------------------------------------------------------------------
*/
Route.group(() => {
  // USERS
  Route.get('/users', 'UsersController.index')
  Route.get('/users/count', 'UsersController.count')
  Route.get('/users/:id', 'UsersController.show')
  Route.post('/users', 'UsersController.store')
  Route.put('/users/:id', 'UsersController.update')
  Route.delete('/users/:id', 'UsersController.delete')

  // EVENTS
  Route.get('/events', 'EventsController.index')
  Route.get('/events/count', 'EventsController.count')
  Route.get('/events/:eventId', 'EventsController.show')
  Route.get('/events/:eventId/categories', 'EventsController.getCategories')
  Route.put(
    '/events/:eventId/categories/:eventCategoryId/entry-amount',
    'EventsController.setEntryAmount'
  )
  Route.get(
    '/events/categories/:eventCategoryId/group-categories-count',
    'EventsController.checkGroupCategoriesForCategory'
  )
  Route.get('/events/:eventId/total-qrcodes', 'EventsController.getTotalQrcodes')
  Route.get('/events/:eventId/total-redeemed', 'EventsController.getTotalRedeemed')
  Route.get(
    '/events/:eventId/categories/:eventCategoryId/stats',
    'EventsController.getCategoryStats'
  )
  Route.get(
    '/events/:eventId/categories/:eventCategoryId/qrcodes',
    'EventsController.getCategoryQrcodes'
  )
  Route.post(
    '/events/:eventId/categories/:eventCategoryId/qrcodes/upload',
    'EventsController.uploadCategoryQrcodes'
  )
  Route.post(
    '/events/:eventId/categories/:eventCategoryId/qrcodes',
    'EventsController.addCategoryQrcode'
  )
  Route.delete(
    '/events/:eventId/categories/:eventCategoryId/qrcodes',
    'EventsController.deleteCategoryQrcodes'
  )
  Route.post('/events/:eventId/qrcodes/validate', 'EventsController.validateCategoryQrcode')
  Route.post('/events/:eventId/qrcodes/redeem', 'EventsController.redeemCategoryQrcode')
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
  Route.get('/events/:eventId/group-scans/:groupScanId', 'EventsController.getGroupScan')
  Route.post('/events/:eventId/group-scans', 'EventsController.addGroupScans')
  Route.put(
    '/events/:eventId/group-scans/:groupScanId',
    'EventsController.updateGroupScan'
  )
  Route.delete(
    '/events/:eventId/group-scans/:groupScanId',
    'EventsController.deleteGroupScan'
  )
  Route.post(
    '/events/:eventId/group-scans/:groupScanId/group-categories',
    'EventsController.addGroupCategory'
  )
  Route.delete(
    '/events/:eventId/group-scans/:groupScanId/group-categories/:eventCategoryId',
    'EventsController.deleteGroupCategory'
  )
})
  .middleware(['auth:api', 'role:admin'])
  .prefix('/api/admin')
/*
|--------------------------------------------------------------------------
| ADMIN ONLY (LEGACY /api/users)
|--------------------------------------------------------------------------
| Some frontend screens still call /api/users* instead of /api/admin/users*.
| Keep these aliases to avoid 404s.
*/
Route.group(() => {
  Route.get('/users', 'UsersController.index')
  Route.get('/users/count', 'UsersController.count')
  Route.get('/users/:id', 'UsersController.show')
})
  .middleware(['auth:api', 'role:admin'])
  .prefix('/api')

/*
|--------------------------------------------------------------------------
| USER ONLY
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/dashboard/stats', 'UsersController.userStats')
  Route.get('/my-events', 'EventsController.myEvents')
  Route.get('/events', 'EventsController.userIndex')
  Route.post('/events', 'EventsController.userStore')
  Route.get('/events/:eventId', 'EventsController.userShow')
  Route.put('/events/:eventId', 'EventsController.userUpdateEvent')
  Route.delete('/events/:eventId', 'EventsController.userDeleteEvent')
  Route.get('/events/:eventId/categories', 'EventsController.userGetCategories')
  Route.get('/events/:eventId/categories/:eventCategoryId/qrcodes', 'EventsController.userGetCategoryQrcodes')
  Route.put(
    '/events/:eventId/categories/:eventCategoryId/entry-amount',
    'EventsController.userSetEntryAmount'
  )
  Route.post('/events/:eventId/categories', 'EventsController.userAddCategories')
  Route.put(
    '/events/:eventId/categories/:eventCategoryId',
    'EventsController.userUpdateCategory'
  )
  Route.delete(
    '/events/:eventId/categories/:eventCategoryId',
    'EventsController.userDeleteCategory'
  )
  Route.get('/events/:eventId/total-qrcodes', 'EventsController.userGetTotalQrcodes')
  Route.get('/events/:eventId/total-redeemed', 'EventsController.userGetTotalRedeemed')
  Route.get(
    '/events/categories/:eventCategoryId/group-categories-count',
    'EventsController.userCheckGroupCategoriesForCategory'
  )
  Route.get(
    '/events/:eventId/categories/:eventCategoryId/stats',
    'EventsController.userGetCategoryStats'
  )
  Route.get('/events/:eventId/group-scans', 'EventsController.userGetGroupScans')
  Route.get(
    '/events/:eventId/group-scans/:groupScanId/group-categories',
    'EventsController.userGetGroupCategories'
  )
  Route.post('/events/:eventId/group-scans', 'EventsController.userAddGroupScans')
  Route.put(
    '/events/:eventId/group-scans/:groupScanId',
    'EventsController.userUpdateGroupScan'
  )
  Route.delete(
    '/events/:eventId/group-scans/:groupScanId',
    'EventsController.userDeleteGroupScan'
  )
  Route.post(
    '/events/:eventId/group-scans/:groupScanId/group-categories',
    'EventsController.userAddGroupCategory'
  )
  Route.delete(
    '/events/:eventId/group-scans/:groupScanId/group-categories/:eventCategoryId',
    'EventsController.userDeleteGroupCategory'
  )
  Route.post(
    '/events/:eventId/categories/:eventCategoryId/qrcodes/upload',
    'EventsController.userUploadCategoryQrcodes'
  )
  Route.post(
    '/events/:eventId/categories/:eventCategoryId/qrcodes',
    'EventsController.userAddCategoryQrcode'
  )
  Route.delete(
    '/events/:eventId/categories/:eventCategoryId/qrcodes',
    'EventsController.userDeleteCategoryQrcodes'
  )
  Route.post('/events/:eventId/qrcodes/validate', 'EventsController.userValidateCategoryQrcode')
  Route.post('/events/:eventId/qrcodes/redeem', 'EventsController.userRedeemCategoryQrcode')
})
  .middleware(['auth:api', 'role:user'])
  .prefix('/api/user')

/*
|--------------------------------------------------------------------------
| SCANNER + ADMIN
|--------------------------------------------------------------------------
*/
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
})
  .middleware(['auth:api', 'role:admin,scanner'])
  .prefix('/api/scanner')

/*
|--------------------------------------------------------------------------
| ROOT (OPTIONAL)
|--------------------------------------------------------------------------
*/
Route.get('/', async () => {
  return { hello: 'world' }
})
