const Role = require("../../model/role.model");
const Account = require("../../model/account.model");
const md5 = require('md5');

const generateHelper = require("../../helpers/generate.helper");
const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const records = await Account.find({
        deleted: false
    });

    for (const record of records) {
        const role = await Role.findOne({
          _id: record.role_id,
          deleted: false
        });
    
        record.roleTitle = role.title;
      }

    res.render("admin/pages/accounts/index", {
      pageTitle: "Tài khoản admin",
      records: records
    });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    // Với chức năng lấy ra danh sách id và title của tài khoản
    const roles = await Role.find({
      deleted: false
    }).select("title");
  
    res.render("admin/pages/accounts/create", {
      pageTitle: "Tạo tài khoản admin",
      roles: roles
    });
}


// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    // Mã hóa password bằng md5 npm
    req.body.password = md5(req.body.password);
  
    // Mã hóa token bằng javascript
    req.body.token = generateHelper.generateRandomString(30);
    
    // Đoạn mã này tạo một đối tượng mới từ model (mô hình) Account với dữ liệu được gửi từ phía client (từ req.body).
    const account = new Account(req.body);
    // Phương thức save() thực hiện việc thêm hoặc cập nhật bản ghi tùy thuộc vào trạng thái của đối tượng.
    await account.save();
    

    req.flash("success", "Tạo tài khoản thành công!");

    // Sau khi hoàn thành thì quay lại trang nì
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }