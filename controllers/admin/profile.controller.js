const Account = require("../../model/account.model");
const Role = require("../../model/role.model");



// [GET] /admin/profile
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


    res.render("admin/pages/profile/index", {
      pageTitle: "Thông tin tài khoản",
      records: records
    });
}