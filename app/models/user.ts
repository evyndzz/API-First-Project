import { BaseModel, column } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'admin' | 'user'

  @column()
  declare apiAccess: 'all' | 'read' | 'none'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  get hashedPassword() {
    return this.password
  }

  set hashedPassword(value: string) {
    this.password = hash.make(value)
  }

  /**
   * Generate JWT token
   */
  generateToken(): string {
    return jwt.sign(
      { 
        id: this.id, 
        email: this.email,
        fullName: this.fullName,
        role: this.role,
        apiAccess: this.apiAccess
      },
      env.get('APP_KEY'),
      { expiresIn: '24h' }
    )
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, env.get('APP_KEY'))
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  /**
   * Verify the password
   */
  static async verifyCredentials(email: string, password: string) {
    const user = await this.findBy('email', email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    return user
  }

  /**
   * Check if user has API access
   */
  hasApiAccess(requiredAccess: 'all' | 'read' = 'read'): boolean {
    if (this.apiAccess === 'none') return false
    if (this.apiAccess === 'all') return true
    if (this.apiAccess === 'read' && requiredAccess === 'read') return true
    return false
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.role === 'admin'
  }
}
