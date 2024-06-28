const Product = require("../../model/product.model");
const paginationHelper = require("../../helpers/pagination.helpers");

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
  
    // console.log(products);
  
    res.render("admin/pages/products/product-trash", {
      pageTitle: "Thùng rác",
      products: products,
      keyword: keyword,
      filterStatus: filterStatus,
      pagination: pagination
    });
}
  

// [PATCH] /admin/trash/restoreItem/:id
module.exports.restoreItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne({
    _id: id
  }, {
    deleted: false
  });

  res.json({
    code: 200
  });
}



// [DELETE] /admin/trash/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.deleteOne({
    _id: id
  });

  res.json({
    code: 200
  });
}