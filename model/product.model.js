const mongoose = require("mongoose");
const { Schema } = mongoose;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

// Hàm để định nghĩa ra bộ khung của database. Dùng Schema để làm cho truyền được vào giá trị của một object
const productSchema = new Schema({ 
    title: String,
    product_category_id: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    featured: String,
    status: String,
    position: Number,
    createdBy: String,
    updatedBy: String,
    deleted: {
        type: Boolean,
        default: false
    }, 
    deletedBy: String,
    slug: {
        type: String,
        slug: "title",
        unique: true
    }
}, {
    timestamps: true // Tự động thêm trường createdAt và updatedAt.
});

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;