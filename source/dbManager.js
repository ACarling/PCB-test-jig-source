const fs = require('fs');
const converter = require('json-2-csv');

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

const reasonableUpper = 200;
const reasonableLower = 0;

exports.addJsonToDB = function (boardNumber, jsonData) {

    let failedTests = "finished: ";
    let failedNum = 0;
    let failStatus = "";

    let jsonArray = [jsonData.rd1, jsonData.rd2, jsonData.rd3, jsonData.rd4, jsonData.rd5, jsonData.rd6, jsonData.rd7, jsonData.rdtotal];
    for (var i = 0; i < jsonArray.length; i++) {
        let currentTest = jsonArray[i];

        if(i == jsonArray.length - 1) {
            console.log("----> total = " + currentTest.microHenries);
        } else if ((currentTest.microHenries > henriesLower && currentTest.microHenries < henriesUpper)) {
            continue;
        } else if (currentTest.microHenries < reasonableLower && currentTest.microHenries > reasonableUpper) {
            failStatus = "r"
        } else {
            if(failStatus == "") {
                failStatus = "f"
            }
            failedNum ++;
            failedTests += "----| " + "rd" + (i + 1) + " failed (" + currentTest.microHenries + ")\n";
            console.log ("----| " + "rd" + (i + 1) + " failed (" + currentTest.microHenries + ")");
        }
    }
 

    pool.query('INSERT INTO lcr_results(number, rd1, rd2, rd3, rd4, rd5, rd6, rd7, total, passfail) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)' +
                    'ON CONFLICT (number) DO UPDATE SET rd1 = $2, rd2 = $3, rd3 = $4, rd4 = $5, rd5 = $6, rd6 = $7, rd7 = $8, total = $9, passfail = $10',
                [boardNumber, jsonData.rd1, jsonData.rd2, jsonData.rd3, jsonData.rd4, jsonData.rd5, jsonData.rd6, jsonData.rd7, jsonData.rdtotal, failStatus], (err, res) => {
                    if (err) throw err;
                });

    console.log("added board number: " + boardNumber + " to database");

    return (failedNum < 1 ? `finished board ${boardNumber}: no failed tests` : failedTests);
    //return "board inductance fits in range " + henriesLower + " < x < " + henriesUpper + ", it has been added to database";
}


// converter.json2csv converts json in the form [{key:elem, ...}, {key:elem, ...}, ...]
// database query returns json in the form {key:elem, ...} {key:elem, ...} - note lack of ','
// for new line seperated rows i want to parse data as parse( [{key:elem, ...}] ) -> parse ( [{key:elem, ...}] )

exports.convertDb = function (callback) {
    var arrayOfJsonData = [];
    pool.query("SELECT * FROM lcr_results", function (err, result, fields) {
        if (err) throw err;
        
        for(var i = 0; i < result.rows.length; i++) {                           // sets each element in arrayOfJsonData to a json STRING of each row
            arrayOfJsonData[i] = JSON.stringify(result.rows[i]);
            console.log(result.rows[i]);
        }
        jsonToCsv(arrayOfJsonData, callback);
    });
}

async function jsonToCsv(dbArray, callback) {
    console.log("jsontocsv function");

    fs.writeFile('/home/pi/nodeServerEtc/source/dbContents.csv', "number,rd1 microHenries,rd1 ohms,rd2 microHenries,rd2 ohms,rd3 microHenries,rd3 ohms,rd4 microHenries,rd4 ohms,rd5 microHenries,rd5 ohms,rd6 microHenries,rd6 ohms,rd7 microHenries,rd7 ohms,total microHenries,total ohms,passfail", function (err) {
        if (err) throw err;                         //creates a file and sets the header line of csv
    });
    for(let index = 0; index < dbArray.length; index++) {                   // for every line in the array of db elements
        let rowOfJson = JSON.parse("[" + dbArray[index] + "]");             // parse to format readable by json2csv
        const csv = await writeToCsv(rowOfJson, index, dbArray.length);     // wait for write to csv function to complete
        //console.log(csv.substring(227));                                    
    }
    console.log("finished");
    callback();
}

function writeToCsv (rowOfJson, row, Arraylength) {
    return new Promise(function (resolve, reject) {     // make function a promise
        converter.json2csv(rowOfJson, (err, csv) => {   // convert json to csv
            if (err) reject(err);                       // throw error if error
            else {
                fs.appendFile('/home/pi/nodeServerEtc/source/dbContents.csv', csv.substring(227), function (err) {
                    if (err) reject(err);
                    if(row == Arraylength - 1) {
                        console.log("finished with:" + (row + 1) + " rows");
                    }
                    resolve(csv);
                });
            }
        });
    });
}