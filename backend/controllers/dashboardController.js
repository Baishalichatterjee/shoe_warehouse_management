const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Today Sales
        const todayOrders = await Order.find({ createdAt: { $gte: today } });
        const todaySales = todayOrders.reduce((acc, order) => acc + order.totalAmount, 0);

        // This Month Sales
        const monthOrders = await Order.find({ createdAt: { $gte: startOfMonth } });
        const thisMonthSales = monthOrders.reduce((acc, order) => acc + order.totalAmount, 0);

        // Total Profit (Overall)
        const allOrders = await Order.find({});
        const totalProfit = allOrders.reduce((acc, order) => acc + order.totalProfit, 0);

        // Total Products Count
        const totalProducts = await Product.countDocuments();

        // Low Stock Items
        const lowStockItems = await Product.find({ $expr: { $lte: ['$stock', '$lowStockAlert'] } });

        // Monthly Sales (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const recentOrders = await Order.find({ createdAt: { $gte: sixMonthsAgo } });

        const monthlySalesMap = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            monthlySalesMap[`${monthNames[d.getMonth()]}`] = 0;
        }

        recentOrders.forEach(order => {
            const monthStr = monthNames[order.createdAt.getMonth()];
            if (monthlySalesMap[monthStr] !== undefined) {
                monthlySalesMap[monthStr] += order.totalAmount;
            }
        });

        const monthlySalesData = Object.keys(monthlySalesMap).map(key => ({
            name: key,
            sales: monthlySalesMap[key]
        }));

        res.json({
            todaySales,
            thisMonthSales,
            totalProfit,
            totalProducts,
            lowStockItems,
            monthlySalesData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reports for a specific month
// @route   GET /api/dashboard/reports?month=YYYY-MM
// @access  Private
const getReports = async (req, res) => {
    try {
        const { month } = req.query; // format: 2026-01

        if (!month) {
            return res.status(400).json({ message: 'Month parameter is required' });
        }

        const [year, monthIndex] = month.split('-');

        const startDate = new Date(year, parseInt(monthIndex) - 1, 1);
        const endDate = new Date(year, parseInt(monthIndex), 0, 23, 59, 59);

        const orders = await Order.find({
            createdAt: { $gte: startDate, $lte: endDate }
        }).populate('products.product');

        let totalSales = 0;
        let totalProfit = 0;
        let totalItemsSold = 0;

        const categorySales = {
            Sports: 0,
            Casual: 0,
            Other: 0
        };

        orders.forEach(order => {
            totalSales += order.totalAmount;
            totalProfit += order.totalProfit;

            order.products.forEach(item => {
                totalItemsSold += item.qty;

                let category = 'Other';
                // if product was populated and has category
                if (item.product && item.product.category) {
                    category = item.product.category;
                }

                if (categorySales[category] !== undefined) {
                    categorySales[category] += (item.qty * item.price);
                } else {
                    categorySales.Other += (item.qty * item.price);
                }
            });
        });

        const categoryData = Object.keys(categorySales).map(key => ({
            name: key,
            value: categorySales[key]
        })).filter(c => c.value > 0);

        res.json({
            totalSales,
            totalProfit,
            totalItemsSold,
            categoryData
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getReports
};
