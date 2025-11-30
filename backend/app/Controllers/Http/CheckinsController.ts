import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CategoryQrcode from 'App/Models/CategoryQrcode'
import CheckinLog from 'App/Models/CheckinLog'
import Event from 'App/Models/Event'
import { DateTime } from 'luxon'

export default class CheckinsController {
  public async scan({ request, response }: HttpContextContract) {
    const qrcodeInput: string | undefined = request.input('qrcode')
    const scannedBy: string | undefined =
      request.input('scannedBy') || request.input('scanned_by')
    const eventIdFilter: string | undefined =
      request.input('eventId') || request.input('event_id')
    const eventCategoryFilter: string | undefined =
      request.input('eventCategoryId') || request.input('event_category_id')

    // 🔐 user filter (untuk menu user)
    const userIdFilter: string | undefined =
      request.input('userId') || request.input('user_id')

    const typeScan: 'CheckIn' | 'CheckOut' =
      (request.input('typeScan') || 'CheckIn') as 'CheckIn' | 'CheckOut'

    const entryAmountRaw = request.input('entryAmount')
    const entryAmount: number | null =
      typeof entryAmountRaw !== 'undefined' && entryAmountRaw !== null && entryAmountRaw !== ''
        ? Number(entryAmountRaw)
        : null

    if (!qrcodeInput || !qrcodeInput.trim()) {
      return response.badRequest({ message: 'qrcode is required' })
    }

    try {
      const qrcode = qrcodeInput.trim()

      const barcodeQuery = CategoryQrcode.query().where('qrcode', qrcode)

      if (eventIdFilter) {
        barcodeQuery.where('event_id', eventIdFilter)
      }

      if (eventCategoryFilter) {
        barcodeQuery.where('event_category_id', eventCategoryFilter)
      }

      const barcode = await barcodeQuery.first()

      if (!barcode) {
        return response.notFound({ message: 'Barcode not found' })
      }

      // Ambil event utk cek kepemilikan (kalau userIdFilter dikirim)
      const eventQuery = Event.query().where('eventCategoryId', barcode.event_category_id)

      // ⚠️ Ganti 'user_id' dengan kolom yang kamu pakai di tabel events
      if (userIdFilter) {
        eventQuery.andWhere('user_id', userIdFilter)
      }

      const eventRecord = await eventQuery.first()

      // Kalau user_id dikirim tapi event-nya bukan milik user tsb → blok
      if (userIdFilter && !eventRecord) {
        return response.unauthorized({
          message: 'You are not allowed to scan tickets for this event',
        })
      }

      // Log terakhir (untuk cek status sekarang)
      const lastLog = await CheckinLog.query()
        .where('category_qrcode_id', barcode.id)
        .orderBy('scanned_at', 'desc')
        .first()

      // Hitung total entry (jumlah sesi check-in yang pernah dibuat untuk barcode ini)
      const countRow = await CheckinLog.query()
        .where('category_qrcode_id', barcode.id)
        .count('* as total')
        .first()

      const totalEntries = Number(countRow?.$extras.total ?? 0)

      // =====================================
      //  BRANCH CHECK - IN  (typeScan = CheckIn)
      // =====================================
      if (typeScan === 'CheckIn') {
        // 1) Cek limit entryAmount (kalau dikirim & > 0)
        if (entryAmount !== null && !Number.isNaN(entryAmount) && entryAmount > 0) {
          if (totalEntries >= entryAmount) {
            return response.badRequest({
              message: `Entry limit reached (${entryAmount}x).`,
              entryUsed: totalEntries,
              entryLimit: entryAmount,
            })
          }
        }

        // 2) Cek status terakhir: kalau masih Checked-in → dianggap belum keluar
        if (lastLog && lastLog.status === 'Checked-in') {
          return response.badRequest({
            message: 'Barcode already checked in',
            log: {
              id: lastLog.id,
              scanned_at: lastLog.scannedAt?.toISO(),
              scanned_by: lastLog.scannedBy,
              status: lastLog.status,
            },
            barcode: {
              id: barcode.id,
              qrcode: barcode.qrcode,
              name: barcode.name,
              other_data: barcode.other_data,
              event_id: barcode.event_id,
              event_category_id: barcode.event_category_id,
            },
            entryUsed: totalEntries,
            entryLimit: entryAmount,
          })
        }

        // 3) Boleh check-in:
        const log = await CheckinLog.create({
          categoryQrcodeId: barcode.id,
          qrcode: barcode.qrcode,
          eventId: barcode.event_id,
          eventCategoryId: barcode.event_category_id,
          scannedBy: scannedBy || null,
          scannedAt: DateTime.now(),
          status: 'Checked-in',
        })

        const entryUsed = totalEntries + 1
        const successMessage =
          entryAmount !== null && entryAmount > 0
            ? `Check-in successful (Entry used ${entryUsed}/${entryAmount})`
            : 'Check-in successful'

        return response.ok({
          message: successMessage,
          entryUsed,
          entryLimit: entryAmount,
          barcode: {
            id: barcode.id,
            qrcode: barcode.qrcode,
            name: barcode.name,
            other_data: barcode.other_data,
            event_id: barcode.event_id,
            event_category_id: barcode.event_category_id,
            eventName: eventRecord?.eventName ?? null,
            categoryName: eventRecord?.categoryName ?? null,
          },
          log: {
            id: log.id,
            scanned_at: log.scannedAt?.toISO(),
            scanned_by: log.scannedBy,
            status: log.status,
          },
        })
      }

      // =====================================
      //  BRANCH CHECK - OUT  (typeScan = CheckOut)
      // =====================================

      // Belum pernah check-in sama sekali
      if (!lastLog) {
        return response.badRequest({
          message: 'Barcode has not checked in yet',
          entryUsed: totalEntries,
          entryLimit: entryAmount,
        })
      }

      // Sudah check-out terakhir kali
      if (lastLog.status === 'Checked-out') {
        return response.badRequest({
          message: 'Barcode already checked out',
          log: {
            id: lastLog.id,
            scanned_at: lastLog.scannedAt?.toISO(),
            scanned_by: lastLog.scannedBy,
            status: lastLog.status,
            checkout_at: lastLog.checkoutAt?.toISO?.() ?? null,
            checkout_by: lastLog.checkoutBy ?? null,
          },
          entryUsed: totalEntries,
          entryLimit: entryAmount,
        })
      }

      // Update log terakhir menjadi Checked-out
      lastLog.merge({
        status: 'Checked-out',
        checkoutAt: DateTime.now(),
        checkoutBy: scannedBy || null,
      })
      await lastLog.save()

      return response.ok({
        message: 'Check-out successful',
        entryUsed: totalEntries,
        entryLimit: entryAmount,
        barcode: {
          id: barcode.id,
          qrcode: barcode.qrcode,
          name: barcode.name,
          other_data: barcode.other_data,
          event_id: barcode.event_id,
          event_category_id: barcode.event_category_id,
          eventName: eventRecord?.eventName ?? null,
          categoryName: eventRecord?.categoryName ?? null,
        },
        log: {
          id: lastLog.id,
          scanned_at: lastLog.scannedAt?.toISO(),
          scanned_by: lastLog.scannedBy,
          status: lastLog.status,
          checkout_at: lastLog.checkoutAt?.toISO?.() ?? null,
          checkout_by: lastLog.checkoutBy ?? null,
        },
      })
    } catch (error) {
      console.error('Check-in/Check-out scan error:', error)
      return response.status(500).json({ message: 'Failed to process scan' })
    }
  }

  public async logs({ request, response }: HttpContextContract) {
    const search: string | undefined = request.input('search')
    const eventIdFilter: string | undefined =
      request.input('eventId') || request.input('event_id')
    const eventCategoryFilter: string | undefined =
      request.input('eventCategoryId') || request.input('event_category_id')

    // 🔐 user filter
    const userIdFilter: string | undefined =
      request.input('userId') || request.input('user_id')

    try {
      const logsQuery = CheckinLog.query()
        .preload('categoryQrcode')
        .orderBy('scanned_at', 'desc')

      if (eventIdFilter) {
        logsQuery.where('event_id', eventIdFilter)
      }

      if (eventCategoryFilter) {
        logsQuery.where('event_category_id', eventCategoryFilter)
      }

      if (search && search.trim()) {
        const term = `%${search.trim().toLowerCase()}%`
        logsQuery.whereRaw('LOWER(qrcode) LIKE ?', [term])
      }

      const logs = await logsQuery

      const categoryIds = logs
        .map((log) => log.categoryQrcode?.event_category_id)
        .filter((id): id is string => Boolean(id))

      if (categoryIds.length === 0) {
        return response.ok({ logs: [] })
      }

      const eventsQuery = Event.query().whereIn('eventCategoryId', categoryIds)

      // ⚠️ Ganti 'user_id' kalau nama kolom di tabel events berbeda
      if (userIdFilter) {
        eventsQuery.andWhere('user_id', userIdFilter)
      }

      const events = await eventsQuery

      // Map dengan tipe jelas
      const eventMap = new Map<string, Event>()
      events.forEach((ev) => {
        eventMap.set(ev.eventCategoryId, ev)
      })

      const payload = logs
        .map((log) => {
          const barcode = log.categoryQrcode
          const event: Event | null = barcode
            ? eventMap.get(barcode.event_category_id) ?? null
            : null

          // kalau pakai filter user dan event-nya bukan milik user → skip
          if (userIdFilter && !event) {
            return null
          }

          return {
            id: log.id,
            qrcode: log.qrcode,
            scanned_at: log.scannedAt?.toISO() ?? null,
            scanned_by: log.scannedBy,
            status: log.status,
            checkout_at: log.checkoutAt?.toISO?.() ?? null,
            checkout_by: log.checkoutBy ?? null,
            barcode: barcode
              ? {
                  id: barcode.id,
                  qrcode: barcode.qrcode,
                  name: barcode.name,
                  other_data: barcode.other_data,
                  event_id: barcode.event_id,
                  event_category_id: barcode.event_category_id,
                }
              : null,
            eventName: event ? event.eventName : null,
            categoryName: event ? event.categoryName : null,
          }
        })
        .filter((row): row is NonNullable<typeof row> => row !== null)

      return response.ok({ logs: payload })
    } catch (error) {
      console.error('Check-in logs error:', error)
      return response.status(500).json({ message: 'Failed to fetch check-in logs' })
    }
  }

  // List tiket yang MASIH Checked-in → untuk halaman checkout
  public async checkedInList({ request, response }: HttpContextContract) {
    const eventIdFilter: string | undefined =
      request.input('eventId') || request.input('event_id')
    const eventCategoryFilter: string | undefined =
      request.input('eventCategoryId') || request.input('event_category_id')

    // 🔐 user filter
    const userIdFilter: string | undefined =
      request.input('userId') || request.input('user_id')

    try {
      const logsQuery = CheckinLog.query()
        .preload('categoryQrcode')
        .where('status', 'Checked-in')
        .orderBy('scanned_at', 'desc')

      if (eventIdFilter) {
        logsQuery.where('event_id', eventIdFilter)
      }

      if (eventCategoryFilter) {
        logsQuery.where('event_category_id', eventCategoryFilter)
      }

      const logs = await logsQuery

      const categoryIds = logs
        .map((log) => log.categoryQrcode?.event_category_id)
        .filter((id): id is string => Boolean(id))

      if (categoryIds.length === 0) {
        return response.ok({ tickets: [] })
      }

      const eventsQuery = Event.query().whereIn('eventCategoryId', categoryIds)

      // ⚠️ Ganti 'user_id' kalau beda
      if (userIdFilter) {
        eventsQuery.andWhere('user_id', userIdFilter)
      }

      const events = await eventsQuery

      const eventMap = new Map<string, Event>()
      events.forEach((ev) => {
        eventMap.set(ev.eventCategoryId, ev)
      })

      const payload = logs
        .map((log) => {
          const barcode = log.categoryQrcode
          const event: Event | null = barcode
            ? eventMap.get(barcode.event_category_id) ?? null
            : null

          if (userIdFilter && !event) {
            return null
          }

          return {
            id: log.id,
            qrcode: log.qrcode,
            scanned_at: log.scannedAt?.toISO() ?? null,
            scanned_by: log.scannedBy,
            barcode: barcode
              ? {
                  id: barcode.id,
                  qrcode: barcode.qrcode,
                  name: barcode.name,
                  other_data: barcode.other_data,
                  event_id: barcode.event_id,
                  event_category_id: barcode.event_category_id,
                }
              : null,
            eventName: event ? event.eventName : null,
            categoryName: event ? event.categoryName : null,
          }
        })
        .filter((row): row is NonNullable<typeof row> => row !== null)

      return response.ok({ tickets: payload })
    } catch (error) {
      console.error('Checked-in list error:', error)
      return response.status(500).json({ message: 'Failed to fetch checked-in tickets' })
    }
  }
}
