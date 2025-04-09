// ✅ Shivneri Fresh - Final JavaScript with Slide-In Cart Panel

let cart = {};
let allProducts = [];

// Load product data
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    displayProducts(data);
    displayCategories(data);
    setupSearch(data);
  });

// Display product cards
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

// Category buttons
function displayCategories(products) {
  const categoryListDiv = document.getElementById('category-list');
  const categories = ["All", ...new Set(products.map(p => p.category))];
  categoryListDiv.innerHTML = categories.map(category => `
    <button class="category-btn" onclick="filterByCategory('${category}')">${category}</button>
  `).join('');
}

function filterByCategory(category) {
  if (category === "All") {
    displayProducts(allProducts);
  } else {
    const filtered = allProducts.filter(p => p.category === category);
    displayProducts(filtered);
  }
}

// Quantity selector buttons
function updateQty(name, change) {
  const span = document.getElementById(`qty-${name}`);
  let qty = parseInt(span.innerText) + change;
  qty = qty < 0 ? 0 : qty;
  span.innerText = qty;
}

// Add to cart
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

// Update the side cart panel
function updateCartDisplay() {
  const cartItems = document.getElementById('side-cart-items');
  const cartCount = document.getElementById('side-cart-count');
  const cartTotal = document.getElementById('side-cart-total');
  const whatsappOrder = document.getElementById('whatsapp-order');

  let total = 0;
  let count = 0;
  let whatsappText = 'https://wa.me/?text=Order%20Details:%0A';

  cartItems.innerHTML = '';

  Object.entries(cart).forEach(([name, item]) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    count += item.quantity;
    whatsappText += `${name} x ${item.quantity} = ₹${itemTotal}%0A`;

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

  cartCount.innerText = `Total Items: ${count}`;
  document.getElementById('cart-count').innerText = count;
  cartTotal.innerText = `Grand Total: ₹${total.toFixed(2)}`;
  whatsappText += `Total: ₹${total.toFixed(2)}`;
  whatsappOrder.href = whatsappText;
}

// Change quantity inside cart panel
function changeCartQty(name, change) {
  cart[name].quantity += change;
  if (cart[name].quantity <= 0) delete cart[name];
  updateCartDisplay();
}

// Remove item completely from cart
function removeFromCart(name) {
  delete cart[name];
  updateCartDisplay();
}

// Clear cart
function clearCart() {
  cart = {};
  updateCartDisplay();
}

// Open/Close side cart panel
function toggleCartPanel() {
  document.getElementById('cart-panel').classList.toggle('open');
}

// Product search
function setupSearch(products) {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    displayProducts(filtered);
  });
}
