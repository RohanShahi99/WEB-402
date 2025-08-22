console.log('Current directory:', __dirname);
//console.log('Trying to load from:', path.resolve('../models/Ingredient.js'));
const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    unit: {
        type: String,
        default: 'pieces'
    }
}, { timestamps: true });

module.exports = mongoose.model('Ingredients', ingredientSchema);