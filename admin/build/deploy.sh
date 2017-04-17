git add .
git commit -m "New Release Version for [Admin]"
git push
ssh root@188.166.7.26 "cd vkabuser && git stash && git pull"