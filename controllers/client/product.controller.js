const Product = require("../../model/product.model");
const ProductCategory = require("../../model/product-category.model");


// [GET] /products/
module.exports.index = async (req, res) => {
    const products = await Product
        .find({
            status: "active",
            deleted: false
        })
        .sort({
            position: "desc"
        })
    ; 

    for (const item of products) {
        item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
    }

    

    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh Sách Sản Phẩm",
        products: products
    });
}


// [GET] /products/detail
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;


    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    });


    if(product) {
        res.render("client/pages/products/detail", {
          pageTitle: "Chi tiết sản phẩm",
          product: product
        });
    } else {
        res.redirect("/");
    }
}



// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {

    const slugCategory = req.params.slugCategory;

    const category = await ProductCategory.findOne({
        slug: slugCategory,
        deleted: false,
        status: "active"
    });

    const allSubCategory = [];

    const getSubCategory = async (currentId) => {
        const subCategory = await ProductCategory.find({
            parent_id: currentId,
            deleted: false,
            status: "active"
        })

        for (const item of subCategory) {
            allSubCategory.push(item.id);
            await getSubCategory(item.id);
        }
    }

    await getSubCategory(category.id);

    const products = await Product
        .find({
            product_category_id: {
                $in: [
                    category.id,
                    ...allSubCategory
                ]
            }
        })
        .sort({
            position: "desc"
        });
    
    for (const item of products) {
        item.priceNew = ((1 - item.discountPercentage/100) * item.price).toFixed(0);
    }

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: products
    })

}