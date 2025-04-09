// ✅ Shivneri Fresh - Clean JavaScript with Slide-In Cart Panel

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
  const cartItems = document.getElementById('side-cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('side-cart-total');
  const whatsappOrder = document.getElementById('whatsapp-order');

  cartItems.innerHTML = '';
  let total = 0;
  let count = 0;
  let whatsappText = 'https://wa.me/?text=Order%20Details:%0A';

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
      = <strong>₹${itemTotal.toFixed(2)}</strong>
      <button onclick="removeFromCart('${name}')">❌</button>
    `;
    cartItems.appendChild(div);

    whatsappText += `${name} x ${item.quantity} = ₹${itemTotal}%0A`;
  });

  cartCount.innerText = count;
  cartTotal.innerHTML = `<strong>Grand Total: ₹${total.toFixed(2)}</strong>`;
  whatsappText += `Total: ₹${total.toFixed(2)}`;
  if (whatsappOrder) whatsappOrder.href = whatsappText;
}
  });

  cartCount.innerText = `Total Items: ${count}`;
  cartTotal.innerText = `Grand Total: ₹${total.toFixed(2)}`;
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

// Slide-In Cart Toggle
const sideCart = document.getElementById('side-cart');
document.getElementById('cart-icon').addEventListener('click', () => {
  sideCart.classList.add('active');
});

document.getElementById('close-cart').addEventListener('click', () => {
  sideCart.classList.remove('active');
});

document.getElementById('clearCart').addEventListener('click', () => {
  cart = {};
  updateCartDisplay();
});

document.getElementById('placeOrder').addEventListener('click', () => {
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

// Dark Mode Toggle + Remember Preference
const toggleButton = document.getElementById('themeToggle');
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    toggleButton.innerHTML = '☀️';
  } else {
    toggleButton.innerHTML = '🌙';
  }
});

toggleButton.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-theme');
  toggleButton.innerHTML = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
