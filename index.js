var http = require('http');
var fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer(function (req, res) {
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}).listen(port);


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});