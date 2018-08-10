// const MongoClient = require('mongodb').MongoClient;  // same as bellow
  const {MongoClient, ObjectID} = require('mongodb'); 

// var obj = new ObjectID(); 
// console.log(obj);

// ES6 destructuring to make new vars from old object props 
// var user = {name: 'Homer', age: 45, location: 'Springfield'};
// var{name} = user; 
// console.log(`${name} says Doh!`);


// TodoApp will not actually be created until data is added 
MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server'); 
    }
    console.log('Connected to MongoDB server'); 
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2)); 
    // })

    // Insert new doc into Users Collections 
    // db.collection('Users').insertOne({
    //     // _id: '1234',
    //     name: 'Nathaniel',
    //     age: 32, 
    //     location: 'Winston Salem'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert user', err);
    //     }

    //     // console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());  
    // })

    client.close();
}); 
