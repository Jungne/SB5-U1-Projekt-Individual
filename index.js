var express = require("express")
var app = express()
var JsonDB = require('node-json-db')
var db = new JsonDB("database", true, true);

const port = 3000; 

app.use(express.static('public'));

//Routes
app.get('/hello', function (req, res) {
  res.send("hello");
})

app.get('/dbtest', function (req, res) {
  res.send(db.getData("/"));
})

app.post('/newUser', function (req, res) {
  db.push("/users/" + req.query.username , {"password": req.query.password})
  res.send("its all good");
})

//Starts the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))