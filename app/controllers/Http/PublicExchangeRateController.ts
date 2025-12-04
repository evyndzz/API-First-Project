import type { HttpContext } from '@adonisjs/core/http'
import { ExchangeRateService } from '#services/ExchangeRateService'

const exchangeRateService = new ExchangeRateService()

/**
 * @swagger
 * components:
 *   schemas:
 *     ExchangeRateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             from:
 *               type: string
 *             to:
 *               type: string
 *             rate:
 *               type: number
 *             timestamp:
 *               type: number
 *     CurrencyConversionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             from:
 *               type: string
 *             to:
 *               type: string
 *             amount:
 *               type: number
 *             convertedAmount:
 *               type: number
 *             rate:
 *               type: number
 *             timestamp:
 *               type: number
 */
export default class PublicExchangeRateController {
  /**
   * @swagger
   * /api/public/exchange-rate:
   *   get:
   *     tags:
   *       - Public API
   *     summary: Mendapatkan exchange rate antara dua mata uang
   *     description: Mengembalikan exchange rate dari mata uang sumber ke mata uang target
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           default: USD
   *         description: Mata uang sumber
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           default: IDR
   *         description: Mata uang target
   *     responses:
   *       200:
   *         description: Exchange rate berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ExchangeRateResponse'
   *       400:
   *         description: Parameter tidak valid
   *       401:
   *         description: Unauthorized
   */
  async getExchangeRate({ request, response }: HttpContext) {
    try {
      const from = request.input('from', 'USD')
      const to = request.input('to', 'IDR')

      const exchangeRate = await exchangeRateService.getExchangeRate(from, to)

      return response.json({
        success: true,
        data: exchangeRate
      })
    } catch (error: any) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Gagal mengambil exchange rate'
      })
    }
  }

  /**
   * @swagger
   * /api/public/exchange-rate/convert:
   *   get:
   *     tags:
   *       - Public API
   *     summary: Konversi jumlah uang dari satu mata uang ke mata uang lain
   *     description: Mengkonversi jumlah uang dari mata uang sumber ke mata uang target
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: amount
   *         required: true
   *         schema:
   *           type: number
   *         description: Jumlah uang yang akan dikonversi
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           default: USD
   *         description: Mata uang sumber
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           default: IDR
   *         description: Mata uang target
   *     responses:
   *       200:
   *         description: Konversi berhasil
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CurrencyConversionResponse'
   *       400:
   *         description: Parameter tidak valid
   *       401:
   *         description: Unauthorized
   */
  async convertCurrency({ request, response }: HttpContext) {
    try {
      const amount = request.input('amount')
      const from = request.input('from', 'USD')
      const to = request.input('to', 'IDR')

      if (!amount || isNaN(parseFloat(amount))) {
        return response.status(400).json({
          success: false,
          message: 'Parameter amount harus diisi dan berupa angka'
        })
      }

      const conversion = await exchangeRateService.convertCurrency(
        parseFloat(amount),
        from,
        to
      )

      return response.json({
        success: true,
        data: conversion
      })
    } catch (error: any) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Gagal melakukan konversi mata uang'
      })
    }
  }

  /**
   * @swagger
   * /api/public/exchange-rate/currencies:
   *   get:
   *     tags:
   *       - Public API
   *     summary: Mendapatkan daftar mata uang yang tersedia
   *     description: Mengembalikan daftar semua mata uang yang tersedia untuk konversi
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Daftar mata uang berhasil diambil
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
   *                     type: string
   *       401:
   *         description: Unauthorized
   */
  async getAvailableCurrencies({ response }: HttpContext) {
    try {
      const currencies = await exchangeRateService.getAvailableCurrencies()

      return response.json({
        success: true,
        data: currencies
      })
    } catch (error: any) {
      return response.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil daftar mata uang'
      })
    }
  }
}

