import type { HttpContext } from '@adonisjs/core/http'
import { ExchangeRateService } from '#services/ExchangeRateService'
import Product from '#models/produk'

const exchangeRateService = new ExchangeRateService()

export default class UiExchangeRateController {
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

  async getProducts({ response }: HttpContext) {
    try {
      const products = await Product.query()
        .orderBy('nama')
        .limit(100)

      return response.json({
        success: true,
        data: products.map(p => ({
          id: p.id,
          nama: p.nama,
          merk: p.merk,
          harga: p.harga
        }))
      })
    } catch (error: any) {
      return response.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil daftar produk'
      })
    }
  }

  async convertProductPrice({ request, response }: HttpContext) {
    try {
      const productId = request.input('productId')
      const toCurrency = request.input('to', 'USD')

      if (!productId) {
        return response.status(400).json({
          success: false,
          message: 'Product ID harus diisi'
        })
      }

      const product = await Product.findOrFail(productId)
      
      // ExchangeRate-API uses USD as base, so we need to convert IDR -> USD -> target currency
      // First get IDR to USD rate (inverse of USD to IDR)
      const usdToIdrRate = await exchangeRateService.getExchangeRate('USD', 'IDR')
      const idrToUsdRate = 1 / usdToIdrRate.rate
      
      // Then get USD to target currency rate
      if (toCurrency === 'USD') {
        const hargaInTargetCurrency = product.harga * idrToUsdRate
        return response.json({
          success: true,
          data: {
            product_id: product.id,
            product_name: product.nama,
            original_price: product.harga,
            original_currency: 'IDR',
            converted_price: parseFloat(hargaInTargetCurrency.toFixed(2)),
            target_currency: toCurrency,
            exchange_rate: parseFloat(idrToUsdRate.toFixed(4))
          }
        })
      } else {
        // Convert IDR -> USD -> target currency
        const usdToTargetRate = await exchangeRateService.getExchangeRate('USD', toCurrency)
        const hargaInUsd = product.harga * idrToUsdRate
        const hargaInTargetCurrency = hargaInUsd * usdToTargetRate.rate
        const idrToTargetRate = idrToUsdRate * usdToTargetRate.rate
        
        return response.json({
          success: true,
          data: {
            product_id: product.id,
            product_name: product.nama,
            original_price: product.harga,
            original_currency: 'IDR',
            converted_price: parseFloat(hargaInTargetCurrency.toFixed(2)),
            target_currency: toCurrency,
            exchange_rate: parseFloat(idrToTargetRate.toFixed(4))
          }
        })
      }
    } catch (error: any) {
      return response.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      })
    }
  }
}

