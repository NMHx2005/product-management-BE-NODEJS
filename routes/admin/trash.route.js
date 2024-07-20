const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/trash.controller")

router.get("/", controller.index);

router.patch("/restoreItem/:id", controller.restoreItem);

router.delete("/deleteItem/:id", controller.deleteItem);

module.exports = router;