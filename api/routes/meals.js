const express = require('express');
const Meals = require('../models/Meals');
const router = express.Router();
const isAuthenticated = require('../auth/test')

router.get('/', isAuthenticated, (require, response) => {
    Meals.find()
        .exec()
        .then(x => response.status(200).send(x));
});

router.get('/:id', (require, response) => {
    Meals.findById(require.params.id)
        .exec()
        .then(x => response.status(200).send(x));
})

router.post('/', (require, response) => {
    Meals.create(require.body)
        .then(x => {
            response.status(201),
            response.send(x)
        })
})

router.put('/:id', (require, response) => {
    Meals.findByIdAndUpdate(require.params.id, require.body)
        .then(() => response.sendStatus(204))
})

router.delete('/:id', (require, response) => {
    Meals.findByIdAndDelete(require.params.id).exec().then(() => response.sendStatus(204))
})

module.exports = router;