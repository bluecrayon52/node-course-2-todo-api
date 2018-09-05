const {ObjectID} = require('mongodb'); 
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo'); 
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result); 
// }); 

// Todo.findOneAndRemove({_id: '5b8ff8f371564b31996cab96'}).then((todo) => {
//     console.log(todo); 
// }); 

// Todo.findByIdAndRemove('5b8ff8f371564b31996cab96').then((todo) => {
//     console.log(todo); 
// }); 