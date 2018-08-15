
const {MongoClient, ObjectID} = require('mongodb'); 

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server'); 
    }
    console.log('Connected to MongoDB server'); 
    const db = client.db('TodoApp');

    // deleteMany 
// db.collection('Todos').deleteMany({text: 'eat pizza'}).then((result) => {
//     console.log(result); 
// });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'eat pizza'}).then((result) => {
    // console.log(result); 
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result); 
    // });

    // db.collection('Users').deleteMany({name: 'Nathaniel'}).then((result) => {
    //     console.log(result); 
    // });

    // db.collection('Users').findOneAndDelete({_id: new ObjectID('5b6a51e332d7173024233c15')}).then((result) => {
    //     console.log(result);     
    // });

    client.close();
}); 
