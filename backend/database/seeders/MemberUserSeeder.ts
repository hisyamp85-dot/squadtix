import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import MemberUser from 'App/Models/MemberUser'

export default class MemberUserSeeder extends BaseSeeder {
  public async run () {
    const memberUserCount = await MemberUser.query().count('* as total').first()
    if (memberUserCount && memberUserCount.$extras.total > 0) {
      console.log('MemberUsers already seeded, skipping seeding.')
      return
    }
    await MemberUser.create({
      username: 'groupuser1',
      password: 'password123',
      status: 'Active',
      section: 'IT',
      idUser: 1,
    })
    await MemberUser.create({
      username: 'groupuser2',
      password: 'password123',
      status: 'Active',
      section: 'HR',
      idUser: 1,
    })
    await MemberUser.create({
      username: 'groupuser3',
      password: 'password123',
      status: 'Inactive',
      section: 'Finance',
      idUser: 2,
    })
  }
}
