#!/bin/bash -e
for ((i=1;i<=100;i++));
 do
 cd fuzz
 npm start main.js
 cd ../iTrust2/iTrust2-v4/
 git add .
 git status
 echo "commit no."+$i
 git commit -m "commiting "+$i
 sleep 120
 git reset --hard HEAD~1
 cd ..
 cd ..
 echo $i
done
