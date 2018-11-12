var express = require("express")
var app = express()
var http = require("http")
var WebSocket = require("ws")
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require("body-parser")
var db = require("./db/db.js")

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
	res.sendfile("index.html");
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
			var user = db.getUser(username);
			if (password == user.password) {
				db.log(req.ip, "User: " + username + " logged in.")
				req.session.user = JSON.stringify(username);
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
		var newUser = {};
		var userName = req.body.username
		newUser[userName] = { "password": req.body.password };
		console.log("New user created: " + userName);
		db.newUser(req.ip, newUser)
		req.session.user = JSON.stringify(userName);
		res.redirect('/chatroom/chatroom.html');
	}
	catch (error) {
		console.log(error);
		res.redirect('/signup/signup.html');
	}
});
app.get('/getUserName', (req, res) => {
	res.send(req.session.user);
})
//Starts the server
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
server.listen(port, () => {
	console.log(`Server started on port ${server.address().port} :)`);
});