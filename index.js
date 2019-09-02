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
        test.call_visaInterface();                  // call function in testBoad.js script which calls python script
    }
    res.end()
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));