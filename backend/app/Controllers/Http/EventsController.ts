import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
import GroupScan from 'App/Models/GroupScan'
import GroupCategory from 'App/Models/GroupCategory'
import CategoryQrcode from 'App/Models/CategoryQrcode'
import CheckinLog from 'App/Models/CheckinLog'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

// 🔥 store untuk entry_amount (file JSON di tmp)
import EntryAmountStore from 'App/Services/EntryAmountStore'

export default class EventsController {
  // ===================== HELPER UNTUK RESPONSE BARCODE =====================
  private buildBarcodeResponse(
    barcode: CategoryQrcode,
    eventRecord?: Event | null,
    status?: string,
    redeemedAt?: DateTime | null,
    redeemedBy?: string | null,
    groupName?: string | null
  ) {
    return {
      id: barcode.id,
      qrcode: barcode.qrcode,
      name: barcode.name,
      other_data: barcode.other_data,
      status: status || 'Pending',
      redeemed_at: redeemedAt?.toISO() || null,
      redeemed_by: redeemedBy ?? null,
      event_category_id: barcode.event_category_id,
      eventName: eventRecord?.eventName ?? null,
      categoryName: eventRecord?.categoryName ?? null,
      groupName: groupName ?? null,
      statusMessage:
        status === 'Redeemed'
          ? 'Ticket has already been redeemed'
          : status === 'Re Redeemed'
          ? 'Ticket is ready for re redemption'
          : 'Ticket is Pending and ready for redemption',
    }
  }

  // ========================================================================
  //  EVENT CRUD
  // ========================================================================

  /**
   * POST /events
   * Body: { name, categories: string[], status?, id_user? }
   */
  public async store({ request, response }: HttpContextContract) {
    const { name, categories, status, id_user } = request.only([
      'name',
      'categories',
      'status',
      'id_user',
    ])

    if (!name || !Array.isArray(categories) || categories.length === 0) {
      return response.badRequest({
        error: 'name and categories[] are required',
      })
    }

    let ownerId: number | null = null
    if (id_user !== undefined && id_user !== null && id_user !== '') {
      const parsed = Number(id_user)
      if (!Number.isNaN(parsed)) {
        ownerId = parsed
      }
    }

    const eventStatus: string = status || 'Active'
    const eventId = randomUUID()

    const eventsPayload = (categories as string[]).map((category: string) => ({
      eventId,
      eventName: name,
      eventCategoryId: randomUUID(),
      categoryName: category,
      status: eventStatus,
      id_user: ownerId,
    }))

    await (Event as any).createMany(eventsPayload)

    return response.created({
      message: 'Event created successfully',
      event_id: eventId,
      event_name: name,
      status: eventStatus,
      id_user: ownerId,
      totalCategories: categories.length,
    })
  }

  /**
   * GET /events
   */
  public async index({ request, response }: HttpContextContract) {
    const idUserFilterRaw = request.input('id_user') as number | string | undefined

    const eventsQuery = Event.query()
      .select('eventId')
      .select('eventName')
      .select('status')
      .select('id_user')
      .count('* as totalCategories')
      .groupBy('eventId', 'eventName', 'status', 'id_user')

    if (idUserFilterRaw !== undefined && idUserFilterRaw !== null && idUserFilterRaw !== '') {
      const idUserFilterNum = Number(idUserFilterRaw)
      if (!Number.isNaN(idUserFilterNum)) {
        eventsQuery.where('id_user', idUserFilterNum)
      } else {
        return response.ok([])
      }
    }

    const events = await eventsQuery

    const result = events.map((event) => ({
      event_id: event.eventId,
      event_name: event.eventName,
      status: event.status,
      id_user: event.id_user,
      totalCategories: Number(event.$extras.totalCategories ?? 0),
    }))

    return response.ok(result)
  }

  /**
   * GET /events/:eventId
   */
  public async show({ params, response }: HttpContextContract) {
    const { eventId } = params

    const event = await Event.query()
      .where('eventId', eventId)
      .select('eventId', 'eventName', 'status', 'id_user')
      .first()

    if (!event) {
      return response.notFound({ message: 'Event not found' })
    }

    return response.ok({
      id_event: event.eventId,
      name: event.eventName,
      status: event.status,
      id_user: event.id_user,
    })
  }

  /**
   * PUT /events/:eventId
   */
  public async update({ params, request, response }: HttpContextContract) {
    const { eventId } = params
    const { name, status } = request.only(['name', 'status'])

    const event = await Event.query().where('eventId', eventId).first()

    if (!event) {
      return response.notFound({ message: 'Event not found' })
    }

    const payload: any = {}
    if (name) payload.eventName = name
    if (status) payload.status = status

    if (Object.keys(payload).length === 0) {
      return response.badRequest({ error: 'Nothing to update' })
    }

    await Event.query().where('eventId', eventId).update(payload)

    return response.ok({
      message: 'Event updated successfully',
      event_id: eventId,
      name: name ?? event.eventName,
      status: status ?? event.status,
    })
  }

  /**
   * DELETE /events/:eventId
   */
  public async deleteEvent({ params, response }: HttpContextContract) {
    const { eventId } = params

    try {
      const eventExists = await Event.query().where('eventId', eventId).first()

      if (!eventExists) {
        return response.notFound({ message: 'Event not found' })
      }

      await CategoryQrcode.query().where('event_id', eventId).delete()
      await GroupCategory.query().where('event_id', eventId).delete()
      await GroupScan.query().where('event_id', eventId).delete()
      await Event.query().where('eventId', eventId).delete()

      return response.ok({ message: 'Event and all related data deleted successfully' })
    } catch (error) {
      console.error('Error deleting event:', error)
      return response.status(500).json({ error: 'Failed to delete event' })
    }
  }

  public async destroy(ctx: HttpContextContract) {
    return this.deleteEvent(ctx)
  }

  // ========================================================================
  //  EVENT CATEGORIES
  // ========================================================================

  /**
   * GET /events/:eventId/categories
   *
   * Frontend sekarang dapat:
   * {
   *   categories: [
   *     { id: string, name: string, entry_amount: number }
   *   ]
   * }
   */
  public async getCategories({ params, response }: HttpContextContract) {
    const { eventId } = params
    const eventIdStr = String(eventId)

    const categories = await Event.query()
      .where('eventId', eventIdStr)
      .select('categoryName', 'eventCategoryId')

    const entryMap = await EntryAmountStore.getEventMap(eventIdStr)

    const categoryList = categories.map((cat) => {
      const catIdStr = String(cat.eventCategoryId)
      return {
        name: cat.categoryName,
        id: cat.eventCategoryId,
        entry_amount: entryMap[catIdStr] ?? 0,
      }
    })

    response.header('Cache-Control', 'no-cache')
    return response.ok({ categories: categoryList })
  }

  public async categories(ctx: HttpContextContract) {
    return this.getCategories(ctx)
  }

  public async addCategories({ params, request, response }: HttpContextContract) {
    const { eventId } = params
    const { categories, status } = request.only(['categories', 'status'])

    const existingEvent = await Event.query().where('eventId', eventId).first()

    if (!existingEvent) {
      return response.notFound({ message: 'Event not found' })
    }

    const eventName = existingEvent.eventName

    const newCategories = (categories as string[]).map((category: string) => ({
      eventId,
      eventName,
      eventCategoryId: randomUUID(),
      categoryName: category,
      status: status || existingEvent.status,
      id_user: existingEvent.id_user,
    }))

    await (Event as any).createMany(newCategories)

    return response.created({ message: 'Categories added successfully' })
  }

  public async updateCategory({ params, request, response }: HttpContextContract) {
    const { eventId, eventCategoryId } = params
    const { categoryName } = request.only(['categoryName'])

    const category = await Event.query()
      .where('eventId', eventId)
      .where('eventCategoryId', eventCategoryId)
      .first()

    if (!category) {
      return response.notFound({ message: 'Category not found' })
    }

    category.categoryName = categoryName
    await category.save()

    return response.ok({ message: 'Category updated successfully' })
  }

  public async deleteCategory({ params, response }: HttpContextContract) {
    const { eventId, eventCategoryId } = params

    const category = await Event.query()
      .where('eventId', eventId)
      .where('eventCategoryId', eventCategoryId)
      .first()

    if (!category) {
      return response.notFound({ message: 'Category not found' })
    }

    await category.delete()

    return response.ok({ message: 'Category deleted successfully' })
  }

  // ========================================================================
  //  GROUP EVENT & GROUP CATEGORY
  // ========================================================================

  public async getGroupScans({ params, response }: HttpContextContract) {
    const { eventId } = params

    const groupScans = await GroupScan.query()
      .where('event_id', eventId)
      .select('id', 'name_group', 'event_id', 'status')

    const groups = groupScans.map((scan) => ({
      id: scan.id,
      name_group: scan.name_group,
      event_id: scan.event_id,
      status: scan.status,
    }))

    return response.ok(groups)
  }

  public async addGroupScans({ params, request, response }: HttpContextContract) {
    const { eventId } = params
    const { groups, status } = request.only(['groups', 'status'])

    for (const group of groups as string[]) {
      const groupScan = new GroupScan()
      groupScan.name_group = group
      groupScan.event_id = eventId
      groupScan.status = status || 'active'
      await groupScan.save()
    }

    return response.created({ message: 'Group scans added successfully' })
  }

  public async getGroupScan({ params, response }: HttpContextContract) {
    const { eventId, groupScanId } = params
    const id = parseInt(groupScanId, 10)

    const groupScan = await GroupScan.query()
      .where('id', id)
      .where('event_id', eventId)
      .select('id', 'name_group', 'event_id', 'status')
      .first()

    if (!groupScan) {
      return response.notFound({ message: 'Group scan not found' })
    }

    return response.ok({
      id: groupScan.id,
      name_group: groupScan.name_group,
      event_id: groupScan.event_id,
      status: groupScan.status,
    })
  }

  public async updateGroupScan({ params, request, response }: HttpContextContract) {
    const { eventId, groupScanId } = params
    const { name_group, status } = request.only(['name_group', 'status'])

    const groupScan = await GroupScan.query()
      .where('id', groupScanId)
      .where('event_id', eventId)
      .first()

    if (!groupScan) {
      return response.notFound({ message: 'Group scan not found' })
    }

    groupScan.name_group = name_group
    if (status) {
      groupScan.status = status
    }
    await groupScan.save()

    return response.ok({ message: 'Group scan updated successfully' })
  }

  public async deleteGroupScan({ params, response }: HttpContextContract) {
    const { eventId, groupScanId } = params

    const groupScan = await GroupScan.query()
      .where('id', groupScanId)
      .where('event_id', eventId)
      .first()

    if (!groupScan) {
      return response.notFound({ message: 'Group scan not found' })
    }

    await groupScan.delete()

    return response.ok({ message: 'Group scan deleted successfully' })
  }

  public async getGroupCategories({ params, response }: HttpContextContract) {
    const { eventId, groupScanId } = params

    const groupCategories = await GroupCategory.query()
      .where('group_scans_id', groupScanId)
      .where('event_id', eventId)
      .select('id', 'group_scans_id', 'event_category_id', 'event_id')

    const categories = groupCategories.map((gc) => ({
      id: gc.id,
      // property model camelCase, response tetap snake_case
      group_scans_id: gc.groupScansId,
      event_category_id: gc.eventCategoryId,
      event_id: gc.eventId,
    }))

    return response.ok(categories)
  }

  public async addGroupCategory({ params, request, response }: HttpContextContract) {
    const { eventId, groupScanId } = params
    const { eventCategoryId } = request.only(['eventCategoryId'])

    const existing = await GroupCategory.query()
      .where('group_scans_id', groupScanId)
      .where('event_category_id', eventCategoryId)
      .where('event_id', eventId)
      .first()

    if (existing) {
      return response.badRequest({ message: 'Category already assigned to this group' })
    }

    const groupCategory = new GroupCategory()
    groupCategory.groupScansId = parseInt(groupScanId, 10)
    groupCategory.eventCategoryId = eventCategoryId
    groupCategory.eventId = eventId
    await groupCategory.save()

    return response.created({ message: 'Category added to group successfully' })
  }

  public async deleteGroupCategory({ params, response }: HttpContextContract) {
    const { eventId, groupScanId, eventCategoryId } = params

    const groupCategory = await GroupCategory.query()
      .where('group_scans_id', groupScanId)
      .where('event_category_id', eventCategoryId)
      .where('event_id', eventId)
      .first()

    if (!groupCategory) {
      return response.notFound({ message: 'Group category not found' })
    }

    await groupCategory.delete()

    return response.ok({ message: 'Category removed from group successfully' })
  }

  // ========================================================================
  //  COUNTS & STATS
  // ========================================================================

  public async count({ response }: HttpContextContract) {
    try {
      const count = await Event.query().countDistinct('event_id as total')
      return response.status(200).json({ count: Number(count[0].$extras.total ?? 0) })
    } catch (err: any) {
      console.error('Failed to count events:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async getCategoryQrcodes({ params, response }: HttpContextContract) {
    const { eventId, eventCategoryId } = params

    try {
      const qrcodes = await CategoryQrcode.query()
        .where('event_id', eventId)
        .where('event_category_id', eventCategoryId)
        .select(
          'id',
          'qrcode',
          'name',
          'other_data'
        )

      const qrcodeIds = qrcodes.map((qr) => qr.id)
      const redeemedLogs = await CheckinLog.query()
        .whereIn('category_qrcode_id', qrcodeIds)
        .select('category_qrcode_id', 'status', 'scannedAt')

      const statusMap = new Map<number, string>()
      const redeemedAtMap = new Map<number, DateTime>()

      redeemedLogs.forEach((log) => {
        statusMap.set(log.categoryQrcodeId, log.status)
        redeemedAtMap.set(log.categoryQrcodeId, log.scannedAt)
      })

      const qrcodeList = qrcodes.map((qr) => ({
        id: qr.id,
        qrcode: qr.qrcode,
        name: qr.name,
        other_data: qr.other_data,
        status: statusMap.get(qr.id) || 'Pending',
        redeemed_at: redeemedAtMap.get(qr.id)?.toISO() || null,
      }))

      return response.ok(qrcodeList)
    } catch (error: any) {
      console.error('Error fetching category qrcodes:', error)
      return response.status(500).json({ error: 'Failed to fetch category qrcodes' })
    }
  }

  // ========================================================================
  //  UPLOAD CSV BARCODE
  // ========================================================================

  public async uploadCategoryQrcodes({ params, request, response }: HttpContextContract) {
    console.log('=== UPLOAD QR CODES START ===')
    const { eventId, eventCategoryId } = params
    console.log('Event ID:', eventId)
    console.log('Event Category ID:', eventCategoryId)

    const file = request.file('file')
    console.log('File received:', file ? 'YES' : 'NO')
    if (!file) {
      return response.badRequest({ message: 'No file uploaded' })
    }

    if (!file.extname || file.extname.toLowerCase() !== 'csv') {
      return response.badRequest({ message: 'Only CSV files are allowed' })
    }

    console.log('Looking for event record...')
    const event = await Event.query()
      .where('eventId', eventId)
      .where('eventCategoryId', eventCategoryId)
      .first()

    console.log('Event found:', event ? 'YES' : 'NO')
    if (!event) {
      return response.notFound({ message: 'Event category not found' })
    }

    const tableEventsId = event.id
    console.log('Table Events ID:', tableEventsId)

    const csvData: any[] = []

    try {
      console.log('Reading file content...')
      const fsPromises = require('fs').promises
      const fileContent = await fsPromises.readFile(file.tmpPath!, 'utf8')
      console.log('File content length:', fileContent.length)

      const lines = fileContent.split('\n').filter((line) => line.trim() !== '')
      console.log('Number of lines:', lines.length)
      if (lines.length === 0) {
        return response.badRequest({ message: 'CSV file is empty' })
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
      console.log('Headers:', headers)
      const requiredHeaders = ['qrcode', 'name', 'other_data']
      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

      if (missingHeaders.length > 0) {
        return response.badRequest({
          message: `Missing required columns: ${missingHeaders.join(', ')}`,
        })
      }

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',')
        if (values.length >= headers.length) {
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim().replace(/^"|"$/g, '') : ''
          })
          csvData.push(row)
        }
      }
      console.log('Parsed CSV data rows:', csvData.length)

      console.log('Checking for duplicates...')
      const duplicateQrcodes: string[] = []
      for (const row of csvData) {
        const existing = await CategoryQrcode.query()
          .where('qrcode', row.qrcode)
          .where('event_category_id', eventCategoryId)
          .first()

        if (existing) {
          duplicateQrcodes.push(row.qrcode)
        }
      }

      if (duplicateQrcodes.length > 0) {
        return response.badRequest({ error: `qrcode '${duplicateQrcodes[0]}' already exists` })
      }

      const qrcodesData = csvData.map((row) => {
        console.log('CSV Row:', row)
        return {
          table_events_id: tableEventsId,
          qrcode: row.qrcode,
          event_id: eventId,
          event_category_id: eventCategoryId,
          name: row.name,
          other_data: row.other_data || null,
        }
      })
      console.log('Prepared data for insertion:', qrcodesData.length, 'rows')

      const batchSize = 100
      for (let i = 0; i < qrcodesData.length; i += batchSize) {
        const batch = qrcodesData.slice(i, i + batchSize)
        console.log('Inserting batch:', batch.length, 'rows')
        await (CategoryQrcode as any).createMany(batch)
      }

      console.log('Upload successful - returning 201')
      return response.created({ message: `${qrcodesData.length} QR codes uploaded successfully` })
    } catch (error: any) {
      console.error('Error processing CSV:', error)

      if (error.code === '23505') {
        const match = error.detail?.match(/Key \(([^)]+)\)=\(([^)]+)\) already exists/)
        if (match) {
          const field = match[1]
          const value = match[2]
          return response.status(400).json({ error: `${field} '${value}' already exists` })
        }
        return response.status(400).json({ error: 'Duplicate entry found' })
      }

      if (error.message) {
        return response.status(500).json({ error: error.message })
      }

      return response.status(500).json({ error: 'Failed to process CSV file' })
    }
  }

  public async deleteCategoryQrcodes({ params, request, response }: HttpContextContract) {
    const { eventId, eventCategoryId } = params
    const { ids } = request.only(['ids'])

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return response.badRequest({ message: 'No IDs provided for deletion' })
    }

    try {
      const deletedCount = await CategoryQrcode.query()
        .where('event_id', eventId)
        .where('event_category_id', eventCategoryId)
        .whereIn('id', ids)
        .delete()

      return response.ok({ message: `${deletedCount} QR codes deleted successfully` })
    } catch (error) {
      console.error('Error deleting QR codes:', error)
      return response.status(500).json({ error: 'Failed to delete QR codes' })
    }
  }

  public async getTotalQrcodes({ params, response }: HttpContextContract) {
    const { eventId } = params

    try {
      const count = await CategoryQrcode.query().where('event_id', eventId).count('* as total')

      return response.ok({ totalQrcodes: parseInt(count[0].$extras.total as string, 10) })
    } catch (error) {
      console.error('Error counting QR codes:', error)
      return response.status(500).json({ error: 'Failed to count QR codes' })
    }
  }

  public async checkGroupCategoriesForCategory({ params, response }: HttpContextContract) {
    const { eventCategoryId } = params

    try {
      const count = await GroupCategory.query()
        .where('event_category_id', eventCategoryId)
        .count('* as total')

      return response.ok({ count: parseInt(count[0].$extras.total as string, 10) })
    } catch (error) {
      console.error('Error checking group categories:', error)
      return response.status(500).json({ error: 'Failed to check group categories' })
    }
  }

  public async getTotalCheckins({ params, response }: HttpContextContract) {
    const { eventId } = params

    try {
      const count = await CheckinLog.query().where('eventId', eventId).count('* as total')

      return response.ok({ totalCheckins: parseInt(count[0].$extras.total as string, 10) })
    } catch (error) {
      console.error('Error counting checkins:', error)
      return response.status(500).json({ error: 'Failed to count checkins' })
    }
  }

  public async getTotalRedeemed({ params, response }: HttpContextContract) {
    const { eventId } = params

    try {
      const count = await CheckinLog.query()
        .where('eventId', eventId)
        .where('status', 'Redeemed')
        .count('* as total')

      return response.ok({ totalRedeemed: parseInt(count[0].$extras.total as string, 10) })
    } catch (error) {
      console.error('Error counting redeemed:', error)
      return response.status(500).json({ error: 'Failed to count redeemed' })
    }
  }

  // ========================================================================
  //  ADD BARCODE MANUAL
  // ========================================================================

  public async addCategoryQrcode({ params, request, response }: HttpContextContract) {
    const { eventId, eventCategoryId } = params
    const {
      qrcode,
      name,
      other_data,
    } = request.only([
      'qrcode',
      'name',
      'other_data',
    ])

    try {
      const event = await Event.query()
        .where('eventId', eventId)
        .where('eventCategoryId', eventCategoryId)
        .first()

      if (!event) {
        return response.notFound({ message: 'Event category not found' })
      }

      const tableEventsId = event.id

      const existing = await CategoryQrcode.query()
        .where('qrcode', qrcode)
        .where('event_category_id', eventCategoryId)
        .first()

      if (existing) {
        return response.badRequest({ error: `qrcode '${qrcode}' already exists` })
      }

      const categoryQrcode = new CategoryQrcode()
      categoryQrcode.table_events_id = tableEventsId
      categoryQrcode.qrcode = qrcode
      categoryQrcode.event_id = eventId
      categoryQrcode.event_category_id = eventCategoryId
      categoryQrcode.name = name
      categoryQrcode.other_data = other_data || null
      await categoryQrcode.save()

      return response.created({ message: 'Barcode added successfully' })
    } catch (error: any) {
      console.error('Error adding barcode:', error)

      if (error.code === '23505') {
        const match = error.detail?.match(/Key \(([^)]+)\)=\(([^)]+)\) already exists/)
        if (match) {
          const field = match[1]
          const value = match[2]
          return response.status(400).json({ error: `${field} '${value}' already exists` })
        }
        return response.status(400).json({ error: 'Duplicate entry found' })
      }

      if (error.message) {
        return response.status(500).json({ error: error.message })
      }

      return response.status(500).json({ error: 'Failed to add barcode' })
    }
  }

  // ========================================================================
  //  VALIDATE & REDEEM (SCAN)
  // ========================================================================

  public async validateCategoryQrcode({ params, request, response }: HttpContextContract) {
    console.log('=== VALIDATE CATEGORY QRCODE START ===')
    const { eventId } = params
    const qrcode = request.input('qrcode')
    console.log('Event ID:', eventId)
    console.log('QR Code:', qrcode)

    if (!qrcode) {
      return response.badRequest({ message: 'qrcode is required' })
    }

    try {
      const barcode = await CategoryQrcode.query()
        .where('event_id', eventId)
        .where('qrcode', qrcode)
        .first()

      if (!barcode) {
        return response.notFound({ status: 'Invalid', message: 'Barcode not found' })
      }

      let barcodes: CategoryQrcode[] = []

      barcodes = [barcode]

      const barcodeIds = barcodes.map((b) => b.id)
      const redeemedLogs = await CheckinLog.query()
        .whereIn('category_qrcode_id', barcodeIds)
        .orderBy('scannedAt', 'desc')
        .select('category_qrcode_id', 'status', 'scannedAt', 'scannedBy')

      const statusMap = new Map<number, string>()
      const scannedAtMap = new Map<number, DateTime>()
      const redeemedByMap = new Map<number, string>()

      redeemedLogs.forEach((log) => {
        if (!statusMap.has(log.categoryQrcodeId)) {
          statusMap.set(log.categoryQrcodeId, log.status)
          scannedAtMap.set(log.categoryQrcodeId, log.scannedAt)
          redeemedByMap.set(log.categoryQrcodeId, log.scannedBy)
        }
      })

      const eventRecord = await Event.query()
        .where('eventCategoryId', barcode.event_category_id)
        .first()

      const eventCategoryIds = barcodes.map((b) => b.event_category_id)
      const groupCategories = await GroupCategory.query()
        .where('event_id', eventId)
        .whereIn('event_category_id', eventCategoryIds)
        .preload('groupScan', (query) => query.select('id', 'name_group'))

      const groupNameMap = new Map<string, string>()
      groupCategories.forEach((gc) => {
        if (gc.groupScan) {
          groupNameMap.set(gc.eventCategoryId, gc.groupScan.name_group)
        }
      })

      const barcodeResponses = barcodes.map((b) => {
        let status = statusMap.get(b.id) || 'Pending'
        if (status === 'Recheckin') {
          status = 'Re Redeemed'
        }
        const scannedAt = scannedAtMap.get(b.id) || null
        const redeemedBy = redeemedByMap.get(b.id) || null
        const groupName = groupNameMap.get(b.event_category_id) || null
        return this.buildBarcodeResponse(b, eventRecord, status, scannedAt, redeemedBy, groupName)
      })

      return response.ok({ barcodes: barcodeResponses })
    } catch (error: any) {
      console.error('Error validating barcode:', error)
      return response.status(500).json({ error: 'Failed to validate barcode' })
    }
  }

  public async redeemCategoryQrcode({ params, request, response }: HttpContextContract) {
    console.log('=== REDEEM CATEGORY QRCODE START ===')
    const { eventId } = params
    const qrcode = request.input('qrcode')
    const rawRedeemedBy = request.input('redeemedBy') as string | undefined
    const redeemedBy = rawRedeemedBy ? String(rawRedeemedBy).trim() : null

    if (!qrcode) {
      return response.badRequest({ message: 'qrcode is required' })
    }

    try {
      const barcode = await CategoryQrcode.query()
        .where('event_id', eventId)
        .where('qrcode', qrcode)
        .first()

      if (!barcode) {
        return response.notFound({ message: 'Barcode not found' })
      }

      const existingLog = await CheckinLog.query()
        .where('category_qrcode_id', barcode.id)
        .first()

      const isReRedeemed = !!existingLog
      const scannedBy = redeemedBy

      const log = await CheckinLog.create({
        categoryQrcodeId: barcode.id,
        qrcode: barcode.qrcode,
        eventId: barcode.event_id,
        eventCategoryId: barcode.event_category_id,
        scannedBy: scannedBy,
        scannedAt: DateTime.now(),
        status: isReRedeemed ? 'Re Redeemed' : 'Redeemed',
      })

      const eventRecord = await Event.query()
        .where('eventCategoryId', barcode.event_category_id)
        .first()

      return response.ok({
        message: 'Barcode redeemed successfully',
        barcode: this.buildBarcodeResponse(
          barcode,
          eventRecord,
          log.status,
          log.scannedAt,
          log.scannedBy
        ),
        log: {
          id: log.id,
          scanned_at: log.scannedAt?.toISO(),
          scanned_by: log.scannedBy,
        },
      })
    } catch (error: any) {
      console.error('Error redeeming barcode:', error)
      return response.status(500).json({ error: 'Failed to redeem barcode' })
    }
  }

  // ========================================================================
  //  CATEGORY STATS
  // ========================================================================

  public async getCategoryStats({ params, response }: HttpContextContract) {
    const { eventId, eventCategoryId } = params

    try {
      const totalTicketsQuery = await CategoryQrcode.query()
        .where('event_id', eventId)
        .where('event_category_id', eventCategoryId)
        .count('* as total')

      const totalTickets = parseInt(totalTicketsQuery[0].$extras.total as string, 10)

      const statsQuery = await CheckinLog.query()
        .where('eventId', eventId)
        .where('eventCategoryId', eventCategoryId)
        .select('status')
        .count('* as count')
        .groupBy('status')

      const statusCounts: { [key: string]: number } = {}
      statsQuery.forEach((stat) => {
        statusCounts[stat.status] = parseInt(stat.$extras.count as string, 10)
      })

      const checkin = statusCounts['checkin'] || statusCounts['Checkin'] || 0
      const reRedeemed =
        statusCounts['Re Redeemed'] ||
        statusCounts['re redeemed'] ||
        statusCounts['Recheckin'] ||
        statusCounts['recheckin'] ||
        0
      const checkout = statusCounts['checkout'] || statusCounts['Checkout'] || 0
      const recheckout = statusCounts['recheckout'] || statusCounts['Recheckout'] || 0

      const totalCheckins = checkin + reRedeemed + checkout + recheckout
      const available = totalTickets - totalCheckins

      return response.ok({
        checkin,
        reRedeemed,
        checkout,
        recheckout,
        totalTickets,
        available,
      })
    } catch (error) {
      console.error('Error fetching category stats:', error)
      return response.status(500).json({ error: 'Failed to fetch category stats' })
    }
  }
  // ========================================================================
//  FLUTTER: EVENT MILIK USER LOGIN
// ========================================================================
public async myEvents({ auth, response }: HttpContextContract) {
  const user = auth.user!

  // Ambil event unik (group by eventId)
  const events = await Event.query()
    .where('id_user', user.id)
    .select('eventId', 'eventName')
    .groupBy('eventId', 'eventName')

  return response.ok(
    events.map((e) => ({
      event_id: e.eventId,
      event_name: e.eventName,
    }))
  )
}

}
