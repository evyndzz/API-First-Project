import { Resend } from 'resend'
import env from '#start/env'

export class EmailService {
  private resend: Resend | null = null

  private getResendClient() {
    if (!this.resend) {
      const apiKey = env.get('RESEND_API_KEY', '')
      if (!apiKey) {
        console.warn('Resend API key not configured. Email will be logged to console.')
        return null
      }
      this.resend = new Resend(apiKey)
    }
    return this.resend
  }

  /**
   * Send email notification using Resend API
   */
  async sendEmail(to: string, subject: string, html: string) {
    try {
      const resend = this.getResendClient()
      
      // Skip sending if API key is not configured
      if (!resend) {
        console.log('Email not sent - Resend API key not configured. Email would be sent to:', to)
        console.log('Subject:', subject)
        console.log('Body:', html)
        return { success: true, message: 'Email logged (Resend API key not configured)' }
      }

      const fromEmail = env.get('RESEND_FROM_EMAIL', 'onboarding@resend.dev')
      
      const { data, error } = await resend.emails.send({
        from: `Inventaris System <${fromEmail}>`,
        to: [to],
        subject,
        html,
      })

      if (error) {
        console.error('Resend API error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, messageId: data?.id }
    } catch (error: any) {
      console.error('Email sending error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Send low stock notification
   */
  async sendLowStockNotification(email: string, products: Array<{ nama: string; stok: number }>) {
    const productList = products.map(p => `<li>${p.nama} - Stok: ${p.stok}</li>`).join('')
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">⚠️ Peringatan: Stok Barang Rendah</h2>
        <p>Berikut adalah daftar produk dengan stok rendah:</p>
        <ul>
          ${productList}
        </ul>
        <p style="color: #666; margin-top: 20px;">
          Silakan lakukan restock untuk produk-produk di atas.
        </p>
      </div>
    `

    return await this.sendEmail(
      email,
      'Peringatan: Stok Barang Rendah',
      html
    )
  }

  /**
   * Send transaction notification
   */
  async sendTransactionNotification(
    email: string,
    transactionType: 'masuk' | 'keluar',
    productName: string,
    jumlah: number,
    catatan?: string
  ) {
    const typeLabel = transactionType === 'masuk' ? 'Masuk' : 'Keluar'
    const typeColor = transactionType === 'masuk' ? '#10b981' : '#ef4444'
    const typeIcon = transactionType === 'masuk' ? '📥' : '📤'

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${typeColor};">
          ${typeIcon} Notifikasi Transaksi ${typeLabel}
        </h2>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Produk:</strong> ${productName}</p>
          <p><strong>Jumlah:</strong> ${jumlah}</p>
          <p><strong>Tipe:</strong> ${typeLabel}</p>
          ${catatan ? `<p><strong>Catatan:</strong> ${catatan}</p>` : ''}
        </div>
        <p style="color: #666;">
          Transaksi ini telah dicatat dalam sistem inventaris.
        </p>
      </div>
    `

    return await this.sendEmail(
      email,
      `Notifikasi Transaksi ${typeLabel} - ${productName}`,
      html
    )
  }
}

