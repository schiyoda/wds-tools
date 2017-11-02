var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var fs = require('fs');
var request = require('request');
var config = require('./config_to');

var discovery = new DiscoveryV1({
          url: config.url,
          username: config.username,
          password: config.password,
          version_date: DiscoveryV1.VERSION_DATE_2017_08_01
});

var files;
var concurrent = 20;

function readDir(){
    return new Promise(function(resolve, reject){
        fs.readdir(config.docs_dir, function (err, data) {
            if (err) {
                throw err;
            }else{
                files = data;
                resolve();
            }
        });
    });
}

function importDocuments(){
    return new Promise(function(res,rej){
      function loop(file){
        var importFile = config.docs_dir + file;
        postDocument(importFile)
        .then(checkStatus)
        .then(function(status){
            var nextFile = files.pop();
            if(nextFile === undefined){
                res();
            }else{
                console.log(status.docId + ' : ' + status.status);
                loop(nextFile);
            }
        })
        .catch(function(error){
            console.log(error);
        });
      }
      loop(files.pop());
    });
}

function postDocument(file){
    return new Promise(function(resolve, reject){
        var text = fs.readFileSync(file, 'utf-8');
        var json = JSON.parse(text);
        var docid = json.document_id;
        var metadata = json.extracted_metadata;
        delete json['document_id'];
        delete json['extracted_metadata'];
        discovery.updateDocument({
            environment_id: config.envid,
            collection_id: config.colid,
            document_id: docid,
            file: {
                value: JSON.stringify(json),
                options: metadata
            }
        }, function(err, response){
            if(err){
                console.error(err);
            }else{
                resolve(docid);
            }
        });
    });
}

var url = config.url + '/v1/environments/' +config.envid+ '/collections/' +config.colid+ '/documents/DOC_ID?version=2017-10-16';
var auth = new Buffer(config.username + ':' + config.password).toString('base64');
var headers = {
    'Authorization' : 'Basic ' + auth
};

function checkStatus(docid){
    return new Promise(function(res, rej) {
        function loop() {
            return new Promise(function(resolve, reject) {
                request.get({
                    url: url.replace(/DOC_ID/g, docid),
                    headers:headers
                }, function(error, response, body){
                    var status = JSON.parse(body).status;
                    resolve(status);
                });
            })
            .then(function(status) {
                if (status === 'available') {
                    var docStatus = {};
                    docStatus.docId = docid;
                    docStatus.status = status;
                    res(docStatus);
                } else {
                    loop();
                }
            });
        }
    loop();
    });
}

Promise.resolve()
    .then(readDir)
    .then(function(){
        for(var i=0;i<concurrent;i++){
            importDocuments();
        }
     })
    .catch(function(error){
        console.log(error);
    });

