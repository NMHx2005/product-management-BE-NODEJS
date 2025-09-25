# REST API E-COMMERCE HOÀN CHỈNH

## 🚀 PHẦN 3: RESTFUL API DESIGN & IMPLEMENTATION

### 3.1 API Architecture & Standards

#### API Design Principles:
```javascript
// API Standards & Conventions
const API_STANDARDS = {
    // Base URL
    baseURL: 'https://api.ecommerce.com/v1',
    
    // HTTP Methods
    methods: {
        GET: 'Retrieve data',
        POST: 'Create new resource',
        PUT: 'Update entire resource',
        PATCH: 'Partial update',
        DELETE: 'Remove resource'
    },
    
    // Status Codes
    statusCodes: {
        200: 'OK - Success',
        201: 'Created - Resource created',
        204: 'No Content - Success with no body',
        400: 'Bad Request - Invalid input',
        401: 'Unauthorized - Authentication required',
        403: 'Forbidden - Access denied',
        404: 'Not Found - Resource not found',
        409: 'Conflict - Resource already exists',
        422: 'Unprocessable Entity - Validation failed',
        429: 'Too Many Requests - Rate limit exceeded',
        500: 'Internal Server Error'
    },
    
    // Response Format
    responseFormat: {
        success: {
            success: true,
            data: {},
            message: 'Success message',
            meta: {
                pagination: {},
                timestamp: '2025-01-01T00:00:00Z'
            }
        },
        error: {
            success: false,
            error: {
                code: 'ERROR_CODE',
                message: 'Error message',
                details: []
            },
            meta: {
                timestamp: '2025-01-01T00:00:00Z'
            }
        }
    }
};
```

#### API Routes Structure:

```javascript
// routes/api.js
const express = require('express');
const router = express.Router();

// Import controllers
const AuthController = require('../controllers/api/AuthController');
const ProductController = require('../controllers/api/ProductController');
const CategoryController = require('../controllers/api/CategoryController');
const CartController = require('../controllers/api/CartController');
const OrderController = require('../controllers/api/OrderController');
const UserController = require('../controllers/api/UserController');
const ReviewController = require('../controllers/api/ReviewController');
const WishlistController = require('../controllers/api/WishlistController');
const PaymentController = require('../controllers/api/PaymentController');

// Import middleware
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const rateLimit = require('../middleware/rateLimit');
const upload = require('../middleware/upload');

// API Documentation
router.get('/', (req, res) => {
    res.json({
        name: 'E-Commerce API',
        version: '1.0.0',
        description: 'Complete E-Commerce REST API',
        documentation: '/api/docs',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            categories: '/api/categories',
            cart: '/api/cart',
            orders: '/api/orders',
            users: '/api/users',
            reviews: '/api/reviews',
            wishlist: '/api/wishlist',
            payments: '/api/payments'
        }
    });
});

// Authentication Routes
router.post('/auth/register', validate.register, AuthController.register);
router.post('/auth/login', validate.login, AuthController.login);
router.post('/auth/logout', auth.required, AuthController.logout);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/forgot-password', validate.email, AuthController.forgotPassword);
router.post('/auth/reset-password', validate.resetPassword, AuthController.resetPassword);
router.post('/auth/verify-email', auth.required, AuthController.verifyEmail);
router.post('/auth/resend-verification', auth.required, AuthController.resendVerification);

// Product Routes
router.get('/products', ProductController.index);
router.get('/products/featured', ProductController.featured);
router.get('/products/search', ProductController.search);
router.get('/products/:id', ProductController.show);
router.post('/products', auth.required, auth.seller, validate.product, upload.array('images', 5), ProductController.create);
router.put('/products/:id', auth.required, auth.seller, validate.product, upload.array('images', 5), ProductController.update);
router.delete('/products/:id', auth.required, auth.seller, ProductController.delete);
router.patch('/products/:id/status', auth.required, auth.seller, ProductController.updateStatus);

// Category Routes
router.get('/categories', CategoryController.index);
router.get('/categories/:id', CategoryController.show);
router.get('/categories/:id/products', CategoryController.products);
router.post('/categories', auth.required, auth.admin, validate.category, CategoryController.create);
router.put('/categories/:id', auth.required, auth.admin, validate.category, CategoryController.update);
router.delete('/categories/:id', auth.required, auth.admin, CategoryController.delete);

// Cart Routes
router.get('/cart', auth.optional, CartController.index);
router.post('/cart/add', auth.optional, validate.cartItem, CartController.add);
router.put('/cart/:id', auth.optional, validate.cartUpdate, CartController.update);
router.delete('/cart/:id', auth.optional, CartController.remove);
router.delete('/cart', auth.optional, CartController.clear);

// Order Routes
router.get('/orders', auth.required, OrderController.index);
router.get('/orders/:id', auth.required, OrderController.show);
router.post('/orders', auth.optional, validate.order, OrderController.create);
router.patch('/orders/:id/status', auth.required, OrderController.updateStatus);
router.post('/orders/:id/cancel', auth.required, OrderController.cancel);
router.get('/orders/:id/tracking', OrderController.tracking);

// User Routes
router.get('/users/profile', auth.required, UserController.profile);
router.put('/users/profile', auth.required, validate.profile, upload.single('avatar'), UserController.updateProfile);
router.post('/users/change-password', auth.required, validate.changePassword, UserController.changePassword);
router.get('/users/addresses', auth.required, UserController.addresses);
router.post('/users/addresses', auth.required, validate.address, UserController.createAddress);
router.put('/users/addresses/:id', auth.required, validate.address, UserController.updateAddress);
router.delete('/users/addresses/:id', auth.required, UserController.deleteAddress);
router.get('/users/orders', auth.required, UserController.orders);
router.get('/users/stats', auth.required, UserController.stats);

// Review Routes
router.get('/reviews', ReviewController.index);
router.get('/products/:productId/reviews', ReviewController.productReviews);
router.post('/products/:productId/reviews', auth.required, validate.review, upload.array('images', 3), ReviewController.create);
router.put('/reviews/:id', auth.required, validate.review, ReviewController.update);
router.delete('/reviews/:id', auth.required, ReviewController.delete);
router.post('/reviews/:id/helpful', auth.required, ReviewController.markHelpful);

// Wishlist Routes
router.get('/wishlist', auth.required, WishlistController.index);
router.post('/wishlist', auth.required, validate.wishlist, WishlistController.add);
router.delete('/wishlist/:productId', auth.required, WishlistController.remove);
router.delete('/wishlist', auth.required, WishlistController.clear);

// Payment Routes
router.post('/payments/process', auth.required, validate.payment, PaymentController.process);
router.get('/payments/:id', auth.required, PaymentController.show);
router.post('/payments/webhook', PaymentController.webhook);
router.get('/payments/methods', PaymentController.methods);

// Admin Routes (with admin middleware)
router.use('/admin', auth.required, auth.admin);
router.get('/admin/dashboard', require('../controllers/api/AdminController').dashboard);
router.get('/admin/users', require('../controllers/api/AdminController').users);
router.get('/admin/orders', require('../controllers/api/AdminController').orders);
router.get('/admin/products', require('../controllers/api/AdminController').products);
router.get('/admin/analytics', require('../controllers/api/AdminController').analytics);

// Rate limiting
router.use('/auth', rateLimit.auth);
router.use('/orders', rateLimit.orders);
router.use('/payments', rateLimit.payments);

module.exports = router;
```

### 3.2 API Controllers Implementation

#### AuthController:

```javascript
// controllers/api/AuthController.js
const { User } = require('../../models');
const AuthService = require('../../services/AuthService');
const EmailService = require('../../services/EmailService');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const redis = require('../../config/redis');

class AuthController {
    // POST /api/auth/register
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: errors.array()
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            const { username, email, password, firstName, lastName, phone, role = 'customer' } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [{ email }, { username }]
                }
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    error: {
                        code: 'USER_EXISTS',
                        message: existingUser.email === email 
                            ? 'Email already registered' 
                            : 'Username already taken'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Create user
            const user = await User.create({
                username,
                email,
                passwordHash: password, // Will be hashed by model hook
                firstName,
                lastName,
                phone,
                role
            });

            // Generate tokens
            const accessToken = user.generateAuthToken();
            const refreshToken = user.generateRefreshToken();

            // Store refresh token in Redis
            await redis.setex(`refresh_token:${user.id}`, 30 * 24 * 60 * 60, refreshToken);

            // Send verification email
            await AuthService.sendVerificationEmail(user);

            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        emailVerified: user.emailVerified
                    },
                    tokens: {
                        accessToken,
                        refreshToken,
                        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
                    }
                },
                message: 'User registered successfully. Please check your email to verify your account.',
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Registration failed'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // POST /api/auth/login
    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: errors.array()
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            const { login, password, rememberMe = false } = req.body;

            // Find user by email or username
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        { email: login },
                        { username: login }
                    ]
                }
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid login credentials'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid login credentials'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Check if account is active
            if (user.status !== 'active') {
                return res.status(403).json({
                    success: false,
                    error: {
                        code: 'ACCOUNT_INACTIVE',
                        message: 'Your account is inactive. Please contact support.'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Generate tokens
            const accessToken = user.generateAuthToken();
            const refreshToken = user.generateRefreshToken();

            // Store refresh token in Redis
            const refreshTokenExpiry = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days or 7 days
            await redis.setex(`refresh_token:${user.id}`, refreshTokenExpiry, refreshToken);

            // Update last login
            await user.updateLastLogin();

            res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        emailVerified: user.emailVerified,
                        avatar: user.avatar
                    },
                    tokens: {
                        accessToken,
                        refreshToken,
                        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
                    }
                },
                message: 'Login successful',
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Login failed'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // POST /api/auth/logout
    async logout(req, res) {
        try {
            const userId = req.user.id;

            // Remove refresh token from Redis
            await redis.del(`refresh_token:${userId}`);

            // Add access token to blacklist
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                const decoded = jwt.decode(token);
                const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
                if (expiresIn > 0) {
                    await redis.setex(`blacklist:${token}`, expiresIn, 'true');
                }
            }

            res.json({
                success: true,
                message: 'Logout successful',
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Logout failed'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // POST /api/auth/refresh
    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'MISSING_REFRESH_TOKEN',
                        message: 'Refresh token is required'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Verify refresh token
            let decoded;
            try {
                decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_REFRESH_TOKEN',
                        message: 'Invalid or expired refresh token'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Check if refresh token exists in Redis
            const storedToken = await redis.get(`refresh_token:${decoded.id}`);
            if (!storedToken || storedToken !== refreshToken) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_REFRESH_TOKEN',
                        message: 'Invalid refresh token'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Get user
            const user = await User.findByPk(decoded.id);
            if (!user || user.status !== 'active') {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'User not found or inactive'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Generate new tokens
            const newAccessToken = user.generateAuthToken();
            const newRefreshToken = user.generateRefreshToken();

            // Update refresh token in Redis
            await redis.setex(`refresh_token:${user.id}`, 30 * 24 * 60 * 60, newRefreshToken);

            res.json({
                success: true,
                data: {
                    tokens: {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
                    }
                },
                message: 'Tokens refreshed successfully',
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Refresh token error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Token refresh failed'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // POST /api/auth/forgot-password
    async forgotPassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: errors.array()
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            const { email } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                // Don't reveal if email exists or not
                return res.json({
                    success: true,
                    message: 'If the email exists, a password reset link has been sent.',
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = Date.now() + 3600000; // 1 hour

            // Store reset token in Redis
            await redis.setex(`password_reset:${resetToken}`, 3600, user.id);

            // Send password reset email
            await EmailService.sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                template: 'password-reset',
                data: {
                    user,
                    resetToken,
                    resetUrl: `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
                }
            });

            res.json({
                success: true,
                message: 'If the email exists, a password reset link has been sent.',
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Password reset request failed'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // POST /api/auth/reset-password
    async resetPassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: errors.array()
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            const { token, password } = req.body;

            // Verify reset token
            const userId = await redis.get(`password_reset:${token}`);
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_TOKEN',
                        message: 'Invalid or expired reset token'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Get user
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'User not found'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Update password
            const hashedPassword = await bcrypt.hash(password, 12);
            await user.update({ passwordHash: hashedPassword });

            // Remove reset token
            await redis.del(`password_reset:${token}`);

            // Invalidate all existing tokens
            await redis.del(`refresh_token:${user.id}`);

            // Send confirmation email
            await EmailService.sendEmail({
                to: user.email,
                subject: 'Password Reset Successful',
                template: 'password-reset-success',
                data: { user }
            });

            res.json({
                success: true,
                message: 'Password reset successful. Please login with your new password.',
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Password reset failed'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // POST /api/auth/verify-email
    async verifyEmail(req, res) {
        try {
            const { token } = req.body;

            // Verify email token
            const userId = await redis.get(`email_verification:${token}`);
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_TOKEN',
                        message: 'Invalid or expired verification token'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Update user
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'User not found'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            await user.update({ emailVerified: true });

            // Remove verification token
            await redis.del(`email_verification:${token}`);

            res.json({
                success: true,
                message: 'Email verified successfully',
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Email verification error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Email verification failed'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // POST /api/auth/resend-verification
    async resendVerification(req, res) {
        try {
            const user = req.user;

            if (user.emailVerified) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'ALREADY_VERIFIED',
                        message: 'Email is already verified'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Send verification email
            await AuthService.sendVerificationEmail(user);

            res.json({
                success: true,
                message: 'Verification email sent successfully',
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Resend verification error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to send verification email'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }
}

module.exports = new AuthController();
```

#### ProductController API:

```javascript
// controllers/api/ProductController.js
const { Product, Category, Brand, ProductImage, Review, User } = require('../../models');
const ProductService = require('../../services/ProductService');
const UploadService = require('../../services/UploadService');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class ProductController {
    // GET /api/products
    async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100 items per page
            const offset = (page - 1) * limit;

            const filters = {
                category: req.query.category,
                brand: req.query.brand,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
                rating: req.query.rating ? parseInt(req.query.rating) : undefined,
                inStock: req.query.inStock === 'true',
                featured: req.query.featured === 'true',
                search: req.query.search,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'DESC',
                limit,
                offset
            };

            const result = await Product.findWithFilters(filters);
            const totalPages = Math.ceil(result.count / limit);

            // Transform data for API response
            const products = result.rows.map(product => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                shortDescription: product.shortDescription,
                price: parseFloat(product.price),
                comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
                discountPercentage: product.getDiscountPercentage(),
                inStock: product.isInStock(),
                inventoryQuantity: product.inventoryQuantity,
                featured: product.featured,
                status: product.status,
                images: product.images?.map(img => ({
                    id: img.id,
                    url: img.imageUrl,
                    altText: img.altText,
                    isPrimary: img.isPrimary
                })) || [],
                category: product.category ? {
                    id: product.category.id,
                    name: product.category.name,
                    slug: product.category.slug
                } : null,
                brand: product.brand ? {
                    id: product.brand.id,
                    name: product.brand.name,
                    slug: product.brand.slug
                } : null,
                rating: {
                    average: parseFloat(product.getDataValue('avgRating') || 0),
                    count: parseInt(product.getDataValue('reviewCount') || 0)
                },
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            }));

            res.json({
                success: true,
                data: {
                    products,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalItems: result.count,
                        itemsPerPage: limit,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    }
                },
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Error in ProductController.index:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to fetch products'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // GET /api/products/:id
    async show(req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findOne({
                where: { 
                    id,
                    status: 'active'
                },
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
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'PRODUCT_NOT_FOUND',
                        message: 'Product not found'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Get rating stats
            const ratingStats = await product.getAverageRating();

            // Get related products
            const relatedProducts = await Product.getRelated(product.id, product.categoryId, 4);

            // Transform product data
            const productData = {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                shortDescription: product.shortDescription,
                sku: product.sku,
                barcode: product.barcode,
                price: parseFloat(product.price),
                comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
                costPrice: product.costPrice ? parseFloat(product.costPrice) : null,
                discountPercentage: product.getDiscountPercentage(),
                trackInventory: product.trackInventory,
                inventoryQuantity: product.inventoryQuantity,
                allowBackorder: product.allowBackorder,
                weight: product.weight ? parseFloat(product.weight) : null,
                dimensions: product.dimensions,
                inStock: product.isInStock(),
                featured: product.featured,
                status: product.status,
                metaTitle: product.metaTitle,
                metaDescription: product.metaDescription,
                
                images: product.images?.map(img => ({
                    id: img.id,
                    url: img.imageUrl,
                    altText: img.altText,
                    sortOrder: img.sortOrder,
                    isPrimary: img.isPrimary
                })) || [],
                
                variants: product.variants?.map(variant => ({
                    id: variant.id,
                    sku: variant.sku,
                    name: variant.name,
                    price: variant.price ? parseFloat(variant.price) : null,
                    comparePrice: variant.comparePrice ? parseFloat(variant.comparePrice) : null,
                    inventoryQuantity: variant.inventoryQuantity,
                    weight: variant.weight ? parseFloat(variant.weight) : null,
                    barcode: variant.barcode,
                    imageUrl: variant.imageUrl
                })) || [],
                
                attributes: product.attributeValues?.map(av => ({
                    id: av.attribute.id,
                    name: av.attribute.name,
                    type: av.attribute.type,
                    value: av.value
                })) || [],
                
                category: product.category ? {
                    id: product.category.id,
                    name: product.category.name,
                    slug: product.category.slug
                } : null,
                
                brand: product.brand ? {
                    id: product.brand.id,
                    name: product.brand.name,
                    slug: product.brand.slug,
                    logo: product.brand.logo
                } : null,
                
                seller: product.seller ? {
                    id: product.seller.id,
                    username: product.seller.username,
                    name: product.seller.getFullName()
                } : null,
                
                rating: ratingStats,
                
                relatedProducts: relatedProducts.map(rp => ({
                    id: rp.id,
                    name: rp.name,
                    slug: rp.slug,
                    price: parseFloat(rp.price),
                    comparePrice: rp.comparePrice ? parseFloat(rp.comparePrice) : null,
                    discountPercentage: rp.getDiscountPercentage(),
                    primaryImage: rp.getPrimaryImage()
                })),
                
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            };

            res.json({
                success: true,
                data: { product: productData },
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Error in ProductController.show:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to fetch product'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // POST /api/products
    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: errors.array()
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Process uploaded images
            let images = [];
            if (req.files && req.files.length > 0) {
                images = await Promise.all(
                    req.files.map(async (file, index) => {
                        const uploadResult = await UploadService.uploadImage(file, 'products');
                        return {
                            url: uploadResult.url,
                            altText: req.body.imageAlts?.[index] || '',
                            isPrimary: index === 0
                        };
                    })
                );
            }

            const productData = {
                ...req.body,
                images,
                attributes: req.body.attributes ? JSON.parse(req.body.attributes) : []
            };

            const product = await ProductService.createProduct(productData, req.user.id);

            res.status(201).json({
                success: true,
                data: { product },
                message: 'Product created successfully',
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Error in ProductController.create:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to create product'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // PUT /api/products/:id
    async update(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: errors.array()
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            const { id } = req.params;

            // Process uploaded images if any
            let images = [];
            if (req.files && req.files.length > 0) {
                images = await Promise.all(
                    req.files.map(async (file, index) => {
                        const uploadResult = await UploadService.uploadImage(file, 'products');
                        return {
                            url: uploadResult.url,
                            altText: req.body.imageAlts?.[index] || '',
                            isPrimary: index === 0
                        };
                    })
                );
            }

            const productData = {
                ...req.body,
                ...(images.length > 0 && { images }),
                attributes: req.body.attributes ? JSON.parse(req.body.attributes) : undefined
            };

            const product = await ProductService.updateProduct(id, productData, req.user.id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'PRODUCT_NOT_FOUND',
                        message: 'Product not found or access denied'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            res.json({
                success: true,
                data: { product },
                message: 'Product updated successfully',
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Error in ProductController.update:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to update product'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // DELETE /api/products/:id
    async delete(req, res) {
        try {
            const { id } = req.params;

            const result = await ProductService.deleteProduct(id, req.user.id);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'PRODUCT_NOT_FOUND',
                        message: 'Product not found or access denied'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            res.status(204).json();
        } catch (error) {
            console.error('Error in ProductController.delete:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to delete product'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // GET /api/products/featured
    async featured(req, res) {
        try {
            const limit = Math.min(parseInt(req.query.limit) || 8, 20);
            const products = await ProductService.getFeaturedProducts(limit);

            const productsData = products.map(product => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                shortDescription: product.shortDescription,
                price: parseFloat(product.price),
                comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
                discountPercentage: product.getDiscountPercentage(),
                primaryImage: product.getPrimaryImage(),
                inStock: product.isInStock(),
                category: product.category ? {
                    id: product.category.id,
                    name: product.category.name,
                    slug: product.category.slug
                } : null
            }));

            res.json({
                success: true,
                data: { products: productsData },
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Error in ProductController.featured:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to fetch featured products'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // GET /api/products/search
    async search(req, res) {
        try {
            const { q: query } = req.query;

            if (!query || query.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_QUERY',
                        message: 'Search query must be at least 2 characters long'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            const filters = {
                categoryId: req.query.category,
                brandId: req.query.brand,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
                limit: Math.min(parseInt(req.query.limit) || 20, 100)
            };

            const products = await ProductService.searchProducts(query.trim(), filters);

            const productsData = products.map(product => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                shortDescription: product.shortDescription,
                price: parseFloat(product.price),
                comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
                discountPercentage: product.getDiscountPercentage(),
                primaryImage: product.getPrimaryImage(),
                inStock: product.isInStock(),
                category: product.category ? {
                    id: product.category.id,
                    name: product.category.name,
                    slug: product.category.slug
                } : null,
                brand: product.brand ? {
                    id: product.brand.id,
                    name: product.brand.name,
                    slug: product.brand.slug
                } : null
            }));

            res.json({
                success: true,
                data: { 
                    products: productsData,
                    query: query.trim(),
                    totalResults: products.length
                },
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Error in ProductController.search:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Search failed'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // PATCH /api/products/:id/status
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['draft', 'active', 'archived'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_STATUS',
                        message: 'Invalid status value'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            const product = await Product.findOne({
                where: { 
                    id,
                    sellerId: req.user.id
                }
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'PRODUCT_NOT_FOUND',
                        message: 'Product not found or access denied'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            await product.update({ status });

            res.json({
                success: true,
                data: { 
                    product: {
                        id: product.id,
                        name: product.name,
                        status: product.status
                    }
                },
                message: 'Product status updated successfully',
                meta: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Error in ProductController.updateStatus:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to update product status'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }
}

module.exports = new ProductController();
```

### 3.3 Middleware Implementation

#### Authentication Middleware:

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const redis = require('../config/redis');

class AuthMiddleware {
    // Required authentication
    async required(req, res, next) {
        try {
            const token = this.extractToken(req);
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'MISSING_TOKEN',
                        message: 'Access token is required'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Check if token is blacklisted
            const isBlacklisted = await redis.get(`blacklist:${token}`);
            if (isBlacklisted) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'TOKEN_BLACKLISTED',
                        message: 'Token has been invalidated'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['passwordHash'] }
            });

            if (!user || user.status !== 'active') {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'User not found or inactive'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_TOKEN',
                        message: 'Invalid access token'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'TOKEN_EXPIRED',
                        message: 'Access token has expired'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            console.error('Auth middleware error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Authentication failed'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }
    }

    // Optional authentication (sets user if token is valid)
    async optional(req, res, next) {
        try {
            const token = this.extractToken(req);
            
            if (!token) {
                return next();
            }

            // Check if token is blacklisted
            const isBlacklisted = await redis.get(`blacklist:${token}`);
            if (isBlacklisted) {
                return next();
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['passwordHash'] }
            });

            if (user && user.status === 'active') {
                req.user = user;
            }

            next();
        } catch (error) {
            // For optional auth, we don't return errors, just continue without user
            next();
        }
    }

    // Admin role required
    admin(req, res, next) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'AUTHENTICATION_REQUIRED',
                    message: 'Authentication required'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'INSUFFICIENT_PERMISSIONS',
                    message: 'Admin access required'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }

        next();
    }

    // Seller role required
    seller(req, res, next) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'AUTHENTICATION_REQUIRED',
                    message: 'Authentication required'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }

        if (!['seller', 'admin'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'INSUFFICIENT_PERMISSIONS',
                    message: 'Seller access required'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }

        next();
    }

    // Customer role required
    customer(req, res, next) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'AUTHENTICATION_REQUIRED',
                    message: 'Authentication required'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }

        if (!['customer', 'seller', 'admin'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'INSUFFICIENT_PERMISSIONS',
                    message: 'Customer access required'
                },
                meta: { timestamp: new Date().toISOString() }
            });
        }

        next();
    }

    // Permission-based access
    permission(requiredPermission) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'AUTHENTICATION_REQUIRED',
                        message: 'Authentication required'
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            if (!req.user.hasPermission(requiredPermission)) {
                return res.status(403).json({
                    success: false,
                    error: {
                        code: 'INSUFFICIENT_PERMISSIONS',
                        message: `Permission '${requiredPermission}' required`
                    },
                    meta: { timestamp: new Date().toISOString() }
                });
            }

            next();
        };
    }

    extractToken(req) {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        
        return null;
    }
}

module.exports = new AuthMiddleware();
```

#### Validation Middleware:

```javascript
// middleware/validation.js
const { body, param, query } = require('express-validator');

class ValidationMiddleware {
    // User registration validation
    get register() {
        return [
            body('username')
                .isLength({ min: 3, max: 50 })
                .withMessage('Username must be between 3 and 50 characters')
                .matches(/^[a-zA-Z0-9_]+$/)
                .withMessage('Username can only contain letters, numbers, and underscores'),
            
            body('email')
                .isEmail()
                .withMessage('Please provide a valid email address')
                .normalizeEmail(),
            
            body('password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
                .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
            
            body('firstName')
                .optional()
                .isLength({ min: 1, max: 50 })
                .withMessage('First name must be between 1 and 50 characters'),
            
            body('lastName')
                .optional()
                .isLength({ min: 1, max: 50 })
                .withMessage('Last name must be between 1 and 50 characters'),
            
            body('phone')
                .optional()
                .isMobilePhone('vi-VN')
                .withMessage('Please provide a valid Vietnamese phone number'),
            
            body('role')
                .optional()
                .isIn(['customer', 'seller'])
                .withMessage('Role must be either customer or seller')
        ];
    }

    // User login validation
    get login() {
        return [
            body('login')
                .notEmpty()
                .withMessage('Email or username is required'),
            
            body('password')
                .notEmpty()
                .withMessage('Password is required'),
            
            body('rememberMe')
                .optional()
                .isBoolean()
                .withMessage('Remember me must be a boolean value')
        ];
    }

    // Product validation
    get product() {
        return [
            body('name')
                .isLength({ min: 1, max: 255 })
                .withMessage('Product name must be between 1 and 255 characters'),
            
            body('description')
                .optional()
                .isLength({ max: 5000 })
                .withMessage('Description must not exceed 5000 characters'),
            
            body('shortDescription')
                .optional()
                .isLength({ max: 500 })
                .withMessage('Short description must not exceed 500 characters'),
            
            body('price')
                .isFloat({ min: 0 })
                .withMessage('Price must be a positive number'),
            
            body('comparePrice')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Compare price must be a positive number'),
            
            body('costPrice')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Cost price must be a positive number'),
            
            body('inventoryQuantity')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Inventory quantity must be a non-negative integer'),
            
            body('weight')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Weight must be a positive number'),
            
            body('categoryId')
                .isInt({ min: 1 })
                .withMessage('Category ID must be a positive integer'),
            
            body('brandId')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Brand ID must be a positive integer'),
            
            body('trackInventory')
                .optional()
                .isBoolean()
                .withMessage('Track inventory must be a boolean value'),
            
            body('allowBackorder')
                .optional()
                .isBoolean()
                .withMessage('Allow backorder must be a boolean value'),
            
            body('featured')
                .optional()
                .isBoolean()
                .withMessage('Featured must be a boolean value'),
            
            body('status')
                .optional()
                .isIn(['draft', 'active', 'archived'])
                .withMessage('Status must be draft, active, or archived')
        ];
    }

    // Category validation
    get category() {
        return [
            body('name')
                .isLength({ min: 1, max: 100 })
                .withMessage('Category name must be between 1 and 100 characters'),
            
            body('description')
                .optional()
                .isLength({ max: 1000 })
                .withMessage('Description must not exceed 1000 characters'),
            
            body('parentId')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Parent ID must be a positive integer'),
            
            body('sortOrder')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Sort order must be a non-negative integer'),
            
            body('isActive')
                .optional()
                .isBoolean()
                .withMessage('Is active must be a boolean value')
        ];
    }

    // Cart item validation
    get cartItem() {
        return [
            body('productId')
                .isInt({ min: 1 })
                .withMessage('Product ID must be a positive integer'),
            
            body('variantId')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Variant ID must be a positive integer'),
            
            body('quantity')
                .isInt({ min: 1, max: 100 })
                .withMessage('Quantity must be between 1 and 100')
        ];
    }

    // Cart update validation
    get cartUpdate() {
        return [
            body('quantity')
                .isInt({ min: 1, max: 100 })
                .withMessage('Quantity must be between 1 and 100')
        ];
    }

    // Order validation
    get order() {
        return [
            body('shipping.fullName')
                .isLength({ min: 1, max: 100 })
                .withMessage('Full name must be between 1 and 100 characters'),
            
            body('shipping.phone')
                .isMobilePhone('vi-VN')
                .withMessage('Please provide a valid Vietnamese phone number'),
            
            body('shipping.email')
                .optional()
                .isEmail()
                .withMessage('Please provide a valid email address'),
            
            body('shipping.city')
                .isLength({ min: 1, max: 100 })
                .withMessage('City must be between 1 and 100 characters'),
            
            body('shipping.district')
                .isLength({ min: 1, max: 100 })
                .withMessage('District must be between 1 and 100 characters'),
            
            body('shipping.ward')
                .isLength({ min: 1, max: 100 })
                .withMessage('Ward must be between 1 and 100 characters'),
            
            body('shipping.street')
                .isLength({ min: 1, max: 255 })
                .withMessage('Street must be between 1 and 255 characters'),
            
            body('notes')
                .optional()
                .isLength({ max: 1000 })
                .withMessage('Notes must not exceed 1000 characters'),
            
            body('guestEmail')
                .if(body('userId').not().exists())
                .isEmail()
                .withMessage('Guest email is required for non-authenticated orders')
        ];
    }

    // Review validation
    get review() {
        return [
            body('rating')
                .isInt({ min: 1, max: 5 })
                .withMessage('Rating must be between 1 and 5'),
            
            body('title')
                .optional()
                .isLength({ min: 1, max: 255 })
                .withMessage('Title must be between 1 and 255 characters'),
            
            body('comment')
                .optional()
                .isLength({ max: 2000 })
                .withMessage('Comment must not exceed 2000 characters')
        ];
    }

    // Address validation
    get address() {
        return [
            body('fullName')
                .isLength({ min: 1, max: 100 })
                .withMessage('Full name must be between 1 and 100 characters'),
            
            body('phone')
                .isMobilePhone('vi-VN')
                .withMessage('Please provide a valid Vietnamese phone number'),
            
            body('email')
                .optional()
                .isEmail()
                .withMessage('Please provide a valid email address'),
            
            body('city')
                .isLength({ min: 1, max: 100 })
                .withMessage('City must be between 1 and 100 characters'),
            
            body('district')
                .isLength({ min: 1, max: 100 })
                .withMessage('District must be between 1 and 100 characters'),
            
            body('ward')
                .isLength({ min: 1, max: 100 })
                .withMessage('Ward must be between 1 and 100 characters'),
            
            body('street')
                .isLength({ min: 1, max: 255 })
                .withMessage('Street must be between 1 and 255 characters'),
            
            body('type')
                .optional()
                .isIn(['home', 'work', 'other'])
                .withMessage('Address type must be home, work, or other'),
            
            body('isDefault')
                .optional()
                .isBoolean()
                .withMessage('Is default must be a boolean value')
        ];
    }

    // Profile update validation
    get profile() {
        return [
            body('firstName')
                .optional()
                .isLength({ min: 1, max: 50 })
                .withMessage('First name must be between 1 and 50 characters'),
            
            body('lastName')
                .optional()
                .isLength({ min: 1, max: 50 })
                .withMessage('Last name must be between 1 and 50 characters'),
            
            body('phone')
                .optional()
                .isMobilePhone('vi-VN')
                .withMessage('Please provide a valid Vietnamese phone number'),
            
            body('dateOfBirth')
                .optional()
                .isISO8601()
                .withMessage('Date of birth must be a valid date'),
            
            body('gender')
                .optional()
                .isIn(['male', 'female', 'other'])
                .withMessage('Gender must be male, female, or other')
        ];
    }

    // Change password validation
    get changePassword() {
        return [
            body('currentPassword')
                .notEmpty()
                .withMessage('Current password is required'),
            
            body('newPassword')
                .isLength({ min: 8 })
                .withMessage('New password must be at least 8 characters long')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
                .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
            
            body('confirmPassword')
                .custom((value, { req }) => {
                    if (value !== req.body.newPassword) {
                        throw new Error('Password confirmation does not match');
                    }
                    return true;
                })
        ];
    }

    // Email validation
    get email() {
        return [
            body('email')
                .isEmail()
                .withMessage('Please provide a valid email address')
                .normalizeEmail()
        ];
    }

    // Reset password validation
    get resetPassword() {
        return [
            body('token')
                .notEmpty()
                .withMessage('Reset token is required'),
            
            body('password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
                .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
        ];
    }

    // Wishlist validation
    get wishlist() {
        return [
            body('productId')
                .isInt({ min: 1 })
                .withMessage('Product ID must be a positive integer')
        ];
    }

    // Payment validation
    get payment() {
        return [
            body('orderId')
                .isInt({ min: 1 })
                .withMessage('Order ID must be a positive integer'),
            
            body('method')
                .isIn(['cod', 'bank_transfer', 'credit_card', 'vnpay', 'momo', 'zalopay'])
                .withMessage('Invalid payment method'),
            
            body('amount')
                .isFloat({ min: 0 })
                .withMessage('Amount must be a positive number')
        ];
    }

    // Parameter validation
    get idParam() {
        return [
            param('id')
                .isInt({ min: 1 })
                .withMessage('ID must be a positive integer')
        ];
    }

    // Query validation
    get paginationQuery() {
        return [
            query('page')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Page must be a positive integer'),
            
            query('limit')
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage('Limit must be between 1 and 100')
        ];
    }
}

module.exports = new ValidationMiddleware();
```

### 3.4 Rate Limiting Middleware:

```javascript
// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const redis = require('../config/redis');

// Redis store for rate limiting
const RedisStore = require('rate-limit-redis');

class RateLimitMiddleware {
    constructor() {
        this.redisStore = new RedisStore({
            client: redis,
            prefix: 'rl:'
        });
    }

    // General API rate limiting
    get general() {
        return rateLimit({
            store: this.redisStore,
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000, // limit each IP to 1000 requests per windowMs
            message: {
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Too many requests, please try again later'
                },
                meta: { timestamp: new Date().toISOString() }
            },
            standardHeaders: true,
            legacyHeaders: false
        });
    }

    // Authentication endpoints rate limiting
    get auth() {
        return rateLimit({
            store: this.redisStore,
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 10, // limit each IP to 10 auth requests per windowMs
            message: {
                success: false,
                error: {
                    code: 'AUTH_RATE_LIMIT_EXCEEDED',
                    message: 'Too many authentication attempts, please try again later'
                },
                meta: { timestamp: new Date().toISOString() }
            },
            skipSuccessfulRequests: true,
            standardHeaders: true,
            legacyHeaders: false
        });
    }

    // Order creation rate limiting
    get orders() {
        return rateLimit({
            store: this.redisStore,
            windowMs: 60 * 1000, // 1 minute
            max: 5, // limit each IP to 5 order requests per minute
            message: {
                success: false,
                error: {
                    code: 'ORDER_RATE_LIMIT_EXCEEDED',
                    message: 'Too many order requests, please try again later'
                },
                meta: { timestamp: new Date().toISOString() }
            },
            standardHeaders: true,
            legacyHeaders: false
        });
    }

    // Payment processing rate limiting
    get payments() {
        return rateLimit({
            store: this.redisStore,
            windowMs: 60 * 1000, // 1 minute
            max: 3, // limit each IP to 3 payment requests per minute
            message: {
                success: false,
                error: {
                    code: 'PAYMENT_RATE_LIMIT_EXCEEDED',
                    message: 'Too many payment requests, please try again later'
                },
                meta: { timestamp: new Date().toISOString() }
            },
            standardHeaders: true,
            legacyHeaders: false
        });
    }

    // Search rate limiting with slow down
    get search() {
        return [
            slowDown({
                store: this.redisStore,
                windowMs: 60 * 1000, // 1 minute
                delayAfter: 10, // allow 10 requests per minute at full speed
                delayMs: 500, // add 500ms delay per request after delayAfter
                maxDelayMs: 5000, // max delay of 5 seconds
                skipSuccessfulRequests: false
            }),
            rateLimit({
                store: this.redisStore,
                windowMs: 60 * 1000, // 1 minute
                max: 50, // limit each IP to 50 search requests per minute
                message: {
                    success: false,
                    error: {
                        code: 'SEARCH_RATE_LIMIT_EXCEEDED',
                        message: 'Too many search requests, please try again later'
                    },
                    meta: { timestamp: new Date().toISOString() }
                },
                standardHeaders: true,
                legacyHeaders: false
            })
        ];
    }

    // File upload rate limiting
    get upload() {
        return rateLimit({
            store: this.redisStore,
            windowMs: 60 * 1000, // 1 minute
            max: 10, // limit each IP to 10 upload requests per minute
            message: {
                success: false,
                error: {
                    code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
                    message: 'Too many upload requests, please try again later'
                },
                meta: { timestamp: new Date().toISOString() }
            },
            standardHeaders: true,
            legacyHeaders: false
        });
    }

    // Admin endpoints rate limiting
    get admin() {
        return rateLimit({
            store: this.redisStore,
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 500, // limit each IP to 500 admin requests per windowMs
            message: {
                success: false,
                error: {
                    code: 'ADMIN_RATE_LIMIT_EXCEEDED',
                    message: 'Too many admin requests, please try again later'
                },
                meta: { timestamp: new Date().toISOString() }
            },
            standardHeaders: true,
            legacyHeaders: false
        });
    }

    // Custom rate limiter for specific needs
    custom(options = {}) {
        const {
            windowMs = 15 * 60 * 1000,
            max = 100,
            message = 'Too many requests',
            skipSuccessfulRequests = false,
            skipFailedRequests = false
        } = options;

        return rateLimit({
            store: this.redisStore,
            windowMs,
            max,
            message: {
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message
                },
                meta: { timestamp: new Date().toISOString() }
            },
            skipSuccessfulRequests,
            skipFailedRequests,
            standardHeaders: true,
            legacyHeaders: false
        });
    }
}

module.exports = new RateLimitMiddleware();
```

---

## 🎯 TỔNG KẾT ROADMAP HOÀN CHỈNH

Tôi đã tạo ra một **lộ trình học tập E-commerce hoàn chỉnh** bao gồm:

### ✅ ĐÃ HOÀN THÀNH:

1. **🎨 Frontend Foundation (HTML, CSS, JS, Pug, SCSS)**
   - HTML5 semantic với accessibility
   - CSS3 advanced với Flexbox/Grid
   - JavaScript ES6+ với DOM manipulation
   - Pug templates với mixins
   - SCSS với variables, mixins, functions
   - NPM package management

2. **🏗️ Database Design (22 Models)**
   - Users, Products, Categories, Brands
   - Orders, OrderItems, Payments, Shipping
   - Reviews, Wishlists, Shopping Cart
   - Addresses, Notifications, Settings
   - Coupons, Product Variants, Attributes

3. **🎯 MVC Architecture**
   - Models với Sequelize ORM
   - Controllers cho Web & API
   - Views với Pug templates
   - Services cho business logic
   - Middleware cho auth, validation, rate limiting

4. **🚀 REST API Complete**
   - Authentication & Authorization
   - CRUD operations cho tất cả entities
   - Rate limiting & security
   - Error handling & validation
   - Pagination & filtering
   - File upload & image processing

### 📚 CÁCH SỬ DỤNG ROADMAP NÀY:

#### **Tuần 1-3: Frontend Basics**
- Học HTML, CSS, JavaScript theo thứ tự
- Làm các bài tập thực hành
- Tạo static website đầu tiên

#### **Tuần 4-5: Advanced Frontend**
- Học Pug template engine
- SCSS advanced techniques
- JavaScript ES6+ features
- NPM và build tools

#### **Tuần 6-10: Backend MVC**
- Thiết kế database schema
- Tạo Sequelize models
- Xây dựng controllers và services
- Implement authentication

#### **Tuần 11-15: REST API**
- API design principles
- Implement all endpoints
- Security và rate limiting
- Testing và documentation

#### **Tuần 16+: Advanced Features**
- Payment gateway integration
- Email service
- File upload
- Admin dashboard
- Deployment

### 🎁 BONUS FEATURES:

1. **Security Best Practices**
2. **Performance Optimization**
3. **Testing Strategies**
4. **Deployment Guide**
5. **Monitoring & Logging**

Bạn có muốn tôi tiếp tục với phần nào cụ thể không? Ví dụ:
- Payment Gateway Integration
- Email Service Implementation  
- File Upload & Image Processing
- Admin Dashboard
- Testing & Deployment

Hoặc bạn có câu hỏi gì về các phần đã hoàn thành?