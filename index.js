const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');

const test = require('./source/testBoard');

app.use(express.static('source'));
app.use(express.urlencoded());          // allows the python interface


app.get('/', function (req, res) {      //serves dash (page.html) as front page 
    res.sendFile('page.html', {root: './source'});
});

app.post('/submit-form', (req, res) => { // is activated whenever a get request is seen to be made to submit-form
    let data = req.body.data;           //||
    let number = req.body.boardNumber;  //|| gets the data from the front end (form data (boardNumber) and if the button was valid (data))
    console.log(data + ", " + number); //logs recieved data

    if(data == "testBoard") { // if the button corresponding with testBoard was pressed
        console.log(">> attempting to run jig");    // make it test board 
        test.call_visaInterface(number);                  // call function in testBoad.js script which calls python script and adds output to database
    }
    res.end()
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));




/* TODO:
* python script
*   > connect python script to lcr meter on pi ( may need to update python or add pyvisa to path )
*   > make python script connect to gpio pins and iterate through the relay while recording data through visa interface: return results through json
* index.js
*   > recieve board number from page.html and parse that + the json file contents into db
*       - might have to investigate callbacks for this so it synchronises with the completion of the python script
* database module
*   > have method to take json and input number and add it to a database, collate all rd values into one row
*   > method to create csv spreadsheet from sorted database and return it to the user
*/