const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        size: { type: Number, required: true },
        buyingPrice: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
        stock: { type: Number, required: true },
        lowStockAlert: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
