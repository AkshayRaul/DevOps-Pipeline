var Random = require('random-js'),
  fs = require('fs'),
  stackTrace = require('stacktrace-parser')
  ;
var simpleGit = require('simple-git')('../iTrust2/iTrust2-v4');
const execSync = require('child_process').execSync;
fuzzed = false
myController = [
  "APIPatientController.java",
  "APIFoodDiaryController.java",
  "APIAppointmentRequestController.java",
  "APIController.java",
  "APIDiagnosisController.java",
  "APIDrugController.java",
  "APIEmergencyRecordController.java",
  "APIEnumController.java",
  "APIHospitalController.java",
  "APIICDCodeController.java",
  "APILOINCController.java",
  "APILabProcedureController.java",
  "APILogEntryController.java",
  "APIPasswordController.java",
  "APIPersonnelController.java",
  "APIPrescriptionController.java",
  "APIUserController.java"
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
      var prob=fuzzer.random.bool(0.7)
      console.log("=" + prob)
      // mutate '==' to '!='
      if (prob) {
        fuzzed = true;
        for (var i = 0; i < array.length; i++) {
          if (array[i] === '=' && array[i - 1] === '=') {
            array[i - 1] = '!';
          } else if (array[i] === "=" && array[i - 1] === '!') {
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
      var prob=fuzzer.random.bool(0.7)
      console.log("&" + prob)
      // mutate '&&' to '||'
      if (prob) {
        fuzzed=true
        for (var i = 0; i < array.length; i++) {
          if (array[i] === '&' && array[i + 1] === '&') {
              array[i] = '|';
              array[i + 1] = '|';
              i++;
          }
          else if(array[i]==='|' && array[i+1] === '|') {
             array[i] = '&';
             array[i + 1] = '&';
             i++;
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
      lines = val.split('\n');
      var prob=fuzzer.random.bool(0.7)
      console.log(">"+prob)
      if (prob) {
        fuzzed=true
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
          return line;
        });
        return array.join('\n');
      }
    }
  },

  mutateNumbers:
  {
    string: function (val) {

      var array = val.split('');
      var prob=fuzzer.random.bool(0.7)
      console.log("123" + prob)
      // mutate 0 to 1 & vice-versa
      if (prob) {
        fuzzed=true
        for (var i = 1; i < array.length; i++) {
          if (array[i] === '0') {
            array[i] = '1';
          }
          else if (array[i] === '1') {
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
      var prob=fuzzer.random.bool(0.7)
      console.log("Strings" + prob)
      // mutate content of "strings" in code
      if (prob) {
        fuzzed = true;
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
      }    
      return array.join('');
    }
  }
};

function callfuzz() {
  for (var i = 1; i <= 100; i++) {
    fuzzed = false
    var controllerPath = "/Project/ansible-srv/iTrust2/iTrust2-v4/iTrust2/src/main/java/edu/ncsu/csc/itrust2/controllers/api/" + myController[fuzzer.random.integer(0, myController.length + 1)];
    console.log("running mutation " + i + " on file" + myController[0]);
    mutationTesting(controllerPath);
    console.log("Fuzz: " + fuzzed)

    if (fuzzed)
      execSync('sh ./commit.sh').toString();
  }
}

function mutationTesting(path) {
  var fileString = fs.readFileSync(path, 'utf-8');
  var modifiedFileString = "";

  modifiedFileString = fuzzer.mutateEquals.string(fileString);
  modifiedFileString = fuzzer.mutateAndOr.string(modifiedFileString);
  modifiedFileString = fuzzer.mutateComparison.string(modifiedFileString);
  modifiedFileString = fuzzer.mutateNumbers.string(modifiedFileString);
  modifiedFileString = fuzzer.mutateStrings.string(modifiedFileString);

  fs.writeFileSync(path, modifiedFileString, 'utf-8');
}

if (process.env.NODE_ENV != "test") {
  fuzzer.seed(5);
  callfuzz();
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
