const express = require('express');
const Orders = require('../models/Orders');
const router = express.Router();
const isAuthenticated = require('../auth/test')

router.get('/', (require, response) => {
    Orders.find()
        .exec()
        .then(x => response.status(200).send(x));
});

router.get('/:id', (require, response) => {
    Orders.findById(require.params.id)
        .exec()
        .then(x => response.status(200).send(x));
})

router.post('/', (require, response) => {
    Orders.create(require.body)
        .then(x => {
            response.status(201),
            response.send(x)
        })
})

router.put('/:id', (require, response) => {
    Orders.findByIdAndUpdate(require.params.id, require.body)
        .then(() => response.sendStatus(204))
})

router.delete('/:id', (require, response) => {
    Orders.findByIdAndDelete(require.params.id).exec().then(() => response.sendStatus(204))
})

module.exports = router;