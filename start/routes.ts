import router from '@adonisjs/core/services/router'

// Public routes (tidak perlu authentication)
router.get('/', async ({ inertia }) => {
  return inertia.render('home')
})

router.get('/login', async ({ inertia }) => {
  return inertia.render('login')
})

// Authentication routes (public)
router.group(() => {
  router.post('/login', '#controllers/Http/AuthController.login')
}).prefix('/api/auth')

// Logout route (public)
router.post('/logout', '#controllers/Http/AuthController.logout')

// Protected UI routes (membutuhkan authentication)
router.group(() => {
  router.get('/dashboard', async (ctx) => {
    const { inertia, session, response } = ctx
    const authToken = session.get('auth_token')
    const user = session.get('user')
    
    if (!authToken || !user) {
      return response.redirect('/login')
    }
    
    const DashboardController = (await import('#controllers/Http/DashboardController')).default
    const dashboardController = new DashboardController()
    return await dashboardController.index(ctx)
  })
  
  router.get('/categories', async ({ inertia, session, response }) => {
    const authToken = session.get('auth_token')
    const user = session.get('user')
    
    if (!authToken || !user) {
      return response.redirect('/login')
    }
    
    const Category = (await import('#models/kategori')).default
    
    const categories = await Category.query()
      .preload('products')
      .orderBy('nama')
    
    const flashSuccess = session.flashMessages.get('success')
    const flashError = session.flashMessages.get('error')
    
    return inertia.render('categories/index', {
      categories: { data: categories, meta: {} },
      flash: (flashSuccess || flashError) ? {
        success: flashSuccess || undefined,
        error: flashError || undefined
      } : undefined
    })
  })
  
  router.get('/products', async ({ inertia, session, response }) => {
    const authToken = session.get('auth_token')
    const user = session.get('user')
    
    if (!authToken || !user) {
      return response.redirect('/login')
    }
    
    const Product = (await import('#models/produk')).default
    const Category = (await import('#models/kategori')).default
    
    const products = await Product.query()
      .preload('category')
      .orderBy('created_at', 'desc')
    
    const categories = await Category.query()
      .orderBy('nama')
    
    const flashSuccess = session.flashMessages.get('success')
    const flashError = session.flashMessages.get('error')
    
    return inertia.render('products/index', {
      products: { data: products, meta: {} },
      categories: categories,
      flash: (flashSuccess || flashError) ? {
        success: flashSuccess || undefined,
        error: flashError || undefined
      } : undefined
    })
  })
  
  router.get('/transactions', async ({ inertia, session, response }) => {
    const authToken = session.get('auth_token')
    const user = session.get('user')
    
    if (!authToken || !user) {
      return response.redirect('/login')
    }
    
    const Transaction = (await import('#models/transaction')).default
    const Product = (await import('#models/produk')).default
    const Supplier = (await import('#models/supplier')).default
    
    const transactions = await Transaction.query()
      .preload('product')
      .preload('supplier')
      .orderBy('created_at', 'desc')
    
    const serializedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      produk_id: transaction.produk_id,
      tipe: transaction.tipe,
      jumlah: transaction.jumlah,
      catatan: transaction.catatan,
      supplier_id: transaction.supplier_id,
      created_at: transaction.created_at?.toString() || new Date().toISOString(),
      updated_at: transaction.updated_at?.toString() || new Date().toISOString(),
      product: transaction.product,
      supplier: transaction.supplier
    }))
    
    const products = await Product.query()
      .orderBy('nama')
    
    const suppliers = await Supplier.query()
      .orderBy('nama')
    
    const flashSuccess = session.flashMessages.get('success')
    const flashError = session.flashMessages.get('error')
    
    return inertia.render('transactions/index', {
      transactions: { data: serializedTransactions, meta: {} },
      products: products,
      suppliers: suppliers,
      flash: (flashSuccess || flashError) ? {
        success: flashSuccess || undefined,
        error: flashError || undefined
      } : undefined
    })
  })
  
  router.get('/suppliers', async ({ inertia, session, response }) => {
    const authToken = session.get('auth_token')
    const user = session.get('user')
    
    if (!authToken || !user) {
      return response.redirect('/login')
    }
    
    const Supplier = (await import('#models/supplier')).default
    
    const suppliers = await Supplier.query()
      .preload('products')
      .orderBy('nama')
    
    const flashSuccess = session.flashMessages.get('success')
    const flashError = session.flashMessages.get('error')
    
    return inertia.render('suppliers/index', {
      suppliers: { data: suppliers, meta: {} },
      flash: (flashSuccess || flashError) ? {
        success: flashSuccess || undefined,
        error: flashError || undefined
      } : undefined
    })
  })
})

// API Authentication routes (public)
router.group(() => {
  router.post('/login', '#controllers/Http/ApiAuthController.login')
  router.get('/profile', '#controllers/Http/ApiAuthController.profile')
    .use('#middleware/api_auth_middleware')
}).prefix('/api/auth')

// Swagger documentation (public)
router.get('/api-docs.json', '#controllers/Http/SwaggerController.index')

// Public API routes (protected dengan JWT)
router.group(() => {
  // Products with external API integration
  router.get('/products', '#controllers/Http/PublicProductsController.index')
    .use('#middleware/api_auth_middleware')
    .use('#middleware/api_access_middleware')
  router.get('/products/:id', '#controllers/Http/PublicProductsController.show')
    .use('#middleware/api_auth_middleware')
    .use('#middleware/api_access_middleware')
  
  // Categories
  router.get('/categories', '#controllers/Http/PublicCategoriesController.index')
    .use('#middleware/api_auth_middleware')
    .use('#middleware/api_access_middleware')
  
  // Exchange Rate API
  router.get('/exchange-rate', '#controllers/Http/PublicExchangeRateController.getExchangeRate')
    .use('#middleware/api_auth_middleware')
    .use('#middleware/api_access_middleware')
  router.get('/exchange-rate/convert', '#controllers/Http/PublicExchangeRateController.convertCurrency')
    .use('#middleware/api_auth_middleware')
    .use('#middleware/api_access_middleware')
  router.get('/exchange-rate/currencies', '#controllers/Http/PublicExchangeRateController.getAvailableCurrencies')
    .use('#middleware/api_auth_middleware')
    .use('#middleware/api_access_middleware')
}).prefix('/api/public')

// Internal API routes (protected dengan session)
router.group(() => {
  router.get('/profile', '#controllers/Http/AuthController.profile')
  router.post('/refresh', '#controllers/Http/AuthController.refresh')
  
  router.get('/categories', '#controllers/Http/CategoriesController.index')
  router.post('/categories', '#controllers/Http/CategoriesController.store')
  router.get('/categories/:id', '#controllers/Http/CategoriesController.show')
  router.put('/categories/:id', '#controllers/Http/CategoriesController.update')
  router.delete('/categories/:id', '#controllers/Http/CategoriesController.destroy')
  router.get('/categories/:id/stats', '#controllers/Http/CategoriesController.stats')
  router.get('/categories/search', '#controllers/Http/CategoriesController.search')

  router.get('/products/search', '#controllers/Http/ProductsController.search')
  router.get('/products/category/:categoryId', '#controllers/Http/ProductsController.getByCategory')
  router.get('/products', '#controllers/Http/ProductsController.index')
  router.post('/products', '#controllers/Http/ProductsController.store')
  router.get('/products/:id', '#controllers/Http/ProductsController.show')
  router.put('/products/:id', '#controllers/Http/ProductsController.update')
  router.delete('/products/:id', '#controllers/Http/ProductsController.destroy')

  router.get('/transactions', '#controllers/Http/TransactionsController.index')
  router.post('/transactions', '#controllers/Http/TransactionsController.store')
  router.get('/transactions/:id', '#controllers/Http/TransactionsController.show')
  router.put('/transactions/:id', '#controllers/Http/TransactionsController.update')
  router.delete('/transactions/:id', '#controllers/Http/TransactionsController.destroy')
  router.get('/transactions/product/:productId', '#controllers/Http/TransactionsController.getByProduct')
  router.get('/transactions/stats', '#controllers/Http/TransactionsController.stats')
  router.get('/transactions/search', '#controllers/Http/TransactionsController.search')

  router.get('/suppliers', '#controllers/Http/SuppliersController.index')
  router.post('/suppliers', '#controllers/Http/SuppliersController.store')
  router.get('/suppliers/:id', '#controllers/Http/SuppliersController.show')
  router.put('/suppliers/:id', '#controllers/Http/SuppliersController.update')
  router.delete('/suppliers/:id', '#controllers/Http/SuppliersController.destroy')
  router.get('/suppliers/search', '#controllers/Http/SuppliersController.search')
}).prefix('/api')
