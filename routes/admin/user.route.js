const express = require("express");
const router = express.Router();
const multer = require('multer');

const controller = require("../../controllers/admin/user.controller");

// const validate = require("../../validates/admin/user.validate");

const upload = multer();

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single('avatar'),
    uploadCloud.uploadSingle,
    // validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single('avatar'),
    uploadCloud.uploadSingle,
    // validate.createPost,
    controller.editPatch
);

module.exports = router;