# Test + Analysis Milestone Submission(Milestone 2)
### Team 6: 
#### Team members - Unity Id
      Ashwin Risbood - arisboo
      Cameron Nelson - cenelso3
      Akshay Raul - araul
      Shwetha Kalyanaraman -skalyan
#### Contributions
    Ashwin Risbood - Wrote a nodeJs script to add-commit-reset 100 fuzz operations each triggering a build in Jenkins, added fuzzing operators, and worked on checkbox.io analysis extension.
    Shwetha Kalyanaraman - Parsing from the 100 log files and sorting as per total failures and time elapsed for each file to generate a report
    Akshay Raul- Worked on setup of ansible, git commit-reset of files,Integrated Jacoco for code coverage and analyzed Itrust using static analysis tool- FindBugs
    Cameron Nelson -  Added fuzzing operators and worked on checkbox.io analysis extension. 


#### Build Instructions:
```
1  git clone https://github.ncsu.edu/araul/Project_DevOps.git
2. cd jenkins-srv
3. baker bake
4. cd ../ansible-srv
5. baker bake
6. baker ssh
7. cd /ansible-srv
7. ansible-playbook initialSetup.yml 
8. ansible-playbook -i inventory main.yml
```

#### Setup Instructions

Once the repository is clone, the sub modules of `iTrust` and `checkbox.io` are also cloned. To set these repositories with configuration files so that these projects are ready to be built, run the following playbook
```
$ ansible-playbook initialSetup.yml
```
##### Main.yml does the following tasks using the following roles :- 
 - Installs MySQL and MongoDB servers (installs_dbs)
 - Installs Jenkins, creates a user, and installs Jenkins plugins (install_jenkins)
 - Creates Jenkins pipelines for iTrust and Checkbox and builds both repos (jenkins_build)
 - Builds iTrust 100 times in jenkins
 - Fetches the logs of 100 builds in host
 - Test Prioritization on those 100 log files to generate a report
 
### Report:

##### Fetch Log
In `tests` folder, `fetchLogs.yml` is a playbook that fetches last 100 build logs from jenkins server. To fetch the logs after the commits have been built, simply:
```
$ ansible-playbook -i inventory fetchLogs.yml
```
##### Analysis of Fuzzer and Test Prioritization
We performed four fuzzing operations:
1. Converting from '<' to '>' or '<' to '>'
2. Adding random strings
3. Converting 0 to 1 or 1 to 0
4. Converting && to || or || to &&

We choose the `API` directory in `Controllers` of iTrust for our Fuzzer. These files include, but are not limited to:
1. APIPatientController.java
2. APIFoodDiaryController.java
3. APIAppointmentRequestController.java
4. APIController.java
5. APIDiagnosisController.java

```
1. cd ansible-srv
2. cd fuzz
3. node main.js
```
This will run the fuzzer and contains the scripts to build 100 jobs by committing 100 times and resets the head after every commit 
```
1. cd ansible-srv
2. ansible-playbook -i inventory test.yml
3. cd tests
4. node priority.js
```
The test.yml file fetches 100 log files from the remote server to the host and stores it in a folder called logs.

Running priority.js will parse through the 100 log files and uses regex to extract important information about the file such as the status of build which could be successful or failure,number of runs, average time to failure, total number of failures.

The output after running that file is a sorted list having the format fileName, Tests, total Runs, average time to failure
with sorting priority first given to total Failures followed by the average time to failure.
```
Test Name: APIPatientTest, Average Test Duration: 1.3676899999999999, Failure count: 24
Test Name: APIUserTest, Average Test Duration: 0.5103800000000002, Failure count: 10
Test Name: APIPersonnelTest, Average Test Duration: 0.2975300000000001, Failure count: 7
Test Name: APIPasswordTest, Average Test Duration: 1.8687999999999991, Failure count: 6
Test Name: APILabProcedureTest, Average Test Duration: 9.65908, Failure count: 6
Test Name: APIPrescriptionTest, Average Test Duration: 0.2861699999999999, Failure count: 5
Test Name: APIFoodDiaryTest, Average Test Duration: 0.4910599999999999, Failure count: 5
Test Name: APIGeneralOphthalmologyTest, Average Test Duration: 5.7994200000000005, Failure count: 5
Test Name: APIDrugTest, Average Test Duration: 0.26475000000000004, Failure count: 4
Test Name: APIGeneralCheckupTest, Average Test Duration: 1.00467, Failure count: 4
Test Name: APIOphthalmologySurgeryTest, Average Test Duration: 1.0917599999999998, Failure count: 4
Test Name: APILogEntryTest, Average Test Duration: 2.937710000000001, Failure count: 4
Test Name: APIICDCodeTest, Average Test Duration: 0.08741000000000003, Failure count: 2
Test Name: APIAppointmentRequestTest, Average Test Duration: 0.54634, Failure count: 2
Test Name: APIEmergencyRecordFormTest, Average Test Duration: 11.326809999999998, Failure count: 2
Test Name: APIEnumTest, Average Test Duration: 0.06362999999999999, Failure count: 1
Test Name: APIHospitalTest, Average Test Duration: 0.07989, Failure count: 1
Test Name: APILOINCTest, Average Test Duration: 0.11155999999999996, Failure count: 1
Test Name: LogEntryTest, Average Test Duration: 0.0008700000000000003, Failure count: 0
Test Name: UserTest, Average Test Duration: 0.0010900000000000005, Failure count: 0
Test Name: HospitalFormTest, Average Test Duration: 0.0011100000000000005, Failure count: 0
Test Name: PersonnelFormTest, Average Test Duration: 0.0014600000000000008, Failure count: 0
Test Name: ICDCodeTest, Average Test Duration: 0.001950000000000001, Failure count: 0
Test Name: DrugTest, Average Test Duration: 0.005110000000000003, Failure count: 0
Test Name: AppointmentRequestTest, Average Test Duration: 0.029239999999999978, Failure count: 0
Test Name: FoodDiaryEntryTest, Average Test Duration: 0.06395999999999998, Failure count: 0
Test Name: DomainObjectTest, Average Test Duration: 0.10790000000000002, Failure count: 0
Test Name: LOINCTest, Average Test Duration: 0.19058999999999998, Failure count: 0
Test Name: OphthalmologySurgeryTest, Average Test Duration: 0.21198999999999987, Failure count: 0
Test Name: LockoutTest, Average Test Duration: 0.3626100000000001, Failure count: 0
Test Name: LogTest, Average Test Duration: 0.40590000000000004, Failure count: 0
Test Name: GeneralOphthalmologyTest, Average Test Duration: 0.48224999999999985, Failure count: 0
Test Name: LabProcedureTest, Average Test Duration: 0.7146100000000005, Failure count: 0
Test Name: GeneralCheckupTest, Average Test Duration: 0.8551300000000004, Failure count: 0
Test Name: APIDiagnosisTest, Average Test Duration: 1.0541200000000002, Failure count: 0
Test Name: EmailUtilTest, Average Test Duration: 1.4280900000000007, Failure count: 0
Test Name: PasswordChangeTest, Average Test Duration: 2.347000000000001, Failure count: 0
Test Name: PatientTest, Average Test Duration: 5.737859999999999, Failure count: 0
```

##### Problems while working in this milestone
- to have async operations like commiting and resetting needed the help of Promises
- keeping the random probabilty low, could trigger a commit which has no changes, and the script would reset a commit which never existed, thus removing an actual commit from top of the stack(unconstructive), so had to make sure to handle such a case.
- to consider cases of a fuzzing operation that would not compile iTrust, these cases would not trigger a test on iTrust and would therefore be useless

##### Problems discovered by Fuzzer
- Randomly changing strings might compile but some strings have significance such as the case in File APIUserTest. 
  private static final String ROLE_ADMIN   = "ROLE_ADMIN"; Changing ROLE_ADMIN would fail test cases.
- Changing == to != in cases where the condition checks for null fails the case as the next steps in the loop would not execute as expected causing the tests to fail. Example: 
```java
if ( patient == null ) {
            return new ResponseEntity( errorResponse( "Could not find a patient entry for you, " + self.getUsername() ),
                    HttpStatus.NOT_FOUND );
        }
  ```
##### Some ways fuzzing operations could be extended in the future
- Fuzzing operations can be optimized w.r.t time by coming up with some predefined random operations that can be performed on similar files.
- Fuzzing operations to convert primitive data type to non-primitive data type
- There could be external libraries in the future which on fuzzing would give detailed analysis on the vulnerability such as the root cause, ways to solve such vulnerabilities etc

##### Reasons the tests were ranked the highest
APIPatientController (small snippet)
```java

if ( patient == null ) {
            return new ResponseEntity( errorResponse( "Could not find a patient entry for you, " + self.getUsername() ),
                    HttpStatus.NOT_FOUND );
        }
```
There are many such cases in this file where we == null changes to != null which violates the condition causing the build to fail.


APIUserTest (small snippet)
```java

   /** constant for admin role */
    private static final String ROLE_ADMIN   = "ROLE_ADMIN";

    /** constant for patient role */
    private static final String ROLE_PATIENT = "ROLE_PATIENT";

    /** constant for hcp role */
    private static final String ROLE_HCP     = "ROLE_HCP";

    /** constant for ER role */
    private static final String ROLE_ER      = "ROLE_ER";

    /** constant for lab role */
    private static final String ROLE_LABTECH = "ROLE_LABTECH";

    /** constant for lab role */
    private static final String ROLE_OD = "ROLE_OD";

    /** constant for lab role */
    private static final String ROLE_OPH = "ROLE_OPH";
```
There are many string operations that could violate and fail the build as any changes to the above string such as changing ROLE_ADMIN to some other string would violate.

##### Approach for Analysis
We performed the following analysis for checkbox.io:
```
1. Cyclematic Complexity - The number of if statements/loops + 1 in each function.
2. Max Conditions - The maximum number of conditions (&& or ||) of an if statement per function.
3. Parameter Count - The number of parameters for each function.
4. Long Methods - The number of methods that contain a long method given a threshold.
```

We used the `Routes` directory in `site` of Checkbox.io as well as `marqdown.js` for your analysis testing. `Routes` include, but are not limited to:
```
1. admin.js
2. live.js
3. upload.js
```

For each file, we enforced the following thesholds for each source metric above using a variable called `status`. If at least one of these thresholds doesn't hold in a function, then `status` is changed to false, implying a failed build. The following thresholds are described as:
```
1. If the number of long methods detected in each function is greater than or equal to 1 (MAX_LONG_METHODS)
2. If the number of parameters in a function is greater than 3 (MAX_PARAMETER_COUNT)
3. If the maximum number of conditions in an if statement per function is greater than 2 (MAX_CONDITIONS)
4. If the Cyclomatic Complexity is greater than 10 (MAX_CC)
```

To run the analysis of checkbox.io, perform the following: 
```
1. Place analysis.js and simple.js in templates of anisble-srv and place it in test in checkbox.io/server-side/site
2. cd checkbox.io/server-side/site/test
3. node analysis.js
```
`node analysis.js` will print a report that contains each function's name, starting line, cyclomatic complexity, maximum conditions, parameter count, and how many long methods it detected. An example of each function will look something like this below:
```
commonSubmit(): 188
============
SimpleCyclomaticComplexity: 2   MaxConditions: 0        Parameters: 3   LongMethods: 0
```

Then run `npm test` to run `simple.js`. In `simple.js`, two tests will be checked. The first is checking the status of a MongoDB server to make sure the server runs and stops correctly. The second test checks if all metrics performed in analysis.js returns a status of true. If the status returns true, the test/build passes. Otherwise, it fails.

##### How do these checks help Software Developers?
Fuzzing technique helps software developers to come across loopholes that would have been ignored many times. Trying to randomly fuzz the code helps to come across many exceptions which help to make the software better. Fuzzing is a very cost effective technique and one can find an invalid input,a corrupted database and various vulnerabilities in the system.

 ##### ScreenCast:
 [Click here](https://goo.gl/hKqmh4) to watch the demo
