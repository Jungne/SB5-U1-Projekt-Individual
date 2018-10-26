window.onload = function () {
    let signUpButton = document.getElementById("sign-up-button")
    signUpButton.onclick = () => {
        console.log("Request the signup page")
    }

    let signInButton = document.getElementById("sign-in-button")
    signInButton.onclick = () => {
        console.log("Request the signin page")
    }
}