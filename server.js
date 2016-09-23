var express = require('express');
var app = express();
var request = require('request');
try {
    var keys = require('./keys.js');
    // do stuff
} catch (ex) {
    keys = {};
}

var api_key = keys.parsehub_key || process.env.PARSEHUB_KEY;
var project_key = keys.project_key || process.env.PROJECT_KEY;

app.get('/api/teachers', function(req,res){
	  request(
	    { method: 'GET'
	    , uri: 'https://www.parsehub.com/api/v2/projects/'+project_key+'/last_ready_run/data?api_key='+api_key
	    , gzip: true
	    }
	  , function (error, response, body) {
	      // body is the decompressed response body
	      console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
	      console.log('the decoded data is: ' + body)
	      res.send(body);
	    }
	  ).on('data', function(data) {
	    // decompressed data as it is received
	    console.log('decoded chunk: ' + data);
	  })
	  .on('response', function(response) {
	    // unmodified http.IncomingMessage object
	    response.on('data', function(data) {
	      // compressed data as it is received
	      console.log('received ' + data.length + ' bytes of compressed data');
	    });
	  });
});
app.get('/', function(req,res){
	res.sendfile('index.html')
});

app.use(express.static('.'));
var port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Example app listening on port '+port);
});
