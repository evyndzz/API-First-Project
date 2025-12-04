import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ApiAccessMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options?: { requiredAccess?: 'all' | 'read' }) {
    try {
      const user = (ctx as any).authUser
      
      if (!user) {
        return ctx.response.status(401).json({
          success: false,
          message: 'Unauthorized. Token tidak valid atau tidak ada.'
        })
      }

      const requiredAccess = options?.requiredAccess || 'read'

      if (!user.hasApiAccess(requiredAccess)) {
        return ctx.response.status(403).json({
          success: false,
          message: `Akses ditolak. User memerlukan akses '${requiredAccess}' untuk endpoint ini.`
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

