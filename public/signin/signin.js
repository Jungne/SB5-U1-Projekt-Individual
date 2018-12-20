window.onload = function () {
    var loginbutton = document.getElementById("login-button")
    var cancelbutton = document.getElementById("cancel-button")

    loginbutton.onclick = function () {
        let username = document.getElementById("username").value
        let password = document.getElementById("password").value
        if (!username || !password) {
            console.log("Fill in username and password")
            return
        }
        let params = {}
        params.username = username
        params.password = password
        const Http = new XMLHttpRequest()
        const url = '/signin'
        Http.open("POST", url, true)
        Http.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        Http.send(JSON.stringify(params))
        Http.onreadystatechange = (e) => {
            console.log(Http.responseText)
            if (Http.responseText == "success") {
                window.location.href = "../chatroom"
            }
        }
    }

    cancelbutton.onclick = function () {
        window.location.href = "../index.html"
    }

};