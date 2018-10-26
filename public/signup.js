window.onload = function () {
  let signUpButton = document.getElementById("sign-up-button")
  signUpButton.onclick = () => {
      console.log("Post signup request")
  }

  let cancelButton = document.getElementById("cancel-button")
  cancelButton.onclick = () => {
      console.log("Request the homepage")
  }
}