
var mongoose = require('mongoose');

// model 
var Todo = mongoose.model('Todo', {
    text: {
        type: String, 
        required: true, 
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean, 
        default: false
    },
    completedAt: {
        type: Number, 
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// var newTodo = new Todo({
//     text: 'Eat Pizza Forever!'
// });

// newTodo.save().then((doc) => {
//     console.log('Save new Todo', doc);
// }, (e) => {
//     console.log(`Here is the error ${e}`)
// });

module.exports = {Todo}; 