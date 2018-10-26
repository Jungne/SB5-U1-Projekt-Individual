window.onload = function () {
  let signUpButton = document.getElementById("sign-up-button")
  signUpButton.onclick = () => {
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    if (!username || !password) {
      console.log("Fill in username and password")
      return
    }
    let params = {}
    params.username = username
    params.password = password
    const Http = new XMLHttpRequest();
    const url = '/newUser';
    Http.open("POST", url, true);
    Http.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    Http.send(JSON.stringify(params));
    Http.onreadystatechange = (e) => { console.log(Http.responseText) }
  }

  let cancelButton = document.getElementById("cancel-button")
  cancelButton.onclick = () => {
    //console.log("Request the homepage")
  }
}