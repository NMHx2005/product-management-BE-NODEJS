const ProductCategory = require("../../model/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree.helper");
const paginationHelper = require("../../helpers/pagination.helpers");



// [GET] /admin/products-category
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
    const paginationTrash = await paginationHelper.paginationTrash(req, find);
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
    

    const records = await ProductCategory
      .find(find)
      .limit(paginationTrash.limitItems)
      .skip(paginationTrash.skip)
      .sort(sort);

    res.render("admin/pages/products-category/index", {
      pageTitle: "Trang Danh Mục Sản Phẩm",
      records: records,
      filterStatus: filterStatus,
      keyword: keyword,
      paginationTrash: paginationTrash
    });
}


// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    const categories = await ProductCategory.find({
        deleted: false
    });

    const newCategories = createTreeHelper(categories);

    res.render("admin/pages/products-category/create", {
      pageTitle: "Thêm mới danh mục sản phẩm",
      categories: newCategories
    });
}
  


// [POST] /admin/products-category/createPost
module.exports.createPost = async (req, res) => {
    if(req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const countCagegory = await ProductCategory.countDocuments({});
        req.body.position = countCagegory + 1;
    }

    const newCategory = new ProductCategory(req.body);
    await newCategory.save();

    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}
  


// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const category = await ProductCategory.findOne({
        _id: id,
        deleted: false
    });

    const categories  = await ProductCategory.find({
        deleted: false
    });

    const newCategories = createTreeHelper(categories);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Trang Danh Mục Sản Phẩm",
      categories: categories,
      category: category
    });
}




// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    if(req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const countCagegory = await ProductCategory.countDocuments({});
        req.body.position = countCagegory + 1;
    }

    await ProductCategory.updateOne({
        _id: id,
        deleted: false
    }, req.body);

    req.flash("success", "Cập nhật danh mục thành công!");

    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);

}



// [PATCH] /admin/products-category/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
    const { id, statusChange } = req.params;
  
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
}


// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const { ids, status } = req.body;
  
    switch(status) {
      case "active":
      case "inactive":
        await ProductCategory.updateMany({
          _id: ids
        }, {
          status: status
        });
        break;
      case "delete":
        await ProductCategory.updateMany({
          _id: ids
        }, {
          deleted: true
        });
        break;
      case "delete-forever":
        await ProductCategory.deleteMany({
          _id: ids
        });
        break;
      case "restoreAll":
        await ProductCategory.updateMany({
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
}


// [PATCH] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
  
    await ProductCategory.updateOne({
      _id: id
    }, {
      deleted: true
    });
  
    req.flash('success', 'Xóa thành công!');
  
    res.json({
      code: 200
    });
  }



// [PATCH] /admin/product/change-position/:id
module.exports.changePosition = async (req, res) => {
  const id = req.params.id;
  const position = req.body.position;

  await ProductCategory.updateOne({
    _id: id
  }, {
    position: position
  });

  res.json({
    code: 200
  });
}