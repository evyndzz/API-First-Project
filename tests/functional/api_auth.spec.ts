import { test } from '@japa/runner'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

test.group('API Authentication', () => {
  test('should login and get JWT token', async ({ client, assert }) => {
    // Create test user
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: await hash.make('password123'),
      role: 'user',
      apiAccess: 'read'
    })

    const response = await client.post('/api/auth/login').json({
      email: 'test@example.com',
      password: 'password123'
    })

    response.assertStatus(200)
    assert.property(response.body(), 'success')
    assert.isTrue(response.body().success)
    assert.property(response.body(), 'token')
    assert.isString(response.body().token)
    assert.property(response.body(), 'user')
    assert.equal(response.body().user.email, 'test@example.com')

    // Cleanup
    await user.delete()
  })

  test('should reject login with invalid credentials', async ({ client, assert }) => {
    const response = await client.post('/api/auth/login').json({
      email: 'invalid@example.com',
      password: 'wrongpassword'
    })

    response.assertStatus(401)
    assert.property(response.body(), 'success')
    assert.isFalse(response.body().success)
    assert.property(response.body(), 'message')
  })

  test('should reject login for user without API access', async ({ client, assert }) => {
    // Create user without API access
    const user = await User.create({
      fullName: 'No Access User',
      email: 'noaccess@example.com',
      password: await hash.make('password123'),
      role: 'user',
      apiAccess: 'none'
    })

    const response = await client.post('/api/auth/login').json({
      email: 'noaccess@example.com',
      password: 'password123'
    })

    response.assertStatus(403)
    assert.property(response.body(), 'success')
    assert.isFalse(response.body().success)
    assert.property(response.body(), 'message')

    // Cleanup
    await user.delete()
  })

  test('should get user profile with valid token', async ({ client, assert }) => {
    // Create test user
    const user = await User.create({
      fullName: 'Test User',
      email: 'profile@example.com',
      password: await hash.make('password123'),
      role: 'user',
      apiAccess: 'read'
    })

    // Login to get token
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'profile@example.com',
      password: 'password123'
    })

    const token = loginResponse.body().token

    // Get profile with token
    const profileResponse = await client.get('/api/auth/profile')
      .header('Authorization', `Bearer ${token}`)

    profileResponse.assertStatus(200)
    assert.property(profileResponse.body(), 'success')
    assert.isTrue(profileResponse.body().success)
    assert.property(profileResponse.body(), 'user')
    assert.equal(profileResponse.body().user.email, 'profile@example.com')

    // Cleanup
    await user.delete()
  })

  test('should reject profile request without token', async ({ client, assert }) => {
    const response = await client.get('/api/auth/profile')

    response.assertStatus(401)
    assert.property(response.body(), 'success')
    assert.isFalse(response.body().success)
    assert.property(response.body(), 'message')
  })
})

