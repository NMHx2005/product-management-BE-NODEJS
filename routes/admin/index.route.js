const dashboardRoute = require("./dashboard.route");
const productsRoute = require("./product.route");
const trashRoute = require("./trash.route");
const rolesRoute = require("./role.route");
const articlesRoute = require("./article.route");
const articlesCategoryRoute = require("./article-category.route");
const accountsRoute = require("./account.route");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const profileRoute = require("./profile.route");
const productsCategoryRoute = require("./product-category.route");
const systemConfig = require("../../config/system");
const settingRoute = require("./setting.route");

const authMiddleware = require("../../middleware/admin/auth.middleware");

module.exports.index = (app) => {
    const path = `/${systemConfig.prefixAdmin}`;

    app.use(
        `${path}/dashboard`,
        authMiddleware.requireAuth,
        dashboardRoute
    );

    app.use(
        `${path}/products`,
        authMiddleware.requireAuth,
        productsRoute
    );

    app.use(
        `${path}/trash`,
        authMiddleware.requireAuth,
        trashRoute
    );

    app.use(
        `${path}/products-category`,
        authMiddleware.requireAuth,
        productsCategoryRoute
    );

    app.use(
        `${path}/roles`,
        authMiddleware.requireAuth,
        rolesRoute
    );

    app.use(
        `${path}/accounts`,
        authMiddleware.requireAuth,
        accountsRoute
    );
    app.use(
        `${path}/userAccount`,
        authMiddleware.requireAuth,
        userRoute
    );

    app.use(
        `${path}/articles`,
        authMiddleware.requireAuth,
        articlesRoute
    );

    app.use(
        `${path}/articles-category`,
        authMiddleware.requireAuth,
        articlesCategoryRoute
    );

    app.use(
        `${path}/profile`,
        authMiddleware.requireAuth,
        profileRoute
    );

    app.use(
        `${path}/settings`,
        authMiddleware.requireAuth,
        settingRoute
    );

    app.use(`${path}/auth`, authRoute);
}