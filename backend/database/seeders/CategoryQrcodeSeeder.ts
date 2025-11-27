import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CategoryQrcode from 'App/Models/CategoryQrcode'
import Event from 'App/Models/Event'

export default class extends BaseSeeder {
  public async run () {
    // Get the first event to associate barcodes with
    const event = await Event.query().first()

    if (!event) {
      console.log('No events found, skipping barcode seeding')
      return
    }

    // Create sample barcodes with id_transaction
    await CategoryQrcode.createMany([
      {
        event_id: event.eventId,
        event_category_id: event.eventCategoryId,
        qrcode: 'ABC123',
        name: 'John Doe',
        other_data: 'VIP Guest',
        id_transaction: 'TXN001'
      },
      {
        event_id: event.eventId,
        event_category_id: event.eventCategoryId,
        qrcode: 'ABC124',
        name: 'Jane Smith',
        other_data: 'VIP Guest',
        id_transaction: 'TXN001'
      },
      {
        event_id: event.eventId,
        event_category_id: event.eventCategoryId,
        qrcode: 'DEF456',
        name: 'Bob Johnson',
        other_data: 'Regular Guest',
        id_transaction: 'TXN002'
      }
    ])
  }
}
