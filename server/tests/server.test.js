const expect = require('expect'); 
const request = require('supertest');
const {ObjectID} = require('mongodb'); 
const app = require('./../server');
const {Todo} = require('./../models/todo');

/* 
----TEMPLATE--------

describe('', () => {
    it('', (done) => {
        
    });
}); 

*/

// ------seed data------
const todos =[{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true, 
    completedAt: 333,
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
});

//---------------------------------POST--------------------------------------------------------------
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text); 
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e)); 
        });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e)); 
        });
    });
});

//---------------------------------GET--------------------------------------------------------------
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return a 404 status for invalid object id', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);

    });

    it('should return a 404 status for object id that does not match a doc', (done) => {
        request(app)
            .get(`/todos/${ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return a todo doc for a matching todo id in the response body', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done); 
    }); 
});

//---------------------------------DELETE--------------------------------------------------------------
describe('DELETE /todos/:id', () => {
    it('should return a 404 status for invalid object id', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
    it('should return a 404 status for object id that does not match a doc', (done) => {
        request(app)
            .delete(`/todos/${ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });
    it('should remove a todo doc for a matching todo id', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo._id).toBe(hexId); 
            })
            .end((err, res) => {
                if (err) {
                    return done(err); 
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy(); 
                    done();
                }).catch((e) => done(e)); 

            });
    });
}); 

//---------------------------------PATCH--------------------------------------------------------------
describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'Updated test todo'

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text); 
                expect(res.body.todo.completed).toBe(true); 
                expect(typeof res.body.todo.completedAt).toBe('number'); 
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
    
                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toBe(text);
                    expect(todo.completed).toBe(true); 
                    expect(typeof todo.completedAt).toBe('number');
                    done();
                }).catch((e) => done(e)); 
            });
    });

    it('should clear completedAt when completed is false', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false); 
                expect(res.body.todo.completedAt).toBeFalsy();  
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
    
                Todo.findById(hexId).then((todo) => {
                    expect(todo.completed).toBe(false); 
                    expect(todo.completedAt).toBeFalsy(); 
                    done();
                }).catch((e) => done(e)); 
            });
    });
}); 