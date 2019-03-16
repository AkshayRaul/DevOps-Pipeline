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
      var prob = fuzzer.random.bool(0.7)
      console.log("=" + prob)
      // mutate '==' to '!='
      if (prob) {
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
      var prob = fuzzer.random.bool(0.7)
      console.log("&" + prob)
      // mutate '&&' to '||'
      if (prob) {
        fuzzed = true
        for (var i = 0; i < array.length - 1; i++) {
          if (array[i] === '&' && array[i + 1] === '&') {
            array[i] = '|';
            array[i + 1] = '|';
            i++;
          }
          else if (array[i] === '|' && array[i + 1] === '|') {
            array[i] = '&';
            array[i + 1] = '&';
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
      var prob = fuzzer.random.bool(0.7)
      console.log(">" + prob)
      if (prob) {
        fuzzed = true
        var re = /<.*>/g
        lines.map((line) => {
          if (!line.match(re)) {
            keys = line.split('');
            for (var i = 1; i < keys.length; i++) {
              if (keys[i] === '<')
                keys[i] = '>';
              else if (keys[i] === '>')
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
      var prob = fuzzer.random.bool(0.7)
      console.log("123" + prob)
      // mutate 0 to 1 & vice-versa
      if (prob) {
        fuzzed = true
        for (var i = 1; i < array.length; i++) {
          if (array[i] === '0') {
            // if (fuzzer.random.bool(.5)) {
            array[i] = '1';
            // }
          }
          else if (array[i] === '1') {
            // if (fuzzer.random.bool(.5)) {
            array[i] = '0';
            // }
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
      if (fuzzer.random.bool(0.25)) {
        fuzzed = true
        for (var i = 1; i < array.length; i++) {
          if (array[i] === '"') {
            let j = i + 1;
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@#$%^&*()-=_+[]{}<>,./?`~ ";

            do {
              if (fuzzer.random.bool(.25)) {
                var char = chars.charAt(fuzzer.random.integer(0, chars.length));
                array[j] = char;
              }
              j++;
            } while (array[j] !== '"');
            i = j + 1;
          }
        }
      }
      var result = array.join('')
      //console.log(result)
      return result;
    }
  }
};

function callfuzz() {

  for (var i = 1; i <= 100; i++) {
    fuzzed = false
    //console.log(fuzzer.random.integer(0, myController.length));
    var controllerPath = "/Project/ansible-srv/iTrust2/iTrust2-v4/iTrust2/src/main/java/edu/ncsu/csc/itrust2/controllers/api/" + myController[fuzzer.random.integer(0, myController.length)];
    console.log("running mutation " + i + " on file" + myController[0]);
    mutationTesting(controllerPath);
    console.log("Fuzz: " + fuzzed)

    if (fuzzed)
      execSync('sh ./commit.sh').toString();
  }
}


function mutationTesting(path) {
  var markDownA = fs.readFileSync(path, 'utf-8');
  var newString = fuzzer.mutateEquals.string(markDownA);
  newString = fuzzer.mutateNumbers.string(newString);
  newString = fuzzer.mutateStrings.string(newString);
  newString = fuzzer.mutatecomparison.string(newString);
  fs.writeFileSync(path, newString, 'utf-8');
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
