module.exports.index = (app) => {
    app.get("/", (req, res) => {
        res.render("client/pages/home/index.pug");
    });
      
    app.get("/products", (req, res) => {
        res.render("client/pages/products/index.pug");
    });
}