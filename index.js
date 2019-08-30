const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const test = require('./source/testBoard');

app.use(express.static('source'));
app.use(express.urlencoded())


app.get('/', function (req, res) {
        res.sendFile('page.html', {root: './source'});
    });

app.post('/submit-form', (req, res) => { // is activated whenever a get request is recieved to submit-form
    let data = req.body.data;
    let number = req.body.boardNumber;
    console.log(data + ", " + number);

    if(data == "testBoard") {
        console.log(">> attempting to run jig"); // make it test board 
        test.call_visaInterface();
    }
    res.end()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))