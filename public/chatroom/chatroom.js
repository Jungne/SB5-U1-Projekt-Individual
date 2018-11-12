window.onload = function () {
    var ws = new WebSocket("ws://" + location.host);

    var textarea = document.getElementById("textarea")
    var messagebox = document.getElementById("messagebox")
    var sendbutton = document.getElementById("sendbutton")

    var userName = "Anonymous"

    ws.onopen = function () {
        console.log("connected succesfully");
        getUserName()
        .then(data => userName = data)
        console.log(userName)
    };

    sendbutton.onclick = function () {
        ws.send(userName + ": " + messagebox.value);
    }

    ws.onmessage = function (evt) {
        textarea.value += evt.data + "\n";
    };

};

function getUserName() {
    return fetch("/getUserName")
    .then(res => res.json())
}