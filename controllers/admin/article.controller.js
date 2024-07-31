const moment = require("moment");
const Account = require("../../model/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");
const Article = require("../../model/articles.model")
const paginationHelper = require("../../helpers/pagination.helpers");
const ArticleCategory = require("../../model/articles-category.model");

// [GET] /admin/pages/articles
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

    if(req.query.status) {
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
    const paginationArticle = await paginationHelper.paginationArticle(req, find);
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

    // Sắp xếp
    const sort = {};
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
  // Hết Sắp xếp

    const articles = await Article
        .find(find)
        .limit(paginationArticle.limitItems)
        .skip(paginationArticle.skip)
        .sort(sort);

    
    for (const item of articles) {
        // Người tạo
        if(item.createdBy) {
            const accountCreated = await Account.findOne({
            _id: item.createdBy
            });
            item.createdByFullName = accountCreated.fullName;
        } else {
            item.createdByFullName = "";
        }
    
        item.createdAtFormat = moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss");
    
    
        // Người cập nhật
        if(item.updatedBy) {
            const accountUpdated = await Account.findOne({
            _id: item.updatedBy
            });
            item.updatedByFullName = accountUpdated.fullName;
        } else {
            item.updatedByFullName = "";
        }
    
        item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YYYY HH:mm:ss");
    }
        


    res.render("admin/pages/articles/index", {
        pageTitle: "Quản lý bài viết",
        articles: articles,
        filterStatus: filterStatus,
        keyword: keyword,
        paginationArticle: paginationArticle
    });
}


// [PATCH] /admin/articles/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
    if(res.locals.role.permissions.includes("articles_edit")) {
        const { id, statusChange } = req.params;

        await Article.updateOne({
            _id: id
        }, {
            status: statusChange
        });

        req.flash('success', 'Cập nhật trạng thái thành công!');

        res.json({
            code: 200
        });
    } else {
        res.send(`403`);
    }
};


// [PATCH] /admin/articles/change-multi
module.exports.changeMulti = async (req, res) => {
    if(res.locals.role.permissions.includes("articles_edit")) {
        const { ids, status } = req.body;

        switch(status) {
            case "active":
            case "inactive":
                await Article.updateMany({
                    _id: ids
                }, {
                    status: status
                });
                req.flash('success', 'Cập nhật trạng thái thành công!');
                break;
            case "delete":
                await Article.updateMany({
                    _id: ids
                }, {
                    deleted: true
                });
                req.flash('success', 'Xóa thành công!');
                break;
            case "delete-forever":
                await Article.deleteMany({
                    _id: ids
                });
                req.flash('success', 'Áp dụng thành công!');
                break;
            case "restoreAll":
                await Article.updateMany({
                    _id: ids
                }, {
                    deleted: false
                });
                req.flash('success', 'Áp dụng thành công!');
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


// [PATCH] /admin/articles/delete/:id
module.exports.deleteItem = async (req, res) => {
    if(res.locals.role.permissions.includes("articles_delete")) {
        const id = req.params.id;

        await Article.updateOne({
            _id: id
        }, {
            deleted: true
        });

        req.flash('success', 'Xóa sản phẩm thành công!');

        res.json({
            code: 200
        });
    } else {
        res.send(`403`);
    }
}



// [PATCH] /admin/artciles/change-position/:id
module.exports.changePosition = async (req, res) => {
    if(res.locals.role.permissions.includes("articles_edit")) {
        const id = req.params.id;
        const position = req.body.position;
    
        await Article.updateOne({
            _id: id
        }, {
            position: position
        });

        req.flash('success', 'Thay đổi vị trí thành công!');
    
        res.json({
            code: 200
        });
    } else {
        res.send(`403`);
    }
}


// [GET] /admin/articles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/articles/create", {
      pageTitle: "Thêm mới bài viết"
    });
}


// [POST] /admin/articles/createPost
module.exports.createPost = async (req, res) => {
    if(res.locals.role.permissions.includes("articles_create")) {
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        } else {
            const countArticles = await Article.countDocuments({});
            req.body.position = countArticles + 1;
        }
    
        req.body.deleted = req.body.deleted === 'true'; // Chuyển đổi deleted từ chuỗi thành boolean
    
        const newArticle = new Article(req.body);
        await newArticle.save();
    
        req.flash("success", "Tạo mới bài viết thành công!");
    
        res.redirect(`/${systemConfig.prefixAdmin}/articles`);
    } else {
        res.send(`403`);
    }
}


// [GET] /admin/articles/edit/:id
module.exports.edit = async (req, res) => {
    try {
      const id = req.params.id;
  
      const article = await Article.findOne({
        _id: id,
        deleted: false
      });
  
      if (article) {
        const categories = await ArticleCategory.find({
          deleted: false
        });
  
        const newCategories = createTreeHelper(categories);
  
        res.render("admin/pages/articles/edit", {
          pageTitle: "Chỉnh sửa sản phẩm",
          article: article,
          categories: newCategories
        });
      } else {
        res.redirect(`/${systemConfig.prefixAdmin}/articles`);
      }
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/articles`);
    }
  }
  
  
  // [PATCH] /admin/articles/edit/:id
  module.exports.editPatch  = async (req, res) => {
    if(res.locals.role.permissions.includes("articles_edit")) {
        try {
            const id = req.params.id;
        
    
            if (req.body.position) {
                req.body.position = parseInt(req.body.position);
            } else {
                const countArticles = await Article.countDocuments({});
                req.body.position = countArticles + 1;
            }
    
            await Article.updateOne({
              _id: id,
              deleted: false
            }, req.body);
        
            req.flash("success", "Cập nhật bài viết thành công!");
        
        } catch(error) {
        req.flash('error', 'Id bài viết không hợp lệ!');
        }
        res.redirect(`/${systemConfig.prefixAdmin}/articles`);
    } else {
        res.send(`403`);
    }
}
  
  


// [GET] /admin/articles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
    
        const article = await Article.findOne({
          _id: id,
          deleted: false
        });
    
        if (article) {
            res.render("admin/pages/articles/detail", {
            pageTitle: "Chi tiết bài viết",
            article: article
        });
    } else {
        res.redirect(`/${systemConfig.prefixAdmin}/articles`);
    }
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/articles`);
    }
}
  