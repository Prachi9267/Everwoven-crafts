

// Scroll to top on page refresh
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

// Search alert function
function search() {
    const query = document.querySelector('.search-bar input').value;
    alert("You searched for: " + query);
}

// Product slider logic
let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    if (index >= totalSlides) currentSlide = 0;
    else if (index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;

    const offset = -currentSlide * 100;
    document.querySelector('.slider-container').style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Initialize on load
window.onload = () => showSlide(currentSlide);

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const heroBanner = document.querySelector('.hero-banner');
    const imageBanner = document.querySelector('.image-banner');

    // Parallax scroll effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        imageBanner.style.transform = `translateZ(-1px) scale(2) translateY(${rate}px)`;
    });

    // Intersection Observer for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });

    // Mousemove 3D effect on product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
});

// List of products for search
const products = [
    { name: "Crochet Flowers", url: "product1.html" },
    { name: "Crochet Clutchers", url: "product4.html" },
    { name: "Crochet Charms", url: "product3.html" },
    { name: "Crochet Octopus", url: "product2.html" },
    { name: "Crochet Bookmark", url: "product5.html" },
    { name: "Crochet Bouquet", url: "product6.html" }
];


// Function to handle product search
function searchProducts(event) {
    event.preventDefault();  // Prevent form submission

    const query = document.getElementById('searchInput').value.toLowerCase();
    const result = products.filter(product => product.name.toLowerCase().includes(query));

    if (result.length > 0) {
        // Redirect to the first matching product
        window.location.href = result[0].url;
    } else {
        alert('No products found!');
    }
}

const openDrawer = document.getElementById("openDrawer");
const slideMenu = document.getElementById("slideMenu");
const overlay = document.getElementById("overlay");
const accountDrawer = document.getElementById("accountdrawer");
const accountmenu = document.getElementById("accountMenu");

// Open Menu
openDrawer.onclick = function () {
    slideMenu.classList.add("open");
    overlay.classList.add("show");
};

// Close when clicking outside
overlay.onclick = function () {
    slideMenu.classList.remove("open");
    overlay.classList.remove("show");
    accountmenu.classList.remove("open");
};

accountDrawer.onclick = function() {
    accountmenu.classList.add("open");
    overlay.classList.add("show");
};

// -------------------------
//  HELPERS
// -------------------------
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// -------------------------
//  ADD TO CART FUNCTION
// -------------------------
function addToCart(name, price, image, qty) {
    let cart = getCart();

    // Check if item already exists
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.qty += parseInt(qty);
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            qty: parseInt(qty)
        });
    }

    saveCart(cart);
    renderCart(); 
}

// -------------------------
//  RENDER CART
// -------------------------
function renderCart() {
    const cartContainer = document.getElementById("cartItems");
    if (!cartContainer) return; 

    let cart = getCart();
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p style='text-align:center; padding: 10px;'>Your cart is empty</p>";
        return;
    }

    let total = 0;

    cart.forEach((item) => {
        total += item.price * item.qty;
        cartContainer.innerHTML += `
            <div class="cart-item" style="display: flex;flex-direction:row; align-items: center;gap:10px;">
                <div style="display: flex; flex-direction: row;gap: 10px;">
                    <img src="${item.image}" width="40" height="40" style="object-fit:cover; border-radius:4px;">
                    <div class="item-details">
                        <p style="margin:0; font-weight:bold; font-size: 0.9em;">${item.name}</p>
                        <p style="margin:0; font-size:0.8em;">₹${item.price} × ${item.qty}</p>
                    </div>
                </div>
                 <div style="display:flex; flex-direction: column; align-items: center; gap:5px;margin-left:5px;">
                    <div style="display:flex; align-items:center; gap:5px;">
                        <button onclick="changeQty('${item.name}', -1)" 
                            style="width:25px; height:25px; border:1px solid #aaa; background:none; cursor:pointer;">-</button>

                        <span>${item.qty}</span>

                        <button onclick="changeQty('${item.name}', 1)" 
                            style="width:25px; height:25px; border:1px solid #aaa; background:none; cursor:pointer;">+</button>
                    </div>
                <button onclick="removeFromCart('${item.name}')" style="background:none; border:none; color:black; cursor:pointer; font-size:0.6em;">Remove</button>
            </div>
        `;
    });

    // Add a Total Display
    cartContainer.innerHTML += `
        <div style="margin-top: 15px; border-top: 2px solid #2c1810; padding-top: 10px;">
            <p style="font-weight:bold; display:flex; justify-content:space-between;">Total: <span>₹${total}</span></p>
        </div>
    `;
}
// -------------------------
//  ORDER NOW FUNCTION
// -------------------------
document.getElementById("orderNow").addEventListener("click", () => {
    let cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Create order summary
    let summary = "Your Order:\n\n";
    let total = 0;

    cart.forEach(item => {
        summary += `${item.name} - ₹${item.price} x ${item.qty}\n`;
        total += item.price * item.qty;
    });

    summary += `\nTotal Amount: ₹${total}\n\n`;

    // Confirm order
    let confirmOrder = confirm(summary + "Do you want to place the order?");

    if (!confirmOrder) return;

    fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            customerName: document.getElementById("custName")?.value || "Unknown",
            items: cart,
            totalAmount: total
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("lastOrderId", data.orderId);

            localStorage.setItem("orderedCart", JSON.stringify(cart));
            localStorage.setItem("orderedTotal", total);

            localStorage.removeItem("cart");

            // Redirect to checkout page
            window.location.href = "checkout.html?cart=true";
        } else {
            alert("❌ Failure.");
        }

            
    })
     .catch(err => {
        alert("❌ Server error: " + err.message);
    });
});



function removeFromCart(name) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== name);
    saveCart(cart);
    renderCart();
}


// -------------------------
//  OPEN CART IN SIDE MENU
// -------------------------
const openCartBtn = document.getElementById("openCart");
if (openCartBtn) {
    openCartBtn.addEventListener("click", () => {
        const slideMenu = document.getElementById("slideMenu");
        const container = document.getElementById("cartContainer");

        slideMenu.classList.add("open");
        
        container.style.display = "block";

        slideMenu.querySelector("h2").style.display = "none";
        slideMenu.querySelector(".decorative-line").style.display = "none";
        slideMenu.querySelector("ul").style.display = "none";
        renderCart();
    });

}

function resetMenu() {
    const slideMenu = document.getElementById("slideMenu");
    const container = document.getElementById("cartContainer");
    
    container.style.display = "none";
    slideMenu.querySelector("h2").style.display = "block";
    slideMenu.querySelector(".decorative-line").style.display = "block";
    slideMenu.querySelector("ul").style.display = "block";
}

function changeQty(name, amount) {
    let cart = getCart();

    let item = cart.find(p => p.name === name);
    if (!item) return;

    item.qty += amount;

    // Remove item if quantity hits 0
    if (item.qty <= 0) {
        cart = cart.filter(p => p.name !== name);
    }

    saveCart(cart);
    renderCart();
}

document.getElementById("backToMenu").addEventListener("click", () => {
    const cartContainer = document.getElementById("cartContainer");
    const slideMenu = document.getElementById("slideMenu");

    // RESET EVERYTHING BACK TO ORIGINAL SIDEBAR
    cartContainer.style.display = "none";

    slideMenu.querySelector("h2").style.display = "block";
    slideMenu.querySelector(".decorative-line").style.display = "block";
    slideMenu.querySelector("ul").style.display = "block";
});

function showLogin() {
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("userPage").style.display = "none";

    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";


}

function showRegister() {
    document.getElementById("registerPage").style.display = "block";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("userPage").style.display = "none";
}

function showUserPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("welcomeUser").innerText = `Hello, ${user.name}!`;

    document.getElementById("registerPage").style.display = "none";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("userPage").style.display = "block";
}

// REGISTER USER
async function registerUser() {
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert(data.message);

    if (res.status === 201) {
         document.getElementById("regName").value = "";
         document.getElementById("regEmail").value = "";
         document.getElementById("regPassword").value = "";
         showLogin();
    }
}

// LOGIN USER
async function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.status === 200) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        showUserPage();
    } else {
        alert(data.message);
    }
}

function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showRegister();
}

// Detect login on page load
window.addEventListener("load", () => {
    if (localStorage.getItem("user")) {
        showUserPage();
    }
});

