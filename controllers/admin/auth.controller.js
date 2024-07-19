const Account = require("../../model/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập"
  });
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const account = await Account.findOne({
    email: email,
    deleted: false
  });

  if(!account) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }

  if(md5(password) != account.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }

  if(account.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }

  req.flash("success", "Đăng nhập thành công")

  // Cái này có tác dụng như cookie dùng để duy trì cái cái đăng nhập, và được lưu đăng nhập theo session và là đăng nhập theo phiên.
  res.cookie("token", account.token); // https://expressjs.com/en/5x/api.html#res.cookie
  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    req.flash("success", "Đăng xuất thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}