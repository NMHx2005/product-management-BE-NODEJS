const express = require("express");
const multer  = require('multer');
const router = express.Router();

const controller = require("../../controllers/admin/product-category.controller");
const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");

const upload = multer();

router.get("/", controller.index);

router.patch("/change-status/:statusChange/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.get("/create", controller.create);

router.patch("/delete/:id", controller.deleteItem);

router.post(
  "/create", 
  upload.single('thumbnail'),
  uploadCloud.uploadSingle,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id", 
  upload.single('thumbnail'),
  uploadCloud.uploadSingle,
  controller.editPatch
);


module.exports = router;