var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var readlineSync = require('readline-sync');
var config = require('./config_to');

var numDocsPerQuery = 100;

var discovery = new DiscoveryV1({
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
                var answer = readlineSync.question('Delete ' + response.document_counts.available + ' documents from collection ' + response.name + '. [y/n]: ',{
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

function deleteDocument(){
    new Promise(function(res,rej){
        function loop(){
            return new Promise(function(resolve, reject) {
                discovery.query({
                    environment_id: config.envid,
                    collection_id: config.colid,
                    query: '',
                    count: numDocsPerQuery,
                }, function(err, response) {
                    if (err) {
                        console.error(err);
                    } else {
                        var count = response.results.length;
                        if(count !== 0){
                            for(var j =0; j<response.results.length;j++){
                                discovery.deleteDocument({
                                    environment_id: config.envid,
                                    collection_id: config.colid,
                                    document_id: response.results[j].id
                                },function(err,response){
                                    if(err){
                                        console.error(err);
                                    }else{
                                        console.log(response.document_id + ' : ' + response.status);
                                    }
                                });
                            }
                        }
                        resolve(count);
                    }
                });
            }).then(function(count){
                if(count === 0){
                    res();
                }else{
                    loop();
                }
            });
        }
        loop();
    });
}

Promise.resolve()
    .then(checkCollection)
    .then(deleteDocument)
    .catch(function(error){
       console.log(error)
    });

