var fs = require('fs'),
    xml2js = require('xml2js'),
    child  = require('child_process'); 
    
var inputFile='logFileTest';
var contents = fs.readFileSync(inputFile)
console.log(contents)
