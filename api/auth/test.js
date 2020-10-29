
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

const isAuthenticated = (require, response, next) => {
    //const token = localStorage.getItem('token')
    const token = require.headers.authorization
    if (!token) {
        response.sendStatus(403)
        console.log('Accesso denegado!!')
    }
    else {
        console.log('Acceso autorizado!!')
        jwt.verify(token, 'mi-secreto', (err, decoded) => {
            const { _id } = decoded
            Users.findOne({ _id }).exec()
                .then(user => {
                    console.log(user)
                    require.user = user
                    //require.user = user;
                    next();
                })
        })
    }
}

module.exports = isAuthenticated;