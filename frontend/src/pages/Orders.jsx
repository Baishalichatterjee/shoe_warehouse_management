import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search } from 'lucide-react';

const Orders = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product) => {
        const existingIndex = cart.findIndex(item => item.product === product._id);
        if (existingIndex >= 0) {
            const newCart = [...cart];
            if (newCart[existingIndex].qty < product.stock) {
                newCart[existingIndex].qty += 1;
                setCart(newCart);
            } else {
                alert('Not enough stock!');
            }
        } else {
            if (product.stock > 0) {
                setCart([...cart, {
                    product: product._id,
                    name: product.name,
                    price: product.sellingPrice,
                    maxStock: product.stock,
                    qty: 1
                }]);
            } else {
                alert('Out of stock!');
            }
        }
    };

    const updateQty = (id, newQty) => {
        const newCart = cart.map(item => {
            if (item.product === id) {
                if (newQty > item.maxStock) {
                    alert('Not enough stock!');
                    return item;
                }
                if (newQty < 1) return null;
                return { ...item, qty: newQty };
            }
            return item;
        }).filter(Boolean);
        setCart(newCart);
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.product !== id));
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const handleCompleteSale = async () => {
        if (cart.length === 0) return alert('Cart is empty');

        try {
            const orderData = {
                products: cart.map(item => ({
                    product: item.product,
                    name: item.name,
                    qty: item.qty,
                    price: item.price
                })),
                paymentMethod
            };

            await api.post('/orders', orderData);
            alert('Sale Completed Successfully!');
            setCart([]);

            // Refresh product list to get new stock values
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Error completing sale:', error);
            alert(error.response?.data?.message || 'Failed to complete sale');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex gap-6 h-full">
            {/* Product Search Area */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide border-b pb-2">Billing / Sales</h2>

                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search Product..."
                        className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50 text-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                    {loading ? (
                        <p>Loading products...</p>
                    ) : (
                        filteredProducts.map(product => (
                            <div
                                key={product._id}
                                onClick={() => addToCart(product)}
                                className={`p-4 border rounded cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center ${product.stock === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white'}`}
                            >
                                <div>
                                    <h4 className="font-bold text-gray-800">{product.name}</h4>
                                    <p className="text-sm text-gray-500">{product.brand} - {product.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary">₹{product.sellingPrice}</p>
                                    <p className={`text-xs ${product.stock <= product.lowStockAlert ? 'text-red-500 font-bold' : 'text-gray-500'}`}>Stock: {product.stock}</p>
                                </div>
                            </div>
                        ))
                    )}
                    {filteredProducts.length === 0 && !loading && (
                        <p className="text-gray-500 italic col-span-2">No products found matching "{searchTerm}"</p>
                    )}
                </div>
            </div>

            {/* Cart Area */}
            <div className="w-1/3 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-bold text-gray-800">Selected Items:</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10 italic">Cart is empty</div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product} className="flex justify-between items-center bg-white p-3 py-2 border rounded text-sm relative">
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">{item.name}</p>
                                    <p className="text-gray-500">₹{item.price}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="number"
                                        className="w-16 border rounded text-center py-1"
                                        value={item.qty}
                                        min="1"
                                        onChange={(e) => updateQty(item.product, parseInt(e.target.value) || 1)}
                                    />
                                    <span className="font-bold text-gray-800 w-16 text-right">₹{item.price * item.qty}</span>
                                    <button onClick={() => removeFromCart(item.product)} className="text-red-500 hover:text-red-700 ml-2 font-bold px-2">✕</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t bg-white">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <span className="text-xl font-bold text-gray-700 font-sans tracking-wide">Subtotal:</span>
                        <span className="text-3xl font-bold text-gray-800 font-sans">₹{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <span className="text-gray-700 font-bold tracking-wide">Payment:</span>
                        <select
                            className="input-field w-2/3 shadow-sm border-gray-300"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="Cash/UPI">Cash/UPI</option>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Card">Card</option>
                        </select>
                    </div>

                    <button
                        onClick={handleCompleteSale}
                        disabled={cart.length === 0}
                        className={`w-full py-4 text-xl font-bold rounded shadow-md transition-colors ${cart.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#2E8B57] hover:bg-green-700 text-white'}`}
                    >
                        COMPLETE SALE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Orders;
