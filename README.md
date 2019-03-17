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
    Akshay Raul- Integrated Jacoco for code coverage and analyzed Itrust using static analysis tool- FindBugs
    Cameron Nelson -  Added fuzzing operators and worked on checkbox.io analysis extension. 

#### Build Instructions:
```
1  git clone https://github.ncsu.edu/araul/Project_DevOps.git
2. cd jenkins-srv
3. baker bake
4. cd ansible-srv
5. baker bake
6. baker ssh
7. cd /ansible-srv
7. ansible-playbook -setupGit.yml 
8. ansible-playbook -i inventory main.yml
```

##### Main.yml does the following tasks using the following roles :- 
 - Installs MySQL and MongoDB servers (installs_dbs)
 - Installs Jenkins, creates a user, and installs Jenkins plugins (install_jenkins)
 - Creates Jenkins pipelines for iTrust and Checkbox and builds both repos (jenkins_build)
 - Builds iTrust 100 times in jenkins
 - Fetches the logs of 100 builds in host
 - Test Prioritization on those 100 log files to generate a report
 
#### Report:

###### Analysis of Fuzzer and Test Prioritization
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
###### Types of Problems discovered by Fuzzer
- to have async operations like commiting and resetting needed the help of Promises
- keeping the random probabilty low, could trigger a commit which has no changes, and the script would reset a commit which never existed, thus removing an actual commit from top of the stack(unconstructive), so had to make sure to handle such a case.
- to consider cases of a fuzzing operation that would not compile iTrust, these cases would not trigger a test on iTrust and would therefore be useless

###### Some ways fuzzing operations could be extended in the future
- Fuzzing operations can be optimized w.r.t time by coming up with some predefined random operations that can be performed on similar files.
- Fuzzing operations to convert primitive data type to non-primitive data type
- There could be external libraries in the future which on fuzzing would give detailed analysis on the vulnerability such as the root cause, ways to solve such vulnerabilities etc

###### Reasons the tests were ranked the highest


###### Approach for Analysis


###### How do these checks help Software Developers?
Fuzzing technique helps software developers to come across loopholes that would have been ignored many times. Trying to randomly fuzz the code helps to come across many exceptions which help to make the software better. Fuzzing is a very cost effective technique and one can find an invalid input,a corrupted database and various vulnerabilities in the system.

 ##### ScreenCast:
 [Click here](https://drive.google.com/open?id=1Ivo299PbIZxvdac14e63yZQAuKM0ZWli) to watch the demo
