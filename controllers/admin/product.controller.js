const Product = require("../../model/product.model");

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
  // const products = await Product.find(find);
  const pagination = {
    currentPage: 1,
    limitItems: 4
  };

  if(req.query.page) {
    pagination.currentPage = parseInt(req.query.page);
  }

  pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;

  const countProducts = await Product.countDocuments(find);
  const totalPage = Math.ceil(countProducts/pagination.limitItems);

  pagination.totalPage = totalPage;

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