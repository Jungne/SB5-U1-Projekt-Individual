var express = require("express")
var app = express()

const port = 3000; 

app.use(express.static('public'));

//Routes
app.get('/hello', function (req, res) {
  res.send("hello");
})

//Starts the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))