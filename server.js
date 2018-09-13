var express = require("express");
var app = express();
var fetch = require("node-fetch");
var schedule = require("node-schedule");

//check if we have local keys
try {
  var keys = require("./keys.js");
} catch (ex) {
  keys = {};
}

var api_key = keys.parsehub_key || process.env.PARSEHUB_KEY;
var project_key = keys.project_key || process.env.PROJECT_KEY;

var teachers = {};

var fetchTeachers = function(verbose) {
  return fetch(
    `https://www.parsehub.com/api/v2/projects/${project_key}/last_ready_run/data?api_key=${api_key}`
  ).then(res => {
    return res.json();
  });
};

//Set up scheduled tasks so we dont bombard the parsehub API with requests
schedule.scheduleJob("*/30 * * * *", function() {
  console.log("Fetching peer teachers");
  fetchTeachers().then(function(data) {
    teachers = data;
  });
  console.log("Peer teachers fetched");
});

console.log("Grabbing initial data");
fetchTeachers().then(function(data) {
  teachers = data;
});

app.get("/api/teachers", function(req, res) {
  res.send(teachers);
});
app.get("/", function(req, res) {
  res.sendFile("dist/newpeerteacherview/index.html", { root: __dirname });
});

app.use(express.static("dist/newpeerteacherview"));

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Example app listening on port " + port);
});
