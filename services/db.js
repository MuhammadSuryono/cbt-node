const mysql = require("mysql2/promise")
const config = require("../config")

async function query(sql, params) {
    console.log(`Host Database: ${config.db.host} ON port ${config.db.port} To Database ${config.db.database}`)
    const connection = await mysql.createConnection(config.db);
    const [results, ] = await connection.execute(sql, params);
    return results;
}

module.exports = {
    query
}