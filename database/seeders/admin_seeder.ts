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
      // Update existing admin to have role and api_access
      existingAdmin.role = 'admin'
      existingAdmin.apiAccess = 'all'
      await existingAdmin.save()
      console.log('ℹ️  Admin user updated with role and API access')
    }

    // Create test user with read-only API access
    const existingTestUser = await User.findBy('email', 'test@inventaris.com')
    
    if (!existingTestUser) {
      await User.create({
        fullName: 'Test User',
        email: 'test@inventaris.com',
        password: await hash.make('test123'),
        role: 'user',
        apiAccess: 'read'
      })
      
      console.log('✅ Test user created successfully!')
      console.log('📧 Email: test@inventaris.com')
      console.log('🔑 Password: test123')
      console.log('👤 Role: user')
      console.log('🔐 API Access: read')
    } else {
      existingTestUser.role = 'user'
      existingTestUser.apiAccess = 'read'
      await existingTestUser.save()
      console.log('ℹ️  Test user updated with role and API access')
    }
  }
}
