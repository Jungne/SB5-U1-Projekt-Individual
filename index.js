var express = require("express")
var app = express()

const port = 3000; 

app.use(express.static('public'));

app.get('/test', function (req, res) {
  res.send("hello");
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))