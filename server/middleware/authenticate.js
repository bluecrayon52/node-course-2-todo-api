var {User} = require('./../models/user');

// middleware to auth the use of private routes
var authenticateByToken = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject(); 
        }
        req.user = user; 
        req.token = token; 
        next(); 
        
    }).catch((e) => {
        res.status(401).send(); 
    });
};

 module.exports = {authenticateByToken}; 