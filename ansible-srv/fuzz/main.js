var Random = require('random-js'),
  fs = require('fs'),
  stackTrace = require('stacktrace-parser')
  ;
var simpleGit = require('simple-git')('../iTrust2/iTrustBareGit');

myController=[
  "APIPatientController.java",
  "APIFoodDiaryController.java",
  "APIAppointmentRequestController.java"
]

var fuzzer =
{
  random: new Random(Random.engines.mt19937().seed(0)),

  seed: function (kernel) {
    fuzzer.random = new Random(Random.engines.mt19937().seed(kernel));
  },

  mutateEquals:
  {
    string: function (val) {

      var array = val.split('');

    // mutate '==' to '!='
      if (fuzzer.random.bool(0.5)) {
        for (var i = 1; i < array.length; i++) {
          if (array[i] === '=' && array[i - 1] === '=') {
            if (fuzzer.random.bool(.5)) {
              array[i - 1] = '!';
            }
          }
        }
      }
      return array.join('');
    }
  },
  mutateand:
  {
    string: function (val) {

      var array = val.split('');
      // mutate '&&' to '||'
      if (fuzzer.random.bool(0.5)) {
        for (var i = 0; i < array.length-1; i++) {
          if (array[i] === '&' && array[i + 1] === '&'){
              array[i] = '|';
              array[i+1] = '|';
              i++;
            }
          else if(array[i]==='|' && array[i+1] === '|'){
             array[i] = '&';
             array[i+1] = '&';
             i++;
          }
        }
       }
      return array.join('');
     }
  },
  mutatecomparison:
  {
    // mutate "<" to ">"
    string: function (val) {
      lines = val.split('\n');
      if (fuzzer.random.bool(0.5)) {
        var re = /<.*>/g
        lines.map((line)=>{
           if(!line.match(re)){
              keys = line.split('');
              for (var i = 1; i < keys.length; i++) {
                 if (keys[i] === '<')
                    keys[i] = '>';
                 else if(keys[i] === '>')
                    keys[i] = '<';
              }
             line = keys.join('');
           }
           // console.log(line);
           return line;
        })
      }
      return lines.join('\n');
    }
  },
  mutateNumbers:
  {
    string: function (val) {

      var array = val.split('');

      // mutate 0 to 1 & vice-versa
      if (fuzzer.random.bool(0.5)) {
        for (var i = 1; i < array.length; i++) {
          if (array[i] === '0') {
            if (fuzzer.random.bool(.5)) {
              array[i] = '1';
            }
          }
          else if (array[i] === '1') {
            if (fuzzer.random.bool(.5)) {
              array[i] = '0';
            }
          }
        }
      }
      return array.join('');
    }
  },
  mutateStrings:
  {
    string: function (val) {

      var array = val.split('');

      // mutate content of "strings" in code
      if(fuzzer.random.bool(0.5)) {
        for(var i = 1; i < array.length; i++) {
          if (array[i] === '"') {
            let j = i + 1;
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@#$%^&*()-=_+[]{}<>,./?`~ ";

            do {
              if(fuzzer.random.bool(.25)) {
                var char = chars.charAt(fuzzer.random.integer(0,chars.length));
                array[j] = char;
              }
              j++;
            } while(array[j] !== '"');
            i = j + 1;
          }
        }
      }
      var result= array.join('')
      //console.log(result)
      return result;
    }
  }
};

async function callfuzz(){
  var arr = [1,2,3,4,5,6]
  for(const i of arr){
       console.log(fuzzer.random.integer(0, myController.length));
       var controllerPath = "../iTrust2/iTrustBareGit/iTrust2/src/main/java/edu/ncsu/csc/itrust2/controllers/api/"+myController[0];    //fuzzer.random.integer(0, myController.length+1)];
       //console.log("running mutation 1 on file"+controllerPath);
       mutationTesting(controllerPath, 1);
       var result = await commit(i);
   }
}
if (process.env.NODE_ENV != "test") {
  fuzzer.seed(0);
  callfuzz();  
 }
function commit(i){
     return new Promise(resolve => {
        simpleGit.add('./*')
        .commit('commiting mutation '+ i, ()=>{
           console.log('commiting mutation' + i)
           setTimeout(()=>{
             simpleGit.reset(['--hard', 'HEAD~1'], ()=>{console.log("resolved"); resolve('resolved')})
           }, 60000)
         })   
      })
}

function mutationTesting(path, iterations) {
  var failedTests = [];
  var reducedTests = [];
  var passedTests = 0;

  var markDownA = fs.readFileSync(path, 'utf-8');
  var newString = fuzzer.mutateEquals.string(markDownA);
  newString = fuzzer.mutateNumbers.string(newString);
 //  newString = fuzzer.mutateStrings.string(newString);
  newString = fuzzer.mutatecomparison.string(newString);
  fs.writeFileSync(path, newString, 'utf-8');
}
exports.mutationTesting = mutationTesting;
exports.fuzzer = fuzzer;

if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}
