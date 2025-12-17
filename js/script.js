// ===== CART MANAGEMENT =====
function getCart() {
    const cart = localStorage.getItem('redcrocusCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('redcrocusCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function addToCart(productId, productName, dimensions) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    const packSizeSelect = card.querySelector('.pack-size');
    const selectedOption = packSizeSelect.options[packSizeSelect.selectedIndex];
    
    const packSize = selectedOption.value;
    const price = parseFloat(selectedOption.dataset.price);
    
    const cart = getCart();
    
    // Check if item already exists
    const existingItemIndex = cart.findIndex(item => 
        item.id === productId && item.packSize === packSize
    );
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            dimensions: dimensions,
            packSize: packSize,
            price: price,
            quantity: 1,
            type: 'standard'
        });
    }
    
    saveCart(cart);
    showAddedToCartNotification(productName);
}

function showAddedToCartNotification(productName) {
    // Create notification
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

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

document.addEventListener('click', (e) => {
    if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        if (spans.length > 0) {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon at ${email}.`);
        
        contactForm.reset();
    });
}

// ===== PACK SIZE PRICE UPDATE =====
document.querySelectorAll('.pack-size').forEach(select => {
    select.addEventListener('change', function() {
        const card = this.closest('.product-card');
        const priceDisplay = card.querySelector('.price-value');
        const selectedOption = this.options[this.selectedIndex];
        const price = selectedOption.dataset.price;
        
        priceDisplay.textContent = `$${parseFloat(price).toFixed(2)}`;
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.product-card, .stat-item, .about-feature');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Update cart count on page load
    updateCartCount();
});

// ===== NAVBAR SHADOW ON SCROLL =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    }
});

// ===== STATS COUNTER ANIMATION =====
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 20);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = stat.textContent.replace(/[^0-9]/g, '');
                const suffix = stat.textContent.replace(/[0-9]/g, '');
                stat.dataset.suffix = suffix;
                if (target) {
                    animateCounter(stat, parseInt(target));
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== LOG PAGE LOAD =====
console.log('🌿 RedCrocus Boxes website loaded successfully!');
console.log('Built with ❤️ for custom packaging solutions');