const fs = require('fs');
const Pool = require('pg').Pool;
const pool = new Pool({ //change this config data to a restricted json file
    user: 'pi',
    host: 'localhost',
    database: 'lcrtest',
    password: 'raspberry',
    port: 5432
});

const henriesLower = 180; //exlusive
const henriesUpper = 190;

const totalUpper = 10;
const totalLower = 5;

exports.addJsonToDB = function (boardNumber, jsonData) {

    let failedTests = "finished: ";

    let jsonArray = [jsonData.rd1, jsonData.rd2, jsonData.rd3, jsonData.rd4, jsonData.rd5, jsonData.rd6, jsonData.rd7, jsonData.rdtotal];
    for (var i = 0; i < jsonArray.length; i++) {
        let currentTest = jsonArray[i];

        if(i == jsonArray.length - 1) {
            console.log("----> total = " + currentTest.microHenries);
        } else if ((currentTest.microHenries > henriesLower && currentTest.microHenries < henriesUpper)) {
            continue;
        } else {
            failedTests += "----| " + "rd" + (i + 1) + " failed (" + currentTest.microHenries + ")\n";
            console.log ("----| " + "rd" + (i + 1) + " failed (" + currentTest.microHenries + ")");
        }
    }
 

    pool.query('INSERT INTO test_res(number, rd1, rd2, rd3, rd4, rd5, rd6, rd7, total) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)' +
                    'ON CONFLICT (number) DO UPDATE SET rd1 = $2, rd2 = $3, rd3 = $4, rd4 = $5, rd5 = $6, rd6 = $7, rd7 = $8, total = $9',
                [boardNumber, jsonData.rd1, jsonData.rd2, jsonData.rd3, jsonData.rd4, jsonData.rd5, jsonData.rd6, jsonData.rd7, jsonData.rdtotal], (err, res) => {
                    if (err) throw err;
                });
    console.log("added board number: " + boardNumber + " to database");

    return (failedTests.length < 1 ? "finished no failed tests" : failedTests);
    //return "board inductance fits in range " + henriesLower + " < x < " + henriesUpper + ", it has been added to database";
}
