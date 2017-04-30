git add .
git commit -m 'Deploy [load_balancer]'
git push
ssh root@89.223.31.14  "PATH=/root/.nvm/versions/node/v7.9.0/bin:/root/opt/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/root/opt/bin && cd vkabuser/load_balancer && git stash && git pull && pm2 start load_balancer.js"