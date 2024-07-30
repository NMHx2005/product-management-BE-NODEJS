const Account = require("../../model/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");
const Article = require("../../model/articles.model")
const paginationHelper = require("../../helpers/pagination.helpers");

// [GET] /admin/pages/articles
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

    if(req.query.status) {
        find.status = req.query.status;
    }

    // Tìm kiếm
    let keyword = "";
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
        keyword = req.query.keyword;
    }
    // Kết Thúc Tìm kiếm


    // Tính năng phân trang
    const paginationArticle = await paginationHelper.paginationArticle(req, find);
    // Kết thúc tính năng phân trang

    // Tối ưu hóa phần Bộ lọc
    const filterStatus = [
        {
        label: "Tất cả",
        value: ""
        },
        {
        label: "Hoạt động",
        value: "active"
        },
        {
        label: "Dừng hoạt động",
        value: "inactive"
        }
    ];

    const articles = await Article
        .find(find)
        .limit(paginationArticle.limitItems)
        .skip(paginationArticle.skip);


    res.render("admin/pages/articles/index", {
        pageTitle: "Quản lý bài viết",
        articles: articles,
        filterStatus: filterStatus,
        keyword: keyword,
        paginationArticle: paginationArticle
    });
}


// [PATCH] /admin/articles/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
    const { id, statusChange } = req.params;

    await Article.updateOne({
        _id: id
    }, {
        status: statusChange
    });

    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.json({
        code: 200
    });

};