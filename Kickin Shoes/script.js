let cart = [];

function addToCart(name, price, idSuffix) {
  const size = document.getElementById(`size-${idSuffix}`).value;
  const quantity = parseInt(document.getElementById(`qty-${idSuffix}`).value);

  const item = {
    id: cart.length,
    name,
    price,
    size,
    quantity,
    total: price * quantity,
    selected: false
  };

  cart.push(item);
  updateCartDisplay();
  updateCartCount();
  showToast(`${name} (Size ${size}, Qty ${quantity}) added to cart.`);
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <input type="checkbox" id="item-${item.id}" onclick="toggleSelection(${item.id})" ${item.selected ? 'checked' : ''} />
      <span>${item.name} - Size ${item.size} x${item.quantity} — ₱${item.total.toLocaleString()}</span>
      <button onclick="deleteCartItem(${item.id})" class="delete-btn" title="Delete">🗑️</button>
    `;
    cartItems.appendChild(itemDiv);
    total += item.total;
  });

  document.getElementById("cart-total").textContent = total.toLocaleString();
}

function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length || '';
}

function toggleSelection(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.selected = !item.selected;
  calculateSelectedTotal();
}

function showCart() {
  if (cart.length) {
    document.getElementById('cartModal').style.display = 'block';
    updateCartDisplay();
  } else {
    showToast("Your cart is empty!", "error");
  }
}

const closeCart = () => document.getElementById('cartModal').style.display = 'none';

function checkoutCart() {
  const selected = cart.filter(i => i.selected);
  if (selected.length) {
    closeCart();
    showCustomerForm(selected);
  } else {
    showToast("Please select items to checkout.", "error");
  }
}

function showCustomerForm(selected) {
  document.getElementById('customerModal').style.display = 'block';
  window.selectedItemsForCheckout = selected;
}

const closeCustomerForm = () => document.getElementById('customerModal').style.display = 'none';

function submitCustomerForm(e) {
  e.preventDefault();
  const name = document.getElementById('customerName').value;
  const email = document.getElementById('customerEmail').value;
  const phone = document.getElementById('customerPhone').value;

  if (name && email && phone) {
    const items = selectedProduct
      ? [{
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: parseInt(document.getElementById("buyNowQty").value),
          total: selectedProduct.price * parseInt(document.getElementById("buyNowQty").value)
        }]
      : window.selectedItemsForCheckout;

    showReceipt(name, email, phone, items);
    selectedProduct = null;
    closeCustomerForm();
    showToast("Checkout complete! Showing receipt...", "success");

    // Remove checked out items from cart
    cart = cart.filter(item => !item.selected);
    updateCartDisplay();
    updateCartCount();
  } else {
    showToast("Please fill in all the fields.", "error");
  }
}

function showReceipt(name, email, phone, items) {
  const receiptModal = document.getElementById('receiptModal');
  const productDetails = document.getElementById('product-details');
  const totalPriceEl = document.getElementById('total-price');

  document.getElementById('customerNameReceipt').innerHTML = name;
  document.getElementById('customerEmailReceipt').innerHTML = email;
  document.getElementById('customerPhoneReceipt').innerHTML = phone;

  productDetails.innerHTML = '';
  let total = 0;

  items.forEach(item => {
    const line = document.createElement('div');
    line.classList.add('receipt-item');
    const itemTotal = item.total || (item.price * (item.quantity || 1));
    line.innerHTML = `
      <span class="receipt-product">${item.name} x${item.quantity || 1}</span>
      <span class="receipt-price">₱${itemTotal.toLocaleString()}</span>
    `;
    productDetails.appendChild(line);
    total += itemTotal;
  });

  totalPriceEl.innerHTML = `₱${total.toLocaleString()}`;
  receiptModal.style.display = 'block';
}

const closeReceipt = () => document.getElementById('receiptModal').style.display = 'none';

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.remove('fade-out'), 10);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

let selectedProduct = null;

function buyNow(name, price, description) {
  const parsedPrice = parseFloat(price.toString().replace(/[₱,]/g, ''));

  selectedProduct = {
    name,
    price: parsedPrice,
    description
  };

  document.getElementById("checkout-modal").style.display = "flex";
  document.getElementById("product-name").innerHTML = `<strong>Product:</strong> ${name}`;
  document.getElementById("product-price").innerHTML = `<strong>Price per unit:</strong> ₱${parsedPrice.toLocaleString()}`;
  document.getElementById("product-description").innerHTML = `<strong>Description:</strong> ${description}`;
  document.getElementById("buyNowQty").value = 1;
  updateBuyNowTotal(); // Set initial total
}

function updateBuyNowTotal() {
  const qty = parseInt(document.getElementById("buyNowQty").value) || 1;
  const total = selectedProduct.price * qty;
  document.getElementById("buyNowTotalPrice").innerHTML = `<strong>Total:</strong> ₱${total.toLocaleString()}`;
}

const closeModal = () => document.getElementById('checkout-modal').style.display = 'none';

const submitCheckout = () => {
  closeModal();
  document.getElementById('customerModal').style.display = 'block';
};

function deleteCartItem(id) {
  cart = cart.filter(i => i.id !== id);
  cart.forEach((item, i) => item.id = i);
  updateCartDisplay();
  updateCartCount();
  showToast("Item removed from cart.", "success");
}

function calculateSelectedTotal() {
  const total = cart
    .filter(i => i.selected)
    .reduce((sum, i) => sum + i.total, 0);

  document.getElementById('cart-total').textContent = total.toLocaleString();
}