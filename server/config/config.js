var env = process.env.NODE_ENV || 'development';  // set to test by package.json, production by heroku

if (env === 'development' || env === 'test') {
    var config = require('./config.json'); 
    var envConfig = config[env]; 
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    })
}
