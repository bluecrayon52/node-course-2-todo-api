const {MongoClient, ObjectID} = require('mongodb'); 

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server'); 
    }
    console.log('Connected to MongoDB server'); 
    const db = client.db('TodoApp');

// findOneAndUpdate(filter, update, options, callback)
db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5b6dfa2203fde3d077c0ed20')
}, {
    // update operators 
    $set: {
        completed: true
    }
}, {
    returnOrigional: false
}).then((result) => {
    console.log(result);
});

// increment Amy's age
db.collection('Users').findOneAndUpdate({
    name: 'Amy'
}, {
    // update operators 
    $inc: {
        age: 10
    }
}, {
    returnOrigional: false
}).then((result) => {
    console.log(result);
});


    client.close();
}); 