const mongoose = require("mongoose");
const { Schema } = mongoose;


// Hàm để định nghĩa ra bộ khung của database. Dùng Schema để làm cho truyền được vào giá trị của một object
const productSchema = new Schema({ 
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;