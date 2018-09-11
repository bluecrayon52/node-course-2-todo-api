const expect = require('expect'); 
const request = require('supertest');
const {ObjectID} = require('mongodb'); 
const app = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user'); 
const {todos, populateTodos, users, populateUsers} = require('./seed/seed'); 

/* 
----TEMPLATE--------

describe('', () => {
    it('', (done) => {
        
    });
}); 

*/
beforeEach(populateUsers); 
beforeEach(populateTodos);

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

//---------------------------------GET--------------------------------------------------------------
describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done); 
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done); 
    });
}); 

//---------------------------------POST--------------------------------------------------------------
describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'julie@example.com';
        var password = 'testpassword3';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email); 
            })
            .end((err) => {
                if (err) {
                    return done(err); 
                }

                User.findOne({email}).then((user) => { 
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    expect(user._id).toBeTruthy(); 
                    expect(user.email).toBe(email); 
                    done(); 
                }).catch((e) => done(e)); 
            }); 
    });

    it('should return validation error if email invalid', (done) => {
        var email = 'bill@example'; 
        var password = 'testpassword4'; 

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should return validation error if password invalid', (done) => {
        var email = 'bill@example.com'; 
        var password = 'test';
        
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        var email = users[0].email; 
        var password = 'testpassword5';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);

    });
}); 

//---------------------------------POST--------------------------------------------------------------
describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email, 
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy(); 
            })
            .end((err, res) => {
                if (err) {
                    return done(err); 
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done(); 
                }).catch((e) => done(e)); 
            }); 
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: 'tina@example.com', 
                password: 'testpassword6'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy(); 
            })
            .end((err, res) => {
                if (err) {
                    return done(err); 
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toEqual(0);
                    done(); 
                }).catch((e) => done(e)); 
            });
    }); 
}); 

//---------------------------------DELETE--------------------------------------------------------------
describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err); 
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toEqual(0);
                    done();
                }).catch((e) => done(e)); 
            }); 
    });
});