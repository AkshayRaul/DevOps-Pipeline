# CM + Build Milestone Submission
### Team 6: 
#### Team members - Unity Id
      Ashwin Risbood - arisboo
      Cameron Nelson - cenelso3
      Akshay Raul - araul
      Shwetha Kalyanaraman -skalyan
#### Contributions
    Ashwin Risbood - CM for Checkbox.io, testscripts and jenkins pipeline for checkbox.io
    Shwetha Kalyanaraman - Jenkins pipeline for Checkbox.io and ITrust, setting up git-hooks.
    Akshay Raul- Configuring and installing Jenkins, building ITrust
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
 - Creates Jenkins pipelines for ITrust and Checkbox and builds both repos (jenkins_build)
 
 ##### Report:
 
 
 ##### ScreenCast:
 
