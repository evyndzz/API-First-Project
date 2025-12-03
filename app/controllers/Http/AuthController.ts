import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
<<<<<<< HEAD
import { loginValidator } from '#validators/auth_validator'

export default class AuthController {

  /**
   * Login admin with password only
   */
=======


export default class AuthController {
>>>>>>> dfea00d (tambahkan)
  async login({ request, response, session, inertia }: HttpContext) {
    try {
      const { password } = request.only(['password'])

<<<<<<< HEAD
      // Validate password is provided
=======
>>>>>>> dfea00d (tambahkan)
      if (!password) {
        return inertia.render('login', {
          errors: { password: 'Password harus diisi' }
        })
      }

<<<<<<< HEAD
      // Find admin user (default admin)
=======
>>>>>>> dfea00d (tambahkan)
      const adminUser = await User.findBy('email', 'admin@inventaris.com')
      if (!adminUser) {
        return inertia.render('login', {
          errors: { password: 'Admin user tidak ditemukan. Silakan jalankan seeder terlebih dahulu.' }
        })
      }

<<<<<<< HEAD
      // Verify password
=======
>>>>>>> dfea00d (tambahkan)
      const isPasswordValid = await hash.verify(adminUser.password, password)
      if (!isPasswordValid) {
        return inertia.render('login', {
          errors: { password: 'Password salah' }
        })
      }

<<<<<<< HEAD
      // Generate JWT token
      const token = adminUser.generateToken()

      // Store token in session for Inertia.js
=======
      const token = adminUser.generateToken()

>>>>>>> dfea00d (tambahkan)
      session.put('auth_token', token)
      session.put('user', {
        id: adminUser.id,
        fullName: adminUser.fullName,
        email: adminUser.email
      })

<<<<<<< HEAD
      // Redirect to dashboard
=======
>>>>>>> dfea00d (tambahkan)
      return response.redirect('/dashboard')
    } catch (error) {
      return inertia.render('login', {
        errors: { password: 'Terjadi kesalahan saat login: ' + error.message }
      })
    }
  }
<<<<<<< HEAD

  /**
   * Logout user
   */
  async logout({ session, response }: HttpContext) {
    try {
      // Clear session
      session.forget(['auth_token', 'user'])
=======
  async logout({ session, response }: HttpContext) {
    try {
      session.forget('auth_token')
      session.forget('user')
>>>>>>> dfea00d (tambahkan)
      
      return response.redirect('/login')
    } catch (error) {
      return response.redirect('/login')
    }
  }
<<<<<<< HEAD

  /**
   * Get current user profile
   */
=======
>>>>>>> dfea00d (tambahkan)
  async profile({ session, response }: HttpContext) {
    try {
      const user = session.get('user')
      
      if (!user) {
        return response.unauthorized({
          message: 'User tidak ditemukan'
        })
      }
      
      return response.ok({
        user: user
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Terjadi kesalahan saat mengambil profil',
        error: error.message
      })
    }
  }
<<<<<<< HEAD

  /**
   * Refresh token
   */
=======
>>>>>>> dfea00d (tambahkan)
  async refresh({ session, response }: HttpContext) {
    try {
      const user = session.get('user')
      
      if (!user) {
        return response.unauthorized({
          message: 'User tidak ditemukan'
        })
      }
      
<<<<<<< HEAD
      // Get user from database
=======
>>>>>>> dfea00d (tambahkan)
      const adminUser = await User.findBy('email', user.email)
      if (!adminUser) {
        return response.unauthorized({
          message: 'User tidak ditemukan'
        })
      }
      
<<<<<<< HEAD
      // Create new token
      const token = adminUser.generateToken()
      
      // Update session
=======
      const token = adminUser.generateToken()
      
>>>>>>> dfea00d (tambahkan)
      session.put('auth_token', token)
      
      return response.ok({
        message: 'Token berhasil diperbarui',
        token: token
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Terjadi kesalahan saat memperbarui token',
        error: error.message
      })
    }
  }
}
