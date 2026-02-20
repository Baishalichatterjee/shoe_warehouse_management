const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@shoeshop.com',
                password: 'password123', // Will be hashed by pre-save middleware but insertMany bypasses it. Actually, wait!
            }
        ]);

        // To ensure password hashing, we'll save individually or use create
        await User.deleteMany();
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@shoeshop.com',
            password: 'password123',
            role: 'Owner'
        });
        await adminUser.save();

        const sampleProducts = [
            {
                name: 'Nike Air Max',
                brand: 'Nike',
                category: 'Sports',
                size: 9,
                buyingPrice: 3000,
                sellingPrice: 4500,
                stock: 2,
                lowStockAlert: 5,
            },
            {
                name: 'Adidas Run',
                brand: 'Adidas',
                category: 'Sports',
                size: 8,
                buyingPrice: 2500,
                sellingPrice: 3800,
                stock: 1,
                lowStockAlert: 5,
            },
            {
                name: 'Puma Flex',
                brand: 'Puma',
                category: 'Casual',
                size: 10,
                buyingPrice: 2000,
                sellingPrice: 3200,
                stock: 10,
                lowStockAlert: 3,
            },
            {
                name: 'Reebok Classic',
                brand: 'Reebok',
                category: 'Casual',
                size: 7,
                buyingPrice: 1800,
                sellingPrice: 2800,
                stock: 15,
                lowStockAlert: 4,
            }
        ];

        const createdProducts = await Product.insertMany(sampleProducts);

        // Initial Orders for Last 6 months dummy data
        const today = new Date();
        const monthsAgo = (m) => {
            const d = new Date();
            d.setMonth(d.getMonth() - m);
            return d;
        };

        const dummyOrders = [
            {
                products: [{ product: createdProducts[0]._id, name: createdProducts[0].name, qty: 2, price: 4500, buyingPrice: 3000 }],
                paymentMethod: 'Cash',
                totalAmount: 9000,
                totalProfit: 3000,
                createdAt: today,
            },
            {
                products: [{ product: createdProducts[1]._id, name: createdProducts[1].name, qty: 1, price: 3800, buyingPrice: 2500 }],
                paymentMethod: 'UPI',
                totalAmount: 3800,
                totalProfit: 1300,
                createdAt: monthsAgo(1),
            },
            {
                products: [{ product: createdProducts[2]._id, name: createdProducts[2].name, qty: 3, price: 3200, buyingPrice: 2000 }],
                paymentMethod: 'Cash',
                totalAmount: 9600,
                totalProfit: 3600,
                createdAt: monthsAgo(2),
            }
        ];

        await Order.insertMany(dummyOrders);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
