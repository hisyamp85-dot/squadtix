import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    // Clear existing users
    await User.query().delete()

    await User.create({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'Admin',
      status: 'Active',
    })

    await User.create({
      name: 'Admin User 2',
      username: 'admin2',
      email: 'admin2@example.com',
      password: 'password',
      role: 'Admin',
      status: 'Active',
    })

    await User.create({
      name: 'Admin User 3',
      username: 'admin3',
      email: 'admin3@example.com',
      password: 'password',
      role: 'Admin',
      status: 'Active',
    })

    await User.create({
      name: 'Regular User',
      username: 'user',
      email: 'user@example.com',
      password: 'password',
      role: 'User',
      status: 'Active',
    })
  }
}
