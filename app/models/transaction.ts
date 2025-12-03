import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Product from './produk.js'
<<<<<<< HEAD
=======
import Supplier from './supplier.js'
>>>>>>> dfea00d (tambahkan)

export default class Transaction extends BaseModel {
  static table = 'transactions'

  @column({ isPrimary: true })
  declare id: number

  @column()
<<<<<<< HEAD
  declare tipe: string // 'masuk' or 'keluar'
=======
  declare tipe: string
>>>>>>> dfea00d (tambahkan)

  @column()
  declare jumlah: number

  @column()
  declare catatan: string

  @column()
  declare produk_id: number

<<<<<<< HEAD
=======
  @column()
  declare supplier_id: number

>>>>>>> dfea00d (tambahkan)
  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => Product, {
    foreignKey: 'produk_id'
  })
  declare product: BelongsTo<typeof Product>
<<<<<<< HEAD
=======

  @belongsTo(() => Supplier, {
    foreignKey: 'supplier_id'
  })
  declare supplier: BelongsTo<typeof Supplier>
>>>>>>> dfea00d (tambahkan)
}
