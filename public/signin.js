// it will hold the data about users
window.onload = function () {
	let usersArray = [];
	let login = document.getElementById("log-in-button");
	let username = document.getElementById("login").value;
	let password = document.getElementById("password").value;
	updateUsersFromDB();
	login.addEventListener("click", function () {

		debugger;
		//should we call a webservice here ? is better :)
		if (isLoginAndPasswordGreat() == true) {
			//goto index.html
			alert("Du er nu logget ind");
			window.location.href = "index.html"; // uden domæne opsat.
			//window.location.href = "/index.html"; // bedst med domæne opsat.
		}
		else {
			//output error
			alert("Forkert login");
		}
	});
	function isLoginAndPasswordGreat() {
		let username = document.getElementById("login").value;
		let password = document.getElementById("password").value;
		user = usersArray.find(x => x.username == username)
		if (user != null && user.password == password) {
			return true;
		}
		return false;
	}
	function updateUsersFromDB() {
		fetch("http://localhost:5000/getUsers")
			.then((response) => response.json())
			.then(function (users) {
				for (let user in users) {
					usersArray.push({ "username": user, "password": users[user].password });
				}


			})
	}


};