module.exports = {
  apps : [

    // First application
    {
      name      : 'load_balancer',
      script    : 'app.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy : {
    production : {
      user : 'node',
      host : '89.223.31.14',
      ref  : 'origin/master',
      repo : 'git@github.com:fletcherist/vk-like-abuser.git',
      path : '/root/vkabuser/load_balancer',
      'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env production'
    },
    dev : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/development',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
