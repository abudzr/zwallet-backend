const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const multer = require("../middlewares/multer");
const auth = require("../middlewares/auth");

router
  .get("/", auth.verification(), usersController.findAll)
  .get("/find-one", auth.verification(), usersController.findOne)
  .get("/find-user", usersController.findId)
  .get("/auth/verify", usersController.verify)
  .post("/", multer.uploadImage.single("image"), usersController.create)
  .post("/auth/login", usersController.login)
  .post("/auth/forgot-password", usersController.forgotPassword)
  .put("/auth/reset-password", usersController.resetPassword)
  .put("/:id", multer.uploadImage.single("image"), usersController.update)
  .put("/edit-password/:id", usersController.updatePassword)
  .put("/edit-pin/:id", usersController.updatePin)
  .put("/topup/:id", auth.verification(), usersController.topUp)
  .delete("/:id", auth.verification(), auth.isAdmin(), usersController.delete);

module.exports = router;
