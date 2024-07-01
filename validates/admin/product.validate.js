// [POST] /admin/products/createPost
module.exports.createPost = async (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề của sản phẩm!");
        res.redirect("back");
        return;
    }
    next();
}