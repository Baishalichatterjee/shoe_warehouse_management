import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Orders() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products').then(setProducts).catch(console.error);
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    setSearch('');
    const existing = cart.find(c => c.product === product._id);
    if (existing) {
      setCart(cart.map(c =>
        c.product === product._id ? { ...c, qty: c.qty + 1 } : c
      ));
    } else {
      setCart([...cart, {
        product: product._id,
        name: product.name,
        qty: 1,
        price: product.sellingPrice
      }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.product !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(cart.map(c => c.product === id ? { ...c, qty: Number(qty) } : c));
  };

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    setError('');
    try {
      await api.post('/orders', { products: cart, paymentMethod });
      setSuccess('Sale completed successfully!');
      setCart([]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page-section">
      <div className="page-header">
        <h2 className="page-title">BILLING / SALES</h2>
      </div>

      <div className="section-card">
        <div className="search-box" style={{ marginBottom: '1rem' }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {search && filteredProducts.length > 0 && (
          <div className="product-dropdown">
            {filteredProducts.map(p => (
              <div key={p._id} className="product-option" onClick={() => addToCart(p)}>
                <span>{p.name}</span>
                <span className="product-option-meta">{p.brand} | Size {p.size} | ₹{p.sellingPrice} | Stock: {p.stock}</span>
              </div>
            ))}
          </div>
        )}

        <h3 className="sub-heading">Selected Items:</h3>

        {cart.length === 0 ? (
          <p className="empty-msg">No items added. Search and click a product to add it.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.product}>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      value={item.qty}
                      min={1}
                      onChange={e => updateQty(item.product, e.target.value)}
                      className="qty-input"
                    />
                  </td>
                  <td>₹{item.price.toLocaleString('en-IN')}</td>
                  <td>₹{(item.price * item.qty).toLocaleString('en-IN')}</td>
                  <td><button className="btn-delete" onClick={() => removeFromCart(item.product)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="billing-footer">
          <div className="subtotal-row">
            <span className="subtotal-label">Subtotal:</span>
            <span className="subtotal-value">₹{subtotal.toLocaleString('en-IN')}</span>
            <span className="subtotal-total">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="payment-row">
            <label className="payment-label">Payment:</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="form-input payment-select"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
              <option>Cash/UPI</option>
            </select>
          </div>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <button
            className="btn-complete-sale"
            onClick={handleCompleteSale}
            disabled={placing || cart.length === 0}
          >
            {placing ? 'Processing...' : 'COMPLETE SALE'}
          </button>
        </div>
      </div>
    </div>
  );
}