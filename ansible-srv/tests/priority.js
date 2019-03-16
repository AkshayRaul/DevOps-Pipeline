var fs = require('fs'),
    child = require('child_process');
var HashMap = require('hashmap');

if (process.env.NODE_ENV != "test") {
    var map = new HashMap();
    for (var j = 1; j <= 100; j++) {
        var testReport = '../logs/' + j;


        var fs = require('fs'),
            path = require('path')

        filePath = path.join(testReport);
        var file= fs.readFileSync(testReport)
        setMap(file.toString(),map)
       
    }
    var keys = map.keys()
    
    for (key in keys) {
        var stat=map.get(keys[key])
        stat.timeElapsed=stat.timeElapsed/stat.runs;
        map.set(keys[key],stat);
  
    }
    sortedLog = sortProperties(map);
    console.log(sortedLog);

}
function setMap(data,map){
    if (true) {
        var re = /BUILD [A-Z]*/g;
        var r = data.match(re) + '';
        var stringArrayStatus = r.split(/(\s+)/);
        var status = stringArrayStatus[2]

        var tr = /Total time: .*/g;
        var t = data.match(tr) + '';
        var stringArrayTime = t.split(/(\s+)/);
        var time = stringArrayTime[4]
        var functionName = /INFO] Tests run: .*/g;
        var func = data.match(functionName) + '';
        var info_split = func.split('INFO]');
        var errorName = /ERROR] Tests run: .*/g;
        var errorFunc = data.match(errorName) + '';
        var error_split = errorFunc.split('ERROR]');
        	//console.log(error_split)
        for (var i = 1; i < info_split.length - 1; i++) {
            var tuple = info_split[i];
            //console.log(tuple)
            var tupleArray = tuple.split(/(\s+)/);
            var runs = tupleArray[6]
            runs = runs.replace(/,\s*$/, "");
            var failure = tupleArray[10]
            failure = failure.replace(/,\s*$/, "");
            var time_elapsed = tupleArray[24]
            var function_name = tupleArray[32]
            var stringArrayfunc = function_name.split(".")
            function_name = stringArrayfunc[5]
            function_name = function_name.replace(/,\s*$/, "")

            if (map.has(function_name)) {
                testfailed = parseInt(map.get(function_name).testFailures) + parseInt(failure);
                timeElapsed = parseFloat(map.get(function_name).timeElapsed) + parseFloat(time_elapsed)
                totalRuns=parseInt(map.get(function_name).runs)+parseInt(runs)
                map.set(function_name, {
                    "testFailures": parseInt(testfailed),
                    "timeElapsed": parseFloat(timeElapsed),
                    "runs":parseInt(totalRuns)
                })
            } else {
                map.set(function_name, {
                    "testFailures": parseInt(failure),
                    "timeElapsed": parseFloat(time_elapsed),
                    "runs":parseInt(runs)
                })
            }
        }

        for (var i = 1; i < error_split.length - 1; i++) {

            var tuple = error_split[i];
            // console.log(tuple);
            var tupleArray = tuple.split(/(\s+)/);
            var runs = tupleArray[6]
            runs = runs.replace(/,\s*$/, "");
            var failure = tupleArray[10]
            failure = failure.replace(/,\s*$/, "");
            var time_elapsed = tupleArray[24]
            var function_name = tupleArray[36]
            var stringArrayfunc = function_name.split(".")
            function_name = stringArrayfunc[5]
            // console.log(function_name)
            function_name = function_name.replace(/,\s*$/, "")
            // console.log("runs is" + runs + " failure is " + failure + " time elapsed is " + time_elapsed + " function name is" + function_name)
            if (map.has(function_name)) {
                testfailed = parseInt(map.get(function_name).testFailures) + parseInt(failure);
                timeElapsed = parseFloat(map.get(function_name).timeElapsed) + parseFloat(time_elapsed)
                totalRuns=parseInt(map.get(function_name).runs)+parseInt(runs)
                map.set(function_name, {
                    "testFailures": parseInt(testfailed),
                    "timeElapsed": parseFloat(timeElapsed),
                    "runs":parseInt(totalRuns)
                })
            } else {
                map.set(function_name, {
                    "testFailures": parseInt(failure),
                    "timeElapsed": parseFloat(time_elapsed),
                    "runs":parseInt(runs)
                })
            }
        }
    } else {
        console.log(err);
    }

}
function sortProperties(hmap) {
    // convert object into array
    var sortable = [];
    //	console.log(hmap)
    var keys = hmap.keys()
    for (key in keys) {
        //  console.log(hmap.get(keys[key]))
        sortable.push([keys[key], hmap.get(keys[key]).timeElapsed, hmap.get(keys[key]).testFailures]);
        //console.log(keys[key])
    }

    sortable.sort(function (x, y) {
        var n = y[2] - x[2];
        if (n !== 0) {
            return n;
        }

        return x[1] - y[1];
    });
    return sortable;
}




