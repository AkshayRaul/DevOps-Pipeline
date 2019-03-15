var fs = require('fs'),
child  = require('child_process'); 
var HashMap = require('hashmap');

 if( process.env.NODE_ENV != "test")
{
var map = new HashMap();
for(var j=25;j<=50;j++){
var testReport =  '../logs/'+j;


var fs = require('fs'),
path = require('path')
console.log(j)
 
filePath = path.join(testReport);

    fs.readFile(testReport, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        //console.log('received data: ' + data);
        var re = /BUILD [A-Z]*/g;
        var r  = data.match(re)+'';
        var stringArrayStatus = r.split(/(\s+)/);
        var status= stringArrayStatus[2]
        
        var tr= /Total time: .*/g;
        var t=data.match(tr)+'';
        var stringArrayTime = t.split(/(\s+)/);
        var time= stringArrayTime[4]

        var functionName=/INFO] Tests run: .*/g;
 	var errorName=/ERROR] Tests run: .*/g;      
        var  func=data.match(errorName)+''
     	if(func[0]=='null'){
	     func=data.match(errorName)+'';
	}
        var info_split=func.split('INFO]');
        var resultJson={

        }
	console.log(info_split)
        for(var i=1;i<info_split.length-1;i++){
            var tuple=info_split[i];
	    //console.log(tuple)
            var tupleArray=tuple.split(/(\s+)/);
            var runs= tupleArray[6]
            runs=runs.replace(/,\s*$/, "");
            var failure= tupleArray[10]
            failure=failure.replace(/,\s*$/, "");
	    var time_elapsed=tupleArray[24]
            var function_name=tupleArray[32]
            var stringArrayfunc = function_name.split(".")
            function_name=stringArrayfunc[5]
            function_name=function_name.replace(/,\s*$/, "")
          
            //console.log("runs is"+runs+" failure is "+failure+" time elapsed is "+ time_elapsed+" function name is" +function_name)
            if(map.has(function_name)){
                  testfailed=map.get(function_name).testFailures+failure;
                  timeElapsed=map.get(function_name).timeElapsed+time_elapsed
                  map.set(function_name,{
                      "testFailures":parseInt(testfailed),
                      "timeElapsed":parseFloat(timeElapsed)
                    })
            }else{
                map.set(function_name,{
                    "testFailures":parseInt(failure),
                    "timeElapsed":parseFloat(time_elapsed)
                })
            }
            
        }

	} else {
		 console.log(err);
	}
	//sortedLog=sortProperties(map);
	//console.log(sortedLog);
	});
    	}

} 
function sortProperties(hmap)
{
  // convert object into array
    var sortable=[];
	//	console.log(hmap)
    var keys=hmap.keys()
	for(key in keys){ 
        console.log(hmap.get(keys[key]))
	sortable.push([keys[key],hmap.get(keys[key]).timeElapsed,hmap.get(keys[key]).testFailures]); 
        //console.log(keys[key])
    }

    sortable.sort(function (x, y) {
        var n = y[2]-x[2];
        if (n !== 0) {
            return n;
        }
    
        return x[1]-y[1];
    });
	return sortable; 
    }
   
    


