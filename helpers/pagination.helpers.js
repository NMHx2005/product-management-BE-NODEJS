const Product = require("../model/product.model");
const ProductCategory = require("../model/product-category.model");
const ArticleCategory = require("../model/articles-category.model");
const Article = require("../model/articles.model");
const User = require("../model/user.model");

module.exports.pagination = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };

    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }

    pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;

    const countProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProducts / pagination.limitItems);

    pagination.totalPage = totalPage;

    return pagination;
};

module.exports.paginationTrash = async (req, find) => {
    const paginationTrash = {
        currentPage: 1,
        limitItems: 5
    };

    if (req.query.page) {
        paginationTrash.currentPage = parseInt(req.query.page);
    }

    paginationTrash.skip = (paginationTrash.currentPage - 1) * paginationTrash.limitItems;

    const countProductCategory = await ProductCategory.countDocuments(find);
    const totalPage = Math.ceil(countProductCategory / paginationTrash.limitItems);

    paginationTrash.totalPage = totalPage;

    return paginationTrash;
};


module.exports.paginationArticle = async (req, find) => {
    const paginationArticle = {
        currentPage: 1,
        limitItems: 4
    };

    if (req.query.page) {
        paginationArticle.currentPage = parseInt(req.query.page);
    }

    paginationArticle.skip = (paginationArticle.currentPage - 1) * paginationArticle.limitItems;

    const countArticles = await Article.countDocuments(find);
    const totalPage = Math.ceil(countArticles / paginationArticle.limitItems);

    paginationArticle.totalPage = totalPage;

    return paginationArticle;
};



module.exports.paginationArticles = async (req, find) => {
    const paginationArticles = {
        currentPage: 1,
        limitItems: 5
    };

    if (req.query.page) {
        paginationArticles.currentPage = parseInt(req.query.page);
    }

    paginationArticles.skip = (paginationArticles.currentPage - 1) * paginationArticles.limitItems;

    const countArticleCategory = await ArticleCategory.countDocuments(find);
    const totalPage = Math.ceil(countArticleCategory / paginationArticles.limitItems);

    paginationArticles.totalPage = totalPage;

    return paginationArticles;
};

module.exports.paginationUser = async (req, find) => {
    const paginationUser = {
        currentPage: 1,
        limitItems: 4,
        skip: 0,
        totalPage: 0
    };

    // Kiểm tra xem trang có hợp lệ không
    if (req.query.page) {
        const page = parseInt(req.query.page);
        if (!isNaN(page) && page > 0) {
            paginationUser.currentPage = page;
        }
    }

    paginationUser.skip = (paginationUser.currentPage - 1) * paginationUser.limitItems;

    try {
        const countUsers = await User.countDocuments(find);
        paginationUser.totalPage = Math.ceil(countUsers / paginationUser.limitItems);
    } catch (error) {
        console.error("Error counting users:", error);
        // Xử lý lỗi nếu cần
    }

    // Đảm bảo currentPage không vượt quá totalPage
    if (paginationUser.currentPage > paginationUser.totalPage) {
        paginationUser.currentPage = paginationUser.totalPage;
    }

    return paginationUser;
};