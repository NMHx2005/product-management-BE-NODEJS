# HƯỚNG DẪN THỰC HIỆN DỰ ÁN E-COMMERCE

## 🚀 CÀI ĐẶT VÀ KHỞI TẠO DỰ ÁN

### Bước 1: Khởi tạo dự án

```bash
# Tạo thư mục dự án
mkdir ecommerce-mvc-app
cd ecommerce-mvc-app

# Khởi tạo package.json
npm init -y

# Cài đặt dependencies
npm install express express-session express-validator bcryptjs jsonwebtoken multer sharp pug sequelize mysql2 redis nodemailer moment lodash helmet cors compression morgan dotenv cookie-parser express-rate-limit express-slow-down

# Cài đặt devDependencies
npm install --save-dev nodemon sass webpack webpack-cli babel-loader @babel/core @babel/preset-env css-loader style-loader mini-css-extract-plugin eslint eslint-config-standard jest supertest sequelize-cli

# Tạo cấu trúc thư mục
mkdir -p {config,controllers/{api,web},models,views/{layouts,partials,pages,admin,emails},routes,middleware,services,utils,public/{css,js,images,uploads},src/{scss,js},database/{migrations,seeders,sql},tests/{unit,integration,fixtures},docs,scripts}

# Khởi tạo Git
git init
echo "node_modules/
.env
public/uploads/
*.log" > .gitignore
```

### Bước 2: Cấu hình cơ bản

#### .env file:
```bash
# Server Configuration
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-refresh-token-secret-here
JWT_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@ecommerce.com

# File Upload Configuration
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/webp

# Payment Gateway (VNPay example)
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay/return
VNPAY_IPN_URL=http://localhost:3000/api/payments/webhook

# Other
SESSION_SECRET=your-session-secret-here
BCRYPT_ROUNDS=12
```

#### app.js (Entry point):
```javascript
require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

// Import database
const db = require('./models');

// Import routes
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const rateLimit = require('./middleware/rateLimit');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"]
        }
    }
}));

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true
}));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Global variables for views
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.currentUrl = req.originalUrl;
    res.locals.appName = 'E-Commerce Shop';
    res.locals.appUrl = process.env.APP_URL;
    next();
});

// Rate limiting
app.use('/api', rateLimit.general);

// Routes
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(404).json({
            success: false,
            error: {
                code: 'NOT_FOUND',
                message: 'API endpoint not found'
            },
            meta: { timestamp: new Date().toISOString() }
        });
    } else {
        res.status(404).render('errors/404', {
            title: 'Trang không tìm thấy',
            message: 'Trang bạn tìm kiếm không tồn tại'
        });
    }
});

// Error handler
app.use(errorHandler);

// Database sync and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Test database connection
        await db.sequelize.authenticate();
        console.log('✅ Database connection established successfully');

        // Sync database (only in development)
        if (process.env.NODE_ENV === 'development') {
            await db.sequelize.sync({ alter: true });
            console.log('✅ Database synchronized');
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`🌐 App URL: ${process.env.APP_URL}`);
            console.log(`📚 API Documentation: ${process.env.APP_URL}/api`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

if (require.main === module) {
    startServer();
}

module.exports = app;
```

### Bước 3: Cấu hình Database

#### config/database.js:
```javascript
require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME + '_test',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
};
```

#### config/redis.js:
```javascript
const redis = require('redis');

const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            console.error('Redis connection refused');
            return new Error('Redis connection refused');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            console.error('Redis retry time exhausted');
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            console.error('Redis max attempts reached');
            return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
    }
});

client.on('connect', () => {
    console.log('✅ Redis connected');
});

client.on('error', (error) => {
    console.error('❌ Redis error:', error);
});

module.exports = client;
```

### Bước 4: Tạo Database và Migration

```bash
# Tạo database
mysql -u root -p
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit

# Khởi tạo Sequelize
npx sequelize-cli init

# Tạo migration cho Users table
npx sequelize-cli migration:generate --name create-users-table

# Sửa file migration
```

#### database/migrations/001-create-users-table.js:
```javascript
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            username: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            password_hash: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            first_name: {
                type: Sequelize.STRING(50)
            },
            last_name: {
                type: Sequelize.STRING(50)
            },
            phone: {
                type: Sequelize.STRING(20)
            },
            avatar: {
                type: Sequelize.STRING(255)
            },
            date_of_birth: {
                type: Sequelize.DATEONLY
            },
            gender: {
                type: Sequelize.ENUM('male', 'female', 'other')
            },
            role: {
                type: Sequelize.ENUM('customer', 'seller', 'admin'),
                defaultValue: 'customer'
            },
            email_verified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            phone_verified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            status: {
                type: Sequelize.ENUM('active', 'inactive', 'banned'),
                defaultValue: 'active'
            },
            last_login: {
                type: Sequelize.DATE
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Add indexes
        await queryInterface.addIndex('users', ['email']);
        await queryInterface.addIndex('users', ['username']);
        await queryInterface.addIndex('users', ['status']);
        await queryInterface.addIndex('users', ['role']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};
```

### Bước 5: Chạy Migration và Seeder

```bash
# Chạy migration
npx sequelize-cli db:migrate

# Tạo seeder cho admin user
npx sequelize-cli seed:generate --name demo-admin-user
```

#### database/seeders/001-demo-admin-user.js:
```javascript
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface, Sequelize) {
        const hashedPassword = await bcrypt.hash('admin123456', 12);
        
        await queryInterface.bulkInsert('users', [{
            username: 'admin',
            email: 'admin@ecommerce.com',
            password_hash: hashedPassword,
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            status: 'active',
            email_verified: true,
            created_at: new Date(),
            updated_at: new Date()
        }]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', {
            email: 'admin@ecommerce.com'
        });
    }
};
```

```bash
# Chạy seeder
npx sequelize-cli db:seed:all
```

### Bước 6: Build Scripts

#### package.json scripts:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "build": "npm run build:css && npm run build:js",
    "build:css": "sass src/scss/main.scss public/css/main.css --style compressed",
    "build:js": "webpack --mode production",
    "watch:css": "sass --watch src/scss/main.scss public/css/main.css",
    "watch:js": "webpack --mode development --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint . --ext .js",
    "lint:fix": "eslint . --ext .js --fix",
    "migrate": "sequelize-cli db:migrate",
    "migrate:undo": "sequelize-cli db:migrate:undo",
    "seed": "sequelize-cli db:seed:all",
    "seed:undo": "sequelize-cli db:seed:undo:all"
  }
}
```

#### webpack.config.js:
```javascript
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: './src/js/main.js',
        admin: './src/js/admin.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].bundle.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/[name].css'
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
};
```

### Bước 7: SCSS Setup

#### src/scss/main.scss:
```scss
// Variables
@import 'variables';
@import 'mixins';

// Base
@import 'base';
@import 'typography';

// Components
@import 'components/buttons';
@import 'components/forms';
@import 'components/cards';
@import 'components/modals';
@import 'components/navigation';

// Layout
@import 'layout/header';
@import 'layout/footer';
@import 'layout/sidebar';

// Pages
@import 'pages/home';
@import 'pages/products';
@import 'pages/cart';
@import 'pages/checkout';

// Utilities
@import 'utilities';

// Responsive
@import 'responsive';
```

### Bước 8: Chạy dự án

```bash
# Development mode
npm run dev

# Build assets
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 📝 TESTING STRATEGY

### Unit Tests với Jest:

#### tests/unit/models/User.test.js:
```javascript
const { User } = require('../../../models');

describe('User Model', () => {
    beforeEach(async () => {
        await User.destroy({ where: {}, force: true });
    });

    describe('User Creation', () => {
        it('should create a user with valid data', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                passwordHash: 'password123',
                firstName: 'Test',
                lastName: 'User'
            };

            const user = await User.create(userData);

            expect(user.username).toBe('testuser');
            expect(user.email).toBe('test@example.com');
            expect(user.role).toBe('customer');
            expect(user.status).toBe('active');
        });

        it('should hash password before saving', async () => {
            const userData = {
                username: 'testuser2',
                email: 'test2@example.com',
                passwordHash: 'password123'
            };

            const user = await User.create(userData);

            expect(user.passwordHash).not.toBe('password123');
            expect(user.passwordHash.length).toBeGreaterThan(50);
        });

        it('should validate email format', async () => {
            const userData = {
                username: 'testuser3',
                email: 'invalid-email',
                passwordHash: 'password123'
            };

            await expect(User.create(userData)).rejects.toThrow();
        });
    });

    describe('User Methods', () => {
        let user;

        beforeEach(async () => {
            user = await User.create({
                username: 'methodtest',
                email: 'method@example.com',
                passwordHash: 'password123',
                firstName: 'Method',
                lastName: 'Test'
            });
        });

        it('should compare password correctly', async () => {
            const isValid = await user.comparePassword('password123');
            expect(isValid).toBe(true);

            const isInvalid = await user.comparePassword('wrongpassword');
            expect(isInvalid).toBe(false);
        });

        it('should generate full name', () => {
            const fullName = user.getFullName();
            expect(fullName).toBe('Method Test');
        });

        it('should generate auth token', () => {
            const token = user.generateAuthToken();
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(50);
        });
    });
});
```

### Integration Tests:

#### tests/integration/auth.test.js:
```javascript
const request = require('supertest');
const app = require('../../app');
const { User } = require('../../models');

describe('Authentication API', () => {
    beforeEach(async () => {
        await User.destroy({ where: {}, force: true });
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const userData = {
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'Password123',
                firstName: 'New',
                lastName: 'User'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('newuser@example.com');
            expect(response.body.data.tokens.accessToken).toBeDefined();
        });

        it('should return error for duplicate email', async () => {
            await User.create({
                username: 'existing',
                email: 'existing@example.com',
                passwordHash: 'hashedpassword'
            });

            const userData = {
                username: 'newuser',
                email: 'existing@example.com',
                password: 'Password123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('USER_EXISTS');
        });
    });

    describe('POST /api/auth/login', () => {
        let user;

        beforeEach(async () => {
            user = await User.create({
                username: 'logintest',
                email: 'login@example.com',
                passwordHash: 'Password123',
                status: 'active'
            });
        });

        it('should login with valid credentials', async () => {
            const loginData = {
                login: 'login@example.com',
                password: 'Password123'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('login@example.com');
            expect(response.body.data.tokens.accessToken).toBeDefined();
        });

        it('should return error for invalid credentials', async () => {
            const loginData = {
                login: 'login@example.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
        });
    });
});
```

## 🚀 DEPLOYMENT GUIDE

### Docker Setup:

#### Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build assets
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

CMD ["npm", "start"]
```

#### docker-compose.yml:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
    volumes:
      - ./public/uploads:/app/public/uploads

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: ecommerce_db
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  mysql_data:
  redis_data:
```

### Production Deployment:

```bash
# Build and deploy
docker-compose up -d

# Run migrations
docker-compose exec app npm run migrate

# Run seeders
docker-compose exec app npm run seed
```

---

## 🎯 TỔNG KẾT

Bạn đã có **lộ trình học tập E-commerce hoàn chỉnh** với:

✅ **Frontend**: HTML5, CSS3, JavaScript ES6+, Pug, SCSS  
✅ **Backend**: Node.js, Express.js, MVC Architecture  
✅ **Database**: MySQL với 22+ models  
✅ **API**: RESTful API hoàn chỉnh  
✅ **Security**: Authentication, Authorization, Rate Limiting  
✅ **Testing**: Unit tests, Integration tests  
✅ **Deployment**: Docker, Production setup  

**Bắt đầu học ngay hôm nay và xây dựng dự án E-commerce của riêng bạn!** 🚀