window.onload = function () {
  let signUpButton = document.getElementById("sign-up-button")
  signUpButton.onclick = () => {
    console.log("Post signup request")
    const Http = new XMLHttpRequest();
    const url = '/hello';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
      console.log(Http.responseText)
    }
  }

  let cancelButton = document.getElementById("cancel-button")
  cancelButton.onclick = () => {
    //console.log("Request the homepage")
  }
}