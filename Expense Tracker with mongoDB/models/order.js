const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    rzpPaymentId : String,
    rzpOrderId: String,
    transactionStatus : String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }

})

module.exports = mongoose.model('Order', orderSchema);

// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Order = sequelize.define('order',{
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     rzpPaymentId : Sequelize.STRING,
//     rzpOrderId: Sequelize.STRING,
//     transactionStatus : Sequelize.STRING
// });

// module.exports = Order;