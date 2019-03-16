var Random = require('random-js'),
    fs = require('fs')
;

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

if (process.env.NODE_ENV != "test") {
  fuzzer.seed(0);
  var patientControllerPath = "../iTrust2/iTrust2-v4/iTrust2/src/main/java/edu/ncsu/csc/itrust2/controllers/api/"+myController[Math.floor(Math.random() * myController.length)];
  mutationTesting([patientControllerPath], 1);
}

function mutationTesting(paths, iterations) {

  var fileString = fs.readFileSync(paths[0], 'utf-8');
  var modifiedFileString = "";
  
  do
  {
    modifiedFileString = fuzzer.mutateEquals.string(fileString);
    modifiedFileString = fuzzer.mutateAndOr.string(modifiedFileString);
    modifiedFileString = fuzzer.mutateComparison.string(modifiedFileString);
    modifiedFileString = fuzzer.mutateNumbers.string(modifiedFileString);
    modifiedFileString = fuzzer.mutateStrings.string(modifiedFileString);
  } while (fuzzer.random.bool(0.05));

  fs.writeFileSync(paths[0], modifiedFileString, 'utf-8');
}
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
