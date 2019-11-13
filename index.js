var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var mime = require('mime');
var wss = require('./websockets-server');

var handleError = function(err, res) {
  res.writeHead(404, {
    'Content-Type': 'text/html'
  });
  //bronse challenge send error to error.html
  res.end('<meta http-equiv="Refresh" content="0; url=/error.html" />');
};

var server = http.createServer(function(req, res) {
  console.log('Responding to a request.');
  var filePath = extract(req.url);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      handleError(err, res);
      return;
    } else {
      //silver challenge set Content-Type dynamically
      var contentType = mime.getType(filePath)
      res.setHeader('Content-Type', contentType);
      res.end(data);
    }
  });
});
server.listen(3000);
