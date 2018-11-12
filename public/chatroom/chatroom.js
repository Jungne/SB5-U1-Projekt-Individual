window.onload = function () {
    var ws = new WebSocket("ws://localhost:5000");

    var textarea = document.getElementById("textarea")
    var messagebox = document.getElementById("messagebox")
    var sendbutton = document.getElementById("sendbutton")

    ws.onopen = function () {
        console.log("connected succesfully");
    };

    sendbutton.onclick = function () {
        ws.send(messagebox.value);
    }

    ws.onmessage = function (evt) {
        textarea.value += evt.data + "\n";
    };

};