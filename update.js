var request = require('request');
//check if we have local keys
try {
    var keys = require('./keys.js');
} catch (ex) {
    keys = {};
}

var api_key = keys.parsehub_key || process.env.PARSEHUB_KEY;
var project_key = keys.project_key || process.env.PROJECT_KEY;

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

console.log("Starting parsehub run to collect peer teachers")
updateTeachers();
console.log("Run started");