const ArticleCategory = require("../../model/articles-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree.helper");
const paginationHelper = require("../../helpers/pagination.helpers");
const moment = require("moment");
const Account = require("../../model/account.model");


// [GET] /admin/articles-category
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
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
    const paginationArticles = await paginationHelper.paginationArticles(req, find);
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

    // Sắp xếp
    const sort = {};
    if(req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.position = "desc";
    }
    // Hết Sắp xếp
    

    const records = await ArticleCategory
      .find(find)
      .limit(paginationArticles.limitItems)
      .skip(paginationArticles.skip)
      .sort(sort);



    res.render("admin/pages/articles-category/index", {
      pageTitle: "Trang Danh Mục Sản Phẩm",
      records: records,
      filterStatus: filterStatus,
      keyword: keyword,
      paginationArticles: paginationArticles
    });
}


// [GET] /admin/articles-category/create
module.exports.create = async (req, res) => {
  const categories = await ArticleCategory.find({
      deleted: false
  });

  const newCategories = createTreeHelper(categories);

  res.render("admin/pages/articles-category/create", {
    pageTitle: "Thêm mới danh mục sản phẩm",
    categories: newCategories
  });
}



// [POST] /admin/articles-category/createPost
module.exports.createPost = async (req, res) => {
  if(res.locals.role.permissions.includes("articles-category_create")) {
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
        const countCagegory = await ArticleCategory.countDocuments({});
        req.body.position = countCagegory + 1;
    }

    req.body.createdBy = res.locals.account.id;

    const newCategory = new ArticleCategory(req.body);
    await newCategory.save();

    res.flash("success", "Tạo mới danh mục bài viết thành công");

    res.redirect(`/${systemConfig.prefixAdmin}/articles-category`);
  } else {
    res.send(`403`);
  };
}
  


// [GET] /admin/articles-category/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const category = await ArticleCategory.findOne({
        _id: id,
        deleted: false
    });

    const categories  = await ArticleCategory.find({
        deleted: false
    });

    const newCategories = createTreeHelper(categories);

    res.render("admin/pages/articles-category/edit", {
      pageTitle: "Trang Danh Mục Sản Phẩm",
      categories: categories,
      category: category
    });
}




// [PATCH] /admin/articles-category/edit/:id
module.exports.editPatch = async (req, res) => {
  if(res.locals.role.permissions.includes("articles-category_edit")) {
    const id = req.params.id;

    if(req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const countCagegory = await ArticleCategory.countDocuments({});
        req.body.position = countCagegory + 1;
    }

    req.body.updatedBy = res.locals.account.id;

    await ArticleCategory.updateOne({
        _id: id,
        deleted: false
    }, req.body);

    req.flash("success", "Cập nhật danh mục thành công!");

    res.redirect(`/${systemConfig.prefixAdmin}/articles-category`);
  } else {
    res.send(`403`);
  }
}



// [PATCH] /admin/articles-category/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  if(res.locals.role.permissions.includes("articles-category_edit")) {
    const { id, statusChange } = req.params;
  
    await ArticleCategory.updateOne({
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


// [PATCH] /admin/articles-category/change-multi
module.exports.changeMulti = async (req, res) => {
  if(res.locals.role.permissions.includes("articles-category_edit")) {
    const { ids, status } = req.body;
  
    switch(status) {
      case "active":
      case "inactive":
        await ArticleCategory.updateMany({
          _id: ids
        }, {
          status: status
        });
        break;
      case "delete":
        await ArticleCategory.updateMany({
          _id: ids
        }, {
          deleted: true
        });
        break;
      case "delete-forever":
        await ArticleCategory.deleteMany({
          _id: ids
        });
        break;
      case "restoreAll":
        await ArticleCategory.updateMany({
          _id: ids
        }, {
          deleted: false
        });
        break;
    }
  
  
    // res.redirect('back');
    res.json({
      code: 200
    });
  } else {
    res.send(`403`);
  }
}


// [PATCH] /admin/articles-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  if(res.locals.role.permissions.includes("articles-category_delete")) {
    const id = req.params.id;
  
    await ArticleCategory.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: res.locals.account.id
    });
  
    req.flash('success', 'Xóa thành công!');
  
    res.json({
      code: 200
    });
  } else {
    res.send(`403`);
  }
}



// [PATCH] /admin/articles/change-position/:id
module.exports.changePosition = async (req, res) => {
  if(res.locals.role.permissions.includes("articles-category_edit")) {
    const id = req.params.id;
    const position = req.body.position;

    await ArticleCategory.updateOne({
      _id: id
    }, {
      position: position
    });

    res.json({
      code: 200
    });
  } else {
    res.send(`403`);
  }
}


// [GET] /admin/articles-category/detail/:id
module.exports.detail = async (req, res) => {
  if(res.locals.role.permissions.includes("articles-category_view")) {
    try {
      const id = req.params.id;
  
      const articleCategory = await ArticleCategory.findOne({
        _id: id,
        deleted: false
      });
  
      if (articleCategory) {
        res.render("admin/pages/articles-category/detail", {
          pageTitle: "Chi tiết mục sản phẩm",
          articleCategory: articleCategory
        });
      } else {
        res.redirect(`/${systemConfig.prefixAdmin}/articles-category`);
      }
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/articles-category`);
    }
  } else {
    res.send(`403`);
  }
}
