require('./config/config');
const _ = require('lodash'); 
const express = require('express'); 
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb'); 

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express(); 

const port = process.env.PORT || 3000; 

app.use(bodyParser.json()); 

//---------------------------------POST--------------------------------------------------------------
app.post('/todos', (req, res) => {

    // console.log(req.body);

    var todo = new Todo({
        text: req.body.text
    });

    // console.log(todo);

    todo.save().then((doc) => {

        // console.log(doc);

        res.send(doc);
    }, (e) => {

        // console.log(e);

        res.status(400).send(e);
    });
});

//---------------------------------GET--------------------------------------------------------------
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});  // send back object en lieu of array 
    },(e) => {
        res.status(400).send(e); 
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id; 
    // res.send(req.params);
    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Todo Id not valid');  
    }

    Todo.findById(id).then((todo) => {
            if (!todo) {
                return res.status(404).send('Todo Id not found');
            }
            res.send({todo});
        }).catch((e) => { 
            res.status(400).send();
        });
});

//---------------------------------DELETE--------------------------------------------------------------
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id; 
    
    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Todo Id not valid');  
    }

    Todo.findByIdAndRemove(id).then((todo) => {
            if (!todo) {
                return res.status(404).send('Todo Id not found');
            }
            res.send({todo});
        }).catch((e) => { 
            res.status(400).send();
        });
});

//---------------------------------PATCH--------------------------------------------------------------
app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send(); 
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e); 
    })

});

app.listen(port, () => {
    console.log(`Started on port ${port}`); 
}); 

module.exports = app;
