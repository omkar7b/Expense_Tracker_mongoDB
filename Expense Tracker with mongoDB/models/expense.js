const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    }
})


module.exports = mongoose.model('Expense', expenseSchema);
// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Expense = sequelize.define('expenses', {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         unique: true,
//         primaryKey: true
//     },
//     amount: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     category: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     }
// })

// module.exports = Expense;