const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction");
const multer = require("../middlewares/multer");
const auth = require("../middlewares/auth");

router
    .get("/", transactionController.listTransactionId)
    .get("/income/:id", auth.verification(), transactionController.findUserIncome)
    .get("/expense/:id", auth.verification(), transactionController.findUserExpense)
    .get("/user/:id", transactionController.findUserTransactions)
    .post("/transfer", transactionController.createTransfer)
    .post("/user/topup", transactionController.createTopUp)


module.exports = router;