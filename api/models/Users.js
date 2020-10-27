const moongose = require('mongoose');
const Schema = moongose.Schema;

const Users = moongose.model('User', new Schema ({
    nombre: String,
    apellido: String,
    email: String,
    password: String,
    salt: String
}));

module.exports = Users;