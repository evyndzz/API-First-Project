import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options?: { roles?: string[] }) {
    try {
      const user = (ctx as any).authUser
      
      if (!user) {
        return ctx.response.status(401).json({
          success: false,
          message: 'Unauthorized. Token tidak valid atau tidak ada.'
        })
      }

      const allowedRoles = options?.roles || ['admin']

      if (!allowedRoles.includes(user.role)) {
        return ctx.response.status(403).json({
          success: false,
          message: `Akses ditolak. Role '${user.role}' tidak memiliki akses ke endpoint ini.`
        })
      }

      await next()
    } catch (error) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Unauthorized. Token tidak valid atau tidak ada.'
      })
    }
  }
}

