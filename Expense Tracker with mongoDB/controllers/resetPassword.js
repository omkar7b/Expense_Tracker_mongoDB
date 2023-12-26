const Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Forgotpassword = require('../models/forgotPassword');


exports.forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });

        if (user) {
            const id = uuid.v4();

            const userForgotPass = new Forgotpassword({
                userId: user._id,
                isactive: true,
                uuid: id,
            })

            await userForgotPass.save();

            // user.createForgotpassword({ id, isactive: true })
            // .then(res => console.log('Create forgotPassword Completed'))
            // .catch(err => {
            //     throw new Error(err)
            // })
                    const client = Sib.ApiClient.instance;
                    const apiKey = client.authentications['api-key'];
                    apiKey.apiKey = process.env.API_KEY;
                    const tranEmailApi = new Sib.TransactionalEmailsApi();

                    const sender = {
                        email: 'omkarbende777@gmail.com',
                        name: 'Omkar @ Expense Tracker App',
                    };

                    const receivers = [
                        {
                            email: req.body.email,
                        },
                    ];

                    tranEmailApi.sendTransacEmail({
                        sender,
                        to: receivers,
                        subject: 'Reset Password',
                        htmlContent: `<h2>Reset Password</h2>
                        <p> <a href='http://localhost:3000/password/resetpassword/${id}'>Click Here</a> to reset password</p>`,
                    })
                    .then((result) => {
                        console.log('Sent>>>>', result);
                        res.status(202).json({
                            success: true,
                            message: 'Reset Password Link sent successfully',
                        });
                    })
                    .catch((error) => {
                        console.error('SendinBlue Error:', error.response ? error.response.body : error.message);
                        throw new Error(error);
                    });
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Catch Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};


exports.resetPassword = async (req, res, next) => {
    try {
        const id = req.params.id;

        const forgotPassReq = await Forgotpassword.findOne({ _id: id, isactive: true });

        if (forgotPassReq.isactive) {
            forgotPassReq.isactive = false;
            forgotPassReq.save();

            res.status(200).send(`
                <html> 
                    <form id="resetPasswordForm" action="http://localhost:3000/password/updatepassword/${id}" method="POST">
                        <label for="newPassword">New Password</label>
                        <input name="newPassword" id="newPassword" type="password" required autocomplete="new-password">
                        <button type="submit">Reset Password</button>
                    </form>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js"></script>
                    <script>
                        document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
                            event.preventDefault();
                            const newPassword = document.getElementById('newPassword').value;
                            const id = "${id}"; // Use "${id}" for plain HTML templates
                            try {
                                const response = await axios.post(\`http://localhost:3000/password/updatepassword/\${id}\`, { newPassword });
                                console.log(newPassword);
                                console.log(response.data);
                                alert(response.data.message);
                            } catch (error) {
                                console.error(error);
                                alert('Error updating password.');
                            }
                        });
                    </script>
                </html>`
            );
        } else {
            console.log('isactive ==== false');
        }
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.json({ success: false, message: 'reset password controller failed' });
    }
}


exports.udpatePassword = async (req, res, next) => {
    try {
        const resetid = req.params.id || req.body.id; 

        if (!resetid) {
            return res.status(400).json({ success: false, message: 'Reset ID is missing' });
        }
        const resetPassReq = await Forgotpassword.findOne({ _id: resetid, isactive: false });

        if (!resetPassReq) {
            return res.status(404).json({ success: false, message: 'Reset request not found' });
        }

        const user = await User.findOne({ id: resetPassReq.userId });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const saltRounds = 10;
        const newPassword = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
       
        await User.findByIdAndUpdate({_id: user._id},{ password: hashedPassword });
        await resetPassReq.update({ isactive: true }); // update isactive back to true

        return res.status(201).json({ message: 'Password Updated Successfully', success: true });
    } catch (error) {
        console.error('Update Password Error:', error);
        return res.status(500).json({ err: error, success: false });
    }
};

