// ===== CART PAGE LOGIC =====

function getCart() {
    const cart = localStorage.getItem('redcrocusCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('redcrocusCart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
}

function updateQuantity(itemId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart(cart);
        }
    }
}

function renderCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';
    
    // Render cart items
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">📦</div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p><strong>Dimensions:</strong> ${item.dimensions}</p>
                <p><strong>Pack Size:</strong> ${item.packSize}-pack</p>
                ${item.type === 'custom' ? `
                    <p><strong>Material:</strong> ${item.specs.thickness} ECT, ${item.specs.flute}</p>
                    <p><strong>Printing:</strong> ${item.specs.printing}</p>
                    ${item.specs.specialNotes ? `<p><strong>Notes:</strong> ${item.specs.specialNotes}</p>` : ''}
                ` : ''}
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        </div>
    `).join('');
    
    // Calculate totals
    updateSummary();
}

function updateSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const shippingMethod = document.getElementById('shippingMethod');
    const shipping = parseFloat(shippingMethod.value);
    
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    
    const total = subtotal + shipping + tax;
    
    // Update display
    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCount();
    
    const shippingMethod = document.getElementById('shippingMethod');
    if (shippingMethod) {
        shippingMethod.addEventListener('change', updateSummary);
    }
    
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('🎉 Thank you for your order!\n\nIn a live site, this would proceed to Shopify checkout.\n\nYour boxes will be ready in 7-10 business days!\n\n📧 You\'ll receive an order confirmation email shortly.');
            
            // Clear cart
            localStorage.removeItem('redcrocusCart');
            window.location.href = 'index.html';
        });
    }
});

// Make functions available globally
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;