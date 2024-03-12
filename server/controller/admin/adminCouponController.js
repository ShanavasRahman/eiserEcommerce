const Coupon = require('../../model/couponModel');


const loadCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.render("admin/coupon", { coupons });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
};



const addCoupon = async (req, res) => {
    try {
        const { discountType, minPurchaseAmount, usageLimit, discountAmount } = req.body;

        // Validate input fields
        if (minPurchaseAmount < 0 || discountAmount < 0 || usageLimit < 0) {
            return res.status(400).json({ error: 'Amounts and usage limit cannot be less than 0' });
        }

        if (discountType === 'Fixed amount' && discountAmount > minPurchaseAmount) {
            return res.status(400).json({ error: 'Discount amount cannot be greater than minimum purchase amount' });
        }

        if (discountType === 'Percentage' && (discountAmount < 0 || discountAmount > 100)) {
            return res.status(400).json({ error: 'Percentage discount amount must be between 0 and 100' });
        }

        const couponCode = Coupon.generateCouponCode();
        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 7);

        const coupon = new Coupon({
            couponCode,
            discountType,
            expirationTime,
            discountAmount,
            minPurchaseAmount,
            usageLimit
        });

        await coupon.save();

        // Send success response
        res.status(200).json({ message: 'Coupon created successfully' });
    } catch (error) {
        // Send error response
        res.status(500).json({ error: 'Internal server error' });
    }
};


const updateCoupon = async (req, res) => {
    try {
        const { editCouponId, editDiscountType, editMinPurchaseAmount, editDescription, editDiscountAmount } = req.body;

        // Validate input fields
        if (editMinPurchaseAmount < 0 || editDiscountAmount < 0) {
            return res.status(400).json({ success: false, error: 'Amounts cannot be less than 0' });
        }

        if (editDiscountType === 'Fixed amount' && editDiscountAmount > editMinPurchaseAmount) {
            return res.status(400).json({ success: false, error: 'Discount amount cannot be greater than minimum purchase amount' });
        }

        if (editDiscountType === 'Percentage' && (editDiscountAmount < 0 || editDiscountAmount > 100)) {
            return res.status(400).json({ success: false, error: 'Percentage discount amount must be between 0 and 100' });
        }

        const coupon = await Coupon.findById(editCouponId);

        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Coupon not found' });
        }

        coupon.discountType = editDiscountType;
        coupon.minPurchaseAmount = editMinPurchaseAmount;
        coupon.description = editDescription;
        coupon.discountAmount = editDiscountAmount;

        await coupon.save();

        res.status(200).json({ success: true, message: 'Coupon updated successfully' });
    } catch (error) {
        console.error('Error updating coupon:', error);
        res.status(500).json({ success: false, message: 'Error updating coupon' });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.body;

        // Perform deletion operation
        await Coupon.findByIdAndDelete(couponId);

        res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ success: false, message: 'Error deleting coupon' });
    }
};



module.exports = {
    loadCoupon,
    addCoupon,
    updateCoupon,
    deleteCoupon
};