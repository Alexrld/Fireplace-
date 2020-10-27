const express = require('express');
const moogose = require('mongoose');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

const auth = require('./routes/auth')
const meals = require('./routes/meals')
const orders = require('./routes/orders')

app.use(cors());
app.use(bodyParser.json());

moogose.connect(process.env.FIRE_URI, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/api/index', (require, response) => {
    response.send('Its working!!')
})

app.use('/api/auth', auth);
app.use('/api/meals', meals);
app.use('/api/orders', orders);


module.exports = app;