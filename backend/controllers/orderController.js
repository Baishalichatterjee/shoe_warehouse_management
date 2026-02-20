const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { products, paymentMethod } = req.body;

        if (products && products.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        let totalAmount = 0;
        let totalProfit = 0;

        // Attach current buyingPrice to the order products and check stock
        for (let i = 0; i < products.length; i++) {
            const dbProduct = await Product.findById(products[i].product);
            if (!dbProduct) {
                return res.status(404).json({ message: `Product not found: ${products[i].name}` });
            }

            if (dbProduct.stock < products[i].qty) {
                return res.status(400).json({ message: `Not enough stock for ${dbProduct.name}` });
            }

            products[i].buyingPrice = dbProduct.buyingPrice;
            totalAmount += products[i].price * products[i].qty;
            totalProfit += (products[i].price - dbProduct.buyingPrice) * products[i].qty;
        }

        const order = new Order({
            products,
            paymentMethod,
            totalAmount,
            totalProfit,
        });

        const createdOrder = await order.save();

        // Reduce stock
        for (let i = 0; i < products.length; i++) {
            const dbProduct = await Product.findById(products[i].product);
            dbProduct.stock -= products[i].qty;
            await dbProduct.save();
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
};
