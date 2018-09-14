require('./config/config');
const _ = require('lodash'); 
const express = require('express'); 
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb'); 

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express(); 

const port = process.env.PORT || 3000; 

app.use(bodyParser.json()); 

// TODO async/await convert 
//---------------------------------POST--------------------------------------------------------------
app.post('/todos', authenticate, (req, res) => {

    var todo = new Todo({
        text: req.body.text,
        _creator: req.user.id 
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// TODO async/await convert 
//---------------------------------GET--------------------------------------------------------------
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id 
    }).then((todos) => {
        res.send({todos});  // send back object en lieu of array 
    },(e) => {
        res.status(400).send(e); 
    });
});

// TODO async/await convert 
//---------------------------------GET--------------------------------------------------------------
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id; 
    // res.send(req.params);
    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Todo Id not valid');  
    }

    Todo.findOne({
        _id: id, 
        _creator: req.user._id
    }).then((todo) => {
            if (!todo) {
                return res.status(404).send('Todo Id not found');
            }
            res.send({todo});
        }).catch((e) => { 
            res.status(400).send();
        });
});

//---------------------------------DELETE--------------------------------------------------------------
app.delete('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id; 

    if(!ObjectID.isValid(id)) {res.status(404).send('Todo Id not valid');}

    try {
        const todo = await Todo.findOneAndRemove({
            _id: id, 
            _creator: req.user._id
        })
        if (!todo) {res.status(404).send('Todo Id not found');} 
        res.send({todo});
    } catch (e) {
    res.status(400).send();
    }
});

// TODO async/await convert 
//---------------------------------PATCH--------------------------------------------------------------
app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id; 
    var body = _.pick(req.body, ['text', 'completed']); // limit what the user can edit 

    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Todo Id not valid');  
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime(); 

    } else {
        body.completed = false; 
        body.completedAt =null; 
    }

    Todo.findOneAndUpdate({
        _id: id, 
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send(); 
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e); 
    })

});

// TODO
//---------------------------------POST USER--------------------------------------------------------------
app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email','password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken(); 
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// TODO async/await convert 
//---------------------------------GET USER--------------------------------------------------------------
app.get('/users/me', authenticate, (req, res) => {
   res.send(req.user); 
}); 

//---------------------------------POST LOGIN--------------------------------------------------------------
app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
      } catch (e) {
        res.status(400).send();
      }
}); 

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send(); 
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`); 
}); 

module.exports = app;
