const db = require('./db')

async function getDataUser(registerNumber) {
    const row = await db.query(
        `select * from user_peserta where number_of_register='${registerNumber}'`
    )

    return row[0]
}

module.exports = {
    getDataUser
}