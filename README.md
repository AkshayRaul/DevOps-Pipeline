# Test + Analysis Milestone Submission(Milestone 2)
### Team 6: 
#### Team members - Unity Id
      Ashwin Risbood - arisboo
      Cameron Nelson - cenelso3
      Akshay Raul - araul
      Shwetha Kalyanaraman -skalyan
#### Contributions
    Ashwin Risbood - Wrote a bash script to build 100 jobs in Jenkins and runs the fuzzer before building the job. Script also includes resetting git head after every build.
    Shwetha Kalyanaraman - Parsing from the 100 log files and sorting as per total failures and time elapsed for each file to generate a report
    Akshay Raul- Integrated Jacoco for code coverage and analyzed Itrust using static analysis tool- FindBugs
    Cameron Nelson -  Added Fuzzer Operators. 

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

###### Types of Problems discovered by Fuzzer



###### Some ways fuzzing operations could be extended in the future

###### Reasons the tests were ranked the highest


###### Approach for Analysis


###### How do these checks help Software Developers?


 
 ##### ScreenCast:
 [Click here](https://drive.google.com/open?id=1Ivo299PbIZxvdac14e63yZQAuKM0ZWli) to watch the demo
