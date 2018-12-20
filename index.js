var express = require("express")
var app = express()
var http = require("http")
var WebSocket = require("ws")
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require("body-parser")
var db = require("./db/db.js")
const bcrypt = require("bcrypt")

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
		return res.redirect('/signin/signin.html');
	}
};

//Websocket
wss.on('connection', (ws) => {

	//connection is up, let's add a simple simple event
	ws.on('message', (message) => {

		//log the received message and send it back to the client
		db.logChat(message)
		console.log('Message: %s', message);

		wss.clients.forEach(client => {
			client.send(message);
		});
	});
});

//Routes
app.get('/index', sessionChecker, (req, res) => {
	console.log("index - becase / is taken over by app.user static files");
	res.sendFile("index.html");
})

app.post('/signin', (req, res) => {
	let username = req.body.username
	let password = req.body.password
	try {
		let user = db.getUser(username)
		if (password == user.password) {
			req.session.user = JSON.stringify(username)
			res.send("success")

		}
		else {
			res.send("bad password")
		}
	}
	catch (error) {
		res.send("user not found")
	}
})

app.get('/logout', (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.clearCookie('user_sid');
		res.redirect('/');
	} else {
		res.redirect('/signin/signin.html');
	}
});

app.post('/signup', (req, res) => {
	try {
		var newUser = {};
		var userName = req.body.username
		var password = req.body.password

		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(password, salt, function(err, hash) {
				console.log(hash)
				newUser[userName] = {"password": hash}
				db.newUser(req.ip, newUser)
			});
		});

		console.log("New user created: " + userName);
		req.session.user = JSON.stringify(userName);
		res.redirect('/chatroom');
	}
	catch (error) {
		console.log(error);
		res.redirect('/signup/signup.html');
	}
});

app.get('/getUserName', (req, res) => {
	res.send(req.session.user);
})

app.get('/chatroom', sessionChecker, (req, res) => {
	res.sendfile("html/chatroom.html");
})

//Starts the server
server.listen(port, () => {
	console.log(`Server started on port ${server.address().port} :)`);
});