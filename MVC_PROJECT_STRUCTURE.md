# CẤU TRÚC DỰ ÁN MVC E-COMMERCE CHI TIẾT

## 📁 Cấu trúc thư mục dự án

```
ecommerce-mvc-app/
├── 📁 config/                     # Cấu hình ứng dụng
│   ├── database.js               # Cấu hình database
│   ├── redis.js                  # Cấu hình Redis
│   ├── email.js                  # Cấu hình email
│   ├── payment.js                # Cấu hình payment gateways
│   └── app.js                    # Cấu hình chung app
├── 📁 controllers/                # Controllers (MVC)
│   ├── 📁 api/                   # API Controllers
│   │   ├── AuthController.js
│   │   ├── ProductController.js
│   │   ├── OrderController.js
│   │   ├── UserController.js
│   │   └── CartController.js
│   ├── 📁 web/                   # Web Controllers
│   │   ├── HomeController.js
│   │   ├── ProductController.js
│   │   ├── CartController.js
│   │   ├── CheckoutController.js
│   │   ├── UserController.js
│   │   └── AdminController.js
├── 📁 models/                     # Models (Database)
│   ├── index.js                  # Model index & associations
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Brand.js
│   ├── Order.js
│   ├── OrderItem.js
│   ├── Review.js
│   ├── ShoppingCart.js
│   ├── Wishlist.js
│   ├── Address.js
│   ├── Payment.js
│   ├── Coupon.js
│   ├── Notification.js
│   └── Setting.js
├── 📁 views/                      # Views (Pug templates)
│   ├── 📁 layouts/
│   │   ├── main.pug
│   │   ├── admin.pug
│   │   └── email.pug
│   ├── 📁 partials/
│   │   ├── header.pug
│   │   ├── footer.pug
│   │   ├── navbar.pug
│   │   ├── product-card.pug
│   │   └── pagination.pug
│   ├── 📁 pages/
│   │   ├── home.pug
│   │   ├── products.pug
│   │   ├── product-detail.pug
│   │   ├── cart.pug
│   │   ├── checkout.pug
│   │   ├── login.pug
│   │   ├── register.pug
│   │   └── profile.pug
│   ├── 📁 admin/
│   │   ├── dashboard.pug
│   │   ├── products.pug
│   │   ├── orders.pug
│   │   ├── users.pug
│   │   └── settings.pug
│   └── 📁 emails/
│       ├── welcome.pug
│       ├── order-confirmation.pug
│       └── password-reset.pug
├── 📁 routes/                     # Định tuyến
│   ├── index.js                  # Route chính
│   ├── web.js                    # Web routes
│   ├── api.js                    # API routes
│   └── admin.js                  # Admin routes
├── 📁 middleware/                 # Middleware
│   ├── auth.js                   # Authentication
│   ├── validation.js             # Validation
│   ├── upload.js                 # File upload
│   ├── rateLimit.js              # Rate limiting
│   └── errorHandler.js           # Error handling
├── 📁 services/                   # Business Logic Services
│   ├── AuthService.js
│   ├── ProductService.js
│   ├── OrderService.js
│   ├── PaymentService.js
│   ├── EmailService.js
│   ├── NotificationService.js
│   └── UploadService.js
├── 📁 utils/                      # Utilities
│   ├── helpers.js                # Helper functions
│   ├── validators.js             # Validation rules
│   ├── formatters.js             # Data formatters
│   └── constants.js              # Constants
├── 📁 public/                     # Static files
│   ├── 📁 css/
│   ├── 📁 js/
│   ├── 📁 images/
│   └── 📁 uploads/
├── 📁 src/                        # Source files (SCSS, JS)
│   ├── 📁 scss/
│   │   ├── main.scss
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _components.scss
│   │   └── _pages.scss
│   └── 📁 js/
│       ├── main.js
│       ├── product-filter.js
│       ├── cart.js
│       └── checkout.js
├── 📁 database/                   # Database files
│   ├── 📁 migrations/
│   ├── 📁 seeders/
│   └── 📁 sql/
├── 📁 tests/                      # Test files
│   ├── 📁 unit/
│   ├── 📁 integration/
│   └── 📁 fixtures/
├── 📁 docs/                       # Documentation
├── 📁 scripts/                    # Utility scripts
│   ├── seed.js
│   └── migrate.js
├── .env                          # Environment variables
├── .gitignore
├── package.json
├── webpack.config.js
├── nodemon.json
└── app.js                        # Entry point
```

## 🏗️ MVC Architecture Implementation

### 1. Models (Data Layer)

#### User Model với đầy đủ chức năng:

```javascript
// models/User.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        // ... (đã có ở trên)
    });

    // Class methods
    User.findByEmail = async function(email) {
        return this.findOne({ 
            where: { email },
            include: ['addresses', 'orders']
        });
    };

    User.findByUsername = async function(username) {
        return this.findOne({ 
            where: { username },
            include: ['addresses']
        });
    };

    User.createWithProfile = async function(userData) {
        const transaction = await sequelize.transaction();
        try {
            const user = await this.create(userData, { transaction });
            
            // Create default address if provided
            if (userData.address) {
                await user.createAddress({
                    ...userData.address,
                    isDefault: true
                }, { transaction });
            }
            
            await transaction.commit();
            return user;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };

    // Instance methods
    User.prototype.generateAuthToken = function() {
        return jwt.sign(
            { 
                id: this.id, 
                email: this.email, 
                role: this.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    };

    User.prototype.generateRefreshToken = function() {
        return jwt.sign(
            { id: this.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '30d' }
        );
    };

    User.prototype.updateLastLogin = async function() {
        this.lastLogin = new Date();
        return this.save();
    };

    User.prototype.getOrderStats = async function() {
        const { Order } = sequelize.models;
        return Order.findAll({
            where: { userId: this.id },
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']
            ],
            group: ['status']
        });
    };

    User.prototype.hasPermission = function(permission) {
        const permissions = {
            customer: ['view_profile', 'edit_profile', 'place_order'],
            seller: ['view_profile', 'edit_profile', 'place_order', 'manage_products', 'view_sales'],
            admin: ['*'] // All permissions
        };
        
        return permissions[this.role].includes(permission) || permissions[this.role].includes('*');
    };

    return User;
};
```

#### Product Model với tính năng nâng cao:

```javascript
// models/Product.js
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        // ... (đã có ở trên)
    });

    // Class methods
    Product.findWithFilters = async function(filters = {}) {
        const {
            category,
            brand,
            minPrice,
            maxPrice,
            rating,
            inStock,
            featured,
            search,
            sortBy = 'createdAt',
            sortOrder = 'DESC',
            limit = 20,
            offset = 0
        } = filters;

        const whereClause = { status: 'active' };
        const include = [
            { model: sequelize.models.Category, as: 'category' },
            { model: sequelize.models.Brand, as: 'brand' },
            { 
                model: sequelize.models.ProductImage, 
                as: 'images',
                where: { isPrimary: true },
                required: false
            },
            {
                model: sequelize.models.Review,
                as: 'reviews',
                attributes: []
            }
        ];

        // Apply filters
        if (category) whereClause.categoryId = category;
        if (brand) whereClause.brandId = brand;
        if (minPrice) whereClause.price = { ...whereClause.price, [Op.gte]: minPrice };
        if (maxPrice) whereClause.price = { ...whereClause.price, [Op.lte]: maxPrice };
        if (inStock) whereClause.inventoryQuantity = { [Op.gt]: 0 };
        if (featured) whereClause.featured = true;
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { shortDescription: { [Op.like]: `%${search}%` } }
            ];
        }

        const order = [];
        if (sortBy === 'price') {
            order.push(['price', sortOrder]);
        } else if (sortBy === 'rating') {
            order.push([sequelize.fn('AVG', sequelize.col('reviews.rating')), sortOrder]);
        } else {
            order.push([sortBy, sortOrder]);
        }

        return this.findAndCountAll({
            where: whereClause,
            include,
            attributes: {
                include: [
                    [sequelize.fn('AVG', sequelize.col('reviews.rating')), 'avgRating'],
                    [sequelize.fn('COUNT', sequelize.col('reviews.id')), 'reviewCount']
                ]
            },
            group: ['Product.id'],
            having: rating ? sequelize.where(
                sequelize.fn('AVG', sequelize.col('reviews.rating')), 
                { [Op.gte]: rating }
            ) : undefined,
            order,
            limit,
            offset,
            subQuery: false
        });
    };

    Product.getFeatured = async function(limit = 8) {
        return this.findAll({
            where: { 
                status: 'active', 
                featured: true 
            },
            include: [
                { model: sequelize.models.Category, as: 'category' },
                { model: sequelize.models.Brand, as: 'brand' },
                { 
                    model: sequelize.models.ProductImage, 
                    as: 'images',
                    where: { isPrimary: true },
                    required: false
                }
            ],
            limit,
            order: [['createdAt', 'DESC']]
        });
    };

    Product.getRelated = async function(productId, categoryId, limit = 4) {
        return this.findAll({
            where: {
                id: { [Op.ne]: productId },
                categoryId,
                status: 'active'
            },
            include: [
                { model: sequelize.models.Category, as: 'category' },
                { 
                    model: sequelize.models.ProductImage, 
                    as: 'images',
                    where: { isPrimary: true },
                    required: false
                }
            ],
            limit,
            order: sequelize.literal('RAND()')
        });
    };

    // Instance methods
    Product.prototype.updateInventory = async function(quantity, operation = 'subtract') {
        if (!this.trackInventory) return this;
        
        if (operation === 'subtract') {
            if (this.inventoryQuantity < quantity && !this.allowBackorder) {
                throw new Error('Insufficient inventory');
            }
            this.inventoryQuantity -= quantity;
        } else if (operation === 'add') {
            this.inventoryQuantity += quantity;
        }
        
        return this.save();
    };

    Product.prototype.getAverageRating = async function() {
        const { Review } = sequelize.models;
        const result = await Review.findOne({
            where: { 
                productId: this.id,
                status: 'approved'
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
            ]
        });
        
        return {
            avgRating: parseFloat(result.getDataValue('avgRating') || 0),
            reviewCount: parseInt(result.getDataValue('reviewCount') || 0)
        };
    };

    Product.prototype.addToWishlist = async function(userId) {
        const { Wishlist } = sequelize.models;
        return Wishlist.findOrCreate({
            where: { userId, productId: this.id }
        });
    };

    Product.prototype.removeFromWishlist = async function(userId) {
        const { Wishlist } = sequelize.models;
        return Wishlist.destroy({
            where: { userId, productId: this.id }
        });
    };

    return Product;
};
```

### 2. Controllers (Business Logic)

#### ProductController cho Web:

```javascript
// controllers/web/ProductController.js
const { Product, Category, Brand, Review, User } = require('../../models');
const ProductService = require('../../services/ProductService');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class ProductController {
    // GET /products
    async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page - 1) * limit;

            const filters = {
                category: req.query.category,
                brand: req.query.brand,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                rating: req.query.rating,
                inStock: req.query.inStock === 'true',
                search: req.query.search,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'DESC',
                limit,
                offset
            };

            const [products, categories, brands] = await Promise.all([
                Product.findWithFilters(filters),
                Category.findAll({ 
                    where: { isActive: true },
                    attributes: ['id', 'name', 'slug'],
                    order: [['name', 'ASC']]
                }),
                Brand.findAll({ 
                    where: { isActive: true },
                    attributes: ['id', 'name', 'slug'],
                    order: [['name', 'ASC']]
                })
            ]);

            const totalPages = Math.ceil(products.count / limit);

            res.render('pages/products', {
                title: 'Sản phẩm',
                currentPage: 'products',
                products: products.rows,
                categories,
                brands,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts: products.count,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                },
                filters: req.query
            });
        } catch (error) {
            console.error('Error in ProductController.index:', error);
            res.status(500).render('errors/500', {
                title: 'Lỗi máy chủ',
                error: 'Không thể tải danh sách sản phẩm'
            });
        }
    }

    // GET /products/:slug
    async show(req, res) {
        try {
            const { slug } = req.params;
            
            const product = await Product.findOne({
                where: { slug, status: 'active' },
                include: [
                    { model: Category, as: 'category' },
                    { model: Brand, as: 'brand' },
                    { model: User, as: 'seller', attributes: ['id', 'username', 'firstName', 'lastName'] },
                    { 
                        model: ProductImage, 
                        as: 'images',
                        order: [['sortOrder', 'ASC'], ['isPrimary', 'DESC']]
                    },
                    {
                        model: ProductVariant,
                        as: 'variants',
                        where: { inventoryQuantity: { [Op.gt]: 0 } },
                        required: false
                    },
                    {
                        model: ProductAttributeValue,
                        as: 'attributeValues',
                        include: [{ model: ProductAttribute, as: 'attribute' }]
                    }
                ]
            });

            if (!product) {
                return res.status(404).render('errors/404', {
                    title: 'Không tìm thấy sản phẩm',
                    message: 'Sản phẩm bạn tìm kiếm không tồn tại'
                });
            }

            // Get reviews with pagination
            const reviewPage = parseInt(req.query.reviewPage) || 1;
            const reviewLimit = 5;
            const reviewOffset = (reviewPage - 1) * reviewLimit;

            const [reviews, relatedProducts, ratingStats] = await Promise.all([
                Review.findAndCountAll({
                    where: { 
                        productId: product.id,
                        status: 'approved'
                    },
                    include: [
                        { 
                            model: User, 
                            as: 'user',
                            attributes: ['id', 'username', 'firstName', 'lastName', 'avatar']
                        },
                        {
                            model: ReviewImage,
                            as: 'images'
                        }
                    ],
                    order: [['createdAt', 'DESC']],
                    limit: reviewLimit,
                    offset: reviewOffset
                }),
                Product.getRelated(product.id, product.categoryId),
                Review.findAll({
                    where: { 
                        productId: product.id,
                        status: 'approved'
                    },
                    attributes: [
                        'rating',
                        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                    ],
                    group: ['rating'],
                    order: [['rating', 'DESC']]
                })
            ]);

            // Calculate average rating
            const avgRating = await product.getAverageRating();

            // Check if user can review (must have purchased)
            let canReview = false;
            if (req.user) {
                const userOrder = await OrderItem.findOne({
                    include: [{
                        model: Order,
                        as: 'order',
                        where: { 
                            userId: req.user.id,
                            status: 'delivered'
                        }
                    }],
                    where: { productId: product.id }
                });
                canReview = !!userOrder;
            }

            res.render('pages/product-detail', {
                title: product.name,
                currentPage: 'products',
                product,
                reviews: reviews.rows,
                relatedProducts,
                avgRating,
                ratingStats,
                canReview,
                reviewPagination: {
                    currentPage: reviewPage,
                    totalPages: Math.ceil(reviews.count / reviewLimit),
                    hasNext: reviewPage * reviewLimit < reviews.count,
                    hasPrev: reviewPage > 1
                },
                breadcrumb: [
                    { text: 'Trang chủ', url: '/' },
                    { text: 'Sản phẩm', url: '/products' },
                    { text: product.category.name, url: `/products?category=${product.category.id}` },
                    { text: product.name }
                ]
            });
        } catch (error) {
            console.error('Error in ProductController.show:', error);
            res.status(500).render('errors/500', {
                title: 'Lỗi máy chủ',
                error: 'Không thể tải thông tin sản phẩm'
            });
        }
    }

    // POST /products/:id/reviews
    async addReview(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const { rating, title, comment } = req.body;

            // Check if user has purchased this product
            const userOrder = await OrderItem.findOne({
                include: [{
                    model: Order,
                    as: 'order',
                    where: { 
                        userId: req.user.id,
                        status: 'delivered'
                    }
                }],
                where: { productId: id }
            });

            if (!userOrder) {
                return res.status(403).json({
                    success: false,
                    message: 'Bạn chỉ có thể đánh giá sản phẩm đã mua'
                });
            }

            // Check if user already reviewed
            const existingReview = await Review.findOne({
                where: {
                    productId: id,
                    userId: req.user.id
                }
            });

            if (existingReview) {
                return res.status(400).json({
                    success: false,
                    message: 'Bạn đã đánh giá sản phẩm này rồi'
                });
            }

            const review = await Review.create({
                productId: id,
                userId: req.user.id,
                orderItemId: userOrder.id,
                rating,
                title,
                comment,
                isVerifiedPurchase: true,
                status: 'pending' // Will be approved by admin
            });

            res.json({
                success: true,
                message: 'Đánh giá của bạn đã được gửi và đang chờ duyệt',
                review
            });
        } catch (error) {
            console.error('Error in ProductController.addReview:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể thêm đánh giá'
            });
        }
    }

    // GET /search/suggestions
    async searchSuggestions(req, res) {
        try {
            const { q } = req.query;
            
            if (!q || q.length < 2) {
                return res.json({ suggestions: [] });
            }

            const products = await Product.findAll({
                where: {
                    status: 'active',
                    name: { [Op.like]: `%${q}%` }
                },
                attributes: ['id', 'name', 'slug', 'price'],
                include: [{
                    model: ProductImage,
                    as: 'images',
                    where: { isPrimary: true },
                    required: false,
                    attributes: ['imageUrl']
                }],
                limit: 8,
                order: [['name', 'ASC']]
            });

            const suggestions = products.map(product => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images[0]?.imageUrl || '/images/no-image.png'
            }));

            res.json({ suggestions });
        } catch (error) {
            console.error('Error in ProductController.searchSuggestions:', error);
            res.json({ suggestions: [] });
        }
    }
}

module.exports = new ProductController();
```

#### CartController:

```javascript
// controllers/web/CartController.js
const { ShoppingCart, Product, ProductVariant, User } = require('../../models');
const CartService = require('../../services/CartService');
const { validationResult } = require('express-validator');

class CartController {
    // GET /cart
    async index(req, res) {
        try {
            const cartItems = await CartService.getCartItems(req);
            const cartSummary = CartService.calculateCartSummary(cartItems);

            res.render('pages/cart', {
                title: 'Giỏ hàng',
                currentPage: 'cart',
                cartItems,
                cartSummary,
                breadcrumb: [
                    { text: 'Trang chủ', url: '/' },
                    { text: 'Giỏ hàng' }
                ]
            });
        } catch (error) {
            console.error('Error in CartController.index:', error);
            res.status(500).render('errors/500', {
                title: 'Lỗi máy chủ',
                error: 'Không thể tải giỏ hàng'
            });
        }
    }

    // POST /cart/add
    async add(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { productId, variantId, quantity = 1 } = req.body;

            // Validate product exists and is available
            const product = await Product.findOne({
                where: { 
                    id: productId, 
                    status: 'active' 
                },
                include: variantId ? [{
                    model: ProductVariant,
                    as: 'variants',
                    where: { id: variantId }
                }] : []
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Sản phẩm không tồn tại'
                });
            }

            // Check inventory
            const availableQuantity = variantId 
                ? product.variants[0].inventoryQuantity 
                : product.inventoryQuantity;

            if (product.trackInventory && availableQuantity < quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Số lượng sản phẩm không đủ'
                });
            }

            // Add to cart
            const cartItem = await CartService.addToCart({
                userId: req.user?.id,
                sessionId: req.sessionID,
                productId,
                variantId,
                quantity
            });

            // Get updated cart summary
            const cartItems = await CartService.getCartItems(req);
            const cartSummary = CartService.calculateCartSummary(cartItems);

            res.json({
                success: true,
                message: 'Đã thêm sản phẩm vào giỏ hàng',
                cartItem,
                cartSummary
            });
        } catch (error) {
            console.error('Error in CartController.add:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể thêm sản phẩm vào giỏ hàng'
            });
        }
    }

    // PUT /cart/update/:id
    async update(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const { quantity } = req.body;

            const cartItem = await CartService.updateCartItem({
                id,
                userId: req.user?.id,
                sessionId: req.sessionID,
                quantity
            });

            if (!cartItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm trong giỏ hàng'
                });
            }

            // Get updated cart summary
            const cartItems = await CartService.getCartItems(req);
            const cartSummary = CartService.calculateCartSummary(cartItems);

            res.json({
                success: true,
                message: 'Đã cập nhật giỏ hàng',
                cartItem,
                cartSummary
            });
        } catch (error) {
            console.error('Error in CartController.update:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể cập nhật giỏ hàng'
            });
        }
    }

    // DELETE /cart/remove/:id
    async remove(req, res) {
        try {
            const { id } = req.params;

            const removed = await CartService.removeFromCart({
                id,
                userId: req.user?.id,
                sessionId: req.sessionID
            });

            if (!removed) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm trong giỏ hàng'
                });
            }

            // Get updated cart summary
            const cartItems = await CartService.getCartItems(req);
            const cartSummary = CartService.calculateCartSummary(cartItems);

            res.json({
                success: true,
                message: 'Đã xóa sản phẩm khỏi giỏ hàng',
                cartSummary
            });
        } catch (error) {
            console.error('Error in CartController.remove:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể xóa sản phẩm khỏi giỏ hàng'
            });
        }
    }

    // DELETE /cart/clear
    async clear(req, res) {
        try {
            await CartService.clearCart({
                userId: req.user?.id,
                sessionId: req.sessionID
            });

            res.json({
                success: true,
                message: 'Đã xóa tất cả sản phẩm khỏi giỏ hàng'
            });
        } catch (error) {
            console.error('Error in CartController.clear:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể xóa giỏ hàng'
            });
        }
    }

    // GET /cart/count
    async getCount(req, res) {
        try {
            const count = await CartService.getCartItemCount({
                userId: req.user?.id,
                sessionId: req.sessionID
            });

            res.json({ count });
        } catch (error) {
            console.error('Error in CartController.getCount:', error);
            res.json({ count: 0 });
        }
    }
}

module.exports = new CartController();
```

### 3. Services (Business Logic Layer)

#### ProductService:

```javascript
// services/ProductService.js
const { Product, Category, Brand, ProductImage, Review } = require('../models');
const { Op } = require('sequelize');
const UploadService = require('./UploadService');

class ProductService {
    async createProduct(productData, sellerId) {
        const transaction = await Product.sequelize.transaction();
        
        try {
            // Generate unique SKU if not provided
            if (!productData.sku) {
                productData.sku = await this.generateSKU(productData.name);
            }

            const product = await Product.create({
                ...productData,
                sellerId,
                status: 'draft'
            }, { transaction });

            // Handle image uploads
            if (productData.images && productData.images.length > 0) {
                await this.addProductImages(product.id, productData.images, transaction);
            }

            // Handle attributes
            if (productData.attributes) {
                await this.addProductAttributes(product.id, productData.attributes, transaction);
            }

            await transaction.commit();
            
            return this.getProductById(product.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateProduct(productId, productData, sellerId) {
        const transaction = await Product.sequelize.transaction();
        
        try {
            const product = await Product.findOne({
                where: { 
                    id: productId,
                    sellerId // Ensure seller can only update their own products
                }
            });

            if (!product) {
                throw new Error('Product not found or access denied');
            }

            await product.update(productData, { transaction });

            // Handle image updates
            if (productData.images) {
                await this.updateProductImages(productId, productData.images, transaction);
            }

            // Handle attribute updates
            if (productData.attributes) {
                await this.updateProductAttributes(productId, productData.attributes, transaction);
            }

            await transaction.commit();
            
            return this.getProductById(productId);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteProduct(productId, sellerId) {
        const product = await Product.findOne({
            where: { 
                id: productId,
                sellerId
            }
        });

        if (!product) {
            throw new Error('Product not found or access denied');
        }

        // Soft delete by changing status
        await product.update({ status: 'archived' });
        
        return true;
    }

    async getProductById(productId) {
        return Product.findByPk(productId, {
            include: [
                { model: Category, as: 'category' },
                { model: Brand, as: 'brand' },
                { model: ProductImage, as: 'images' },
                { 
                    model: Review, 
                    as: 'reviews',
                    where: { status: 'approved' },
                    required: false
                }
            ]
        });
    }

    async searchProducts(query, filters = {}) {
        const whereClause = {
            status: 'active',
            [Op.or]: [
                { name: { [Op.like]: `%${query}%` } },
                { description: { [Op.like]: `%${query}%` } },
                { shortDescription: { [Op.like]: `%${query}%` } }
            ]
        };

        // Apply additional filters
        if (filters.categoryId) {
            whereClause.categoryId = filters.categoryId;
        }
        
        if (filters.brandId) {
            whereClause.brandId = filters.brandId;
        }

        if (filters.minPrice || filters.maxPrice) {
            whereClause.price = {};
            if (filters.minPrice) whereClause.price[Op.gte] = filters.minPrice;
            if (filters.maxPrice) whereClause.price[Op.lte] = filters.maxPrice;
        }

        return Product.findAll({
            where: whereClause,
            include: [
                { model: Category, as: 'category' },
                { model: Brand, as: 'brand' },
                { 
                    model: ProductImage, 
                    as: 'images',
                    where: { isPrimary: true },
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: filters.limit || 20
        });
    }

    async getFeaturedProducts(limit = 8) {
        return Product.findAll({
            where: { 
                status: 'active',
                featured: true
            },
            include: [
                { model: Category, as: 'category' },
                { 
                    model: ProductImage, 
                    as: 'images',
                    where: { isPrimary: true },
                    required: false
                }
            ],
            limit,
            order: [['createdAt', 'DESC']]
        });
    }

    async getProductsByCategory(categoryId, options = {}) {
        const { limit = 20, offset = 0, sortBy = 'createdAt', sortOrder = 'DESC' } = options;

        return Product.findAndCountAll({
            where: { 
                categoryId,
                status: 'active'
            },
            include: [
                { model: Category, as: 'category' },
                { model: Brand, as: 'brand' },
                { 
                    model: ProductImage, 
                    as: 'images',
                    where: { isPrimary: true },
                    required: false
                }
            ],
            limit,
            offset,
            order: [[sortBy, sortOrder]]
        });
    }

    async addProductImages(productId, images, transaction) {
        const imageData = images.map((image, index) => ({
            productId,
            imageUrl: image.url,
            altText: image.altText || '',
            sortOrder: index,
            isPrimary: index === 0
        }));

        return ProductImage.bulkCreate(imageData, { transaction });
    }

    async updateProductImages(productId, images, transaction) {
        // Remove existing images
        await ProductImage.destroy({
            where: { productId },
            transaction
        });

        // Add new images
        return this.addProductImages(productId, images, transaction);
    }

    async addProductAttributes(productId, attributes, transaction) {
        const { ProductAttributeValue } = require('../models');
        
        const attributeData = attributes.map(attr => ({
            productId,
            attributeId: attr.attributeId,
            value: attr.value
        }));

        return ProductAttributeValue.bulkCreate(attributeData, { transaction });
    }

    async updateProductAttributes(productId, attributes, transaction) {
        const { ProductAttributeValue } = require('../models');
        
        // Remove existing attributes
        await ProductAttributeValue.destroy({
            where: { productId },
            transaction
        });

        // Add new attributes
        return this.addProductAttributes(productId, attributes, transaction);
    }

    async generateSKU(productName) {
        const prefix = productName.substring(0, 3).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        
        return `${prefix}-${timestamp}-${random}`;
    }

    async updateInventory(productId, quantity, operation = 'subtract') {
        const product = await Product.findByPk(productId);
        
        if (!product) {
            throw new Error('Product not found');
        }

        return product.updateInventory(quantity, operation);
    }

    async getProductStats(sellerId) {
        const stats = await Product.findAll({
            where: { sellerId },
            attributes: [
                'status',
                [Product.sequelize.fn('COUNT', Product.sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        return stats.reduce((acc, stat) => {
            acc[stat.status] = parseInt(stat.getDataValue('count'));
            return acc;
        }, {});
    }
}

module.exports = new ProductService();
```

#### OrderService:

```javascript
// services/OrderService.js
const { Order, OrderItem, Product, User, ShoppingCart } = require('../models');
const CartService = require('./CartService');
const PaymentService = require('./PaymentService');
const EmailService = require('./EmailService');
const NotificationService = require('./NotificationService');

class OrderService {
    async createOrder(orderData, userId = null) {
        const transaction = await Order.sequelize.transaction();
        
        try {
            // Get cart items
            const cartItems = await CartService.getCartItems({
                user: userId ? { id: userId } : null,
                sessionID: orderData.sessionId
            });

            if (!cartItems || cartItems.length === 0) {
                throw new Error('Cart is empty');
            }

            // Calculate order totals
            const orderSummary = CartService.calculateCartSummary(cartItems);

            // Create order
            const order = await Order.create({
                userId,
                guestEmail: orderData.guestEmail,
                subtotal: orderSummary.subtotal,
                taxAmount: orderSummary.tax,
                shippingAmount: orderSummary.shipping,
                discountAmount: orderSummary.discount,
                totalAmount: orderSummary.total,
                
                // Shipping information
                shippingFullName: orderData.shipping.fullName,
                shippingPhone: orderData.shipping.phone,
                shippingEmail: orderData.shipping.email,
                shippingCity: orderData.shipping.city,
                shippingDistrict: orderData.shipping.district,
                shippingWard: orderData.shipping.ward,
                shippingStreet: orderData.shipping.street,
                
                notes: orderData.notes,
                status: 'pending',
                paymentStatus: 'pending'
            }, { transaction });

            // Create order items
            const orderItems = cartItems.map(item => ({
                orderId: order.id,
                productId: item.product.id,
                variantId: item.variantId,
                quantity: item.quantity,
                unitPrice: item.product.price,
                totalPrice: item.product.price * item.quantity,
                productName: item.product.name,
                productSku: item.product.sku,
                productImage: item.product.getPrimaryImage()
            }));

            await OrderItem.bulkCreate(orderItems, { transaction });

            // Update product inventory
            for (const item of cartItems) {
                await item.product.updateInventory(item.quantity, 'subtract');
            }

            // Clear cart
            await CartService.clearCart({
                userId,
                sessionId: orderData.sessionId
            });

            await transaction.commit();

            // Send confirmation email
            await this.sendOrderConfirmation(order.id);

            // Create notification
            if (userId) {
                await NotificationService.createNotification({
                    userId,
                    type: 'order',
                    title: 'Đơn hàng đã được tạo',
                    message: `Đơn hàng #${order.orderNumber} đã được tạo thành công`,
                    data: { orderId: order.id }
                });
            }

            return this.getOrderById(order.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getOrderById(orderId, userId = null) {
        const whereClause = { id: orderId };
        if (userId) whereClause.userId = userId;

        return Order.findOne({
            where: whereClause,
            include: [
                { 
                    model: User, 
                    as: 'user',
                    attributes: ['id', 'username', 'email', 'firstName', 'lastName']
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'slug', 'status']
                    }]
                }
            ]
        });
    }

    async getUserOrders(userId, options = {}) {
        const { page = 1, limit = 10, status } = options;
        const offset = (page - 1) * limit;

        const whereClause = { userId };
        if (status) whereClause.status = status;

        return Order.findAndCountAll({
            where: whereClause,
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug']
                }]
            }],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
    }

    async updateOrderStatus(orderId, status, userId = null) {
        const whereClause = { id: orderId };
        if (userId) whereClause.userId = userId;

        const order = await Order.findOne({ where: whereClause });
        
        if (!order) {
            throw new Error('Order not found');
        }

        // Validate status transition
        if (!this.isValidStatusTransition(order.status, status)) {
            throw new Error('Invalid status transition');
        }

        // Update order
        await order.update({ 
            status,
            ...(status === 'shipped' && { shippedAt: new Date() }),
            ...(status === 'delivered' && { deliveredAt: new Date() }),
            ...(status === 'cancelled' && { cancelledAt: new Date() })
        });

        // Handle inventory for cancelled orders
        if (status === 'cancelled') {
            await this.restoreInventory(orderId);
        }

        // Send status update email
        await this.sendOrderStatusUpdate(orderId, status);

        // Create notification
        if (order.userId) {
            await NotificationService.createNotification({
                userId: order.userId,
                type: 'order',
                title: 'Cập nhật đơn hàng',
                message: `Đơn hàng #${order.orderNumber} đã được ${this.getStatusText(status)}`,
                data: { orderId: order.id, status }
            });
        }

        return order;
    }

    async cancelOrder(orderId, userId, reason = '') {
        const order = await Order.findOne({
            where: { 
                id: orderId,
                userId,
                status: { [Op.in]: ['pending', 'confirmed'] }
            }
        });

        if (!order) {
            throw new Error('Order not found or cannot be cancelled');
        }

        await order.update({
            status: 'cancelled',
            cancelledAt: new Date(),
            notes: order.notes ? `${order.notes}\n\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`
        });

        // Restore inventory
        await this.restoreInventory(orderId);

        // Handle refund if payment was made
        if (order.paymentStatus === 'paid') {
            await PaymentService.processRefund(orderId);
        }

        return order;
    }

    async processPayment(orderId, paymentData) {
        const order = await this.getOrderById(orderId);
        
        if (!order) {
            throw new Error('Order not found');
        }

        if (order.paymentStatus === 'paid') {
            throw new Error('Order already paid');
        }

        // Process payment through payment service
        const paymentResult = await PaymentService.processPayment({
            orderId: order.id,
            amount: order.totalAmount,
            currency: order.currency,
            method: paymentData.method,
            ...paymentData
        });

        if (paymentResult.success) {
            await order.update({
                paymentStatus: 'paid',
                status: order.status === 'pending' ? 'confirmed' : order.status
            });
        }

        return paymentResult;
    }

    async restoreInventory(orderId) {
        const order = await Order.findOne({
            where: { id: orderId },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{ model: Product, as: 'product' }]
            }]
        });

        if (!order) return;

        for (const item of order.items) {
            if (item.product) {
                await item.product.updateInventory(item.quantity, 'add');
            }
        }
    }

    async sendOrderConfirmation(orderId) {
        const order = await this.getOrderById(orderId);
        
        if (!order) return;

        const emailData = {
            to: order.user?.email || order.guestEmail,
            subject: `Xác nhận đơn hàng #${order.orderNumber}`,
            template: 'order-confirmation',
            data: { order }
        };

        return EmailService.sendEmail(emailData);
    }

    async sendOrderStatusUpdate(orderId, status) {
        const order = await this.getOrderById(orderId);
        
        if (!order || !order.user?.email) return;

        const emailData = {
            to: order.user.email,
            subject: `Cập nhật đơn hàng #${order.orderNumber}`,
            template: 'order-status-update',
            data: { order, status, statusText: this.getStatusText(status) }
        };

        return EmailService.sendEmail(emailData);
    }

    isValidStatusTransition(currentStatus, newStatus) {
        const transitions = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['processing', 'cancelled'],
            processing: ['shipped', 'cancelled'],
            shipped: ['delivered'],
            delivered: [],
            cancelled: [],
            refunded: []
        };

        return transitions[currentStatus]?.includes(newStatus) || false;
    }

    getStatusText(status) {
        const statusTexts = {
            pending: 'chờ xử lý',
            confirmed: 'đã xác nhận',
            processing: 'đang xử lý',
            shipped: 'đã giao cho đơn vị vận chuyển',
            delivered: 'đã giao thành công',
            cancelled: 'đã hủy',
            refunded: 'đã hoàn tiền'
        };

        return statusTexts[status] || status;
    }

    async getOrderStats(sellerId = null) {
        const whereClause = {};
        
        if (sellerId) {
            // Get orders containing products from specific seller
            const { OrderItem, Product } = require('../models');
            const sellerProductIds = await Product.findAll({
                where: { sellerId },
                attributes: ['id']
            }).then(products => products.map(p => p.id));

            const orderIds = await OrderItem.findAll({
                where: { productId: { [Op.in]: sellerProductIds } },
                attributes: ['orderId'],
                group: ['orderId']
            }).then(items => items.map(item => item.orderId));

            whereClause.id = { [Op.in]: orderIds };
        }

        const [statusStats, revenueStats] = await Promise.all([
            Order.findAll({
                where: whereClause,
                attributes: [
                    'status',
                    [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'count']
                ],
                group: ['status']
            }),
            Order.findAll({
                where: {
                    ...whereClause,
                    paymentStatus: 'paid'
                },
                attributes: [
                    [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'totalRevenue'],
                    [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'paidOrders']
                ]
            })
        ]);

        return {
            statusStats: statusStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.getDataValue('count'));
                return acc;
            }, {}),
            revenueStats: {
                totalRevenue: parseFloat(revenueStats[0]?.getDataValue('totalRevenue') || 0),
                paidOrders: parseInt(revenueStats[0]?.getDataValue('paidOrders') || 0)
            }
        };
    }
}

module.exports = new OrderService();
```

---

## 📋 TIẾP THEO: PHẦN 3 - RESTFUL API (sẽ được hoàn thành trong phần tiếp theo)

Đây là phần đầu của lộ trình học tập chi tiết. Tôi đã tạo:

1. ✅ **Lộ trình cơ bản HTML, CSS, JS, Pug, NPM, SCSS** với ví dụ thực tế
2. ✅ **Database Schema với 22 bảng** cho hệ thống E-commerce hoàn chỉnh  
3. ✅ **Sequelize Models** với đầy đủ associations và methods
4. ✅ **Cấu trúc MVC** chi tiết với Controllers và Services
5. ✅ **Business Logic** hoàn chỉnh cho Product, Cart, Order

**Những phần tiếp theo sẽ bao gồm:**
- REST API design và implementation
- Authentication & Authorization
- File upload & image processing
- Payment gateway integration
- Email service
- Admin dashboard
- Testing
- Deployment

Bạn có muốn tôi tiếp tục với phần REST API hay có câu hỏi gì về phần đã hoàn thành không?