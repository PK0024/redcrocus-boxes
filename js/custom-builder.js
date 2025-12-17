// ===== CUSTOM BOX BUILDER LOGIC =====

// Get all form inputs
const lengthInput = document.getElementById('length');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const thicknessInputs = document.querySelectorAll('input[name="thickness"]');
const fluteTypeSelect = document.getElementById('fluteType');
const packSizeSelect = document.getElementById('packSize');
const printingSelect = document.getElementById('printing');
const specialNotesTextarea = document.getElementById('specialNotes');
const addToCartBtn = document.getElementById('addCustomBoxToCart');

// Base pricing
const BASE_PRICE_PER_CUBIC_INCH = 0.008;
const THICKNESS_UPCHARGE = 15;
const PRINT_COSTS = {
    'none': 0,
    '1color': 50,
    '2color': 80,
    'full': 120
};
const DISCOUNT_TIERS = {
    25: 0,
    50: 0.10,
    100: 0.15,
    250: 0.20,
    500: 0.25
};

// Update everything when inputs change
function updatePreview() {
    const length = parseInt(lengthInput.value) || 18;
    const width = parseInt(widthInput.value) || 14;
    const height = parseInt(heightInput.value) || 12;
    const thickness = document.querySelector('input[name="thickness"]:checked').value;
    const flute = fluteTypeSelect.value;
    const packSize = parseInt(packSizeSelect.value);
    const printing = printingSelect.value;
    
    // Calculate volume
    const volume = length * width * height;
    
    // Update 3D box dimensions display
    document.getElementById('frontDim').textContent = `${length}" × ${height}"`;
    document.getElementById('topDim').textContent = `${length}" × ${width}"`;
    document.getElementById('sideDim').textContent = `${width}" × ${height}"`;
    
    // Update specifications
    document.getElementById('specDimensions').textContent = `${length}" × ${width}" × ${height}"`;
    document.getElementById('specVolume').textContent = `${volume.toLocaleString()} cubic inches`;
    document.getElementById('specMaterial').textContent = `${thickness} ECT, ${flute}-Flute`;
    document.getElementById('specQuantity').textContent = `${packSize} boxes`;
    
    // Calculate pricing
    let basePrice = volume * BASE_PRICE_PER_CUBIC_INCH * packSize;
    basePrice = Math.max(basePrice, 50); // Minimum price
    
    let thicknessExtra = 0;
    if (thickness === '38') {
        thicknessExtra = THICKNESS_UPCHARGE;
        document.getElementById('thicknessUpcharge').style.display = 'flex';
    } else {
        document.getElementById('thicknessUpcharge').style.display = 'none';
    }
    
    let printCost = PRINT_COSTS[printing];
    if (printCost > 0) {
        document.getElementById('printingCost').style.display = 'flex';
        document.getElementById('printPrice').textContent = `+$${printCost.toFixed(2)}`;
    } else {
        document.getElementById('printingCost').style.display = 'none';
    }
    
    // Calculate discount
    const discountPercent = DISCOUNT_TIERS[packSize];
    const discount = basePrice * discountPercent;
    
    if (discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discountAmount').textContent = `-$${discount.toFixed(2)}`;
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
    
    // Calculate total
    const total = basePrice - discount + thicknessExtra + printCost;
    const pricePerBox = total / packSize;
    
    // Update price display
    document.getElementById('basePrice').textContent = `$${basePrice.toFixed(2)}`;
    document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
    document.getElementById('pricePerBox').textContent = `$${pricePerBox.toFixed(2)}`;
}

// Add event listeners
lengthInput.addEventListener('input', updatePreview);
widthInput.addEventListener('input', updatePreview);
heightInput.addEventListener('input', updatePreview);
thicknessInputs.forEach(input => input.addEventListener('change', updatePreview));
fluteTypeSelect.addEventListener('change', updatePreview);
packSizeSelect.addEventListener('change', updatePreview);
printingSelect.addEventListener('change', updatePreview);

// Add to cart functionality
addToCartBtn.addEventListener('click', () => {
    const length = parseInt(lengthInput.value);
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);
    const thickness = document.querySelector('input[name="thickness"]:checked').value;
    const flute = fluteTypeSelect.options[fluteTypeSelect.selectedIndex].text;
    const packSize = parseInt(packSizeSelect.value);
    const printing = printingSelect.options[printingSelect.selectedIndex].text;
    const specialNotes = specialNotesTextarea.value;
    const totalPrice = parseFloat(document.getElementById('totalPrice').textContent.replace('$', ''));
    
    // Get cart from localStorage
    const cart = localStorage.getItem('redcrocusCart');
    const cartItems = cart ? JSON.parse(cart) : [];
    
    // Create custom box item
    const customBox = {
        id: 'custom-' + Date.now(),
        name: 'Custom Box',
        dimensions: `${length}" × ${width}" × ${height}"`,
        packSize: packSize,
        price: totalPrice,
        quantity: 1,
        type: 'custom',
        specs: {
            length,
            width,
            height,
            thickness,
            flute,
            printing,
            specialNotes
        }
    };
    
    cartItems.push(customBox);
    
    // Save to localStorage
    localStorage.setItem('redcrocusCart', JSON.stringify(cartItems));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showAddedToCartNotification('Custom Box');
    
    // Optionally redirect to cart
    setTimeout(() => {
        if (confirm('Custom box added to cart! Go to cart now?')) {
            window.location.href = 'cart.html';
        }
    }, 1000);
});

function updateCartCount() {
    const cart = localStorage.getItem('redcrocusCart');
    const cartItems = cart ? JSON.parse(cart) : [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function showAddedToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div style="background: var(--primary-green); color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); position: fixed; top: 100px; right: 20px; z-index: 10000; animation: slideIn 0.3s ease;">
            <p style="margin: 0; font-weight: 600;">✓ ${productName} added to cart!</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updatePreview();
    updateCartCount();
});

// 3D Box rotation effect
const box3d = document.getElementById('box3d');
if (box3d) {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 20 - 10;
        mouseY = (e.clientY / window.innerHeight) * 20 - 10;
        
        box3d.style.transform = `rotateX(${-20 + mouseY}deg) rotateY(${30 + mouseX}deg)`;
    });
}