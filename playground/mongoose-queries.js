const {ObjectID} = require('mongodb'); 
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo'); 
const {User} = require('./../server/models/user');

// var todoId = '5b8747179b95528a0fb3e55b';

var userId = '5b788ac2b5cf6121ce51c56f'; 
// if(!ObjectID.isValid(todoId)) {
//     console.log('Todo Id not valid'); 
// }

if(!ObjectID.isValid(userId)) {
    return console.log('User Id not valid'); 
}

// Todo.find({
//     _id: todoId
// }).then((todos) => {
//     console.log('Todos', todos); 
// }); 

// Todo.findOne({
//     _id: todoId
// }).then((todo) => {
//     console.log('Todo', todo); 
// }); 

// Todo.findById(todoId).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found')
//     }
//     console.log('Todo By Id', todo); 
// }).catch((e) => console.log(e));


User.findById(userId).then((user) => {
        if (!user) {
            return console.log('Id not found')
        }
        console.log('User By Id', user); 
    }).catch((e) => console.log(e));
    


