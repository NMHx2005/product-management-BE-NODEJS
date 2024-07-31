const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const articleCategorySchema = new mongoose.Schema({
  title: String,
  parent_id: {
    type: String,
    default: ""
  },
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
  timestamps: true // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
});

const ArticleCategory = mongoose.model("ArticleCategory", articleCategorySchema, "articles-category");

module.exports = ArticleCategory;