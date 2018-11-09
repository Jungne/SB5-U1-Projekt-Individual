var express = require("express")
var app = express()
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require("body-parser")
var JsonDB = require('node-json-db')
var db = new JsonDB("database", true, true);

const port = process.env.PORT || 5000;

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

//Routes
app.get('/index', sessionChecker,(req, res) => {
	console.log("index - becase / is taken over by app.user static files");
  	res.sendfile("index.html");
})

app.get('/hello',sessionChecker, (req, res) => {
  	res.send("hello dudes");
})

app.get('/dbtest', function (req, res) {
  res.send(db.getData("/"));
})

app.post('/newUser', function (req, res) {
    db.push("/users/" + req.body.username , {"password": req.body.password})
    res.send("its all good");
    console.log("Created new user.")
})

app.get('/getUsers', function (req, res) {
  res.send(db.getData("/users"));
  console.log("List of users requested.")
})
app.route('/signin')
    .get(function (req, res) {
        res.sendFile(__dirname + '/public/signin.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;
            console.log(username +" "+ password);
            try {
            var user = db.getData("/users/"+ username);
            	if(password == user.password){
            		req.session.user = JSON.stringify(user);
            		res.redirect('/index.html');
            	}
            	else{
            		res.redirect('/signin');
            		console.log("Wrong password and/or login. Try again")

            	}
        	}
        	catch(error)
        	{
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

//Starts the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))