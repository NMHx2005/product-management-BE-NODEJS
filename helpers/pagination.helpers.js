const Product = require("../model/product.model");
const ProductCategory = require("../model/product-category.model");
const Article = require("../model/articles.model");

module.exports.pagination = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    
    if(req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    
    pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;
    
    const countProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProducts/pagination.limitItems);

    pagination.totalPage = totalPage;

    return pagination;
};

module.exports.paginationTrash = async (req, find) => {
    const paginationTrash = {
        currentPage: 1,
        limitItems: 5
    };
    
    if(req.query.page) {
        paginationTrash.currentPage = parseInt(req.query.page);
    }
    
    paginationTrash.skip = (paginationTrash.currentPage - 1) * paginationTrash.limitItems;
    
    const countProductCategory = await ProductCategory.countDocuments(find);
    const totalPage = Math.ceil(countProductCategory/paginationTrash.limitItems);

    paginationTrash.totalPage = totalPage;

    return paginationTrash;
};


module.exports.paginationArticle = async (req, find) => {
    const paginationArticle = {
        currentPage: 1,
        limitItems: 4
    };
    
    if(req.query.page) {
        paginationArticle.currentPage = parseInt(req.query.page);
    }
    
    paginationArticle.skip = (paginationArticle.currentPage - 1) * paginationArticle.limitItems;
    
    const countArticles = await Article.countDocuments(find);
    const totalPage = Math.ceil(countArticles/paginationArticle.limitItems);

    paginationArticle.totalPage = totalPage;

    return paginationArticle;
};
