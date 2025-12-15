import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'

export default class AdminUserSeeder extends BaseSeeder {
  public async run () {
    // 1. Hapus user admin lama menggunakan Query Builder (bypass Model)
    await Database.from('users')
      .where('username', 'admin')
      .orWhere('email', 'admin@squadtix.com')
      .delete()

    // 2. Buat hash password secara manual
    const hashedPassword = await Hash.make('password123')

    // 3. Insert data langsung ke tabel users
    // Ini memastikan password ter-hash dengan benar dan status sesuai,
    // tanpa terpengaruh oleh hook Model yang mungkin bermasalah.
    await Database.table('users').insert({
      email: 'admin@squadtix.com',
      password: hashedPassword,
      name: 'Admin Squadtix',
      username: 'admin',
      role: 'admin',
      status: 'Active',
      created_at: DateTime.now().toSQL(),
      updated_at: DateTime.now().toSQL(),
    })
  }
}