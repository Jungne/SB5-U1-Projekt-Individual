const express = require("express")
const app = express()
const http = require("http")
const WebSocket = require("ws")
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require("body-parser")
const db = require("./db/db.js")
const bcrypt = require("bcryptjs")
const validator = require("validator")

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
	ws.on('message', (message) => {
		//sanitize the input
		message = validator.escape(message)

		//logs the received message
		db.logChat(message)
		console.log('Message: %s', message);

		//sends the message to all connected clients
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

	if (validator.isAlphanumeric(username, ['da-DK']) && validator.isLength(password, { min: 5 })) {
		try {
			let user = db.getUser(username)

			bcrypt.compare(password, user.password, function(err, pwres) {
				if (pwres == true) {
					req.session.user = JSON.stringify(username)
					res.send("success")
				}
				else {
					res.send("bad password")
				}
			});			
		}
		catch (error) {
			res.send("user not found")
		}
	}	
	else {
		res.send("username or password rejected")
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
	var newUser = {};
	var userName = req.body.username
	var password = req.body.password

	if (validator.isAlphanumeric(userName, ['da-DK']) && validator.isLength(password, { min: 5 })) {
		try {

			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(password, salt, function(err, hash) {
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
	}
	else {
		res.send("username or password rejected")
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