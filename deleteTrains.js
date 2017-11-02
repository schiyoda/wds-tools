var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var readlineSync = require('readline-sync');
var request = require('request');
var config = require('./config_to');

discovery = new DiscoveryV1({
          url: config.url,
          username: config.username,
          password: config.password,
          version_date: DiscoveryV1.VERSION_DATE_2017_08_01
        });

function checkCollection(){
    return new Promise(function(resolve,reject){
        discovery.getCollection({
            environment_id: config.envid,
            collection_id: config.colid,
        }, function(err, response) {
            if (err) {
                console.error(err);
            } else {
                var answer = readlineSync.question('Delete training data from collection ' + response.name + '. [y/n]: ',{
                    trueValue:['y','Y','yes','Yes'],
                    falseValue:['n','N','no','No']
                });
                if(answer === true){
                    resolve();
                } else if(answer === false){
                    reject('Canceled');
                }
            }
        });
    });
};


var url = config.url + '/v1/environments/' +config.envid+ '/collections/' +config.colid+ '/training_data?version=2017-10-16';
var auth = new Buffer(config.username + ':' + config.password).toString('base64');
var headers = {'Authorization' : 'Basic ' + auth};

function deleteTrains(){
    return new Promise(function(resolve, reject) {
        request.del({
            url: url,
            headers:headers
        }, function(error, response, body){
            console.log('Deleted');
            resolve();
        });
    });
}

Promise.resolve()
    .then(checkCollection)
    .then(deleteTrains)
    .catch(function(error){
       console.log(error)
    });


