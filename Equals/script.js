console.log("Welcome to Equals Kape!");

document.addEventListener("DOMContentLoaded", () => {
  // --- Toast Notification Container ---
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // Helper for toasts
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">
        ${
          type === "success"
            ? '<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#A3E635"/><path d="M7 13.5l3 3 7-7" stroke="#365314" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
            : type === "error"
            ? '<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#FCA5A5"/><path d="M8 8l8 8M16 8l-8 8" stroke="#7F1D1D" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
            : '<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#FDE68A"/><path d="M12 8v4m0 4h.01" stroke="#B45309" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
        }
      </span>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;
    // Close when clicking X
    toast.querySelector('.toast-close').onclick = () => toast.remove();

    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.remove('fade-out'), 10);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 500);
    }, 3200);
  }

  setTimeout(() => {
    showToast("☕ Enjoy 10% off all cold brews this week!", "info");
  }, 1200);

  // Login Button Clickable/Accessible
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      showToast("Login functionality coming soon!", "info");
    });
    loginBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        loginBtn.click();
      }
    });
  }

  // --- Cart UI and Data ---
  let cart = [];
  // Cart Button at the top right
  const cartBtn = document.getElementById("top-cart-btn");

  // Create the cart container (but don't float a button at the bottom)
  const cartContainer = document.createElement("div");
  cartContainer.classList.add("cart");
  cartContainer.style.display = "none";
  cartContainer.style.position = "fixed";
  cartContainer.style.top = "70px";
  cartContainer.style.right = "30px";
  cartContainer.style.background = "#fff";
  cartContainer.style.padding = "24px";
  cartContainer.style.borderRadius = "12px";
  cartContainer.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
  cartContainer.style.minWidth = "260px";
  cartContainer.innerHTML = `
    <h3>Your Cart</h3>
    <div id="cart-items"></div>
    <strong id="total">Total: ₱0</strong>
    <button id="checkout-btn" style="margin-top:15px;">Checkout</button>
    <button id="close-cart" style="margin-top:10px;">Close</button>
  `;
  document.body.appendChild(cartContainer);

  function updateCartDisplay() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = "";
    let total = 0;
    cart.forEach((item, idx) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      itemDiv.innerHTML = `
        ${item.name} x${item.qty} - ₱${item.price * item.qty}
        <button class="remove-item" data-idx="${idx}" style="float:right;">✖</button>
      `;
      cartItemsDiv.appendChild(itemDiv);
      total += item.price * item.qty;
    });
    document.getElementById("total").innerText = `Total: ₱${total}`;
    if (cartBtn)
      cartBtn.innerText = `🛒 Cart (${cart.reduce((a, b) => a + b.qty, 0)})`;
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = "<em>Your cart is empty.</em>";
    }
  }

  // Remove item from cart
  cartContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const idx = parseInt(e.target.getAttribute("data-idx"));
      cart.splice(idx, 1);
      updateCartDisplay();
      showToast("Item removed from cart.", "success");
    }
  });

  // Cart button toggles cart display (top)
  if (cartBtn) {
    cartBtn.onclick = () => {
      cartContainer.style.display = cartContainer.style.display === "none" ? "block" : "none";
      updateCartDisplay();
    };
    cartBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        cartBtn.click();
      }
    });
  }

  // Close cart panel
  cartContainer.querySelector("#close-cart").onclick = () => {
    cartContainer.style.display = "none";
  };

  // Checkout action
  cartContainer.querySelector("#checkout-btn").onclick = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty!", "error");
      return;
    }
    let msg = "Thank you for your purchase!\n";
    let total = 0;
    cart.forEach(item => {
      msg += `- ${item.name} x${item.qty} = ₱${item.price * item.qty}\n`;
      total += item.price * item.qty;
    });
    msg += `Total: ₱${total}`;
    showToast("Thank you for your purchase!", "success");
    cart = [];
    updateCartDisplay();
    cartContainer.style.display = "none";
  };

  // --- Product Cards Logic ---
  document.querySelectorAll(".menu-card").forEach(card => {
    // Try h4, fallback to h3 for backward compatibility
    const nameEl = card.querySelector("h4") || card.querySelector("h3");
    const name = nameEl ? nameEl.innerText : "";
    const price = parseFloat(card.getAttribute("data-price"));

    // Remove any previous controls to avoid duplicates
    let oldControl = card.querySelector(".control-wrap");
    if (oldControl) oldControl.remove();

    // Quantity input
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.value = "1";
    qtyInput.classList.add("qty-input");

    // Add to Cart button
    const addButton = document.createElement("button");
    addButton.innerText = "Add to Cart";
    addButton.className = "add-to-cart";

    // Buy Now button
    const buyButton = document.createElement("button");
    buyButton.innerText = "Buy Now";
    buyButton.className = "buy-now";

    // Event Handlers
    addButton.onclick = (e) => {
      e.stopPropagation();
      const qty = parseInt(qtyInput.value);
      if (qty < 1) return;
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty += qty;
      } else {
        cart.push({ name, price, qty });
      }
      updateCartDisplay();
      cartContainer.style.display = "block";
      showToast(`${name} x${qty} added to cart.`, "success");
    };

    buyButton.onclick = (e) => {
      e.stopPropagation();
      const qty = parseInt(qtyInput.value);
      if (qty < 1) return;
      const total = qty * price;
      showToast(`✅ You bought ${qty} ${name}(s) for ₱${total}`, "success");
    };

    // Controls wrapper
    const controlWrap = document.createElement("div");
    controlWrap.classList.add("control-wrap");
    controlWrap.appendChild(qtyInput);
    controlWrap.appendChild(addButton);
    controlWrap.appendChild(buyButton);
    card.appendChild(controlWrap);

    // Make card clickable to focus qty
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      qtyInput.focus();
    });
  });

  // Initial render
  updateCartDisplay();
});