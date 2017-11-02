var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var fs=require("fs");
var request = require('then-request');
var config = require('./config_to');

var discovery = new DiscoveryV1({
          url: config.url,
          username: config.username,
          password: config.password,
          version_date: DiscoveryV1.VERSION_DATE_2017_08_01
});

var files;

var url = config.url + '/v1/environments/' +config.envid+ '/collections/' +config.colid+ '/training_data?version=2017-10-16';
var auth = new Buffer(config.username + ':' + config.password).toString('base64');

function readDir(){
    return new Promise(function(resolve, reject){
        fs.readdir(config.trains_dir, function (err, data) {
            if (err) {
                throw err;
            }else{
                files = data;
                resolve();
            }
        });
    });
}

function importTrains(){
    return new Promise(function(res,rej){
      function loop(file){
        return new Promise(function(resolve, reject) {
            var importFile = config.trains_dir + file;
            var text = fs.readFileSync(importFile, 'utf-8');
            var json = JSON.parse(text);
            var headers = {
                'Authorization' : 'Basic ' + auth,
                'Content-Type' : 'application/json'
            };
            request('POST',url, {headers:headers, json:json}).getBody('utf8').then(JSON.parse).done(function(res){
                console.log(res);
                resolve();
            });
        })
        .then(function(){
            var nextFile = files.pop();
            if(nextFile === undefined){
                res();
            }else{
                loop(nextFile);
            }
        })
    }
    loop(files.pop());
  });
}

Promise.resolve()
    .then(readDir)
    .then(importTrains)
    .catch(function(error){
        console.log(error);
    });



