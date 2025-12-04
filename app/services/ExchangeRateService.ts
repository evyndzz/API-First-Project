import axios from 'axios'

export class ExchangeRateService {
  private baseUrl = 'https://api.exchangerate-api.com/v4/latest'

  /**
   * Get exchange rate from USD to target currency
   */
  async getExchangeRate(from: string = 'USD', to: string = 'IDR'): Promise<{
    from: string
    to: string
    rate: number
    timestamp: number
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/${from}`)
      const rates = response.data.rates
      
      if (!rates[to]) {
        throw new Error(`Currency ${to} not found`)
      }

      return {
        from,
        to,
        rate: rates[to],
        timestamp: Date.now()
      }
    } catch (error: any) {
      throw new Error(`Failed to fetch exchange rate: ${error.message}`)
    }
  }

  /**
   * Convert amount from one currency to another
   */
  async convertCurrency(
    amount: number,
    from: string = 'USD',
    to: string = 'IDR'
  ): Promise<{
    from: string
    to: string
    amount: number
    convertedAmount: number
    rate: number
    timestamp: number
  }> {
    const exchangeRate = await this.getExchangeRate(from, to)
    
    return {
      from,
      to,
      amount,
      convertedAmount: amount * exchangeRate.rate,
      rate: exchangeRate.rate,
      timestamp: exchangeRate.timestamp
    }
  }

  /**
   * Get all available currencies
   */
  async getAvailableCurrencies(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/USD`)
      return Object.keys(response.data.rates)
    } catch (error: any) {
      throw new Error(`Failed to fetch currencies: ${error.message}`)
    }
  }
}

