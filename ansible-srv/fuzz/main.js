var Random = require('random-js'),
  fs = require('fs'),
  stackTrace = require('stacktrace-parser')
  ;
var simpleGit = require('simple-git')('../iTrust2/iTrust2-v4');

myController=[
  "APIPatientController.java",
  "APIFoodDiaryController.java",
  "APIAppointmentRequestController.java"
];

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
      for (var i = 0; i < array.length; i++) {
        if (array[i] === '=' && array[i - 1] === '=') {
          if (fuzzer.random.bool(0.25)) {
            array[i - 1] = '!';
          }
        }
        else if (array[i] === "=" && array[i - 1] === '!') {
          if (fuzzer.random.bool(0.25)) {
            array[i - 1] = '=';
          }
        }
      }
      return array.join('');
    }
  },

  mutateAndOr:
  {
    string: function (val) {

      var array = val.split('');

      // mutate '&&' to '||'
      for (var i = 0; i < array.length; i++) {
        if (array[i] === '&' && array[i - 1] === '&') {
          if (fuzzer.random.bool(0.25)) {
            array[i] = '|';
            array[i - 1] = '|';
          }
        }
        else if(array[i]==='|' && array[i - 1] === '|') {
          if (fuzzer.random.bool(0.25)) {
            array[i] = '&';
            array[i - 1] = '&';
          }
        }
      }
      return array.join('');
     }
  },

  mutateComparison:
  {
    // mutate "<" to ">"
    string: function (val) {
      var array = val.split('\n');
      var re = /<.*>/g
      array.map((line) => {
        if(!line.match(re)){
          var keys = line.split('');
          for (var i = 0; i < keys.length; i++) {
            if (keys[i] === '<') {
              if (fuzzer.random.bool(0.25)) {
                keys[i] = '>';
              }
            } else if (keys[i] === '>') {
              if (fuzzer.random.bool(0.25)) {
                keys[i] = '<';
              }
            }
          }
          line = keys.join('');
        }
        return line;
        });
      return array.join('\n');
    }
  },

  mutateNumbers:
  {
    string: function (val) {

      var array = val.split('');

      // mutate 0 to 1 & vice-versa
      for (var i = 0; i < array.length; i++) {
        if (array[i] === '0') {
          if (fuzzer.random.bool(0.25)) {
            array[i] = '1';
          }
        }
        else if (array[i] === '1') {
          if (fuzzer.random.bool(0.25)) {
            array[i] = '0';
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
      for (var i = 0; i < array.length; i++) {
        if (array[i - 1] === '"') {
          do {
            //Add or remove random characters
            if (fuzzer.random.bool(0.05))
            {
              var new_chars = fuzzer.random.string(10);
              array.splice(i, 1, new_chars[Math.floor(Math.random() * new_chars.length)]);
            }
            i++;
          } while (array[i] !== '"');
          i++;
        }
      }
      return array.join('');
    }
  }
};

async function callfuzz(){
  var arr = [1,2,3,4,5,6]
  for(const i of arr){
       console.log(fuzzer.random.integer(0, myController.length));
       var controllerPath = "../iTrust2/iTrust2-v4/iTrust2/src/main/java/edu/ncsu/csc/itrust2/controllers/api/"+myController[0];    //fuzzer.random.integer(0, myController.length+1)];
       //console.log("running mutation 1 on file"+controllerPath);
       mutationTesting(controllerPath, 1);
       var result = await add(i);
       var commit_result = await commit(i);
   }
}

if (process.env.NODE_ENV != "test") {
  fuzzer.seed(0);
  callfuzz();  
}
function add(i){
  return new Promise(resolve => {
    setTimeout(()=>{
      simpleGit.add('./*')
      .commit('commiting mutation '+ i, ()=>{
           console.log('commiting mutation' + i)
           resolve("added changes")
       })
     },30000)
   })
}

function commit(i){
     return new Promise(resolve => {
         setTimeout(()=>{
            simpleGit.reset(['--hard', 'HEAD~1'], ()=>{console.log("resolved"); resolve('resolved')
            })
         },30000);
      })
}

function mutationTesting(path, iterations) {

  var fileString = fs.readFileSync(path, 'utf-8');
  var modifiedFileString = "";
  
  do
  {
    modifiedFileString = fuzzer.mutateEquals.string(fileString);
    modifiedFileString = fuzzer.mutateAndOr.string(modifiedFileString);
    modifiedFileString = fuzzer.mutateComparison.string(modifiedFileString);
    modifiedFileString = fuzzer.mutateNumbers.string(modifiedFileString);
    modifiedFileString = fuzzer.mutateStrings.string(modifiedFileString);
  } while (fuzzer.random.bool(0.05));

  fs.writeFileSync(path, modifiedFileString, 'utf-8');
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
