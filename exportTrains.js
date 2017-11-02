var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var fs=require("fs");
var request = require('then-request');
var config = require('./config_from');

var discovery = new DiscoveryV1({
          url: config.url,
          username: config.username,
          password: config.password,
          version_date: DiscoveryV1.VERSION_DATE_2017_08_01
});

var url = config.url + '/v1/environments/' +config.envid+ '/collections/' +config.colid+ '/training_data?version=2017-10-16';
var auth = new Buffer(config.username + ':' + config.password).toString('base64');
var headers = {
    'Authorization' : 'Basic ' + auth
};

request('GET',url ,{headers:headers}).done(function(res){
    var tmp= console.log((res.getBody('utf-8')));
    var queries = JSON.parse(res.getBody('utf-8')).queries;
    for(var i=0; i<queries.length; i++){
        delete queries[i]['filter'];
        delete queries[i]['query_id'];
        delete queries[i]['created'];
        delete queries[i]['updated'];
        for(var j=0; j<queries[i].examples.length; j++){
            delete queries[i].examples[j]['cross_reference'];
            delete queries[i].examples[j]['created'];
            delete queries[i].examples[j]['updated'];
        }
        console.log(queries[i]);
        fs.writeFileSync(config.trains_dir + "train" +i+ ".json",JSON.stringify(queries[i]));
    }
});
