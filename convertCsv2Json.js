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

/* 
converter.on("end_parsed", function (jsonArray) {
    for(var i=0; i<jsonArray.length; i++){
        fs.writeFile(jsons + 'json-' + i + '.json', JSON.stringify(jsonArray[i],null,'    '));
        //console.log(jsonArray[i]);
    }
    console.log("Converted to JSON files.");
});
 
require("fs").createReadStream(process.argv[2]).pipe(converter);
*/
