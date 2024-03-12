const User = require('../../model/userModel');

const renderWalletPage = async (req, res) => {
    try {
        const userId = req.session.userId;

        const user = await User.findById(userId).populate('wallet');

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('user/wallet', { wallet: user.wallet });
    } catch (error) {
        console.error('Error rendering wallet page:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = renderWalletPage;