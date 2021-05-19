const transactionModel = require("../models/transaction");
const usersModel = require("../models/usersModel");
const helper = require("../helpers/printHelper");


exports.listTransaction = (req, res) => {
    transactionModel
        .getAllTransaction()
        .then((result) => {
            if (result < 1) {
                helper.printError(res, 400, "Transaction not found");
                return;
            }
            helper.printSuccess(res, 200, "Find all transaction successfully", result);
        })
        .catch((err) => {
            helper.printError(res, 500, err.message);
        });
};




exports.listTransactionId = async (req, res) => {
    try {
        const id = req.auth.id;
        const cond = req.query
        cond.search = cond.search || ''
        cond.page = Number(cond.page) || 1
        cond.limit = Number(cond.limit) || 5
        cond.offset = (cond.page * cond.limit) - cond.limit
        cond.sort = cond.sort || 'id'
        cond.order = cond.order || 'ASC'

        const results = await transactionModel.getAllTransactionById(id, cond)
        if (results < 1) {
            return helper.printError(res, 400, "Sorry, there are no transactions for this user");
        }
        return helper.printSuccess(
            res,
            200,
            "Get Data Transactions Success",
            results
        );
    } catch (err) {
        return helper.printError(res, 500, err.message);
    }
}

exports.createTopUp = async (req, res) => {
    const { idUser, amount, notes } = req.body;
    const data = {
        idUser,
        idReceiver: idUser,
        amount,
        notes,
        type: "Receive",
        status: "success"
    };

    await transactionModel.createTopup(data, idUser)
        .then((result) => {
            return helper.printSuccess(
                res,
                200,
                "Top Up Success",
                result
            );

        })
        .catch((err) => {
            return helper.printError(res, 500, err.message);
        });
};

exports.createTransfer = async (req, res) => {
    const { idUser, idReceiver, amount, notes, pin } = req.body;
    const data = {
        idUser,
        idReceiver,
        amount,
        notes,
        type: "Transfer",
        status: "pending"
    };
    const dataReceiver = {
        idUser: idReceiver,
        idReceiver: idUser,
        amount,
        notes,
        type: "Receive",
        status: "success"
    };

    try {
        const user = await usersModel.findUser(idReceiver, "Check User")
        if (user < 1) {
            helper.printError(res, 400, "User Not Found");
            return;
        } else {
            const credit = await transactionModel.checkCredit(idUser)
            if (credit[0].credit < amount) {
                helper.printError(res, 400, "Sorry, your balance is insufficient")
                return;
            }
            const cekpin = await transactionModel.checkPin(idUser, pin)
            if (cekpin < 1) {
                helper.printError(res, 400, "Incorrect pin, please enter the pin correctly ")
                return;
            }
            await transactionModel.createTransaction(data);
            await transactionModel.createTransaction(dataReceiver);
            await transactionModel.transferIdUser(idUser);
            await transactionModel.receiverTransfer(idReceiver);
            helper.printSuccess(
                res,
                200,
                "Transfer Success",
            );
        }
    } catch (err) {
        helper.printError(res, 500, err.message);
    }
};

exports.findUserIncome = (req, res) => {
    const id = req.params.id;

    transactionModel
        .getAllIncomebyId(id)
        .then((result) => {
            console.log(result[0].income);
            if (result < 1) {
                helper.printError(res, 400, "User income not found");
                return;
            }
            helper.printSuccess(res, 200, "Find user income successfully", result);
        })
        .catch((err) => {
            helper.printError(res, 500, err.message);
        });
};

exports.findUserExpense = (req, res) => {
    const id = req.params.id;

    transactionModel
        .getAllExpensebyId(id)
        .then((result) => {
            if (result < 1) {
                helper.printError(res, 400, "User income not found");
                return;
            }
            helper.printSuccess(res, 200, "Find user income successfully", result);
        })
        .catch((err) => {
            helper.printError(res, 500, err.message);
        });
};

exports.findUserTransactions = (req, res) => {
    const id = req.params.id;
    const { page, perPage } = req.query;
    const sortBy = req.query.sortBy ? req.query.sortBy : "id";
    const order = req.query.order ? req.query.order : "ASC";

    transactionModel
        .getAllUserTransactions(id, page, perPage, sortBy, order)
        .then(([totalData, totalPage, result, page, perPage]) => {
            if (result < 1) {
                helper.printError(res, 400, "Transactions not found");
                return;
            }
            helper.printPaginate(
                res,
                200,
                "Find all user transactions successfully",
                totalData,
                totalPage,
                result,
                page,
                perPage
            );
        })
        .catch((err) => {
            helper.printError(res, 500, err.message);
        });
};

exports.findDetailTransaction = (req, res) => {
    const id = req.params.id;

    transactionModel
        .getTransactionbyId(id)
        .then((result) => {
            if (result < 1) {
                helper.printError(res, 400, "Transaction not found");
                return;
            }
            helper.printSuccess(res, 200, "Find detail transaction successfully", result);
        })
        .catch((err) => {
            helper.printError(res, 500, err.message);
        });
};
