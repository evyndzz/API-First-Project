import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  async run() {
    const existingAdmin = await User.findBy('email', 'admin@inventaris.com')
    
    if (!existingAdmin) {
      await User.create({
        fullName: 'Administrator',
        email: 'admin@inventaris.com',
        password: await hash.make('admin123'),
        role: 'admin',
        apiAccess: 'all'
      })
      
      console.log('✅ Admin user created successfully!')
      console.log('📧 Email: admin@inventaris.com')
      console.log('🔑 Password: admin123')
      console.log('👤 Role: admin')
      console.log('🔐 API Access: all')
    } else {
      existingAdmin.role = 'admin'
      existingAdmin.apiAccess = 'all'
      await existingAdmin.save()
      console.log('ℹ️  Admin user updated with role and API access')
    }
  }
}
