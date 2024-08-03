const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const searchRoute = require("./search.route");
const checkoutRoute = require("./checkout.route");
const cartRoute = require("./cart.route");

const categoryMiddleware = require("../../middleware/client/category.middleware");
const cartMiddleware = require("../../middleware/client/cart.middleware");

module.exports.index = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);

    app.use("/", homeRoute);
    
    app.use("/products", productRoute);

    app.use("/search", searchRoute);

    app.use("/cart", cartRoute);
    
    app.use("/checkout", checkoutRoute);
}