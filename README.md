# Project_DevOps
### Team 6: 
#### Team members - Unity Id
      Ashwin Risbood - arisboo
      Cameron Nelson - cenelso3
      Akshay Raul - araul
      Shwetha Kalyanaraman -skalyan
#### Contributions
    Ashwin Risbood - CM for Checkbox.io, testscripts and jenkins pipeline for checkbox.io
    Shwetha Kalyanaraman - Jenkins pipeline for checkbox.io and ITrust, setting up git-hooks.
    Akshay Raul- Configuring and installing Jenkin, building Itrust
    Cameron Nelson -  Creating bare git repository and triggering builds.
    
#### Demo
```

1 git clone https://github.ncsu.edu/araul/Project_DevOps.git\
2. cd jenkins-srv
3. baker bake
4. cd ansible-srv
5. baker bake
6. baker ssh
7. asnible-playbook -i inventory main.yml 
```
##### This anisble playbook does the following :- 
 - Installs mysql and Mongodb servers 
 - Install Jenkins and creates a user.
 - Creates Jenkins pipelines for ITrust and Checkbox.
 
