#!/bin/bash -e
for ((i=1;i<=4;i++));
 do
 cd fuzz
 npm start main.js
 cd ../iTrust2/iTrustBareGit
 git add .
 git status
 echo "commit"+$i
 git commit -m "commiting "+$i
 sleep 10
 git push origin master
 git reset --hard HEAD
 cd ..
 cd ..
 echo $i
done