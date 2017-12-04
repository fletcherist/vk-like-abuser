deploy:
	ssh root@89.223.31.14 "PATH=/root/.nvm/versions/node/v7.9.0/bin:/root/opt/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/root/opt/bin && cd vkabuser/engine && git stash && git pull && npm install && pm2 restart vkabuser"
update-config:
	scp config.js root@89.223.31.14:~/vkabuser/engine

deploy-rest:
	ssh root@89.223.31.14 "PATH=/root/.nvm/versions/node/v7.9.0/bin:/root/opt/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/root/opt/bin && cd vkabuser/engine && git stash && git pull && npm install && pm2 restart vkabuserrest"