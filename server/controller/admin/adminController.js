const admin = require('../../model/userModel');
const Order = require('../../model/orderModel');
const bcrypt = require('bcrypt');


const verifyLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await admin.findOne({ email });
        if (user) {
            // Check if the email is verified
            if (await bcrypt.compare(password, user.password)) {
                console.log(user.is_admin);
                // Check if the user is an admin
                if (user.is_admin === 1) {
                    // Successful login for admin, create a session
                    req.session.adminUserId = user.id;
                    res.redirect('/admin/dashboard'); // Redirect to admin home page
                } 
            } else {
                // Failed login
                res.send('Invalid email, password, or email not verified');
            }
        } else {
            // User not found
            res.send('Invalid email, password, or email not verified');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const loadLogin = async (req, res) => {
    try {

        res.set('Cache-Control', 'no-store')
        res.render("admin/login");

    } catch (error) {
        res.render("error/internalError", { error })
    }

};
const userLogout = async (req, res) => {
    try {

        req.session.destroy();

        // Redirect to the login page
        res.redirect('/admin');
    } catch (error) {
        res.render("error/internalError", { error });
    }
};


const loadDashboard = async (req, res) => {
    try {
        const allOrders = await Order.find();
        const deliveredOrders = await Order.find({ status: 'Delivered' });
        const shippedOrders = await Order.find({ status: 'Shipped' });
        const processingOrders = await Order.find({ status: 'Processing' });
        const totalOrdersCount = allOrders.length;
        res.render("admin/dashboard",{totalOrdersCount});
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
  verifyLogin,
  loadLogin,
  loadDashboard,
  userLogout
};