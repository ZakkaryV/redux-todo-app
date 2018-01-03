const express = require('express');
const app = express();
const path = require('path');

// tells express to use the current directory as a default to serve files from
app.use(express.static('./'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
    console.log("Request Recieved");
})

app.listen(8080, () => console.log('App listening on port 8080'));