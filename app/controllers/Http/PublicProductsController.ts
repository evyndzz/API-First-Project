import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/produk'
import { ExchangeRateService } from '#services/ExchangeRateService'
import { QRCodeService } from '#services/QRCodeService'

const exchangeRateService = new ExchangeRateService()
const qrCodeService = new QRCodeService()

/**
 * @swagger
 * components:
 *   schemas:
 *     PublicProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         nama:
 *           type: string
 *         merk:
 *           type: string
 *         stok:
 *           type: number
 *         harga:
 *           type: number
 *         harga_usd:
 *           type: number
 *         qr_code:
 *           type: string
 *         kategori:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             nama:
 *               type: string
 *         supplier:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             nama:
 *               type: string
 */
export default class PublicProductsController {
  /**
   * @swagger
   * /api/public/products:
   *   get:
   *     tags:
   *       - Public API
   *     summary: Mendapatkan daftar produk dengan konversi mata uang dan QR code
   *     description: Mengembalikan daftar produk dengan harga dalam IDR dan USD, serta QR code untuk setiap produk
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: currency
   *         schema:
   *           type: string
   *           default: USD
   *         description: Mata uang target untuk konversi harga
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Nomor halaman
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Jumlah item per halaman
   *     responses:
   *       200:
   *         description: Daftar produk berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/PublicProduct'
   *                 meta:
   *                   type: object
   *       401:
   *         description: Unauthorized
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const currency = request.input('currency', 'USD')

      const products = await Product.query()
        .preload('category')
        .preload('supplier')
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

      // Get exchange rate
      const exchangeRate = await exchangeRateService.getExchangeRate('IDR', currency)

      // Process products with exchange rate and QR code
      const processedProducts = await Promise.all(
        products.all().map(async (product) => {
          const hargaInTargetCurrency = product.harga / exchangeRate.rate
          const qrCodeUrl = qrCodeService.generateProductQRCode(product.id, product.nama)

          return {
            id: product.id,
            nama: product.nama,
            merk: product.merk,
            stok: product.stok,
            harga: product.harga, // IDR
            harga_usd: parseFloat(hargaInTargetCurrency.toFixed(2)),
            currency: currency,
            exchange_rate: parseFloat(exchangeRate.rate.toFixed(4)),
            qr_code: qrCodeUrl,
            kategori: product.category ? {
              id: product.category.id,
              nama: product.category.nama
            } : null,
            supplier: product.supplier ? {
              id: product.supplier.id,
              nama: product.supplier.nama
            } : null
          }
        })
      )

      return response.json({
        success: true,
        data: processedProducts,
        meta: {
          current_page: products.currentPage,
          last_page: products.lastPage,
          per_page: products.perPage,
          total: products.total
        }
      })
    } catch (error: any) {
      return response.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil data produk'
      })
    }
  }

  /**
   * @swagger
   * /api/public/products/{id}:
   *   get:
   *     tags:
   *       - Public API
   *     summary: Mendapatkan detail produk dengan konversi mata uang dan QR code
   *     description: Mengembalikan detail produk dengan harga dalam IDR dan USD, serta QR code
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID produk
   *       - in: query
   *         name: currency
   *         schema:
   *           type: string
   *           default: USD
   *         description: Mata uang target untuk konversi harga
   *     responses:
   *       200:
   *         description: Detail produk berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/PublicProduct'
   *       404:
   *         description: Produk tidak ditemukan
   *       401:
   *         description: Unauthorized
   */
  async show({ params, request, response }: HttpContext) {
    try {
      const currency = request.input('currency', 'USD')
      
      const product = await Product.query()
        .where('id', params.id)
        .preload('category')
        .preload('supplier')
        .firstOrFail()

      // Get exchange rate
      const exchangeRate = await exchangeRateService.getExchangeRate('IDR', currency)
      const hargaInTargetCurrency = product.harga / exchangeRate.rate
      const qrCodeUrl = qrCodeService.generateProductQRCode(product.id, product.nama)

      return response.json({
        success: true,
        data: {
          id: product.id,
          nama: product.nama,
          merk: product.merk,
          stok: product.stok,
          harga: product.harga, // IDR
          harga_usd: parseFloat(hargaInTargetCurrency.toFixed(2)),
          currency: currency,
          exchange_rate: parseFloat(exchangeRate.rate.toFixed(4)),
          qr_code: qrCodeUrl,
          kategori: product.category ? {
            id: product.category.id,
            nama: product.category.nama
          } : null,
          supplier: product.supplier ? {
            id: product.supplier.id,
            nama: product.supplier.nama
          } : null
        }
      })
    } catch (error: any) {
      return response.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      })
    }
  }
}

