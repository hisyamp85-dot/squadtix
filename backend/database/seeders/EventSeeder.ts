import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Event from 'App/Models/Event'
import { randomUUID } from 'node:crypto'

export default class EventSeeder extends BaseSeeder {
  public async run () {
    // Force seed events

    const eventId = randomUUID()
    const eventCategoryId1 = randomUUID()
    const eventCategoryId2 = randomUUID()

    await Event.createMany([
      {
        eventId,
        eventName: 'Sample Event',
        eventCategoryId: eventCategoryId1,
        categoryName: 'VIP',
        status: 'Active',
      },
      {
        eventId,
        eventName: 'Sample Event',
        eventCategoryId: eventCategoryId2,
        categoryName: 'Regular',
        status: 'Active',
      },
    ])
  }
}
