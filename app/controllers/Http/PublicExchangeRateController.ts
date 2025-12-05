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
 */
export default class PublicExchangeRateController {
  /**
   * @swagger
   * /api/public/exchange-rate:
   *   get:
   *     tags:
   *       - Public API
   *     summary: Mendapatkan exchange rate antara dua mata uang
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           default: USD
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           default: IDR
   *     responses:
   *       200:
   *         description: Exchange rate berhasil diambil
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
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: amount
   *         required: true
   *         schema:
   *           type: number
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           default: USD
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           default: IDR
   *     responses:
   *       200:
   *         description: Konversi berhasil
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
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Daftar mata uang berhasil diambil
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

