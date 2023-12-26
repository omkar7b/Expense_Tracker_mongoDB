const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const downloadFileSchema = new Schema({
    fileUrl: {
        type: String,
        required: true
    },
    date: Date,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('DownloadFile', downloadFileSchema); 


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const downloadedFile = sequelize.define('downloadedFile', {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     fileURL: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     userId: Sequelize.INTEGER,
//     date : Sequelize.DATEONLY
// })

// module.exports = downloadedFile;