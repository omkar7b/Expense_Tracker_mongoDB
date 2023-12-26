const Expense = require('../models/expense.js'); // Adjust the path based on your project structure
const User = require('../models/user.js'); // Adjust the path based on your project structure

exports.addExpense = async (req, res, next) => {
    try {
        const { amount, description, category } = req.body;

        if (!amount || !description || !category) {
            return res.status(400).json({ error: 'Bad Parameters' });
        }

        const newExpense = new Expense({
            amount: amount,
            description: description,
            category: category,
            userId: req.user._id,
        });

        await newExpense.save();

        const user = await User.findById(req.user._id);
        console.log('///////' ,user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.totalExpense = (user.totalExpense || 0) + Number(amount);
        console.log('usertotal',user.totalExpense)
        await user.save();

        res.status(200).json({ newExpense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getExpense = async (req, res, next) => {
    try {
        const pagesize = +req.query.pagesize;
        const page = +req.query.page || 1;

        const count = await Expense.countDocuments({ userId: req.user._id });
        const offset = (page - 1) * pagesize;

        const expenses = await Expense.find({ userId: req.user._id })
            .skip(offset)
            .limit(pagesize);

        res.status(200).json({
            expenses,
            currentPage: page,
            hasNextPage: pagesize * page < count,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(count / pagesize),
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message || 'Error fetching expenses' });
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const deleteId = req.params.id;

        if (!deleteId) {
            return res.status(404).json({ message: 'Expense Not Found' });
        }

        const expenseToDelete = await Expense.findByIdAndDelete(deleteId);

        if (!expenseToDelete) {
            return res.status(404).json({ message: 'Expense Not Found' });
        }

        const amount = expenseToDelete.amount;

        const user = await User.findById(req.user._id);
        console.log('///////' ,user);

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        user.totalExpense = user.totalExpense - amount;

        await user.save();

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

