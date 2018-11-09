var express = require("express")
var app = express()
var http = require("http")
var WebSocket = require("ws")
var bodyParser = require("body-parser")
var JsonDB = require('node-json-db')
var db = new JsonDB("database", true, true);

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Websocket
wss.on('connection', (ws) => {

  //connection is up, let's add a simple simple event
  ws.on('message', (message) => {

      //log the received message and send it back to the client
      console.log('received: %s', message);
      ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection    
  ws.send('Hi there, I am a WebSocket server');
});

//Routes
app.get('/', function (req, res) {
  res.sendfile("index.html");
})

app.get('/hello', function (req, res) {
  res.send("hello dudes");
})

app.get('/dbtest', function (req, res) {
  res.send(db.getData("/"));
})

app.post('/newUser', function (req, res) {
    db.push("/users/" + req.body.username , {"password": req.body.password})
    res.send("Created new user.");
    console.log("Created new user.")
    log(req.ip, "Created new user: " + req.body.username)
})

app.get('/getUsers', function (req, res) {
  res.send(db.getData("/users"));
  console.log("List of users requested.")
  log(req.ip, "List of users requested.")
})

//Starts the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//Function for logging data from requests
function log(ip, desc) {
  db.push("/logs[]", {
    "timestamp": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    "ip": ip,
    "description": desc
  })
}