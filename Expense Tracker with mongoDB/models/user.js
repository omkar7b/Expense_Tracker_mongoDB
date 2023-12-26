const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ispremiumuser: {
    type: Boolean,
    default: false,
  },
  totalExpense: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('User', userSchema);


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         unique: true
//     },
//     name: {
//         type: Sequelize.STRING,
//         allowNUll : false
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull : false,
//         unique : true
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull : false
//     },
//     ispremiumuser : {
//         type: Sequelize.BOOLEAN
//     },
//     totalExpense: {
//         type: Sequelize.DECIMAL,
//         defaultValue: 0
//     }
// })

// module.exports = User;
