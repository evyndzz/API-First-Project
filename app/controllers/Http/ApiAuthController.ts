import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     ApiLoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         token:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             email:
 *               type: string
 *             fullName:
 *               type: string
 *             role:
 *               type: string
 *             apiAccess:
 *               type: string
 *     ApiProfileResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         user:
 *           type: object
 */
export default class ApiAuthController {
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags:
   *       - API Authentication
   *     summary: Login untuk mendapatkan API token
   *     description: Login dengan email dan password untuk mendapatkan JWT token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ApiLoginRequest'
   *     responses:
   *       200:
   *         description: Login berhasil
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiLoginResponse'
   *       401:
   *         description: Kredensial tidak valid
   *       403:
   *         description: User tidak memiliki akses API
   */
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      if (!email || !password) {
        return response.status(400).json({
          success: false,
          message: 'Email dan password harus diisi'
        })
      }

      const user = await User.verifyCredentials(email, password)

      if (!user.hasApiAccess('read')) {
        return response.status(403).json({
          success: false,
          message: 'User tidak memiliki akses API'
        })
      }

      const token = user.generateToken()

      return response.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          apiAccess: user.apiAccess
        }
      })
    } catch (error: any) {
      return response.status(401).json({
        success: false,
        message: error.message || 'Kredensial tidak valid'
      })
    }
  }

  /**
   * @swagger
   * /api/auth/profile:
   *   get:
   *     tags:
   *       - API Authentication
   *     summary: Mendapatkan profil user yang sedang login
   *     description: Mengembalikan informasi user berdasarkan JWT token
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Profil user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiProfileResponse'
   *       401:
   *         description: Token tidak valid atau tidak ada
   */
  async profile(ctx: HttpContext) {
    try {
      const user = (ctx as any).authUser
      
      if (!user) {
        return ctx.response.status(401).json({
          success: false,
          message: 'Token tidak valid atau tidak ada'
        })
      }
      
      return ctx.response.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          apiAccess: user.apiAccess
        }
      })
    } catch (error: any) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Token tidak valid atau tidak ada'
      })
    }
  }
}

