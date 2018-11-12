var express = require("express")
var app = express()
var http = require("http")
var WebSocket = require("ws")
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require("body-parser")
var JsonDB = require('node-json-db')
var db = new JsonDB("database", true, true);

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//from: https://www.codementor.io/mayowa.a/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3?fbclid=IwAR2uT--Fi394bUHW6YO2esKbzqCugODOZptk2Ks7fNxru-KdDhcJ7hww_z8
app.use(cookieParser());
app.use(session({
	key: 'user_sid',
	secret: 'somerandonstuffs',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000
	}
}));
app.use((req, res, next) => {
	if (req.cookies.user_sid && !req.session.user) {
		res.clearCookie('user_sid');
	}
	next();
});
var sessionChecker = (req, res, next) => {
	if (req.session.user && req.cookies.user_sid) {
		next();
	} else {
		return res.redirect('/signin');
	}
};

//Websocket
wss.on('connection', (ws) => {

	//connection is up, let's add a simple simple event
	ws.on('message', (message) => {

		//log the received message and send it back to the client
		console.log('received: %s', message);

		wss.clients.forEach(client => {
			client.send(message);
		});
	});
});

//Routes
app.get('/index', sessionChecker, (req, res) => {
	console.log("index - becase / is taken over by app.user static files");
	res.sendfile("index.html");
})

app.get('/hello', sessionChecker, (req, res) => {
	res.send("hello dudes");
})

app.get('/dbtest', function (req, res) {
	res.send(db.getData("/"));
})

app.post('/newUser', function (req, res) {
	db.push("/users/" + req.body.username, { "password": req.body.password })
	res.send("Created new user.");
	console.log("Created new user.")
	log(req.ip, "Created new user: " + req.body.username)
})

app.get('/getUsers', function (req, res) {
	res.send(db.getData("/users"));
	console.log("List of users requested.")
	log(req.ip, "List of users requested.")
})

app.route('/signin')
	.get(function (req, res) {
		res.sendFile(__dirname + '/public/signin/signin.html');
	})
	.post((req, res) => {
		var username = req.body.username,
			password = req.body.password;
		console.log(username + " " + password);
		try {
			var user = db.getData("/users/" + username);
			if (password == user.password) {
				req.session.user = JSON.stringify(user);
				res.redirect('/chatroom/chatroom.html');
			}
			else {
				res.redirect('/signin');
				console.log("Wrong password and/or login. Try again")

			}
		}
		catch (error) {
			res.redirect('/signin');
			console.log("no redirect. user not found")
		}
	});

app.get('/logout', (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.clearCookie('user_sid');
		res.redirect('/');
	} else {
		res.redirect('/signin');
	}
});

app.post('/signup', (req, res) => {
	try {
		/*
		* parsen cannot work without variable
		*from: https://www.npmjs.com/package/node-json-db
		*/
		var newuser = {};
		newuser[req.body.username] = { "password": req.body.password };
		console.log(newuser);
		db.push("/users", newuser, false);

		var user = db.getData("/users/" + req.body.username);
		req.session.user = JSON.stringify(user);
		res.redirect('/chatroom/chatroom.html');
	}
	catch (error) {
		console.log(error);
		res.redirect('/signup/signup.html');
	}
});

//Starts the server
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
server.listen(port, () => {
	console.log(`Server started on port ${server.address().port} :)`);
});

//Function for logging data from requests
function log(ip, desc) {
	db.push("/logs[]", {
		"timestamp": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
		"ip": ip,
		"description": desc
	})
}