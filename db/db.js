var JsonDB = require('node-json-db')
var userdb = new JsonDB("./db/userdb", true, true)
var logdb = new JsonDB("./db/logdb", true, true)
var chatdb = new JsonDB("./db/chatdb", true, true)

module.exports = {
	//Function for logging data from requests.
	log: function (ip, desc) {
		logdb.push("/logs[]", {
			"timestamp": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
			"ip": ip,
			"description": desc
		})
	},
	//Creates a new user.
	newUser: function (ip, newUser) {
		userdb.push("/users", newUser, false);
		this.log(ip, "New user created: " + newUser)
	},
	//Gets a user
	getUser: function (userName) {
		console.log(userdb.getData("/users/" + userName))
		return userdb.getData("/users/" + userName)
	},
	//Logs chat message
	logChat: function (message) {
		chatdb.push("/chatlog[]", {
			"timestamp": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
			"message": message
		})
	}
};