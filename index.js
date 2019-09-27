const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');

app.use(express.static('source'));
app.use(express.urlencoded());          // allows the python interface

const appDir = 'home/pi/nodeServerEtc';

app.get('/', (req, res) => {      //serves dash (page.html) as front page 
    res.sendFile('page.html', {root: appDir + '/source'});
});



//--------------------------------- TO show test status to front end (post connects to testboard.js and get connects to page.html) ---------------------------------\\
var currentTest = ""; // the variable that is routed to the front end ajax

app.get('/result', (req, res) => {
    res.send(currentTest);
});


//--------------------------------- testBoard (call python interface) ---------------------------------\\

const manager = require(appDir + '/source/dbManager'); //load the database manager which also tests whether the boards return valid results 

//function to make the visa interface python script run and then put the results in a json file the server

call_visaInterface = function (boardNumber) {

    var spawn = require("child_process").spawn;
    var process = spawn('python3', [appDir +"/source/visaInterface.py"]);
    let dataString = '';
    console.log(" >> loaded python attempting to gain output: ")
    
    currentTest = "loading python subroutine"; //the current test variable is the message routed to the front-ened

    process.stdout.on('data', function (data) {         //data is everything that has been printed and flushed to the stdout from the python script
        dataString += data.toString();                  //TODO: use this line to get error messages to the front end properly 
                                                        //   especially seeings how the data is put into a json file rather 
                                                        //   rather than the output stream
        currentTest = data.toString();
        console.log(currentTest);
    });

    process.stdout.on('end', function () { // calls once the python script finishes
        //JSON.parse(dataString);
        currentTest = null;
        let data = JSON.parse(fs.readFileSync(appDir + '/source/results.json'));
        
        //console.log(" >> RD1 values: " + data.rd1.microHenries + ", " + data.rd1.ohms);
        currentTest = manager.addJsonToDB(boardNumber, data);
    });
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));



// -- download stuff (in test)

app.get('/download', (req, res) => {
    manager.convertDbToCsv(function() {
        res.download(appDir +'/source/dbContents.csv', (err) => {
            if (err) throw err;
        });
    });
});

/*
app.get('/shutdown', (req, res) => {
    process.exit();
});

//manager.convertDbToCsv();

 TODO:
*/