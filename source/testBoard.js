const fs = require('fs');

//script to make the python do its thing and then put the results in a json file the server

exports.call_visaInterface = function () {

    var spawn = require("child_process").spawn;
    var process = spawn('python', ["./source/visaInterface.py"]);
    let dataString = '';
    console.log(" >> loaded python attempting to gain output: ")

    process.stdout.on('data', function (data) { //data is everything printed in the python script
        dataString += data.toString();
    });

    process.stdout.on('end', function () {
        //JSON.parse(dataString);
        let data = JSON.parse(fs.readFileSync('./source/results.json'));
        
        console.log(" >> recieved: " + data.ohms + ", " + data.microHenries);
    });
}