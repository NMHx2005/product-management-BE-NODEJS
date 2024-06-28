const Product = require("../../model/product.model");
const paginationHelper = require("../../helpers/pagination.helpers");


// [GET] /admin/products/
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

  res.render("admin/pages/products/index", {
    pageTitle: "Quản lý sản phẩm",
    products: products,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  });
}


// [PATCH] /admin/products/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  const { id, statusChange } = req.params;

  await Product.updateOne({
    _id: id
  }, {
    status: statusChange
  });

  // res.redirect('back');
  res.json({
    code: 200
  });
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const { ids, status } = req.body;

  await Product.updateMany({
    _id: ids
  }, {
    status: status
  });

  // res.redirect('back');
  res.json({
    code: 200
  });
}



// [PATCH] /admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne({
    _id: id
  }, {
    deleted: true
  });

  res.json({
    code: 200
  });
}