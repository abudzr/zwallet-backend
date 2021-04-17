const connection = require("../configs/dbConfig");


exports.getAllTransactionById = (id, cond) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM transaction WHERE idUser = ${id} ORDER BY ${cond.sort} ${cond.order}
            LIMIT ${cond.limit} OFFSET ${cond.offset}`,
            (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            }
        )
    })
};

exports.checkPin = (id, pin) => {
    return new Promise((resolve, reject) => {
        connection.query(
            ` select pin from users where id=${id} and pin=${pin}`,
            (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            }
        );
    });
};

exports.createTopup = (data, idUser) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "INSERT INTO transaction SET ?",
            [data],
            (err, result) => {
                console.log(err);
                if (!err) {
                    connection.query(
                        `SELECT amount from transaction WHERE idUser = ${idUser} ORDER BY createdAt DESC LIMIT 1`,
                        (err, result) => {
                            console.log(err);
                            if (!err) {
                                connection.query(
                                    `UPDATE users SET credit =(credit + ${result[0].amount}) WHERE id = ${idUser}`,
                                    (err, result) => {
                                        if (!err) {
                                            resolve(result);
                                        } else {
                                            reject(new Error("Internal server error"));
                                        }
                                    }
                                )
                            } else {
                                reject(new Error("Internal server error"));
                            }
                        }
                    )
                } else {
                    reject(new Error("Internal server error"));
                }
            }
        )
    })
}

exports.createTransaction = (data) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "INSERT INTO transaction SET ?",
            [data],
            (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error("Internal server error"));
                }
            }
        )
    })
}

exports.transferIdUser = (idUser) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT amount from transaction WHERE idUser = ${idUser} ORDER BY createdAt DESC LIMIT 1`,
            (err, result) => {
                if (!err) {
                    connection.query(
                        `UPDATE users SET credit =(credit - ${result[0].amount}) WHERE id = ${idUser}`,
                        (err, result) => {
                            if (!err) {
                                connection.query(
                                    `SELECT credit from users WHERE id = ${idUser}`,
                                    (err, result) => {
                                        if (!err) {
                                            connection.query(
                                                `UPDATE transaction SET creditLeft =${result[0].credit} WHERE idUser =${idUser} ORDER BY createdAt DESC LIMIT 1 `,
                                                (err, result) => {
                                                    if (!err) {
                                                        resolve(result);
                                                    } else {
                                                        reject(new Error("Internal server error"));
                                                    }
                                                }
                                            )
                                        } else {
                                            reject(new Error("Internal server error"));
                                        }
                                    }
                                )
                            } else {
                                reject(new Error("Internal server error"));
                            }
                        }
                    )
                } else {
                    reject(new Error("Internal server error"));
                }
            })
    })
}

exports.receiverTransfer = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT amount from transaction WHERE idReceiver = ${id} ORDER BY createdAt DESC LIMIT 1`,
            (err, result) => {
                if (!err) {
                    connection.query(
                        `UPDATE users SET credit =(credit + ${result[0].amount}) WHERE id = ${id}`,
                        (err, result) => {
                            if (!err) {
                                resolve(result);
                            } else {
                                reject(new Error("Internal server error"));
                            }
                        }
                    )
                } else {
                    reject(new Error("Internal server error"));
                }
            })
    })
}

exports.checkCredit = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT credit from users WHERE id = ${id}`,
            (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error("Internal server error"));
                }
            }
        )
    })
}
