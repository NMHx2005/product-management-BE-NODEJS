const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");

router.get("/register", controller.register);

router.post("/register", controller.registerPost);

router.get("/login", controller.login);

router.get("/logout", controller.logout);

router.post("/login", controller.loginPost);

module.exports = router;