# CM + Build Milestone Submission
### Team 6: 
#### Team members - Unity Id
      Ashwin Risbood - arisboo
      Cameron Nelson - cenelso3
      Akshay Raul - araul
      Shwetha Kalyanaraman -skalyan
#### Contributions
    Ashwin Risbood - CM for Checkbox.io, testscripts and jenkins pipeline for checkbox.io
    Shwetha Kalyanaraman - Jenkins pipeline for Checkbox.io and iTrust, setting up git-hooks.
    Akshay Raul- Configuring and installing Jenkins, building iTrust
    Cameron Nelson -  Creating bare git repository and triggering builds with git-hooks. 

##### Build Instructions:
```
1 git clone https://github.ncsu.edu/araul/Project_DevOps.git\
2. cd jenkins-srv
3. baker bake
4. cd ansible-srv
5. baker bake
6. baker ssh
7. cd /ansible-srv
7. ansible-playbook -i inventory main.yml 
```
##### Main.yml does the following tasks using the following roles :- 
 - Installs MySQL and MongoDB servers (instslls_dbs)
 - Installs Jenkins, creates a user, and installs Jenkins plugins (install_jenkins)
 - Creates Jenkins pipelines for iTrust and Checkbox and builds both repos (jenkins_build)
 
##### Report:

 ###### Automating CheckBox.io setup
Checkbox.io required setting up of environmental variables and installing mongoDB. The "MONGO_PORT" was a little confusing to set, as it turned out to be the port where checkbox.io is hosted. Creating the automation script was pretty straightforward. Understanding the bigger picture on how the builds are triggered was crucial. Creating Jenkinsfile for this application was no hassle as it is well documented. 

###### Build triggers and pipeline setup
Triggering the builds for both iTrust and Checkbox.io required two kind of git hooks for each repository. Both repositories needed a post-commit hook in order to build in Jenkins. The only challenge in doing this was that the crumb user needed to be retrieved in Jenkins as a header for the build script to execute properly. Both repositories also needed post-receive hooks so that when a build has been pushed, the contents of the repository would be pushed into their respective `www` bare repository.
 
 ##### ScreenCast:
 
