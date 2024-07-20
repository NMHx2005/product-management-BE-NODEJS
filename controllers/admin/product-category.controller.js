const ProductCategory = require("../../model/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree.helper");

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


    const records = await ProductCategory.find(find);

    res.render("admin/pages/products-category/index", {
      pageTitle: "Trang Danh Mục Sản Phẩm",
      records: records,
      filterStatus: filterStatus,
      keyword: keyword
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