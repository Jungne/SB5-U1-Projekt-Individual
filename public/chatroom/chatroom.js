window.onload = function () {
    var Socket = new WebSocket("ws://localhost:8080/");

    ws.onopen = function () {
        console.log("connected succesfully");
        ws.send("Hello server! - client");
    };
};