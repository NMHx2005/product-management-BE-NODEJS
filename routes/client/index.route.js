const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const searchRoute = require("./search.route");
const checkoutRoute = require("./checkout.route");
const cartRoute = require("./cart.route");
const userRoute = require("./user.route");
const chatRoute = require("./chat.route");

const categoryMiddleware = require("../../middleware/client/category.middleware");
const cartMiddleware = require("../../middleware/client/cart.middleware");
const userMiddleware = require("../../middleware/client/user.middleware");
const settingMiddleware = require("../../middleware/client/setting.middleware");

module.exports.index = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use(settingMiddleware.setting);
    
    app.use("/", homeRoute);
    
    app.use("/products", productRoute);

    app.use("/search", searchRoute);

    app.use("/cart", cartRoute);

    app.use("/user", userRoute);

    app.use("/checkout", checkoutRoute);
    
    app.use(
        "/chat",
        userMiddleware.requireAuth,
        chatRoute
    ); 
}