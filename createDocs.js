var DiscoveryV1 = require('ibm-watson/discovery/v1');
var fs = require('fs');
var request = require('request');
var config = require('./config_to');

var discovery = new DiscoveryV1({
    iam_apikey: config.apikey,
    url: config.url,
    version: '2019-04-30'
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

function createDocuments(){
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
        discovery.addDocument({
            environment_id: config.envid,
            collection_id: config.colid,
            file: json,
            file_content_type: 'application/json'
        }, function(err, response){
            if(err){
                console.error(err);
            }else{
                resolve(response.document_id);
            }
        });
    });
}

function checkStatus(docid){
    return new Promise(function(res, rej) {
        function loop() {
            return new Promise(function(resolve, reject) {
                discovery.getDocumentStatus({
                    environment_id: config.envid,
                    collection_id: config.colid,
                    document_id: docid
                }, function(err, response){
                    if(err){
                        console.error(err);
                    }else{
                        resolve(response.status);
                    }
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
            })
            .catch(function(error){
                console.log(error);
            });
        }
    loop();
    });
}

Promise.resolve()
    .then(readDir)
    .then(function(){
        for(var i=0;i<concurrent;i++){
            createDocuments();
        }
     })
    .catch(function(error){
        console.log(error);
    });
