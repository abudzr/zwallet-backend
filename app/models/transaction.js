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

exports.getAllTransaction = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM transaction `,
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
                                            connection.query(
                                                `SELECT credit from users WHERE id = ${idUser}`,
                                                (err, result) => {
                                                    if (!err) {
                                                        connection.query(
                                                            `UPDATE transaction SET creditLeft =${result[0].credit}, status="success"  WHERE idUser =${idUser} ORDER BY createdAt DESC LIMIT 1 `,
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
                console.log(result[0]);
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
                                                `UPDATE transaction SET creditLeft =${result[0].credit}, status="success"  WHERE idUser =${idUser} ORDER BY createdAt DESC LIMIT 1 `,
                                                (err, result) => {
                                                    if (!err) {
                                                        resolve(result);
                                                    } else {
                                                        reject(new Error("Update Credit Left Failed"));
                                                    }
                                                }
                                            )
                                        } else {
                                            reject(new Error("Select credit failed"));
                                        }
                                    }
                                )
                            } else {
                                reject(new Error("Update user Credit for transfer Failed"));
                            }
                        }
                    )
                } else {
                    reject(new Error("Select Amount Failed"));
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
                                connection.query(
                                    `SELECT credit from users WHERE id = ${id}`,
                                    (err, result) => {
                                        if (!err) {
                                            connection.query(
                                                `UPDATE transaction SET creditLeft =${result[0].credit}, status="success"  WHERE idUser =${id} ORDER BY createdAt DESC LIMIT 1 `,
                                                (err, result) => {
                                                    if (!err) {
                                                        resolve(result);
                                                    } else {
                                                        reject(new Error("Update Credit Left Failed"));
                                                    }
                                                }
                                            )
                                        } else {
                                            reject(new Error("Select credit failed"));
                                        }
                                    }
                                )
                            } else {
                                reject(new Error("Update user Credit for Receiver Failed"));
                            }
                        }
                    )
                } else {
                    reject(new Error("Select Amount Failed"));
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

// exports.inserthistory = (data) => {
//     return new Promise((resolve, reject) => {
//         connection.query(
//             "INSERT INTO history SET ?",
//             [data],
//             (err, result) => {
//                 if (!err) {
//                     resolve(result);
//                 } else {
//                     reject(new Error("Internal server error"));
//                 }
//             }
//         )
//     })
// }

exports.getAllIncomebyId = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT SUM(amount) AS income FROM transaction WHERE idUser =${id} AND type ="Receive"`,
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

exports.getAllExpensebyId = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT SUM(amount) AS expense FROM transaction WHERE idUser =${id} AND type ="transfer"`,
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

exports.getTransactionbyId = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT t.id, u.username, u.email, u.firstname, u.lastname, u.phoneNumber, u.image, t.createdAt, t.idUser, t.amount, t.notes, t.status, t.type 
            FROM transaction t 
            INNER JOIN users u 
            ON 
            t.idReceiver = u.id WHERE t.id = ${id}
            `,
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


// SELECT COUNT(*) AS totalData FROM transaction t WHERE t.idUser = 8

exports.gethistory = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT t.id, u.username, u.email, u.firstname, u.lastname, u.image, t.createdAt, t.idUser, t.amount, t.notes, t.status, t.type 
            FROM transaction t 
            INNER JOIN users u 
            ON 
            t.idReceiver = u.id WHERE t.idUser = ${id}
            `,
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

exports.getAllUserTransactions = (id, queryPage, queryPerPage, sortBy, order) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT COUNT(*) AS totalData FROM transaction t WHERE t.idUser = ${id}`,
            (err, result) => {
                let totalData, page, perPage, totalPage;
                if (err) {
                    reject(new Error("Internal server error"));
                } else {
                    totalData = result[0].totalData;
                    page = queryPage ? parseInt(queryPage) : 1;
                    perPage = queryPerPage ? parseInt(queryPerPage) : 5;
                    totalPage = Math.ceil(totalData / perPage);
                }
                const firstData = perPage * page - perPage;
                // SELECT t.id, u.username, u.email, u.firstname, u.lastname, u.image, t.createdAt, t.idUser, t.amount, t.notes, t.status, t.type FROM transaction t INNER JOIN users u ON t.idReceiver = u.id WHERE t.idUser = 7 ORDER BY createdAt DESC LIMIT 2
                connection.query(
                    `SELECT t.id, u.username, u.email, u.firstname, u.lastname, u.image, t.createdAt, t.idUser, t.amount, t.notes, t.status, t.type 
                    FROM transaction t 
                    INNER JOIN users u 
                    ON 
                    t.idReceiver = u.id WHERE t.idUser = ? ORDER BY ${sortBy} ${order} LIMIT ?,?
                    `,
                    [id, firstData, perPage],
                    (err, result) => {
                        if (err) {
                            reject(new Error("Internal server error"));
                        } else {
                            resolve([totalData, totalPage, result, page, perPage]);
                        }
                    }
                );
            }
        );
    });
};



// select transaction by id
// jika transfer di halaman history tampilkan profile penerima, dan jumlah transfer dan berdasarkan tgl transfer
// jika receiver di halaman history tampilkan profile pengirim dan jumlah transfer berdasarkan tgl
// SELECT h.id, u.username, u.firstname,u.lastname, u.email, u.image, u.phoneNumber,h.idUser, h.amount FROM history h INNER JOIN users u ON h.idUser =u.id WHERE h.idUser = 8