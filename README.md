# DEPLOYMENT, INFRASTRUCTURE, and something SPECIAL
### Team 6: 
#### Team members - Unity Id
      Ashwin Risbood - arisboo
      Cameron Nelson - cenelso3
      Akshay Raul - araul
      Shwetha Kalyanaraman -skalyan
#### Contributions
    Ashwin Risbood - 
    Shwetha Kalyanaraman - Setting up proxy server for feature flags in iTrust and wrote ansible scripts to configure redis.
    Akshay Raul- Setup Jenkins prod pipeline, wrote ansible scripts to configure kubernetes and servers(tomcat & nginx). Setup tomcat and nginx. Setup and configured Datadog agent for monitory & log processing
    Cameron Nelson - Assisted in setup of git hooks for iTrust and Checkbox.io in setting up nginx server for checkbox.io. Worked on configuring file transfers from iTrust jenkins server to iTrust deployment server (i.e. war file and SQL sample users). Lead the finalization of final screencast. 

#### Instructions to Setup:
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
#### Deployment Components
#### Deployment:

#### Feature Flag:
We used the feature of redis-cli to set two keys: 

1: Url name

2: Status of the URL to enable or disable

The ansible script starts by installing redis,starts redis server, starts the node file to redirect accordingly.

Every link of Itrust goes through a proxy server which will check from redis key-value pair.

After checking it will redirect accordingly if the url is disabled or not.
Suppose urlKey:'/iTrust/patient' has status set to be enabled

Then redirecting to '/iTrust/patient' will respond as feature disabled.


#### Infrastructure Component:
marqdown microservice: https://github.ncsu.edu/arisboo/marqdown
#### Special Milestone:

### 1. Blue Green Deployment
### 2. Datadog Monitoring and Log Processing




##### ScreenCast:
[Click here](https://goo.gl/hKqmh4) to watch the demo
