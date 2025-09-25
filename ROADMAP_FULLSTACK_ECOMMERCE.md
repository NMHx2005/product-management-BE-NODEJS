# LỘ TRÌNH FULLSTACK E-COMMERCE HOÀN CHỈNH
## Từ Cơ Bản Đến Nâng Cao - MVC & REST API

---

## 📚 PHẦN 1: KIẾN THỨC CƠ BẢN (2-3 tuần)

### 1.1 HTML5 Fundamentals (3-4 ngày)

#### Ngày 1-2: HTML Cơ Bản
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Commerce Shop</title>
</head>
<body>
    <!-- Semantic HTML5 Elements -->
    <header>
        <nav>
            <ul>
                <li><a href="#home">Trang chủ</a></li>
                <li><a href="#products">Sản phẩm</a></li>
                <li><a href="#cart">Giỏ hàng</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <h1>Chào mừng đến cửa hàng</h1>
        </section>
        
        <section id="products">
            <article class="product-card">
                <img src="product.jpg" alt="Sản phẩm">
                <h3>Tên sản phẩm</h3>
                <p>Mô tả sản phẩm</p>
                <span class="price">500,000 VNĐ</span>
            </article>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 E-Commerce Shop</p>
    </footer>
</body>
</html>
```

#### Ngày 3-4: HTML Forms & Accessibility
```html
<!-- Form đăng ký/đăng nhập -->
<form id="registerForm" method="POST" action="/register">
    <fieldset>
        <legend>Thông tin đăng ký</legend>
        
        <label for="username">Tên đăng nhập:</label>
        <input type="text" id="username" name="username" required 
               pattern="[a-zA-Z0-9]{3,20}" 
               aria-describedby="username-help">
        <small id="username-help">3-20 ký tự, chỉ chữ và số</small>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        
        <label for="password">Mật khẩu:</label>
        <input type="password" id="password" name="password" required 
               minlength="8" aria-describedby="password-help">
        <small id="password-help">Tối thiểu 8 ký tự</small>
        
        <label for="role">Vai trò:</label>
        <select id="role" name="role">
            <option value="customer">Khách hàng</option>
            <option value="seller">Người bán</option>
        </select>
        
        <button type="submit">Đăng ký</button>
    </fieldset>
</form>
```

### 1.2 CSS3 & SCSS (4-5 ngày)

#### Ngày 1-2: CSS Cơ Bản & Flexbox/Grid
```css
/* Reset CSS */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Variables */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    --text-color: #333;
    --bg-color: #f8f9fa;
    --border-radius: 8px;
    --shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Layout với Grid */
.container {
    display: grid;
    grid-template-areas: 
        "header header header"
        "sidebar main aside"
        "footer footer footer";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 250px 1fr 300px;
    min-height: 100vh;
    gap: 20px;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }

/* Product Grid với Flexbox */
.products-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
}

.product-card {
    flex: 0 1 calc(25% - 15px);
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

/* Responsive Design */
@media (max-width: 1200px) {
    .product-card { flex: 0 1 calc(33.333% - 14px); }
}

@media (max-width: 768px) {
    .container {
        grid-template-areas: 
            "header"
            "main"
            "sidebar"
            "aside"
            "footer";
        grid-template-columns: 1fr;
    }
    
    .product-card { flex: 0 1 calc(50% - 10px); }
}

@media (max-width: 480px) {
    .product-card { flex: 0 1 100%; }
}
```

#### Ngày 3-4: SCSS Advanced
```scss
// _variables.scss
$colors: (
    primary: #2c3e50,
    secondary: #3498db,
    success: #27ae60,
    warning: #f39c12,
    danger: #e74c3c,
    light: #ecf0f1,
    dark: #2c3e50
);

$breakpoints: (
    xs: 480px,
    sm: 768px,
    md: 992px,
    lg: 1200px,
    xl: 1400px
);

// _mixins.scss
@mixin respond-to($breakpoint) {
    @if map-has-key($breakpoints, $breakpoint) {
        @media (min-width: map-get($breakpoints, $breakpoint)) {
            @content;
        }
    }
}

@mixin button-style($bg-color, $text-color: white) {
    background: map-get($colors, $bg-color);
    color: $text-color;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background: darken(map-get($colors, $bg-color), 10%);
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(0);
    }
}

@mixin card-style {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 20px;
    margin-bottom: 20px;
}

// main.scss
@import 'variables';
@import 'mixins';

.btn {
    @include button-style(primary);
    
    &--secondary { @include button-style(secondary); }
    &--success { @include button-style(success); }
    &--danger { @include button-style(danger); }
}

.card {
    @include card-style;
    
    &__header {
        border-bottom: 1px solid map-get($colors, light);
        padding-bottom: 15px;
        margin-bottom: 15px;
        
        h3 {
            color: map-get($colors, primary);
            font-size: 1.25rem;
        }
    }
    
    &__body {
        p {
            line-height: 1.6;
            color: #666;
        }
    }
    
    &__footer {
        border-top: 1px solid map-get($colors, light);
        padding-top: 15px;
        margin-top: 15px;
        text-align: right;
    }
}

// Responsive Grid System
.row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
}

.col {
    padding: 0 15px;
    flex: 1;
    
    @for $i from 1 through 12 {
        &-#{$i} {
            flex: 0 0 percentage($i / 12);
            max-width: percentage($i / 12);
        }
        
        @include respond-to(sm) {
            &-sm-#{$i} {
                flex: 0 0 percentage($i / 12);
                max-width: percentage($i / 12);
            }
        }
        
        @include respond-to(md) {
            &-md-#{$i} {
                flex: 0 0 percentage($i / 12);
                max-width: percentage($i / 12);
            }
        }
        
        @include respond-to(lg) {
            &-lg-#{$i} {
                flex: 0 0 percentage($i / 12);
                max-width: percentage($i / 12);
            }
        }
    }
}
```

### 1.3 JavaScript ES6+ (5-6 ngày)

#### Ngày 1-2: JavaScript Cơ Bản & ES6
```javascript
// ES6+ Features
class Product {
    constructor(id, name, price, category, stock = 0) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.stock = stock;
        this.createdAt = new Date();
    }
    
    // Getter/Setter
    get formattedPrice() {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(this.price);
    }
    
    set updateStock(quantity) {
        if (quantity < 0) {
            throw new Error('Số lượng không thể âm');
        }
        this.stock = quantity;
    }
    
    // Methods
    isInStock() {
        return this.stock > 0;
    }
    
    applyDiscount(percentage) {
        return this.price * (1 - percentage / 100);
    }
}

// Shopping Cart Class
class ShoppingCart {
    constructor() {
        this.items = new Map();
        this.discountCode = null;
        this.shippingFee = 30000;
    }
    
    addItem(product, quantity = 1) {
        if (!product.isInStock()) {
            throw new Error('Sản phẩm đã hết hàng');
        }
        
        const existingItem = this.items.get(product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.set(product.id, {
                product,
                quantity,
                addedAt: new Date()
            });
        }
        
        this.saveToLocalStorage();
        this.updateCartUI();
    }
    
    removeItem(productId) {
        this.items.delete(productId);
        this.saveToLocalStorage();
        this.updateCartUI();
    }
    
    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }
        
        const item = this.items.get(productId);
        if (item) {
            item.quantity = quantity;
            this.saveToLocalStorage();
            this.updateCartUI();
        }
    }
    
    get totalItems() {
        return Array.from(this.items.values())
            .reduce((total, item) => total + item.quantity, 0);
    }
    
    get subtotal() {
        return Array.from(this.items.values())
            .reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
    
    get total() {
        let total = this.subtotal + this.shippingFee;
        if (this.discountCode) {
            total *= (1 - this.discountCode.percentage / 100);
        }
        return total;
    }
    
    applyDiscountCode(code) {
        // Simulate API call
        return fetch('/api/discount/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                this.discountCode = data;
                this.updateCartUI();
                return true;
            }
            return false;
        });
    }
    
    saveToLocalStorage() {
        const cartData = {
            items: Array.from(this.items.entries()),
            discountCode: this.discountCode,
            savedAt: new Date()
        };
        localStorage.setItem('shopping_cart', JSON.stringify(cartData));
    }
    
    loadFromLocalStorage() {
        const saved = localStorage.getItem('shopping_cart');
        if (saved) {
            const data = JSON.parse(saved);
            this.items = new Map(data.items);
            this.discountCode = data.discountCode;
        }
    }
    
    updateCartUI() {
        // Update cart badge
        document.querySelector('.cart-badge').textContent = this.totalItems;
        
        // Update cart dropdown
        this.renderCartDropdown();
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: {
                itemCount: this.totalItems,
                total: this.total
            }
        }));
    }
    
    renderCartDropdown() {
        const dropdown = document.querySelector('.cart-dropdown');
        if (!dropdown) return;
        
        const itemsHTML = Array.from(this.items.values())
            .map(item => `
                <div class="cart-item" data-id="${item.product.id}">
                    <img src="${item.product.image}" alt="${item.product.name}">
                    <div class="cart-item__info">
                        <h4>${item.product.name}</h4>
                        <p>${item.product.formattedPrice} x ${item.quantity}</p>
                    </div>
                    <button class="cart-item__remove" onclick="cart.removeItem(${item.product.id})">×</button>
                </div>
            `).join('');
        
        dropdown.innerHTML = `
            <div class="cart-items">${itemsHTML}</div>
            <div class="cart-summary">
                <p>Tổng cộng: ${this.total.toLocaleString('vi-VN')} VNĐ</p>
                <a href="/checkout" class="btn btn--primary">Thanh toán</a>
            </div>
        `;
    }
}
```

#### Ngày 3-4: DOM Manipulation & Events
```javascript
// DOM Utilities
const DOM = {
    // Element selection
    select: (selector) => document.querySelector(selector),
    selectAll: (selector) => document.querySelectorAll(selector),
    
    // Element creation
    create: (tag, attributes = {}, content = '') => {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    },
    
    // Event handling
    on: (element, event, handler, options = {}) => {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        element?.addEventListener(event, handler, options);
    },
    
    off: (element, event, handler) => {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        element?.removeEventListener(event, handler);
    },
    
    // Animation utilities
    fadeIn: (element, duration = 300) => {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    fadeOut: (element, duration = 300) => {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
};

// Product Filter & Search
class ProductFilter {
    constructor(products, containerSelector) {
        this.allProducts = products;
        this.filteredProducts = [...products];
        this.container = DOM.select(containerSelector);
        this.currentFilters = {
            category: '',
            priceRange: { min: 0, max: Infinity },
            searchTerm: '',
            sortBy: 'name'
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.render();
    }
    
    setupEventListeners() {
        // Category filter
        DOM.on('.category-filter', 'change', (e) => {
            this.currentFilters.category = e.target.value;
            this.applyFilters();
        });
        
        // Price range filter
        DOM.on('.price-min', 'input', (e) => {
            this.currentFilters.priceRange.min = parseFloat(e.target.value) || 0;
            this.applyFilters();
        });
        
        DOM.on('.price-max', 'input', (e) => {
            this.currentFilters.priceRange.max = parseFloat(e.target.value) || Infinity;
            this.applyFilters();
        });
        
        // Search
        let searchTimeout;
        DOM.on('.search-input', 'input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentFilters.searchTerm = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300);
        });
        
        // Sort
        DOM.on('.sort-select', 'change', (e) => {
            this.currentFilters.sortBy = e.target.value;
            this.applyFilters();
        });
    }
    
    applyFilters() {
        let filtered = [...this.allProducts];
        
        // Category filter
        if (this.currentFilters.category) {
            filtered = filtered.filter(product => 
                product.category === this.currentFilters.category
            );
        }
        
        // Price filter
        filtered = filtered.filter(product => 
            product.price >= this.currentFilters.priceRange.min &&
            product.price <= this.currentFilters.priceRange.max
        );
        
        // Search filter
        if (this.currentFilters.searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(this.currentFilters.searchTerm) ||
                product.description.toLowerCase().includes(this.currentFilters.searchTerm)
            );
        }
        
        // Sort
        filtered.sort((a, b) => {
            switch (this.currentFilters.sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });
        
        this.filteredProducts = filtered;
        this.render();
    }
    
    render() {
        if (!this.container) return;
        
        if (this.filteredProducts.length === 0) {
            this.container.innerHTML = `
                <div class="no-products">
                    <h3>Không tìm thấy sản phẩm</h3>
                    <p>Thử thay đổi bộ lọc của bạn</p>
                </div>
            `;
            return;
        }
        
        const productsHTML = this.filteredProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-card__image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${!product.isInStock() ? '<span class="out-of-stock">Hết hàng</span>' : ''}
                </div>
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.name}</h3>
                    <p class="product-card__description">${product.description}</p>
                    <div class="product-card__price">
                        <span class="current-price">${product.formattedPrice}</span>
                        ${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}
                    </div>
                    <div class="product-card__actions">
                        <button class="btn btn--primary add-to-cart" 
                                data-product-id="${product.id}"
                                ${!product.isInStock() ? 'disabled' : ''}>
                            ${product.isInStock() ? 'Thêm vào giỏ' : 'Hết hàng'}
                        </button>
                        <button class="btn btn--secondary wishlist-btn" data-product-id="${product.id}">
                            ♡
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.container.innerHTML = productsHTML;
        
        // Add event listeners for new elements
        this.container.querySelectorAll('.add-to-cart').forEach(btn => {
            DOM.on(btn, 'click', this.handleAddToCart.bind(this));
        });
    }
    
    handleAddToCart(e) {
        const productId = parseInt(e.target.dataset.productId);
        const product = this.allProducts.find(p => p.id === productId);
        
        if (product) {
            cart.addItem(product);
            
            // Visual feedback
            e.target.textContent = 'Đã thêm!';
            e.target.disabled = true;
            
            setTimeout(() => {
                e.target.textContent = 'Thêm vào giỏ';
                e.target.disabled = false;
            }, 1000);
        }
    }
}
```

#### Ngày 5-6: Async/Await & API Integration
```javascript
// API Service Class
class APIService {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('auth_token');
    }
    
    // HTTP Methods
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }
    
    async get(endpoint) {
        return this.request(endpoint);
    }
    
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
    
    // Authentication
    setToken(token) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    }
    
    clearToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }
}

// Product Service
class ProductService extends APIService {
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/products?${queryString}`);
    }
    
    async getProduct(id) {
        return this.get(`/products/${id}`);
    }
    
    async searchProducts(query, filters = {}) {
        return this.post('/products/search', { query, filters });
    }
    
    async getCategories() {
        return this.get('/categories');
    }
    
    async getProductReviews(productId) {
        return this.get(`/products/${productId}/reviews`);
    }
    
    async addReview(productId, review) {
        return this.post(`/products/${productId}/reviews`, review);
    }
}

// User Service
class UserService extends APIService {
    async login(credentials) {
        const response = await this.post('/auth/login', credentials);
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }
    
    async register(userData) {
        return this.post('/auth/register', userData);
    }
    
    async logout() {
        try {
            await this.post('/auth/logout');
        } finally {
            this.clearToken();
        }
    }
    
    async getProfile() {
        return this.get('/user/profile');
    }
    
    async updateProfile(data) {
        return this.put('/user/profile', data);
    }
    
    async getOrders() {
        return this.get('/user/orders');
    }
    
    async getWishlist() {
        return this.get('/user/wishlist');
    }
    
    async addToWishlist(productId) {
        return this.post('/user/wishlist', { productId });
    }
    
    async removeFromWishlist(productId) {
        return this.delete(`/user/wishlist/${productId}`);
    }
}

// Order Service
class OrderService extends APIService {
    async createOrder(orderData) {
        return this.post('/orders', orderData);
    }
    
    async getOrder(orderId) {
        return this.get(`/orders/${orderId}`);
    }
    
    async updateOrderStatus(orderId, status) {
        return this.put(`/orders/${orderId}/status`, { status });
    }
    
    async processPayment(orderId, paymentData) {
        return this.post(`/orders/${orderId}/payment`, paymentData);
    }
}

// Application State Management
class AppState {
    constructor() {
        this.state = {
            user: null,
            cart: new ShoppingCart(),
            products: [],
            categories: [],
            loading: false,
            error: null
        };
        
        this.subscribers = new Map();
        this.services = {
            product: new ProductService(),
            user: new UserService(),
            order: new OrderService()
        };
        
        this.init();
    }
    
    init() {
        // Load cart from localStorage
        this.state.cart.loadFromLocalStorage();
        
        // Check for existing auth
        this.checkAuth();
        
        // Load initial data
        this.loadInitialData();
    }
    
    async checkAuth() {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const user = await this.services.user.getProfile();
                this.setState({ user });
            } catch (error) {
                // Token invalid, clear it
                this.services.user.clearToken();
            }
        }
    }
    
    async loadInitialData() {
        this.setState({ loading: true });
        
        try {
            const [products, categories] = await Promise.all([
                this.services.product.getProducts({ limit: 20 }),
                this.services.product.getCategories()
            ]);
            
            this.setState({ 
                products: products.data || products,
                categories: categories.data || categories,
                loading: false 
            });
        } catch (error) {
            this.setState({ 
                error: error.message, 
                loading: false 
            });
        }
    }
    
    setState(updates) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...updates };
        
        // Notify subscribers
        this.subscribers.forEach((callback, key) => {
            callback(this.state, prevState);
        });
    }
    
    subscribe(key, callback) {
        this.subscribers.set(key, callback);
        
        // Return unsubscribe function
        return () => {
            this.subscribers.delete(key);
        };
    }
    
    // Action methods
    async login(credentials) {
        try {
            this.setState({ loading: true, error: null });
            const response = await this.services.user.login(credentials);
            this.setState({ user: response.user, loading: false });
            return response;
        } catch (error) {
            this.setState({ error: error.message, loading: false });
            throw error;
        }
    }
    
    async logout() {
        try {
            await this.services.user.logout();
            this.setState({ user: null });
            // Redirect to home
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    async addToCart(product, quantity = 1) {
        try {
            this.state.cart.addItem(product, quantity);
            
            // If user is logged in, sync with server
            if (this.state.user) {
                await this.services.user.post('/user/cart', {
                    productId: product.id,
                    quantity
                });
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            throw error;
        }
    }
    
    async createOrder(orderData) {
        try {
            this.setState({ loading: true });
            const order = await this.services.order.createOrder(orderData);
            
            // Clear cart after successful order
            this.state.cart.items.clear();
            this.state.cart.saveToLocalStorage();
            this.state.cart.updateCartUI();
            
            this.setState({ loading: false });
            return order;
        } catch (error) {
            this.setState({ error: error.message, loading: false });
            throw error;
        }
    }
}

// Initialize app
const app = new AppState();
const cart = app.state.cart;

// Global error handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    app.setState({ error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
});

// Export for use in other modules
window.app = app;
window.cart = cart;
```

### 1.4 Pug Template Engine (2-3 ngày)

#### Ngày 1: Pug Cơ Bản
```pug
//- layout.pug
doctype html
html(lang='vi')
    head
        meta(charset='UTF-8')
        meta(name='viewport' content='width=device-width, initial-scale=1.0')
        title= title || 'E-Commerce Shop'
        link(rel='stylesheet' href='/css/main.css')
        block head
    body
        include partials/header
        
        main.main-content
            block content
        
        include partials/footer
        
        script(src='/js/main.js')
        block scripts

//- partials/header.pug
header.header
    .container
        .header__logo
            a(href='/')
                img(src='/images/logo.png' alt='Logo')
        
        nav.header__nav
            ul.nav-list
                li.nav-item
                    a.nav-link(href='/' class={active: currentPage === 'home'}) Trang chủ
                li.nav-item
                    a.nav-link(href='/products' class={active: currentPage === 'products'}) Sản phẩm
                li.nav-item
                    a.nav-link(href='/about' class={active: currentPage === 'about'}) Giới thiệu
                li.nav-item
                    a.nav-link(href='/contact' class={active: currentPage === 'contact'}) Liên hệ
        
        .header__actions
            .search-box
                input.search-input(type='text' placeholder='Tìm kiếm sản phẩm...')
                button.search-btn
                    i.icon-search
            
            .user-menu
                if user
                    .dropdown
                        button.dropdown-toggle
                            img.avatar(src=user.avatar || '/images/default-avatar.png')
                            span= user.name
                        .dropdown-menu
                            a(href='/profile') Tài khoản
                            a(href='/orders') Đơn hàng
                            a(href='/wishlist') Yêu thích
                            .divider
                            a(href='/logout') Đăng xuất
                else
                    a.btn.btn--outline(href='/login') Đăng nhập
                    a.btn.btn--primary(href='/register') Đăng ký
            
            .cart-toggle
                button.cart-btn
                    i.icon-cart
                    span.cart-badge= cartItemCount || 0
                .cart-dropdown
                    // Cart items will be populated by JavaScript

//- pages/home.pug
extends ../layout

block head
    meta(name='description' content='Cửa hàng trực tuyến hàng đầu Việt Nam')

block content
    section.hero
        .container
            .hero__content
                h1.hero__title Chào mừng đến với cửa hàng của chúng tôi
                p.hero__subtitle Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
                a.btn.btn--primary.btn--large(href='/products') Mua sắm ngay
            .hero__image
                img(src='/images/hero-banner.jpg' alt='Hero Banner')
    
    section.featured-categories
        .container
            h2.section-title Danh mục nổi bật
            .categories-grid
                each category in featuredCategories
                    .category-card
                        a(href=`/products?category=${category.slug}`)
                            img(src=category.image alt=category.name)
                            h3= category.name
                            p #{category.productCount} sản phẩm
    
    section.featured-products
        .container
            h2.section-title Sản phẩm nổi bật
            .products-grid
                each product in featuredProducts
                    include ../partials/product-card

//- partials/product-card.pug
.product-card(data-id=product.id)
    .product-card__image
        a(href=`/products/${product.slug}`)
            img(src=product.images[0] alt=product.name loading='lazy')
        if product.discount
            .discount-badge -#{product.discount}%
        if !product.inStock
            .out-of-stock-badge Hết hàng
    
    .product-card__content
        h3.product-card__title
            a(href=`/products/${product.slug}`)= product.name
        
        .product-card__rating
            .stars(data-rating=product.rating)
                - for (let i = 1; i <= 5; i++)
                    span.star(class={filled: i <= product.rating})
            span.rating-count (#{product.reviewCount} đánh giá)
        
        p.product-card__description= product.shortDescription
        
        .product-card__price
            if product.discount
                span.original-price= formatPrice(product.originalPrice)
            span.current-price= formatPrice(product.price)
        
        .product-card__actions
            button.btn.btn--primary.add-to-cart(
                data-product-id=product.id
                disabled=!product.inStock
            )= product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'
            
            button.btn.btn--secondary.wishlist-btn(data-product-id=product.id)
                i.icon-heart

//- pages/products.pug
extends ../layout

block head
    title Sản phẩm - E-Commerce Shop
    meta(name='description' content='Khám phá bộ sưu tập sản phẩm đa dạng')

block content
    .container
        .page-header
            h1 Sản phẩm
            .breadcrumb
                a(href='/') Trang chủ
                span.separator /
                span Sản phẩm
        
        .products-page
            aside.filters-sidebar
                .filter-section
                    h3 Danh mục
                    ul.category-list
                        each category in categories
                            li
                                label.checkbox-label
                                    input(type='checkbox' name='category' value=category.id)
                                    span.checkmark
                                    span.label-text= category.name
                                    span.count (#{category.productCount})
                
                .filter-section
                    h3 Khoảng giá
                    .price-range
                        .price-inputs
                            input.price-input.price-min(type='number' placeholder='Từ' min='0')
                            span -
                            input.price-input.price-max(type='number' placeholder='Đến')
                        .price-slider
                            input.range-slider(type='range' min='0' max='10000000' step='100000')
                
                .filter-section
                    h3 Thương hiệu
                    ul.brand-list
                        each brand in brands
                            li
                                label.checkbox-label
                                    input(type='checkbox' name='brand' value=brand.id)
                                    span.checkmark
                                    span.label-text= brand.name
                
                .filter-section
                    h3 Đánh giá
                    .rating-filters
                        - for (let i = 5; i >= 1; i--)
                            label.radio-label
                                input(type='radio' name='rating' value=i)
                                span.radiomark
                                .stars
                                    - for (let j = 1; j <= 5; j++)
                                        span.star(class={filled: j <= i})
                                span.label-text từ #{i} sao trở lên
            
            main.products-main
                .products-toolbar
                    .results-info
                        span Hiển thị #{products.length} trong tổng số #{totalProducts} sản phẩm
                    
                    .toolbar-actions
                        .view-options
                            button.view-btn.grid-view.active(data-view='grid')
                                i.icon-grid
                            button.view-btn.list-view(data-view='list')
                                i.icon-list
                        
                        .sort-options
                            select.sort-select
                                option(value='default') Sắp xếp mặc định
                                option(value='price-low') Giá thấp đến cao
                                option(value='price-high') Giá cao đến thấp
                                option(value='name') Tên A-Z
                                option(value='rating') Đánh giá cao nhất
                                option(value='newest') Mới nhất
                
                .products-grid#products-container
                    each product in products
                        include ../partials/product-card
                
                if totalPages > 1
                    .pagination
                        if currentPage > 1
                            a.pagination__btn.prev(href=`?page=${currentPage - 1}`)
                                i.icon-chevron-left
                                span Trước
                        
                        .pagination__numbers
                            - let startPage = Math.max(1, currentPage - 2)
                            - let endPage = Math.min(totalPages, currentPage + 2)
                            
                            if startPage > 1
                                a.pagination__number(href='?page=1') 1
                                if startPage > 2
                                    span.pagination__ellipsis ...
                            
                            - for (let i = startPage; i <= endPage; i++)
                                if i === currentPage
                                    span.pagination__number.active= i
                                else
                                    a.pagination__number(href=`?page=${i}`)= i
                            
                            if endPage < totalPages
                                if endPage < totalPages - 1
                                    span.pagination__ellipsis ...
                                a.pagination__number(href=`?page=${totalPages}`)= totalPages
                        
                        if currentPage < totalPages
                            a.pagination__btn.next(href=`?page=${currentPage + 1}`)
                                span Sau
                                i.icon-chevron-right

block scripts
    script(src='/js/product-filter.js')
```

#### Ngày 2-3: Pug Advanced & Mixins
```pug
//- mixins/forms.pug
mixin input(options = {})
    - const { type = 'text', name, label, placeholder, required = false, value = '', error, helpText, icon } = options
    .form-group(class={error: error})
        if label
            label.form-label(for=name class={required: required})= label
                if required
                    span.required *
        
        .input-wrapper
            if icon
                i.input-icon(class=`icon-${icon}`)
            input.form-input(
                type=type
                id=name
                name=name
                placeholder=placeholder
                value=value
                required=required
                class={error: error}
            )
        
        if error
            .error-message= error
        else if helpText
            .help-text= helpText

mixin textarea(options = {})
    - const { name, label, placeholder, required = false, value = '', error, rows = 4 } = options
    .form-group(class={error: error})
        if label
            label.form-label(for=name class={required: required})= label
                if required
                    span.required *
        
        textarea.form-textarea(
            id=name
            name=name
            placeholder=placeholder
            required=required
            rows=rows
            class={error: error}
        )= value
        
        if error
            .error-message= error

mixin select(options = {})
    - const { name, label, required = false, options: selectOptions = [], value = '', error } = options
    .form-group(class={error: error})
        if label
            label.form-label(for=name class={required: required})= label
                if required
                    span.required *
        
        .select-wrapper
            select.form-select(
                id=name
                name=name
                required=required
                class={error: error}
            )
                each option in selectOptions
                    option(
                        value=option.value
                        selected=option.value === value
                    )= option.text
            i.select-arrow.icon-chevron-down
        
        if error
            .error-message= error

mixin checkbox(options = {})
    - const { name, label, checked = false, value = '1' } = options
    .form-group.checkbox-group
        label.checkbox-label
            input.form-checkbox(
                type='checkbox'
                name=name
                value=value
                checked=checked
            )
            span.checkmark
            span.label-text= label

mixin radio(options = {})
    - const { name, label, value, checked = false, groupName } = options
    .form-group.radio-group
        label.radio-label
            input.form-radio(
                type='radio'
                name=groupName
                value=value
                checked=checked
            )
            span.radiomark
            span.label-text= label

//- mixins/components.pug
mixin modal(id, title, size = 'medium')
    .modal.fade(id=id tabindex='-1')
        .modal-backdrop
        .modal-dialog(class=`modal-${size}`)
            .modal-content
                .modal-header
                    h3.modal-title= title
                    button.modal-close(type='button' data-dismiss='modal')
                        i.icon-close
                .modal-body
                    block
                .modal-footer
                    block footer

mixin alert(type = 'info', dismissible = true)
    .alert(class=`alert--${type}` class={dismissible: dismissible})
        .alert-icon
            case type
                when 'success'
                    i.icon-check-circle
                when 'error'
                    i.icon-x-circle
                when 'warning'
                    i.icon-alert-triangle
                default
                    i.icon-info
        .alert-content
            block
        if dismissible
            button.alert-close
                i.icon-close

mixin breadcrumb(items)
    nav.breadcrumb
        ol.breadcrumb-list
            each item, index in items
                li.breadcrumb-item(class={active: index === items.length - 1})
                    if index === items.length - 1
                        span= item.text
                    else
                        a(href=item.url)= item.text
                    if index < items.length - 1
                        i.breadcrumb-separator.icon-chevron-right

mixin pagination(currentPage, totalPages, baseUrl = '')
    if totalPages > 1
        nav.pagination
            - let startPage = Math.max(1, currentPage - 2)
            - let endPage = Math.min(totalPages, currentPage + 2)
            
            if currentPage > 1
                a.pagination__btn.prev(href=`${baseUrl}?page=${currentPage - 1}`)
                    i.icon-chevron-left
                    span Trước
            
            .pagination__numbers
                if startPage > 1
                    a.pagination__number(href=`${baseUrl}?page=1`) 1
                    if startPage > 2
                        span.pagination__ellipsis ...
                
                - for (let i = startPage; i <= endPage; i++)
                    if i === currentPage
                        span.pagination__number.active= i
                    else
                        a.pagination__number(href=`${baseUrl}?page=${i}`)= i
                
                if endPage < totalPages
                    if endPage < totalPages - 1
                        span.pagination__ellipsis ...
                    a.pagination__number(href=`${baseUrl}?page=${totalPages}`)= totalPages
            
            if currentPage < totalPages
                a.pagination__btn.next(href=`${baseUrl}?page=${currentPage + 1}`)
                    span Sau
                    i.icon-chevron-right

mixin productCard(product)
    .product-card(data-id=product.id)
        .product-card__image
            a(href=`/products/${product.slug}`)
                img(src=product.images[0] alt=product.name loading='lazy')
            if product.discount
                .discount-badge -#{product.discount}%
            if !product.inStock
                .out-of-stock-badge Hết hàng
            
            .product-card__actions-overlay
                button.btn.btn--icon.quick-view(data-product-id=product.id title='Xem nhanh')
                    i.icon-eye
                button.btn.btn--icon.wishlist-btn(data-product-id=product.id title='Yêu thích')
                    i.icon-heart
        
        .product-card__content
            .product-card__category= product.category.name
            
            h3.product-card__title
                a(href=`/products/${product.slug}`)= product.name
            
            .product-card__rating
                .stars(data-rating=product.rating)
                    - for (let i = 1; i <= 5; i++)
                        span.star(class={filled: i <= product.rating})
                span.rating-count (#{product.reviewCount})
            
            .product-card__price
                if product.discount
                    span.original-price= formatPrice(product.originalPrice)
                span.current-price= formatPrice(product.price)
            
            button.btn.btn--primary.add-to-cart(
                data-product-id=product.id
                disabled=!product.inStock
            )= product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'

//- pages/checkout.pug
extends ../layout

include ../mixins/forms
include ../mixins/components

block head
    title Thanh toán - E-Commerce Shop

block content
    .container
        +breadcrumb([
            {text: 'Trang chủ', url: '/'},
            {text: 'Giỏ hàng', url: '/cart'},
            {text: 'Thanh toán'}
        ])
        
        .checkout-page
            .checkout-steps
                .step(class={active: step >= 1, completed: step > 1})
                    .step-number 1
                    .step-title Thông tin giao hàng
                
                .step(class={active: step >= 2, completed: step > 2})
                    .step-number 2
                    .step-title Phương thức thanh toán
                
                .step(class={active: step >= 3})
                    .step-number 3
                    .step-title Xác nhận đơn hàng
            
            .checkout-content
                .checkout-main
                    if step === 1
                        .checkout-section
                            h2 Thông tin giao hàng
                            
                            if user
                                .saved-addresses
                                    h3 Địa chỉ đã lưu
                                    each address in user.addresses
                                        .address-card(class={selected: address.isDefault})
                                            label.radio-label
                                                input(type='radio' name='address' value=address.id checked=address.isDefault)
                                                span.radiomark
                                                .address-info
                                                    strong= address.fullName
                                                    p= address.phone
                                                    p= `${address.street}, ${address.ward}, ${address.district}, ${address.city}`
                                                    if address.isDefault
                                                        span.default-badge Mặc định
                            
                            form.shipping-form(method='POST' action='/checkout/shipping')
                                .form-row
                                    .form-col
                                        +input({
                                            name: 'fullName',
                                            label: 'Họ và tên',
                                            required: true,
                                            value: user ? user.fullName : ''
                                        })
                                    .form-col
                                        +input({
                                            type: 'tel',
                                            name: 'phone',
                                            label: 'Số điện thoại',
                                            required: true,
                                            value: user ? user.phone : ''
                                        })
                                
                                +input({
                                    type: 'email',
                                    name: 'email',
                                    label: 'Email',
                                    required: true,
                                    value: user ? user.email : ''
                                })
                                
                                .form-row
                                    .form-col
                                        +select({
                                            name: 'city',
                                            label: 'Tỉnh/Thành phố',
                                            required: true,
                                            options: cities
                                        })
                                    .form-col
                                        +select({
                                            name: 'district',
                                            label: 'Quận/Huyện',
                                            required: true,
                                            options: []
                                        })
                                
                                .form-row
                                    .form-col
                                        +select({
                                            name: 'ward',
                                            label: 'Phường/Xã',
                                            required: true,
                                            options: []
                                        })
                                    .form-col
                                        +input({
                                            name: 'street',
                                            label: 'Địa chỉ cụ thể',
                                            required: true
                                        })
                                
                                +textarea({
                                    name: 'note',
                                    label: 'Ghi chú đơn hàng',
                                    placeholder: 'Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.'
                                })
                                
                                if user
                                    +checkbox({
                                        name: 'saveAddress',
                                        label: 'Lưu địa chỉ này cho lần mua hàng sau'
                                    })
                                
                                .form-actions
                                    button.btn.btn--primary(type='submit') Tiếp tục
                    
                    else if step === 2
                        .checkout-section
                            h2 Phương thức thanh toán
                            
                            .payment-methods
                                .payment-method
                                    label.radio-label
                                        input(type='radio' name='paymentMethod' value='cod' checked)
                                        span.radiomark
                                        .payment-info
                                            .payment-icon
                                                i.icon-truck
                                            .payment-details
                                                strong Thanh toán khi nhận hàng (COD)
                                                p Phí thu hộ: 0₫ - 30,000₫ (tùy vùng)
                                
                                .payment-method
                                    label.radio-label
                                        input(type='radio' name='paymentMethod' value='vnpay')
                                        span.radiomark
                                        .payment-info
                                            .payment-icon
                                                img(src='/images/vnpay.png' alt='VNPay')
                                            .payment-details
                                                strong Ví điện tử VNPay
                                                p Thanh toán an toàn qua VNPay
                                
                                .payment-method
                                    label.radio-label
                                        input(type='radio' name='paymentMethod' value='momo')
                                        span.radiomark
                                        .payment-info
                                            .payment-icon
                                                img(src='/images/momo.png' alt='MoMo')
                                            .payment-details
                                                strong Ví MoMo
                                                p Thanh toán nhanh chóng với MoMo
                                
                                .payment-method
                                    label.radio-label
                                        input(type='radio' name='paymentMethod' value='bank')
                                        span.radiomark
                                        .payment-info
                                            .payment-icon
                                                i.icon-credit-card
                                            .payment-details
                                                strong Thẻ ATM/Visa/Master
                                                p Thanh toán bảo mật qua cổng OnePay
                            
                            .form-actions
                                a.btn.btn--outline(href='/checkout?step=1') Quay lại
                                button.btn.btn--primary(onclick='goToStep(3)') Tiếp tục
                    
                    else if step === 3
                        .checkout-section
                            h2 Xác nhận đơn hàng
                            
                            .order-review
                                .shipping-info
                                    h3 Thông tin giao hàng
                                    .info-card
                                        strong= shippingInfo.fullName
                                        p= shippingInfo.phone
                                        p= shippingInfo.email
                                        p= `${shippingInfo.street}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`
                                        if shippingInfo.note
                                            p
                                                strong Ghi chú: 
                                                = shippingInfo.note
                                
                                .payment-info
                                    h3 Phương thức thanh toán
                                    .info-card= paymentMethod.name
                                
                                .order-items
                                    h3 Sản phẩm đã đặt
                                    .items-list
                                        each item in cartItems
                                            .order-item
                                                img.item-image(src=item.product.images[0] alt=item.product.name)
                                                .item-info
                                                    h4= item.product.name
                                                    p Số lượng: #{item.quantity}
                                                    p Giá: #{formatPrice(item.product.price)}
                                                .item-total= formatPrice(item.product.price * item.quantity)
                            
                            .form-actions
                                a.btn.btn--outline(href='/checkout?step=2') Quay lại
                                button.btn.btn--primary.btn--large(onclick='placeOrder()') Đặt hàng
                
                .checkout-sidebar
                    .order-summary
                        h3 Tóm tắt đơn hàng
                        
                        .summary-items
                            each item in cartItems
                                .summary-item
                                    span.item-name #{item.product.name} x#{item.quantity}
                                    span.item-price= formatPrice(item.product.price * item.quantity)
                        
                        .summary-calculations
                            .calculation-row
                                span Tạm tính
                                span= formatPrice(subtotal)
                            
                            .calculation-row
                                span Phí vận chuyển
                                span= formatPrice(shippingFee)
                            
                            if discount > 0
                                .calculation-row.discount
                                    span Giảm giá
                                    span -#{formatPrice(discount)}
                            
                            .calculation-row.total
                                strong
                                    span Tổng cộng
                                    span= formatPrice(total)
                        
                        if step < 3
                            .promo-code
                                .form-group
                                    .input-group
                                        input.form-input(type='text' placeholder='Mã giảm giá')
                                        button.btn.btn--outline Áp dụng

block scripts
    script(src='/js/checkout.js')
```

### 1.5 NPM & Package Management (1-2 ngày)

```json
// package.json
{
  "name": "ecommerce-mvc-app",
  "version": "1.0.0",
  "description": "Full-featured e-commerce application with MVC architecture",
  "main": "app.js",
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
    "seed": "node scripts/seed.js",
    "migrate": "sequelize-cli db:migrate",
    "migrate:undo": "sequelize-cli db:migrate:undo",
    "generate:model": "sequelize-cli model:generate",
    "docs": "jsdoc -c jsdoc.conf.json"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "express-validator": "^7.0.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.6",
    "pug": "^3.0.2",
    "sequelize": "^6.35.0",
    "mysql2": "^3.6.5",
    "redis": "^4.6.10",
    "nodemailer": "^6.9.7",
    "moment": "^2.29.4",
    "lodash": "^4.17.21",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "cookie-parser": "^1.4.6",
    "express-rate-limit": "^7.1.5",
    "express-slow-down": "^2.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "sass": "^1.69.5",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "babel-loader": "^9.1.3",
    "@babel/core": "^7.23.6",
    "@babel/preset-env": "^7.23.6",
    "css-loader": "^6.8.1",
    "style-loader": "^3.3.3",
    "mini-css-extract-plugin": "^2.7.6",
    "eslint": "^8.55.0",
    "eslint-config-standard": "^17.1.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "sequelize-cli": "^6.6.2"
  },
  "keywords": ["ecommerce", "mvc", "nodejs", "express", "pug"],
  "author": "Your Name",
  "license": "MIT"
}
```

---

## 📦 PHẦN 2: DỰ ÁN MVC E-COMMERCE (4-5 tuần)

### 2.1 Thiết kế Database & Models (1 tuần)

#### Database Schema với 15+ Models:

```sql
-- 1. Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    avatar VARCHAR(255),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    role ENUM('customer', 'seller', 'admin') DEFAULT 'customer',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(255),
    parent_id INT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 3. Brands Table
CREATE TABLE brands (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo VARCHAR(255),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Products Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    price DECIMAL(15,2) NOT NULL,
    compare_price DECIMAL(15,2),
    cost_price DECIMAL(15,2),
    track_inventory BOOLEAN DEFAULT TRUE,
    inventory_quantity INT DEFAULT 0,
    allow_backorder BOOLEAN DEFAULT FALSE,
    weight DECIMAL(8,2),
    dimensions VARCHAR(100),
    category_id INT,
    brand_id INT,
    seller_id INT,
    status ENUM('draft', 'active', 'archived') DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Product Images Table
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. Product Attributes Table
CREATE TABLE product_attributes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('text', 'number', 'boolean', 'select', 'multiselect') DEFAULT 'text',
    is_required BOOLEAN DEFAULT FALSE,
    is_filterable BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Product Attribute Values Table
CREATE TABLE product_attribute_values (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    attribute_id INT NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES product_attributes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_attribute (product_id, attribute_id)
);

-- 8. Product Variants Table
CREATE TABLE product_variants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255),
    price DECIMAL(15,2),
    compare_price DECIMAL(15,2),
    inventory_quantity INT DEFAULT 0,
    weight DECIMAL(8,2),
    barcode VARCHAR(100),
    image_url VARCHAR(255),
    position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 9. Addresses Table
CREATE TABLE addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    country VARCHAR(50) DEFAULT 'Vietnam',
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    type ENUM('home', 'work', 'other') DEFAULT 'home',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    guest_email VARCHAR(100),
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    subtotal DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    shipping_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'VND',
    
    -- Shipping Information
    shipping_full_name VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_email VARCHAR(100),
    shipping_country VARCHAR(50) DEFAULT 'Vietnam',
    shipping_city VARCHAR(100) NOT NULL,
    shipping_district VARCHAR(100) NOT NULL,
    shipping_ward VARCHAR(100) NOT NULL,
    shipping_street VARCHAR(255) NOT NULL,
    shipping_postal_code VARCHAR(20),
    
    -- Billing Information (if different from shipping)
    billing_full_name VARCHAR(100),
    billing_phone VARCHAR(20),
    billing_email VARCHAR(100),
    billing_country VARCHAR(50),
    billing_city VARCHAR(100),
    billing_district VARCHAR(100),
    billing_ward VARCHAR(100),
    billing_street VARCHAR(255),
    billing_postal_code VARCHAR(20),
    
    notes TEXT,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 11. Order Items Table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    product_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- 12. Shopping Cart Table
CREATE TABLE shopping_cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id VARCHAR(255),
    product_id INT NOT NULL,
    variant_id INT,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    UNIQUE KEY unique_cart_item (user_id, session_id, product_id, variant_id)
);

-- 13. Wishlists Table
CREATE TABLE wishlists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_item (user_id, product_id)
);

-- 14. Reviews Table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_item_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_product_review (user_id, product_id, order_item_id)
);

-- 15. Review Images Table
CREATE TABLE review_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    review_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- 16. Coupons Table
CREATE TABLE coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type ENUM('fixed', 'percentage') NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    minimum_amount DECIMAL(15,2) DEFAULT 0,
    maximum_discount DECIMAL(15,2),
    usage_limit INT,
    usage_count INT DEFAULT 0,
    usage_limit_per_customer INT DEFAULT 1,
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 17. Coupon Usage Table
CREATE TABLE coupon_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    coupon_id INT NOT NULL,
    user_id INT,
    order_id INT NOT NULL,
    discount_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 18. Payments Table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    payment_method ENUM('cod', 'bank_transfer', 'credit_card', 'vnpay', 'momo', 'zalopay') NOT NULL,
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(255),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'VND',
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
    gateway_response JSON,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 19. Shipping Methods Table
CREATE TABLE shipping_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    free_shipping_minimum DECIMAL(15,2),
    estimated_days_min INT,
    estimated_days_max INT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 20. Order Tracking Table
CREATE TABLE order_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    status ENUM('confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL,
    message TEXT,
    location VARCHAR(255),
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 21. Notifications Table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('order', 'promotion', 'system', 'review') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 22. Settings Table
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    group_name VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_shopping_cart_user ON shopping_cart(user_id);
CREATE INDEX idx_shopping_cart_session ON shopping_cart(session_id);
```

#### Sequelize Models Implementation:

```javascript
// models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const db = {};

// Import all models
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Category = require('./Category')(sequelize, Sequelize.DataTypes);
db.Brand = require('./Brand')(sequelize, Sequelize.DataTypes);
db.Product = require('./Product')(sequelize, Sequelize.DataTypes);
db.ProductImage = require('./ProductImage')(sequelize, Sequelize.DataTypes);
db.ProductAttribute = require('./ProductAttribute')(sequelize, Sequelize.DataTypes);
db.ProductAttributeValue = require('./ProductAttributeValue')(sequelize, Sequelize.DataTypes);
db.ProductVariant = require('./ProductVariant')(sequelize, Sequelize.DataTypes);
db.Address = require('./Address')(sequelize, Sequelize.DataTypes);
db.Order = require('./Order')(sequelize, Sequelize.DataTypes);
db.OrderItem = require('./OrderItem')(sequelize, Sequelize.DataTypes);
db.ShoppingCart = require('./ShoppingCart')(sequelize, Sequelize.DataTypes);
db.Wishlist = require('./Wishlist')(sequelize, Sequelize.DataTypes);
db.Review = require('./Review')(sequelize, Sequelize.DataTypes);
db.ReviewImage = require('./ReviewImage')(sequelize, Sequelize.DataTypes);
db.Coupon = require('./Coupon')(sequelize, Sequelize.DataTypes);
db.CouponUsage = require('./CouponUsage')(sequelize, Sequelize.DataTypes);
db.Payment = require('./Payment')(sequelize, Sequelize.DataTypes);
db.ShippingMethod = require('./ShippingMethod')(sequelize, Sequelize.DataTypes);
db.OrderTracking = require('./OrderTracking')(sequelize, Sequelize.DataTypes);
db.Notification = require('./Notification')(sequelize, Sequelize.DataTypes);
db.Setting = require('./Setting')(sequelize, Sequelize.DataTypes);

// Define associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// models/User.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
            validate: {
                len: [3, 50],
                isAlphanumeric: true
            }
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'password_hash'
        },
        firstName: {
            type: DataTypes.STRING(50),
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.STRING(50),
            field: 'last_name'
        },
        phone: {
            type: DataTypes.STRING(20),
            validate: {
                isNumeric: true
            }
        },
        avatar: DataTypes.STRING(255),
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            field: 'date_of_birth'
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other')
        },
        role: {
            type: DataTypes.ENUM('customer', 'seller', 'admin'),
            defaultValue: 'customer'
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'email_verified'
        },
        phoneVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'phone_verified'
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'banned'),
            defaultValue: 'active'
        },
        lastLogin: {
            type: DataTypes.DATE,
            field: 'last_login'
        }
    }, {
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: {
            beforeCreate: async (user) => {
                if (user.passwordHash) {
                    const bcrypt = require('bcryptjs');
                    user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
                }
            }
        }
    });

    User.associate = function(models) {
        // User has many addresses
        User.hasMany(models.Address, {
            foreignKey: 'user_id',
            as: 'addresses'
        });

        // User has many orders
        User.hasMany(models.Order, {
            foreignKey: 'user_id',
            as: 'orders'
        });

        // User has many products (as seller)
        User.hasMany(models.Product, {
            foreignKey: 'seller_id',
            as: 'products'
        });

        // User has many reviews
        User.hasMany(models.Review, {
            foreignKey: 'user_id',
            as: 'reviews'
        });

        // User has many wishlist items
        User.hasMany(models.Wishlist, {
            foreignKey: 'user_id',
            as: 'wishlists'
        });

        // User has many shopping cart items
        User.hasMany(models.ShoppingCart, {
            foreignKey: 'user_id',
            as: 'cartItems'
        });

        // User has many notifications
        User.hasMany(models.Notification, {
            foreignKey: 'user_id',
            as: 'notifications'
        });
    };

    // Instance methods
    User.prototype.comparePassword = async function(password) {
        const bcrypt = require('bcryptjs');
        return bcrypt.compare(password, this.passwordHash);
    };

    User.prototype.getFullName = function() {
        return `${this.firstName} ${this.lastName}`.trim();
    };

    User.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());
        delete values.passwordHash;
        return values;
    };

    return User;
};

// models/Product.js
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        slug: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false
        },
        description: DataTypes.TEXT,
        shortDescription: {
            type: DataTypes.STRING(500),
            field: 'short_description'
        },
        sku: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false
        },
        barcode: DataTypes.STRING(100),
        price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        comparePrice: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'compare_price'
        },
        costPrice: {
            type: DataTypes.DECIMAL(15, 2),
            field: 'cost_price'
        },
        trackInventory: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'track_inventory'
        },
        inventoryQuantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'inventory_quantity'
        },
        allowBackorder: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'allow_backorder'
        },
        weight: DataTypes.DECIMAL(8, 2),
        dimensions: DataTypes.STRING(100),
        categoryId: {
            type: DataTypes.INTEGER,
            field: 'category_id'
        },
        brandId: {
            type: DataTypes.INTEGER,
            field: 'brand_id'
        },
        sellerId: {
            type: DataTypes.INTEGER,
            field: 'seller_id'
        },
        status: {
            type: DataTypes.ENUM('draft', 'active', 'archived'),
            defaultValue: 'draft'
        },
        featured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        metaTitle: {
            type: DataTypes.STRING(255),
            field: 'meta_title'
        },
        metaDescription: {
            type: DataTypes.TEXT,
            field: 'meta_description'
        }
    }, {
        tableName: 'products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: {
            beforeValidate: (product) => {
                if (product.name && !product.slug) {
                    product.slug = product.name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim('-');
                }
            }
        }
    });

    Product.associate = function(models) {
        // Product belongs to category
        Product.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category'
        });

        // Product belongs to brand
        Product.belongsTo(models.Brand, {
            foreignKey: 'brand_id',
            as: 'brand'
        });

        // Product belongs to seller
        Product.belongsTo(models.User, {
            foreignKey: 'seller_id',
            as: 'seller'
        });

        // Product has many images
        Product.hasMany(models.ProductImage, {
            foreignKey: 'product_id',
            as: 'images'
        });

        // Product has many variants
        Product.hasMany(models.ProductVariant, {
            foreignKey: 'product_id',
            as: 'variants'
        });

        // Product has many attribute values
        Product.hasMany(models.ProductAttributeValue, {
            foreignKey: 'product_id',
            as: 'attributeValues'
        });

        // Product has many reviews
        Product.hasMany(models.Review, {
            foreignKey: 'product_id',
            as: 'reviews'
        });

        // Product has many order items
        Product.hasMany(models.OrderItem, {
            foreignKey: 'product_id',
            as: 'orderItems'
        });

        // Product has many wishlist items
        Product.hasMany(models.Wishlist, {
            foreignKey: 'product_id',
            as: 'wishlists'
        });

        // Product has many cart items
        Product.hasMany(models.ShoppingCart, {
            foreignKey: 'product_id',
            as: 'cartItems'
        });
    };

    // Instance methods
    Product.prototype.isInStock = function() {
        if (!this.trackInventory) return true;
        return this.inventoryQuantity > 0 || this.allowBackorder;
    };

    Product.prototype.getDiscountPercentage = function() {
        if (!this.comparePrice || this.comparePrice <= this.price) return 0;
        return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
    };

    Product.prototype.getPrimaryImage = function() {
        if (this.images && this.images.length > 0) {
            const primary = this.images.find(img => img.isPrimary);
            return primary ? primary.imageUrl : this.images[0].imageUrl;
        }
        return '/images/no-image.png';
    };

    return Product;
};

// models/Order.js
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderNumber: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
            field: 'order_number'
        },
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id'
        },
        guestEmail: {
            type: DataTypes.STRING(100),
            field: 'guest_email'
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
            defaultValue: 'pending'
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
            defaultValue: 'pending',
            field: 'payment_status'
        },
        subtotal: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        taxAmount: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
            field: 'tax_amount'
        },
        shippingAmount: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
            field: 'shipping_amount'
        },
        discountAmount: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
            field: 'discount_amount'
        },
        totalAmount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            field: 'total_amount'
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'VND'
        },
        
        // Shipping Information
        shippingFullName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'shipping_full_name'
        },
        shippingPhone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: 'shipping_phone'
        },
        shippingEmail: {
            type: DataTypes.STRING(100),
            field: 'shipping_email'
        },
        shippingCountry: {
            type: DataTypes.STRING(50),
            defaultValue: 'Vietnam',
            field: 'shipping_country'
        },
        shippingCity: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'shipping_city'
        },
        shippingDistrict: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'shipping_district'
        },
        shippingWard: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'shipping_ward'
        },
        shippingStreet: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'shipping_street'
        },
        shippingPostalCode: {
            type: DataTypes.STRING(20),
            field: 'shipping_postal_code'
        },
        
        notes: DataTypes.TEXT,
        shippedAt: {
            type: DataTypes.DATE,
            field: 'shipped_at'
        },
        deliveredAt: {
            type: DataTypes.DATE,
            field: 'delivered_at'
        },
        cancelledAt: {
            type: DataTypes.DATE,
            field: 'cancelled_at'
        }
    }, {
        tableName: 'orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: {
            beforeCreate: (order) => {
                if (!order.orderNumber) {
                    order.orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
                }
            }
        }
    });

    Order.associate = function(models) {
        // Order belongs to user
        Order.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        // Order has many items
        Order.hasMany(models.OrderItem, {
            foreignKey: 'order_id',
            as: 'items'
        });

        // Order has many payments
        Order.hasMany(models.Payment, {
            foreignKey: 'order_id',
            as: 'payments'
        });

        // Order has many tracking records
        Order.hasMany(models.OrderTracking, {
            foreignKey: 'order_id',
            as: 'tracking'
        });

        // Order has many coupon usage
        Order.hasMany(models.CouponUsage, {
            foreignKey: 'order_id',
            as: 'couponUsage'
        });
    };

    // Instance methods
    Order.prototype.getFullShippingAddress = function() {
        return `${this.shippingStreet}, ${this.shippingWard}, ${this.shippingDistrict}, ${this.shippingCity}`;
    };

    Order.prototype.canBeCancelled = function() {
        return ['pending', 'confirmed'].includes(this.status);
    };

    Order.prototype.canBeShipped = function() {
        return this.status === 'processing' && this.paymentStatus === 'paid';
    };

    return Order;
};
```