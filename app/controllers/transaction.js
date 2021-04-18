const transactionModel = require("../models/transaction");
const usersModel = require("../models/usersModel");
const helper = require("../helpers/printHelper");

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
        method: "topup",
        notes,
        status: "success"
    };
    transactionModel
        .createTopup(data, idUser)
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
        method: "transfer",
        notes,
        status: "pending"
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
            await transactionModel.createTransaction(data);
            const cekpin = await transactionModel.checkPin(idUser, pin)
            if (cekpin < 1) {
                helper.printError(res, 400, "Incorrect pin, please enter the pin correctly ")
                return;
            }
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
