const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: 'your_secret_key_here', // Change this to a random secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Sample products (fallback if MongoDB unavailable)
const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Laptop',      price: 1000, description: 'A powerful laptop' },
  { id: 2, name: 'Phone',       price: 500,  description: 'Latest smartphone' },
  { id: 3, name: 'Headphones',  price: 100,  description: 'Noise-cancelling headphones' }
];

// MongoDB Product schema
const productSchema = new mongoose.Schema({
  id:          { type: Number, unique: true },
  name:        String,
  price:       Number,
  description: String
});
const Product = mongoose.model('Product', productSchema);

// MongoDB connection
let useDb = false;

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  serverSelectionTimeoutMS: 5000
})
  .then(async () => {
    useDb = true;
    console.log('MongoDB connected');
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(SAMPLE_PRODUCTS);
      console.log('Sample products seeded');
    }
  })
  .catch(() => {
    useDb = false;
    console.warn('MongoDB unavailable — using in-memory sample data');
  });

// Helpers
async function getAllProducts() {
  if (useDb) return Product.find();
  return SAMPLE_PRODUCTS;
}

async function getProduct(productId) {
  if (useDb) return Product.findOne({ id: productId });
  return SAMPLE_PRODUCTS.find(p => p.id === productId) || null;
}

// ── Routes ──────────────────────────────────────────────

// GET /
app.get('/', async (req, res) => {
  const products = await getAllProducts();
  res.render('index', { products, db_available: useDb });
});

// GET /add_to_cart/:product_id
app.get('/add_to_cart/:product_id', (req, res) => {
  const productId = parseInt(req.params.product_id, 10);
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push(productId);
  res.redirect('/');
});

// GET /cart
app.get('/cart', async (req, res) => {
  const cartItems = [];
  let total = 0;
  if (req.session.cart && req.session.cart.length > 0) {
    for (const pid of req.session.cart) {
      const product = await getProduct(pid);
      if (product) {
        cartItems.push(product);
        total += product.price;
      }
    }
  }
  res.render('cart', { cart_items: cartItems, total, db_available: useDb });
});

// GET /checkout
app.get('/checkout', (req, res) => {
  req.session.cart = [];
  res.render('checkout');
});

// ── Start server ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
