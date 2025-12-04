import axios from 'axios'

export class QRCodeService {
  private baseUrl = 'https://api.qrserver.com/v1/create-qr-code'

  /**
   * Generate QR code URL
   */
  generateQRCodeUrl(
    data: string,
    size: number = 200,
    format: 'png' | 'svg' = 'png'
  ): string {
    const params = new URLSearchParams({
      size: `${size}x${size}`,
      data: data,
      format: format
    })

    return `${this.baseUrl}/?${params.toString()}`
  }

  /**
   * Generate QR code for product
   */
  generateProductQRCode(productId: number, productName: string): string {
    const data = JSON.stringify({
      type: 'product',
      id: productId,
      name: productName,
      timestamp: Date.now()
    })
    
    return this.generateQRCodeUrl(data, 300, 'png')
  }

  /**
   * Generate QR code for transaction
   */
  generateTransactionQRCode(transactionId: number, transactionType: string): string {
    const data = JSON.stringify({
      type: 'transaction',
      id: transactionId,
      transactionType: transactionType,
      timestamp: Date.now()
    })
    
    return this.generateQRCodeUrl(data, 300, 'png')
  }

  /**
   * Generate simple text QR code
   */
  generateTextQRCode(text: string, size: number = 200): string {
    return this.generateQRCodeUrl(text, size, 'png')
  }
}

