window.onload = function () {
    var ws = new WebSocket("ws://localhost:5000");

    ws.onopen = function () {
        console.log("connected succesfully");
        ws.send("Hello server! - client");
    };

    ws.onmessage = function (evt) {
        console.log(evt.data);
    };
};