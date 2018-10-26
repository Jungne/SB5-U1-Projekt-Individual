var express = require("express")
var app = express()
var JsonDB = require('node-json-db')
var db = new JsonDB("database", true, true);

const port = 3000; 

app.use(express.static('public'));

//Routes
app.get('/hello', function (req, res) {
  res.send("hello dudes");
})

app.get('/dbtest', function (req, res) {
  res.send(db.getData("/"));
})

app.post('/newUser', function (req, res) {
  if (req.body.username && req.body.password) {
    db.push("/users/" + req.body.username , {"password": req.body.password})
    res.send("its all good");
    console.log("Created new user.")
  }
  else { 
    console.log("Something went wrong.")
  }
  
})

app.get('/getUsers', function (req, res) {
  res.send(db.getData("/users"));
  console.log("List of users requested.")
})

//Starts the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))