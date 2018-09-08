const mongoose = require('mongoose');
const validator = require('validator'); 
const jwt = require('jsonwebtoken');
const _ = require('lodash'); 

// model

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, 
        minlength: 1,
        trim: true,
        unique: true, 
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid emial'
        }
    }, 
    password: {
        type: String,
        required: true, 
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true 
        }
    }]
});

// override toJSON method to limit user data sent 
UserSchema.methods.toJSON = function () {
    var user = this; 
    var userObject = user.toObject(); 

    return _.pick(userObject, ['_id', 'email']);s
};

// arrow functions do not bind a this keyword 
UserSchema.methods.generateAuthToken = function () {
    var user = this; 
    var access = 'auth';
    var token = jwt.sign({
            _id: user._id.toHexString(), 
            access 
        }, 'secret123').toString();
    user.tokens = user.tokens.concat([{access, token}]); 

    return user.save().then(() => {
        return token; 
    });
};
var User = mongoose.model('User', UserSchema);

// var newUser = new User({
//     email: 'newUser@email.com'
// });

// newUser.save().then((doc) => {
//     console.log('Save new User', doc);
// }, (e) => {
//     console.log(`Here is the error ${e}`)
// });

module.exports = {User}; 