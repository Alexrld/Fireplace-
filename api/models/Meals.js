const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Meals = mongoose.model('Meal', new Schema({
    nombre: String,
    descripcion: String
}));

module.exports = Meals;