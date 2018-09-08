var env = process.env.NODE_ENV || 'development';  // set to production by heroku 

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'; 
} else if (env === 'test') {
    process.env.PORT = 3000; 
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'; 
}