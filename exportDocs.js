var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var fs=require("fs");
var config = require('./config_from');

var numDocsPerQuery = 100;

var discovery = new DiscoveryV1({
          url: config.url,
          username: config.username,
          password: config.password,
          version_date: DiscoveryV1.VERSION_DATE_2017_08_01
});

function countNumDocs(){
    return new Promise(function(resolve,reject){
        discovery.query({
            environment_id: config.envid,
            collection_id: config.colid,
            query: ''
        }, function(err, response) {
            if (err) {
                console.error(err);
            } else {
                var numDocs = response.matching_results;
                console.log('Number of documents: ',numDocs);
                resolve(numDocs);
            }
        });  
    });
};

function exportDocument(numDocs){
    var numLoop = Math.floor(numDocs / numDocsPerQuery ) + 1;
    new Promise(function(res,rej){
        function loop(i){
            return new Promise(function(resolve, reject) {
                discovery.query({
                    environment_id: config.envid,
                    collection_id: config.colid,
                    query: '',
                    count: numDocsPerQuery,
                    offset: numDocsPerQuery * i
                }, function(err, response) {
                    if (err) {
                        console.error(err);
                    } else {
                        var results = response.results;
                        var j;
                        for(j=0;j<results.length;j++){
                            var docId = results[j].id;
                            results[j].document_id = docId;
                            delete results[j]['id'];
                            delete results[j]['score'];
                            var filename = config.docs_dir + docId + ".json";
                            fs.writeFileSync(filename,JSON.stringify(results[j]));
                        }
                        console.log('Export ' + j + ' documents');
                        resolve(i+1);
                    }
                });
            }).then(function(count){
                if(count>=numLoop){
                    res();
                }else{
                    loop(count);
                }
            });           
        }
        loop(0);
    });
}

Promise.resolve()
    .then(countNumDocs)
    .then(exportDocument)
    .catch(function(error){
       console.log(error)
    });

