const fs = require('fs');
const Pool = require('pg').Pool;
const pool = new Pool({ //change this config data to a restricted json file
    user: 'pi',
    host: 'localhost',
    database: 'lcrtest',
    password: 'password',
    port: 5432
});

exports.addJsonToDB = function (boardNumber, jsonData) {
    pool.query('INSERT INTO test_res(number, rd1, rd2, rd3, rd4, rd5, rd6, rd7, total) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
                [boardNumber, jsonData.rd1, jsonData.rd2, jsonData.rd3, jsonData.rd4, jsonData.rd5, jsonData.rd6, jsonData.rd7, jsonData.total], (err, res) => {
                    if (err) throw err;
                });
} 