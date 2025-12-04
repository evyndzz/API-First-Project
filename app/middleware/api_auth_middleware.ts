import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class ApiAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      const authHeader = ctx.request.header('authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ctx.response.status(401).json({
          success: false,
          message: 'Unauthorized. Token tidak valid atau tidak ada.'
        })
      }

      const token = authHeader.substring(7)
      
      try {
        const decoded = jwt.verify(token, env.get('APP_KEY')) as any
        
        const user = await User.find(decoded.id)
        
        if (!user) {
          return ctx.response.status(401).json({
            success: false,
            message: 'Unauthorized. User tidak ditemukan.'
          })
        }

        // Attach user to context
        ctx.authUser = user as any
        
        await next()
      } catch (error) {
        return ctx.response.status(401).json({
          success: false,
          message: 'Unauthorized. Token tidak valid atau tidak ada.'
        })
      }
    } catch (error) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Unauthorized. Token tidak valid atau tidak ada.'
      })
    }
  }
}

