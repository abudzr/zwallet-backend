const express = require("express");
const route = express.Router();

const usersRouter = require("./usersRouter");
const transactionRouter = require("./transactionRouter");

route.use("/users", usersRouter);
route.use("/transaction", transactionRouter);

module.exports = route;
