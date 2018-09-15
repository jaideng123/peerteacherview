var request = require("request");
var fetch = require("node-fetch");
//check if we have local keys
try {
  var keys = require("./keys.js");
} catch (ex) {
  keys = {};
}

var api_key = keys.parsehub_key || process.env.PARSEHUB_KEY;
var project_key = keys.project_key || process.env.PROJECT_KEY;

var triggerParsehubRun = function(verbose) {
  return fetch(
    `https://www.parsehub.com/api/v2/projects/${project_key}/run?api_key=${api_key}`,
    { method: "POST" }
  );
};

console.log("Starting parsehub run to collect peer teachers");
triggerParsehubRun().then(result => {
  console.log(result);
  console.log("Run started");
});
