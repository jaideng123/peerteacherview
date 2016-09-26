var express = require('express');
var app = express();
var request = require('request');
var schedule = require('node-schedule');

//check if we have local keys
try {
    var keys = require('./keys.js');
} catch (ex) {
    keys = {};
}

var api_key = keys.parsehub_key || process.env.PARSEHUB_KEY;
var project_key = keys.project_key || process.env.PROJECT_KEY;

var teachers = {};

var fetchTeachers = function(verbose){
	return new Promise(function(resolve,reject){
		request(
	    { method: 'GET'
	    , uri: 'https://www.parsehub.com/api/v2/projects/'+project_key+'/last_ready_run/data?api_key='+api_key
	    , gzip: true
	    }
	  , function (error, response, body) {
	      // body is the decompressed response body
	      if(verbose){
	        console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'));
	        console.log('the decoded data is: ' + body);
	        console.log(error);
	  	  }
	      if(error){
	      	reject(error);
	      }
	      resolve(body);
	    }
	  ).on('data', function(data) {
	    // decompressed data as it is received
	    if(verbose)
	    	console.log('decoded chunk: ' + data);
	  })
	  .on('response', function(response) {
	    // unmodified http.IncomingMessage object
	    response.on('data', function(data) {
	      // compressed data as it is received
	      if(verbose)
	      	console.log('received ' + data.length + ' bytes of compressed data');
	    });
	  });
	});
}

var updateTeachers = function(verbose){
	return new Promise(function(resolve,reject){
		request(
	    { method: 'POST'
	    , uri: 'https://www.parsehub.com/api/v2/projects/'+project_key+'/run?api_key='+api_key
	    , gzip: true
	    }
	  , function (error, response, body) {
	      // body is the decompressed response body
	      if(verbose){
		    console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'));
		    console.log('the decoded data is: ' + body);
		    console.log(error);
	  	  }
	      if(error){
	      	reject(error);
	      }
	      resolve(body);
	    }
	  ).on('data', function(data) {
	    // decompressed data as it is received
	    if(verbose){
	    	console.log('decoded chunk: ' + data);
		}
	  })
	  .on('response', function(response) {
	    // unmodified http.IncomingMessage object
	    response.on('data', function(data) {
	      // compressed data as it is received
	      if(verbose){
	      	console.log('received ' + data.length + ' bytes of compressed data');
	  	  }
	    });
	  });
	});
}
//Set up scheduled tasks so we dont bombard the parsehub API with requests
schedule.scheduleJob('*/1 * * * *', function(){
	console.log("Fetching peer teachers")
  	fetchTeachers().then(function(data){teachers = data;});
  	console.log("Peer teachers fetched")
});
schedule.scheduleJob('* */3 * * *', function(){
	console.log("Starting parsehub run to collect peer teachers")
  	updateTeachers();
  	console.log("Run started");
});
updateTeachers();
fetchTeachers().then(function(data){teachers = data;});
app.get('/api/teachers', function(req,res){
	  res.send(teachers);
});
app.get('/', function(req,res){
	res.sendfile('index.html');
});

app.use(express.static('.'));

var port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Example app listening on port '+port);
});
