module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'eComm_frontend',
      script: 'server.js',
      out_file: '/app/eComm_frontend/logs/all.log',
      error_file: '/app/eComm_frontend/logs/all.log',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
