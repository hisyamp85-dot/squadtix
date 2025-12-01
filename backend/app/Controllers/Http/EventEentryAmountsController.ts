import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EntryAmountStore from 'App/Services/EntryAmountStore'

export default class EventEntryAmountsController {
  public async update({ params, request, response }: HttpContextContract) {
    const { eventId, categoryId } = params

    // bisa datang sebagai number atau string, kita normalisasi
    const raw = request.input('entry_amount')

    const parsed = typeof raw === 'number' ? raw : Number(raw)

    if (Number.isNaN(parsed) || parsed < 0) {
      return response.badRequest({ error: 'entry_amount must be a non-negative number' })
    }

    await EntryAmountStore.setEntryAmount(String(eventId), String(categoryId), parsed)

    return response.ok({ success: true, entry_amount: parsed })
  }
}
