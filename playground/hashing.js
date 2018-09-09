const {SHA256} = require('crypto-js'); // for playground only
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

var password = '123abc';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//        console.log(hash);  
//     });
// }); 

var hashedPassword = '$2a$10$r8NSGSqvoxs4FVq7yxtMNOdV.2yqKc0T7O3.JJwjgi7h6wHX8XzYy';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res); 
})
// var data = {
//     id: 10
// };
// var token = jwt.sign(data, 'somesecret');
// console.log('token: ',token); 
// var decoded = jwt.verify(token,'somesecret');
// console.log('decoded: ',decoded); 

// // ------------ simulation of JSON web token management ----------

// var message = 'I am user number 3'; 
// var hash = SHA256(message).toString(); 

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// // changing without salting with the correct secret not allowed
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString(); 

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString(); 

// if (resultHash === token.hash) {
//     console.log('Data was not changed'); 
// } else {
//     console.log('Data was changed. Do not trust!'); 
// }
