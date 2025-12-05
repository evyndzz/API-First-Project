import { test } from '@japa/runner'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import Product from '#models/produk'
import Category from '#models/kategori'

test.group('Public API', () => {
  test('should get products list with exchange rate and QR code', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'API Test User',
      email: 'apitest@example.com',
      password: await hash.make('password123'),
      role: 'user',
      apiAccess: 'read'
    })

    const loginResponse = await client.post('/api/auth/login').json({
      email: 'apitest@example.com',
      password: 'password123'
    })

    const token = loginResponse.body().token

    const category = await Category.create({
      nama: 'Test Category'
    })

    const product = await Product.create({
      nama: 'Test Product',
      merk: 'Test Brand',
      stok: 10,
      harga: 1000000,
      kategori_id: category.id,
      supplier_id: 1
    })

    const response = await client.get('/api/public/products')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.property(response.body(), 'success')
    assert.isTrue(response.body().success)
    assert.property(response.body(), 'data')
    assert.isArray(response.body().data)

    await product.delete()
    await category.delete()
    await user.delete()
  })

  test('should get exchange rate', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'API Test User',
      email: 'apitest2@example.com',
      password: await hash.make('password123'),
      role: 'user',
      apiAccess: 'read'
    })

    const loginResponse = await client.post('/api/auth/login').json({
      email: 'apitest2@example.com',
      password: 'password123'
    })

    const token = loginResponse.body().token

    const response = await client.get('/api/public/exchange-rate?from=USD&to=IDR')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.property(response.body(), 'success')
    assert.isTrue(response.body().success)
    assert.property(response.body(), 'data')
    assert.property(response.body().data, 'rate')
    assert.isNumber(response.body().data.rate)

    await user.delete()
  })

  test('should convert currency', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'API Test User',
      email: 'apitest3@example.com',
      password: await hash.make('password123'),
      role: 'user',
      apiAccess: 'read'
    })

    const loginResponse = await client.post('/api/auth/login').json({
      email: 'apitest3@example.com',
      password: 'password123'
    })

    const token = loginResponse.body().token

    const response = await client.get('/api/public/exchange-rate/convert?amount=100&from=USD&to=IDR')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.property(response.body(), 'success')
    assert.isTrue(response.body().success)
    assert.property(response.body(), 'data')
    assert.property(response.body().data, 'convertedAmount')
    assert.isNumber(response.body().data.convertedAmount)

    await user.delete()
  })

  test('should reject API request without token', async ({ client, assert }) => {
    const response = await client.get('/api/public/products')

    response.assertStatus(401)
    assert.property(response.body(), 'success')
    assert.isFalse(response.body().success)
  })

  test('should reject API request with user without API access', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'No Access',
      email: 'noaccess2@example.com',
      password: await hash.make('password123'),
      role: 'user',
      apiAccess: 'none'
    })

    const loginResponse = await client.post('/api/auth/login').json({
      email: 'noaccess2@example.com',
      password: 'password123'
    })

    loginResponse.assertStatus(403)

    await user.delete()
  })
})

