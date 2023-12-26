const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense');
const premiumRoutes = require('./routes/purchase');
const premiumFeatureRoute = require('./routes/premiumFeature');
const passwordRoutes = require('./routes/resetPassword');

// const User = require('./models/user')
// const Expense = require('./models/expense');
// const Order = require('./models/order');
// const Forgotpassword = require('./models/forgotPassword');
// const downloadedFile = require('./models/downloadedFile');

require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log',), { flags: 'a' });

app.use(bodyParser.json({ extended: false}));
app.use(cors({
    origin: "*"
}));
app.use(helmet({ contentSecurityPolicy: false,}));
app.use(morgan('combined', { stream: accessLogStream })); 

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase', premiumRoutes);
app.use('/premium', premiumFeatureRoute);
app.use('/password', passwordRoutes);


// app.use(express.static(path.join(__dirname, 'views')));
app.use((req, res) => {
    console.log('url>>', req.url)
    res.sendFile(path.join(__dirname, `views/${req.url}`))
})


// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(Forgotpassword);
// Forgotpassword.belongsTo(User);

// User.hasMany(downloadedFile);
// downloadedFile.belongsTo(User);

// sequelize.sync() 
//     .then(() => {
//         app.listen(3000);
//         console.log('successful');
//     })
//     .catch((err) => {
//         console.log(err);
//     });
   
mongoose.connect('mongodb+srv://Omkar:AkSKpLZgv8PElZih@cluster1.bi7gilh.mongodb.net/expense?retryWrites=true&w=majority')
        .then(() => {
            app.listen(3000);
            console.log('successful');
        })
        .catch((err) => {
            console.log(err);
        });
