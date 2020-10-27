const express = require('express');
const Users = require('../models/Users');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken')


router.get('/', (require, response) => {
    Users.find()
        .exec()
        .then(x => response.status(200).send(x));
});

router.get('/:id', (require, response) => {
    Users.findById(require.params.id)
        .exec()
        .then(x => response.status(200).send(x));
})

const signToken = (_id) => {
    console.log({_id})
    return jwt.sign({ _id }, 'mi-secreto', {
        expiresIn: 60 * 60 * 24 * 365,
    })
}

router.post('/register', (require, response) => {
    const { nombre, apellido, email, password } = require.body;
    const randomSalt = crypto.randomBytes(64).toString('base64')
    crypto.pbkdf2(password, randomSalt, 10000, 64, 'sha1', (err, key) => {
        const encryptedPassword = key.toString('base64')
        Users.findOne({ email }).exec() //Busca por email para encontrar al usuario completo
            .then(user => {
                console.log(user)
                if (user) return response.send('El usuario ya existe!')
                Users.create({
                    nombre,
                    apellido,
                    email,
                    password: encryptedPassword,
                    salt: randomSalt
                }).then(() => response.send('Usuario creado con exito!'))
            })
    })
})

router.post('/login', (require, response) => {
    const { email, password } = require.body;
    Users.findOne({ email }).exec()
        .then(user => {
            if(!user) return response.send('Usuario y/o constraseña incorrectos')
            crypto.pbkdf2(password, user.salt, 10000, 64, 'sha1', (err, key) => {
                const encryptedPassword = key.toString('base64');
                console.log(encryptedPassword)
                if(encryptedPassword === user.password) {
                    const token = signToken(user._id)
                    response.send({ token })
                }else response.send('Usuario y/o constraseña incorrectos')
            }) 
        })
})

router.put('/:id', (require, response) => {
    Users.findByIdAndUpdate(require.params.id, require.body)
        .then(() => response.sendStatus(204))
})

router.delete('/:id', (require, response) => {
    Users.findByIdAndDelete(require.params.id).exec().then(() => response.sendStatus(204))
})

module.exports = router;
