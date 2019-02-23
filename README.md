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
    Akshay Raul- Configuring and installing Jenkins, building iTrust pipeline, creating credentials for git ssh keys, handling REST calls
    Cameron Nelson -  Creating bare git repository and triggering builds with git-hooks. 

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
 
#### Report:

###### Installing Jenkins through Ansible
Configuring Jenkins with Ansible was a great experience but not without hiccups. When Jenkins is installed for the first time, it asks for admin password `initialAdminPassword` which needs to be setup using groovy that uses Hudson security module to complete the initial setup. Further, setting up CrumbIssuer and then retreiving crumbs from Jenkins REST api was necessary to access Jenkins REST Api. The issues we encountered wer having `Error:Crumb not valid` and `Error:Crumb not found`. There is not much documentation on it, but experimenting with the API endpoints, `Content-Type` header helps with understanding how crumbs work. We have used Jenkinsfile for creating the pipeline. I

###### Automating Itrust setup
Itrust setup required to have maven installed for building successfully. Initially, it was difficult for us to figure out how to use Jenkinsfile with the REST API as it expects an xml file. We figured this out by creating a dummy job, then accessing the `config.xml` file in the $JENKINS_HOME. For iTrust, as the repository is private, we had to use `credentials` plugin to create a credential that holds the private key. Other issues we faced were that ansible doesn't natively support `multipart/form-data` Content type, which is required to setup credentials. This further led to issues in templating errors.
Once setup, it playbook runs without any issues, and then creates jobs & triggers build.


###### Automating CheckBox.io setup
Checkbox.io required setting up of environmental variables and installing mongoDB. The "MONGO_PORT" was a little confusing to set, as it turned out to be the port where checkbox.io is hosted. Creating the automation script was pretty straightforward. Understanding the bigger picture on how the builds are triggered was crucial. Creating Jenkinsfile for this application was no hassle as it is well documented. 

###### Build triggers and pipeline setup
Triggering the builds for both iTrust and Checkbox.io required two kind of git hooks for each repository. Both repositories needed a post-commit hook in order to build in Jenkins. The only challenge in doing this was that the crumb user needed to be retrieved in Jenkins as a header for the build script to execute properly. Both repositories also needed post-receive hooks so that when a build has been pushed, the contents of the repository would be pushed into their respective `www` bare repository.
 
 ##### ScreenCast:
 
