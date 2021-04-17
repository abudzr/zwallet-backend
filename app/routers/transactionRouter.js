const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction");
const multer = require("../middlewares/multer");
const auth = require("../middlewares/auth");

router
    .get("/", auth.verification(), transactionController.listTransactionId)
    .post("/transfer", transactionController.createTransfer)
    .post("/topup", transactionController.createTopUp)


module.exports = router;