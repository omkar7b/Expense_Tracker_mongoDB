const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(id, ispremiumuser) {
    return jwt.sign({ userId: id, ispremiumuser }, 'secretkey');
}

exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password} = req.body;
        console.log(name,email,password)

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Bad Parameters' });
        }
        const userExist = await User.findOne({ email:email });

        if (userExist) {
            console.log('User Already Exists');
            return res.status(409).json({ error: 'User Already Exists' });
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err);
            const newUser = new User({
                name: name,
                email: email,
                password: hash
            });
            await newUser.save();
            return res.status(201).json({ success: true, message: 'Account Created Successfully' });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }

        bcrypt.compare(password, userExist.password, (err, result) => {
            if (err) {
                throw new Error('Something went wrong!');
            }
            if (result) {
                console.log(userExist._id,'>>>>')
                return res.status(200).json({ success: true, message: 'User Login Successful', token: generateAccessToken(userExist._id, userExist.ispremiumuser) });
            } else {
                return res.status(401).json({ success: false, message: 'Incorrect Password' });
            }
        });
    } catch (error) {
        console.log('Error', error);
        return res.status(404).json({ success: false, message: 'User Not Found' });
    }
}

exports.generateAccessToken = generateAccessToken;
