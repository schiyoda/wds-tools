var fs = require('fs');
var csv = require('csvtojson');
var config = require('./config_to');

var csvFilePath=process.argv[2];
var i = 0;

csv()
.fromFile(csvFilePath)
.on('json', function(json){
    fs.writeFileSync(config.docs_dir + 'json-' + i + '.json', JSON.stringify(json,null,'    '));
    i++;
})
.on('done',function(error){
    console.log('end')
})

