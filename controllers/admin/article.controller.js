const Account = require("../../model/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");
const Article = require("../../model/articles.model")

// [GET] /admin/pages/articles
module.exports.index = async (req, res) => {
    const articles = await Article.find({
        deleted: false
    })

    // console.log(articles);
    res.render("admin/pages/articles/index", {
        pageTitle: "Quản lý bài viết",
        articles: articles
    });
    // res.send("OK");
}