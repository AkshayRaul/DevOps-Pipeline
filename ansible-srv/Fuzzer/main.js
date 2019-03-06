var Random = require('random-js')
    marqdown = require('./marqdown.js'),
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
        // string: function(val)
        // {
        //     // MUTATE IMPLEMENTATION HERE
        //     var array = val.split('');
        //     // console.log(val)
        //     if( fuzzer.random.bool(1) )
        //     {
        //         //replace 0 with 1
        //         // if(array.contains("0"))
        //         // val.replace("0", "1");

        //     }
        //     // delete random characters
        //     if( fuzzer.random.bool(0.25) )
        //     {
        //         //fuzzer.random.integer(0,99)
        //     }

        //     // add random characters
        //     // fuzzer.random.string(10)
        //     out=array.join('')
        //     // console.log(out)
        //     return val
        // }
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
    mutationTesting([passwordControllerPath],10);
}

function mutationTesting(paths,iterations)
{    
    var failedTests = [];
    var reducedTests = [];
    var passedTests = 0;
    
    var markDownA = fs.readFileSync(paths[0],'utf-8');
    console.log(markDownA)
    //var markDownB = fs.readFileSync(paths[1],'utf-8');
    
    for (var i = 0; i < iterations; i++) {

        let mutuatedString = fuzzer.mutate.string(markDownA);
        
        try
        {
            marqdown.render(mutuatedStri
var passwordControllerPath = "../iTrust2/iTrustBareGit/iTrust2/src/main/java/edu/ncsu/csc/itrust2/controllers/api/APIPatientController.java"
