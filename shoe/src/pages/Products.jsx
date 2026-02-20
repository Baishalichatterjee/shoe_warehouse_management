import { useState, useEffect } from 'react';
import { api } from '../services/api';

const emptyForm = {
  name: '', brand: '', category: 'Sports', size: '', buyingPrice: '', sellingPrice: '', stock: '', lowStockAlert: 5
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const data = await api.get('/products');
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product) => {
    setForm({
      name: product.name, brand: product.brand, category: product.category,
      size: product.size, buyingPrice: product.buyingPrice, sellingPrice: product.sellingPrice,
      stock: product.stock, lowStockAlert: product.lowStockAlert
    });
    setEditId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const updated = await api.put(`/products/${editId}`, form);
        setProducts(products.map(p => p._id === editId ? updated : p));
      } else {
        const created = await api.post('/products', form);
        setProducts([created, ...products]);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="page-section">
      <div className="page-header">
        <h2 className="page-title">PRODUCTS</h2>
        <div className="page-header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}>
            + Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="section-card form-card">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <label>Product Name:</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="form-input" />
            </div>
            <div className="form-row">
              <label>Brand:</label>
              <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required className="form-input" />
            </div>
            <div className="form-row">
              <label>Category:</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-input">
                <option>Sports</option>
                <option>Casual</option>
                <option>Formal</option>
              </select>
            </div>
            <div className="form-row">
              <label>Size:</label>
              <input type="number" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} required className="form-input" />
            </div>
            <div className="form-row">
              <label>Buying Price:</label>
              <input type="number" value={form.buyingPrice} onChange={e => setForm({ ...form, buyingPrice: e.target.value })} required className="form-input" />
            </div>
            <div className="form-row">
              <label>Selling Price:</label>
              <input type="number" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: e.target.value })} required className="form-input" />
            </div>
            <div className="form-row">
              <label>Stock:</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required className="form-input" />
            </div>
            <div className="form-row">
              <label>Low Stock Alert:</label>
              <input type="number" value={form.lowStockAlert} onChange={e => setForm({ ...form, lowStockAlert: e.target.value })} className="form-input" />
            </div>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Saving...' : 'SAVE PRODUCT'}
            </button>
          </form>
        </div>
      )}

      <div className="section-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Size</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No products found</td></tr>
            ) : (
              filtered.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>{p.size}</td>
                  <td>
                    <span className={p.stock <= p.lowStockAlert ? 'stock-low' : 'stock-ok'}>
                      {p.stock}
                    </span>
                  </td>
                  <td>₹{p.sellingPrice.toLocaleString('en-IN')}</td>
                  <td className="action-col">
                    <button className="btn-edit" onClick={() => handleEdit(p)}>✏️ Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(p._id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}