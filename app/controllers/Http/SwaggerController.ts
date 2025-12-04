import type { HttpContext } from '@adonisjs/core/http'
import { swaggerSpec } from '#config/swagger'

export default class SwaggerController {
  /**
   * Serve Swagger JSON specification
   */
  async index({ response }: HttpContext) {
    return response.json(swaggerSpec)
  }
}

