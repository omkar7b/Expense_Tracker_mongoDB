const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passwordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    isactive: Boolean,
    uuid: String,
})

module.exports = mongoose.model('Forgetpassword', passwordSchema)


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Forgotpassword = sequelize.define('forgotpassword', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true,
//     },
//     userId: Sequelize.INTEGER,
//     isactive: Sequelize.BOOLEAN
// })

// module.exports = Forgotpassword;