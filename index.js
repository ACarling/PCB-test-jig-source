const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');

const titleString = "number,rd1 microHenries,rd1 ohms,rd2 microHenries,rd2 ohms,rd3 microHenries,rd3 ohms,rd4 microHenries,rd4 ohms,rd5 microHenries,rd5 ohms,rd6 microHenries,rd6 ohms,rd7 microHenries,rd7 ohms,total microHenries,total ohms,passfail\n";

app.use(express.static('source'));
app.use(express.urlencoded());          // allows the python interface

app.get('/', (req, res) => {      //serves dash (page.html) as front page 
    res.sendFile('page.html', {root: __dirname + '/source'});
});



//--------------------------------- TO show test status to front end (post connects to testboard.js and get connects to page.html) ---------------------------------\\
var currentTest = ""; // the variable that is routed to the front end ajax

app.get('/result', (req, res) => {
    res.send(currentTest);
});


//--------------------------------- testBoard (call python interface) ---------------------------------\\


//function to make the visa interface python script run and then put the results in a json file the server

call_visaInterface = function (boardNumber) {
    let spawn = require("child_process").spawn;
    let process = spawn('python3', [__dirname + "/source/visaInterface.py"]);
    let dataString = '';
    console.log(" >> loaded python attempting to gain output: ")
    
    currentTest = "loading python subroutine"; //the current test variable is the message routed to the front-ened

    process.stdout.on('data', function (data) {         //data is everything that has been printed and flushed to the stdout from the python script
        dataString += data.toString();                  
        currentTest = data.toString();
        console.log(currentTest);
    });

    process.stdout.on('end', function () { // calls once the python script finishes
        currentTest = null;
        let data = JSON.parse(fs.readFileSync(__dirname + '/source/results.json'));
        jsonToCsv(data, boardNumber).then(data => {
            fs.appendFileSync(__dirname + `/source/dbContents.csv`, data);
        });
    });
}

function jsonToCsv(jsonObject, boardNumber) {
    /* jsonObject structure
        {
            rd : {microHenries: 1, ohms: 1},
            ...
        }
    */
    return new Promise((resolve, reject) => {
        var csvString = `${boardNumber},`;
        Object.keys(jsonObject).forEach(RD => {
            csvString += `${jsonObject[RD].microHenries},${jsonObject[RD].ohms},`;
        });
        resolve(csvString + "\n");
    })
}


//--------------------------------- FORM PROCESSING from frontend ---------------------------------\\

app.post('/submit-form', (req, res) => { // is activated whenever a get request is seen to be made to submit-form
    let data = req.body.data;           //||
    let number = req.body.boardNumber;  //|| gets the data from the front end (form data (boardNumber) and if the button was valid (data))
    console.log(data + ", " + number); //logs recieved data

    if(data == "testBoard") { // if the button corresponding with testBoard was pressed
        console.log(">> attempting to run jig");    // make jig test board 
        call_visaInterface(number);                  // call function in testBoad.js script which calls python script and adds output to database
    }
    res.end()
});


//--------------------------------- front end databse interaction ---------------------------------\\

app.get('/download', (req, res) => {

    // download csv here
    res.download(__dirname + `/source/dbContents.csv`, (err) => {
        if (err) throw err;
    });
});



// on startup write the header to the csv file if it doesnt already exist

fs.readFile(__dirname + `/source/dbContents.csv`, 'utf8', (err, data) => {
    if(err) {
        fs.writeFileSync(__dirname + `/source/dbContents.csv`, titleString);
    } else {
        if(!data.includes(titleString)) {
            fs.writeFileSync(__dirname + `/source/dbContents.csv`, titleString);
        }
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
