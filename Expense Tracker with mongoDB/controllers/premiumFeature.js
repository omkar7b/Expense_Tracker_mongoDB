const User = require('../models/user');
const Expense = require('../models/expense');
//const sequelize = require('../util/database');
const DownloadFile = require('../models/downloadedFile.js');
const AWS = require('aws-sdk');

// exports.getLeaderboard = async (req, res) => {
//     try {
//         const userAggregatedExpenses = await User.findAll({
//             order:  [[('totalExpense'), 'DESC']]
//         });
//         console.log(userAggregatedExpenses);
//         res.transactionStatus(200).json(userAggregatedExpenses);
//     } catch (error) {
//         console.log(error);
//         res.transactionStatus(500).json(error);
//     }
// }

exports.getLeaderboard = async (req, res) => {
    try {
        const userAggregatedExpenses = await User.find()
            .sort({ totalExpense: 'desc' })
            .exec();

        console.log(userAggregatedExpenses);
        res.status(200).json(userAggregatedExpenses);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

function uploadToS3(data, filename){
    
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
    });

        let params = {
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read' // Access Control Level
        }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) =>{
            if(err) {
             console.log('Something Went Wrong');
             reject(err);
            } else {
             console.log('success', s3response);
              resolve(s3response.Location);
            }
         })
    })
}

exports.downloadExpense = async (req, res, next) => {
    try {
        if (!req.user.ispremiumuser) {
            return res.status(401).json({ message: 'Buy Premium to Download Report', success: false });
        }
        console.log('donwloaded')
        const expenses = await Expense.find({userId: req.user._id});
        const stringifiedExpenses = JSON.stringify(expenses);

        const userId = req.user._id;

        const filename = `Expense${userId}/${new Date()}.txt`; 
        const fileUrl = await uploadToS3(stringifiedExpenses, filename);

        const downloadedFile = new DownloadFile({
            fileUrl: fileUrl,
            date: Date.now(),
            userId: req.user._id, 
        });     
        await downloadedFile.save();

        res.status(200).json({ fileUrl, success: true });
    } catch (error) {
        res.status(500).json({ fileUrl: '', success: false, error: error });
        console.log(error);
    }
};


exports.recentlydownloadedFile = async (req,res, next) => {
    try {
        const recentdownloadedFile = await DownloadFile.find({userId: req.user._id});
       // console.log(recentdownloadedFile,'//////////////');
        res.status(200).json(recentdownloadedFile);
    } catch (err){
        res.status(500).json(err)
    }
    
}



// const userAggregatedExpenses = await User.findAll({
//     attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalExpense']],
//     include: [
//         {
//             model: Expense,
//             attributes: []
//         }
//     ],
//     group: ['user.id'],
//     order: [[('totalExpense'), 'DESC']]
// });



// const expenses = await Expense.findAll({
        //     attributes: ['userId', [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total_cost']],
        //     group: ['userId']
        // });
        
        //const userAggregatedExpenses = {};
        // expenses.forEach(expense => {
        //     if (userAggregatedExpenses[expense.userId]) {
        //         userAggregatedExpenses[expense.userId] += expense.amount;
        //     } else {
        //         userAggregatedExpenses[expense.userId] = expense.amount;
        //     }
        // });

        // const userLeaderboardDetails = [];
        // user.forEach((user) => {
        //     userLeaderboardDetails.push({
        //         name: user.name, 
        //         totalExpense: userAggregatedExpenses[user.id] || 0 // Use 0 if no expenses found
        //     });
        // });
        // console.log(expenses);
        // userLeaderboardDetails.sort((a,b) => b.totalExpense-a.totalExpense);