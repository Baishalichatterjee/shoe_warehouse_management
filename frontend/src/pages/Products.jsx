import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: 'Sports',
        size: '',
        buyingPrice: '',
        sellingPrice: '',
        stock: '',
        lowStockAlert: 5,
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                name: '', brand: '', category: 'Sports', size: '',
                buyingPrice: '', sellingPrice: '', stock: '', lowStockAlert: 5
            });
        }
    }, [product, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand:</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                                <option value="Sports">Sports</option>
                                <option value="Casual">Casual</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Size:</label>
                            <input type="number" name="size" value={formData.size} onChange={handleChange} required className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price (₹):</label>
                            <input type="number" name="buyingPrice" value={formData.buyingPrice} onChange={handleChange} required className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹):</label>
                            <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} required className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock:</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert:</label>
                            <input type="number" name="lowStockAlert" value={formData.lowStockAlert} onChange={handleChange} required className="input-field" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="btn-danger bg-gray-500 hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="btn-primary">SAVE PRODUCT</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

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

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSaveProduct = async (productData) => {
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, productData);
            } else {
                await api.post('/products', productData);
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="relative w-1/3">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <button onClick={handleAdd} className="btn-primary flex items-center">
                    <Plus size={18} className="mr-2" /> Add Product
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 uppercase text-gray-500 text-xs">
                        <tr>
                            <th className="px-6 py-3 text-left font-semibold tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left font-semibold tracking-wider">Brand</th>
                            <th className="px-6 py-3 text-left font-semibold tracking-wider">Size</th>
                            <th className="px-6 py-3 text-left font-semibold tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left font-semibold tracking-wider">Price</th>
                            <th className="px-6 py-3 text-center font-semibold tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product._id} className={`hover:bg-gray-50 ${product.stock <= product.lowStockAlert ? 'bg-red-50' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.size}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${product.stock <= product.lowStockAlert ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.sellingPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                        <button onClick={() => handleEdit(product)} className="btn-primary inline-flex text-xs py-1 px-2 items-center rounded-sm">
                                            <Edit2 size={12} className="mr-1" /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} className="btn-danger inline-flex text-xs py-1 px-2 items-center rounded-sm">
                                            <Trash2 size={12} className="mr-1" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={editingProduct}
                onSave={handleSaveProduct}
            />
        </div>
    );
};

export default Products;
