const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const usercontroller = require('./user');

exports.purchasePremium = async (req, res, next) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.razorpay_key_id,
            key_secret: process.env.razorpay_key_secret
        });
        const amount = 1500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                console.error(err);
                return res.status(403).json({ message: 'Something Went Wrong', error: err });
            }
            try {
                const createOrder = new Order({
                    rzpOrderId: order.id,
                    transactionStatus: 'PENDING',
                    userId: req.user._id,
                });

                await createOrder.save();

                return res.status(201).json({ order: createOrder, key_id: rzp.key_id });
            } catch (err) {
                console.error(err);
                return res.status(403).json({ message: 'Something Went Wrong', error: err });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Something Went Wrong', error });
    }
};


exports.updateTransactiontransactionStatus = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ rzpOrderId: order_id });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const userId = order.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.updateOne({ ispremiumuser: true });
        const token = usercontroller.generateAccessToken(userId, true);

        await order.updateOne({ rzpPaymentId: payment_id, transactionStatus: 'SUCCESSFUL' });

        return res.status(202).json({ success: true, message: "Transaction Successful", token });
    } catch (error) {
        console.error(error);
        return res.status(403).json({ error: error, message: 'Something went wrong' });
    }
};


exports.showPremium = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, user });
    } catch (err) {
        console.error(err);
        return res.status(404).json({ success: false, message: 'User is not found' });
    }
};

