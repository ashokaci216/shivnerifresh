// Global cart object
let cart = {};
let allProducts = []; // Store all products for category filtering

// Load products and initialize page
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    displayProducts(data);
    displayCategories(data);
    setupSearch(data);
  });

function displayProducts(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
card.innerHTML = `
  <div class="product-info">
    <h3>${product.name}</h3>
    <p>₹${product.price.toFixed(2)}</p>
  </div>
  <div class="qty-controls">
    <button onclick="updateQty('${product.name}', -1)">➖</button>
    <span id="qty-${product.name}">0</span>
    <button onclick="updateQty('${product.name}', 1)">➕</button>
  </div>
  <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
  <div class="in-cart" id="incart-${product.name}"></div>
`;
    productList.appendChild(card);
  });
}

function displayCategories(products) {
  const categoryListDiv = document.getElementById('category-list');
  const categories = ["All", ...new Set(products.map(p => p.category))];
  categoryListDiv.innerHTML = 
    categories.map(category => `
      <button class="category-btn" onclick="filterByCategory('${category}')">${category}</button>
    `).join('');
}

function filterByCategory(category) {
  if (category === "All") {
    displayProducts(allProducts);
  } else {
    const filtered = allProducts.filter(product => product.category === category);
    displayProducts(filtered);
  }
}

function updateQty(name, change) {
  const span = document.getElementById(`qty-${name}`);
  let qty = parseInt(span.innerText) + change;
  qty = qty < 0 ? 0 : qty;
  span.innerText = qty;
}

function addToCart(name, price) {
  const qty = parseInt(document.getElementById(`qty-${name}`).innerText);
  if (qty > 0) {
    cart[name] = cart[name] || { price, quantity: 0 };
    cart[name].quantity += qty;
    document.getElementById(`qty-${name}`).innerText = 0;
    document.getElementById(`incart-${name}`).innerText = `Already in cart: ${cart[name].quantity}`;
    updateCartDisplay();
  }
}

function updateCartDisplay() {
  document.getElementById('cart-section').classList.remove('hidden');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  cartItems.innerHTML = '';
  let total = 0;
  let count = 0;
  Object.entries(cart).forEach(([name, item]) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    count += item.quantity;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <strong>${name}</strong><br>
      ₹${item.price.toFixed(2)} x 
      <button onclick="changeCartQty('${name}', -1)">➖</button>
      ${item.quantity}
      <button onclick="changeCartQty('${name}', 1)">➕</button>
      = ₹${itemTotal.toFixed(2)}
      <button onclick="removeFromCart('${name}')">❌</button>
    `;
    cartItems.appendChild(div);
  });
  cartCount.innerText = count;
  document.getElementById('totalItems').innerText = `Total Items: ${count}`;
  document.getElementById('cart-total').innerText = `Grand Total: ₹${total.toFixed(2)}`;
  document.getElementById('clearCart').addEventListener('click', () => {
  cart = {};
  updateCartDisplay();
});
}

function changeCartQty(name, change) {
  cart[name].quantity += change;
  if (cart[name].quantity <= 0) delete cart[name];
  updateCartDisplay();
}

function removeFromCart(name) {
  delete cart[name];
  updateCartDisplay();
}

function setupSearch(products) {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', () => {
    const keyword = input.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
    displayProducts(filtered);
  });
}
// Slide-In Cart Panel Toggle
document.getElementById('cart-icon').addEventListener('click', () => {
  document.getElementById('side-cart').classList.add('active');
});

document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('side-cart').classList.remove('active');
});

document.getElementById('placeOrder').addEventListener('click', () => {
  // Clear Cart Button
document.getElementById('clearCart').addEventListener('click', () => {
  cart = {};
  updateCartDisplay();
});
  const name = document.getElementById('customerName').value;
  const address = document.getElementById('customerAddress').value;
  if (!name || !address || Object.keys(cart).length === 0) {
    alert('Please fill in customer details and cart items.');
    return;
  }

  let message = `Order from Shivneri Fresh\n\nCustomer: ${name}\nAddress: ${address}\n\n`;
  let total = 0;
  Object.entries(cart).forEach(([product, item]) => {
    const subtotal = item.quantity * item.price;
    message += `${product} - Qty: ${item.quantity}, ₹${subtotal.toFixed(2)}\n`;
    total += subtotal;
  });
  message += `\nGrand Total: ₹${total.toFixed(2)}`;
  const whatsappURL = `https://wa.me/919867378209?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
});

// Cart icon click scrolls to cart section
document.getElementById('cart-icon').addEventListener('click', () => {
  document.getElementById('cart-section').scrollIntoView({ behavior: 'smooth' });
});

// ✅ Scroll to cart-section when 🛒 icon is clicked
document.getElementById('cart-icon').addEventListener('click', function () {
  const cartSection = document.getElementById('cart-section');
  if (cartSection) {
    cartSection.scrollIntoView({ behavior: 'smooth' });
  }
});

