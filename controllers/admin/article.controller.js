const Account = require("../../model/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");
const Article = require("../../model/articles.model")

// [GET] /admin/pages/articles
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

    if(req.query.status) {
        find.status = req.query.status;
    }

    const articles = await Article.find(find);

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

    res.render("admin/pages/articles/index", {
        pageTitle: "Quản lý bài viết",
        articles: articles,
        filterStatus: filterStatus
    });
}