var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

// create a mongoose model
var Todo = mongoose.model('Todo', {
    text: {
        type: String 
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

var newTodo = new Todo({
    text: 'Eat Pizza Forever!'
});

var newerTodo = new Todo({
    text: 'Eat Pizza Until You Die!',
    completed: true,
    completedAt: 100
});

newTodo.save().then((doc) => {
    console.log('Save new Todo', doc);
}, (e) => {
    console.log(`Here is the error ${e}`)
});

newerTodo.save().then((doc) => {
    console.log('Save newer Todo', doc);
}, (e) => {
    console.log(`Here is the error ${e}`)
});