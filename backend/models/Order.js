const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                price: { type: Number, required: true }, // selling price at that time
                buyingPrice: { type: Number, required: true }, // for profit calculation
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalProfit: {
            type: Number,
            required: true,
            default: 0.0,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
