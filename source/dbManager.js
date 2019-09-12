const fs = require('fs');
const Pool = require('pg').Pool;
const pool = new Pool({ //change this config data to a restricted json file
    user: 'pi',
    host: 'localhost',
    database: 'lcrtest',
    password: 'raspberry',
    port: 5432
});

const henriesLower = 176;
const henriesUpper = 183;

exports.addJsonToDB = function (boardNumber, jsonData) {
    /* doesnt work yet -- ----- see  comment
    console.log("henlo")
    for(var key in jsonData) { // instead of doing this open a file system and parse the actual json file here instead of taking it as a param
        
        if(key.microHenries > 200) {
            continue;
        }
        if(jsonData.key.microHenries > henriesLower && jsonData.key.microHenries < henriesUpper) { //test for board shorts and failures
            console.log(key + " is good");
            continue;
        } else {
            console.log(key + " failed");
            console.log(key.microHenries);
            return "board fails not adding to database";
        }
    }
    */


    pool.query('INSERT INTO test_res(number, rd1, rd2, rd3, rd4, rd5, rd6, rd7, total) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
                [boardNumber, jsonData.rd1, jsonData.rd2, jsonData.rd3, jsonData.rd4, jsonData.rd5, jsonData.rd6, jsonData.rd7, jsonData.total], (err, res) => {
                    if (err) throw err;
                });
    console.log("added board number: " + boardNumber + " to database");

    //return "board inductance fits in range " + henriesLower + " < x < " + henriesUpper + ", it has been added to database";
}
