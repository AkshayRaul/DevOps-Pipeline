var Random = require('random-js'),
    fs = require('fs'),
    stackTrace = require('stacktrace-parser')
    ;

var fuzzer = 
{
    random : new Random(Random.engines.mt19937().seed(0)),
    
    seed: function (kernel)
    {
        fuzzer.random = new Random(Random.engines.mt19937().seed(kernel));
    },

    mutate:
    {
        string: function(val)
        {
            
            var array = val.split('');
	    
	    // mutate '==' to '!=' 
            if( fuzzer.random.bool(1) )
            {
                for(var i=1;i<array.length;i++){
		   if(array[i] === '=' && array[i-1]==='='){
			if(fuzzer.random.bool(.5)){
		   		array[i-1] = '!';
			}
		   }
		}
            }
	   return array.join('');
        }
    }
};

if( process.env.NODE_ENV != "test")
{
    fuzzer.seed(0);
    var patientControllerPath = "../iTrust2-v4/iTrust2/src/main/java/edu/ncsu/csc/itrust2/controllers/api/APIPatientController.java"
    mutationTesting([patientControllerPath],1);
}

function mutationTesting(paths,iterations)
{    
    var failedTests = [];
    var reducedTests = [];
    var passedTests = 0;
	   
    var markDownA = fs.readFileSync(paths[0],'utf-8');
    var newString = fuzzer.mutate.string(markDownA);
    fs.writeFileSync(paths[0], newString, 'utf-8');    
}
exports.mutationTesting = mutationTesting;
exports.fuzzer = fuzzer;

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
