
var mongoose = require('mongoose');

// model
var User = mongoose.model('User', {
    email: {
        type: String,
        required: true, 
        minLength: 1,
        trim: true
    }
});

// var newUser = new User({
//     email: 'newUser@email.com'
// });

// newUser.save().then((doc) => {
//     console.log('Save new User', doc);
// }, (e) => {
//     console.log(`Here is the error ${e}`)
// });

module.exports = {User}; 