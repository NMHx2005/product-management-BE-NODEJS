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
      
      if(role.title) {
        record.roleTitle = role.title;
      }
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
  if(res.local.role.permissions.includes("account_")) {
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
  } else {
    res.send(`403`);
  }
}


// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const account = await Account.findOne({
        _id: id,
        deleted: false
    });
  
    const roles = await Role.find({
        deleted: false
    }).select("title");

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản admin",
      roles: roles,
      account: account
    });
}


// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  if(res.local.role.permissions.includes("account_")) {
    const id = req.params.id;
    
    if(req.body.password == "") {
        delete req.body.password;
    } else {
        req.body.password = md5(req.body.password);
    }

    await Account.updateOne({
        _id: id,
        deleted: false
    }, req.body);

    req.flash("success", "Chỉnh sửa tài khoản thành công!");

    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } else {
    res.send(`403`);
  }
}


// [PATCH] /admin/accounts/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  if(res.local.role.permissions.includes("account_")) {
    const { id, statusChange } = req.params;

    await Account.updateOne({
      _id: id
    }, {
      status: statusChange
    });

    req.flash('success', 'Cập nhật trạng thái thành công!');

    // res.redirect('back');
    res.json({
      code: 200
    });
  } else {
    res.send(`403`);
  }
}


// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const account = await Account.findOne({
      _id: id,
      deleted: false
    });

    if (!account) {
      return res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }

    const role = await Role.findOne({
      _id: account.role_id,
      deleted: false
    });

    if (role) {
      account.roleTitle = role.title;
    }

    res.render("admin/pages/accounts/detail", {
      pageTitle: "Chi tiết tài khoản",
      account: account
    });
  } catch (error) {
    console.error(error);
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
}



// [PATCH] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
  if(res.local.role.permissions.includes("account_delete")) {
    const id = req.params.id;

    await Account.updateOne({
      _id: id
    }, {
      deleted: true
    });

    req.flash('success', 'Xóa thành công!');

    res.json({
      code: 200
    });
  } else {
    res.send(`403`);
  }
}

