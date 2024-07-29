const Product = require("../../model/product.model");
const paginationHelper = require("../../helpers/pagination.helpers");
const ProductCategory = require("../../model/product-category.model");
const Role = require("../../model/role.model");
const Account = require("../../model/account.model");
const moment = require("moment");


// [GET] /admin/trash/
module.exports.index = async (req, res) => {
    const find = {
      deleted: true
    };
  
    if (req.query.status) {
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
    const paginationTrash = await paginationHelper.paginationTrash(req, find);
    // Kết thúc tính năng phân trang
    
     // Tính năng phân trang
     const pagination = await paginationHelper.pagination(req, find);
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
    // Tối ưu hóa phần Bộ lọc
  



  
    const products = await Product
      .find(find)
      .limit(pagination.limitItems)
      .skip(pagination.skip);
  
    const productCategory = await ProductCategory
      .find(find)
      .limit(paginationTrash.limitItems)
      .skip(paginationTrash.skip);

    for (const item of products) {
      // Người xóa
      if(item.deletedBy) {
        const accountDeleted = await Account.findOne({
          _id: item.deletedBy
        });
        item.deletedByFullName = accountDeleted.fullName;
      } else {
        item.deletedByFullName = "";
      }
  
      item.deletedAtFormat = moment(item.updatedAt).format("DD/MM/YYYY HH:mm:ss");
    }

    for (const item of productCategory) {
      // Người xóa
      if(item.deletedBy) {
        const accountDeleted = await Account.findOne({
          _id: item.deletedBy
        });
        item.deletedByFullName = accountDeleted.fullName;
      } else {
        item.deletedByFullName = "";
      }
  
      item.deletedAtFormat = moment(item.updatedAt).format("DD/MM/YYYY HH:mm:ss");
    }

    const RoleFalse = await Role.find(find);

    for (const item of RoleFalse) {
      // Người xóa
      if(item.deletedBy) {
        const accountDeleted = await Account.findOne({
          _id: item.deletedBy
        });
        item.deletedByFullName = accountDeleted.fullName;
      } else {
        item.deletedByFullName = "";
      }
  
      item.deletedAtFormat = moment(item.updatedAt).format("DD/MM/YYYY HH:mm:ss");
    }


    const records = await Account.find(find);

    for (const record of records) {
      const role = await Role.findOne({
        _id: record.role_id,
        deleted: false
      });
  
      record.roleTitle = role.title;
    }



    res.render("admin/pages/trash", {
      pageTitle: "Thùng rác",
      products: products,
      keyword: keyword,
      productCategory: productCategory,
      paginationTrash: paginationTrash,
      filterStatus: filterStatus,
      pagination: pagination,
      RoleFalse: RoleFalse,
      records: records
    });
}


// [PATCH] /admin/trash/restoreItem/:id
module.exports.restoreItem = async (req, res) => {
  if(res.locals.role.permissions.includes("trash_edit")) {
    const id = req.params.id;

    await Product.updateOne({
      _id: id
    }, {
      deleted: false
    });

    await ProductCategory.updateOne({
      _id: id
    }, {
      deleted: false
    });

    await Role.updateOne({
      _id: id
    }, {
      deleted: false
    });

    await Account.updateOne({
      _id: id
    }, {
      deleted: false
    });

    req.flash("success", "Khôi phục thành công");

    res.json({
      code: 200
    });
  } else {
    res.send(`403`);
  }
}



// [DELETE] /admin/trash/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  if(res.locals.role.permissions.includes("trash_delete")) {
    const id = req.params.id;

    await Product.deleteOne({
      _id: id
    });

    await ProductCategory.deleteOne({
      _id: id
    });

    await Role.deleteOne({
      _id: id
    });

    await Account.deleteOne({
      _id: id
    });
    
    req.flash("success", "Xóa thành công");

    res.json({
      code: 200
    });
  } else {
    res.send(`403`);
  }
}



// [PATCH] /admin/trash/change-multi
module.exports.changeMulti = async (req, res) => {
  if(res.locals.role.permissions.includes("trash_edit")) {
    const { ids, status } = req.body;

    switch(status) {
      case "active":
      case "inactive":
        await Product.updateMany({
          _id: ids
        }, {
          status: status
        });

        await ProductCategory.updateMany({
          _id: ids
        }, {
          status: status
        });
        break;
      case "delete":
        await Product.updateMany({
          _id: ids
        }, {
          deleted: true
        });

        await ProductCategory.updateMany({
          _id: ids
        }, {
          deleted: true
        });
        break;
      case "delete-forever":
        await Product.deleteMany({
          _id: ids
        });

        await ProductCategory.deleteMany({
          _id: ids
        });
        break;
      case "restoreAll":
        await Product.updateMany({
          _id: ids
        }, {
          deleted: false
        });

        await ProductCategory.updateMany({
          _id: ids
        }, {
          deleted: false
        });
        break;
    }

    req.flash("success", "Hoàn Thành");

    // res.redirect('back');
    res.json({
      code: 200
    });
  } else {
    res.send(`403`);
  }
}



// [PATCH] /admin/trash/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  if(res.locals.role.permissions.includes("trash_edit")) {
    const { id, statusChange } = req.params;

  await Product.updateOne({
    _id: id
  }, {
    status: statusChange
  });

  await ProductCategory.updateOne({
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
