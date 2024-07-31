const mongoose = require("mongoose");
const { Schema } = mongoose;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

// Hàm để định nghĩa ra bộ khung của database. Dùng Schema để làm cho truyền được vào giá trị của một object
const articleSchema = new Schema({ 
    title: String,
    content: String,
    thumbnail: String,
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

const Article = mongoose.model('Article', articleSchema, "articles");

module.exports = Article;