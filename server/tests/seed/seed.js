const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken'); 

const {Todo} = require('./../../models/todo'); 
const {User} = require('./../../models/user');

// ------ user seed data------
const userOneId = new ObjectID();
const userTwoId = new ObjectID(); 

const users =[{
    _id: userOneId,
    email: 'nathan@example.com',
    password: 'testpassword1',
    tokens: [{
        access: 'auth', 
        token: jwt.sign({_id: userOneId, access:'auth'}, process.env.JWT_SECRET).toString()
    }]
   
}, {
    _id: userTwoId,
    email: 'heather@example.com',
    password: 'testpassword2',
    tokens: [{
        access: 'auth', 
        token: jwt.sign({_id: userTwoId, access:'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

// ------todo seed data------
const todos =[{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId

}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    _creator: userTwoId,
    completed: true, 
    completedAt: 333
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
}; 

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}; 

module.exports = {todos, populateTodos, users, populateUsers}; 