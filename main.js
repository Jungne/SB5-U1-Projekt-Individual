window.onload = function () {
    var signUpButton = document.getElementById("sign-up-button")
    signUpButton.onclick = () => {
        console.log("Signing up......")
    }

    var signInButton = document.getElementById("sign-in-button")
    let currentColor = "yellow"
    signInButton.onclick = () => {
        currentColor = currentColor == "yellow" ? "purple" : "yellow"
        signInButton.style.backgroundColor = currentColor
    }
}