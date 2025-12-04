import { test } from '@japa/runner'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import Product from '#models/produk'
import Category from '#models/kategori'

test.group('Public API', (group) => {
  let authToken: string
  let testUser: User

  group.setup(async () => {
    // Create test user with API access
    testUser = await User.create({
      fullName: 'API Test User',
      email: 'apitest@example.com',
      password: await hash.make('password123'),
      role: 'user',
      apiAccess: 'read'
    })
  })

  group.teardown(async () => {
    if (testUser) {
      await testUser.delete()
    }
  })

  test('should login and get token', async ({ client, assert }) => {
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'apitest@example.com',
      password: 'password123'
    })

    loginResponse.assertStatus(200)
    authToken = loginResponse.body().token
    assert.isString(authToken)
  })

  test('should get products list with exchange rate and QR code', async ({ client, assert }) => {
    // Login first to get token
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'apitest@example.com',
      password: 'password123'
    })
    const token = loginResponse.body().token
    // Create test category and product
    const category = await Category.create({
      nama: 'Test Category'
    })

    const product = await Product.create({
      nama: 'Test Product',
      merk: 'Test Brand',
      stok: 10,
      harga: 1000000,
      kategori_id: category.id,
      supplier_id: 1 // Assuming supplier exists
    })

    const response = await client.get('/api/public/products')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.property(response.body(), 'success')
    assert.isTrue(response.body().success)
    assert.property(response.body(), 'data')
    assert.isArray(response.body().data)
    
    if (response.body().data.length > 0) {
      const firstProduct = response.body().data[0]
      assert.property(firstProduct, 'harga_usd')
      assert.property(firstProduct, 'qr_code')
      assert.isString(firstProduct.qr_code)
    }

    // Cleanup
    await product.delete()
    await category.delete()
  })

  test('should get exchange rate', async ({ client, assert }) => {
    // Login first to get token
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'apitest@example.com',
      password: 'password123'
    })
    const token = loginResponse.body().token

    const response = await client.get('/api/public/exchange-rate?from=USD&to=IDR')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.property(response.body(), 'success')
    assert.isTrue(response.body().success)
    assert.property(response.body(), 'data')
    assert.property(response.body().data, 'from')
    assert.property(response.body().data, 'to')
    assert.property(response.body().data, 'rate')
    assert.isNumber(response.body().data.rate)
  })

  test('should convert currency', async ({ client, assert }) => {
    // Login first to get token
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'apitest@example.com',
      password: 'password123'
    })
    const token = loginResponse.body().token

    const response = await client.get('/api/public/exchange-rate/convert?amount=100&from=USD&to=IDR')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.property(response.body(), 'success')
    assert.isTrue(response.body().success)
    assert.property(response.body(), 'data')
    assert.property(response.body().data, 'amount')
    assert.property(response.body().data, 'convertedAmount')
    assert.property(response.body().data, 'rate')
    assert.equal(response.body().data.amount, 100)
    assert.isNumber(response.body().data.convertedAmount)
  })

  test('should get available currencies', async ({ client, assert }) => {
    // Login first to get token
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'apitest@example.com',
      password: 'password123'
    })
    const token = loginResponse.body().token

    const response = await client.get('/api/public/exchange-rate/currencies')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.property(response.body(), 'success')
    assert.isTrue(response.body().success)
    assert.property(response.body(), 'data')
    assert.isArray(response.body().data)
    assert.isTrue(response.body().data.length > 0)
  })

  test('should reject API request without token', async ({ client, assert }) => {
    const response = await client.get('/api/public/products')

    response.assertStatus(401)
    assert.property(response.body(), 'success')
    assert.isFalse(response.body().success)
    assert.property(response.body(), 'message')
  })

  test('should reject API request with user without API access', async ({ client, assert }) => {
    // Create user without API access
    const noAccessUser = await User.create({
      fullName: 'No Access',
      email: 'noaccess2@example.com',
      password: await hash.make('password123'),
      role: 'user',
      apiAccess: 'none'
    })

    // Login to get token
    const loginResponse = await client.post('/api/auth/login').json({
      email: 'noaccess2@example.com',
      password: 'password123'
    })

    // Should fail at login
    loginResponse.assertStatus(403)

    // Cleanup
    await noAccessUser.delete()
  })
})

