// Firebase config (user's actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCOCVaPPPF0J1GRnrPV-cy3KGdDvBJmdKY",
  authDomain: "l-amour-jewelry.firebaseapp.com",
  projectId: "l-amour-jewelry",
  storageBucket: "l-amour-jewelry.firebasestorage.app",
  messagingSenderId: "781244207566",
  appId: "1:781244207566:web:73c2840a5368afa6701b9f"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- SweetAlert2 Customization ---
const swalTheme = {
  background: '#181818',
  color: '#fff',
  customClass: {
    popup: 'swal2-gold-dark',
    confirmButton: 'swal2-btn-gold',
    cancelButton: 'swal2-btn-outline',
    title: 'swal2-title-gold',
    htmlContainer: 'swal2-html-white',
    input: 'swal2-input-dark',
  },
  confirmButtonColor: '#d4af37',
  cancelButtonColor: '#333',
};

// --- UI Elements ---
const loginBtn = document.getElementById('loginBtn');
const loginDropdown = document.getElementById('loginDropdown');
const loginOptions = document.getElementById('loginOptions');
const googleLogin = document.getElementById('googleLogin');
const guestLogin = document.getElementById('guestLogin');
const emailLogin = document.getElementById('emailLogin');
const emailSignup = document.getElementById('emailSignup');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const orderSummary = document.getElementById('orderSummary');
const productGrid = document.getElementById('productGrid');
const filterCategories = document.querySelectorAll('.filter-categories button');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const accountInfo = document.getElementById('accountInfo');
const emailSignupBtn = document.getElementById('emailSignupBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');

// --- State ---
let currentUser = null;
let cart = [];
let wishlist = [];
let selectedCategory = 'all';
let maxPrice = 1000;

// --- Product Data (placeholder) ---
const products = [
  { id: 1, name: "Gold Elegance Ring", price: 299, oldPrice: 399, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", badge: "Bestseller", category: "rings" },
  { id: 2, name: "Diamond Halo Necklace", price: 499, oldPrice: 599, image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", badge: "Luxury", category: "necklaces" },
  { id: 3, name: "Classic Gold Bracelet", price: 199, oldPrice: 249, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", badge: "New", category: "bracelets" },
  { id: 4, name: "Pearl Drop Earrings", price: 159, oldPrice: 199, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", badge: "Bestseller", category: "earrings" },
  { id: 5, name: "Rose Gold Band", price: 349, oldPrice: 399, image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", badge: "Luxury", category: "rings" },
  { id: 6, name: "Emerald Pendant Necklace", price: 429, oldPrice: 499, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=400&q=80", badge: "New", category: "necklaces" },
  { id: 7, name: "Sapphire Tennis Bracelet", price: 599, oldPrice: 699, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80", badge: "Luxury", category: "bracelets" },
  { id: 8, name: "Minimalist Stud Earrings", price: 99, oldPrice: 129, image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80", badge: "New", category: "earrings" }
];

// --- Auth Functions ---
loginBtn.onclick = () => {
  loginDropdown.classList.toggle('open');
};
document.addEventListener('click', (e) => {
  if (!loginDropdown.contains(e.target)) loginDropdown.classList.remove('open');
});
googleLogin.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(() => Swal.fire({
      title: 'Logged in with Google!',
      icon: 'success',
      ...swalTheme
    }))
    .catch(err => Swal.fire({
      title: 'Error',
      text: err.message,
      icon: 'error',
      ...swalTheme
    }));
};
guestLogin.onclick = () => {
  auth.signInAnonymously()
    .then(() => Swal.fire({
      title: 'Guest Mode',
      text: 'You are logged in as a guest.',
      icon: 'info',
      ...swalTheme
    }))
    .catch(err => Swal.fire({
      title: 'Error',
      text: err.message,
      icon: 'error',
      ...swalTheme
    }));
};
emailLogin.onclick = () => {
  Swal.fire({
    title: 'Email Login',
    html: '<input id="swal-email" class="swal2-input" placeholder="Email"><input id="swal-pass" type="password" class="swal2-input" placeholder="Password">',
    preConfirm: () => {
      const email = document.getElementById('swal-email').value;
      const pass = document.getElementById('swal-pass').value;
      return { email, pass };
    },
    showCancelButton: true,
    ...swalTheme
  }).then(result => {
    if (result.isConfirmed) {
      auth.signInWithEmailAndPassword(result.value.email, result.value.pass)
        .then(() => Swal.fire({
          title: 'Logged in!',
          icon: 'success',
          ...swalTheme
        }))
        .catch(err => Swal.fire({
          title: 'Error',
          text: err.message,
          icon: 'error',
          ...swalTheme
        }));
    }
  });
};
if (emailSignupBtn) {
  emailSignupBtn.onclick = () => {
    Swal.fire({
      title: 'Sign Up',
      html: '<input id="swal-email" class="swal2-input" placeholder="Email"><input id="swal-pass" type="password" class="swal2-input" placeholder="Password">',
      preConfirm: () => {
        const email = document.getElementById('swal-email').value;
        const pass = document.getElementById('swal-pass').value;
        return { email, pass };
      },
      showCancelButton: true,
      ...swalTheme
    }).then(result => {
      if (result.isConfirmed) {
        auth.createUserWithEmailAndPassword(result.value.email, result.value.pass)
          .then(() => Swal.fire({
            title: 'Account created!',
            icon: 'success',
            ...swalTheme
          }))
          .catch(err => Swal.fire({
            title: 'Error',
            text: err.message,
            icon: 'error',
            ...swalTheme
          }));
      }
    });
  };
}
if (googleLoginBtn) {
  googleLoginBtn.onclick = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(() => Swal.fire({
        title: 'Logged in with Google!',
        icon: 'success',
        ...swalTheme
      }))
      .catch(err => Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
        ...swalTheme
      }));
  };
}
auth.onAuthStateChanged(async user => {
  currentUser = user;
  const loginDropdown = document.getElementById('loginDropdown');
  const accountInfo = document.getElementById('accountInfo');
  // --- Firestore user database logic ---
  if (user) {
    // Save/update user in Firestore
    try {
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) { /* ignore for now */ }
    // Hide login, show account info
    loginDropdown.style.display = 'none';
    accountInfo.style.display = 'flex';
    let displayName = user.displayName || user.email || 'Guest';
    if (user.isAnonymous) displayName = 'Guest';
    accountInfo.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.7em;">
        <span style="color:#d4af37;font-weight:bold;">${displayName}</span>
        <button id="logoutBtn" style="background:transparent;border:2px solid #d4af37;color:#d4af37;padding:0.3em 1em;border-radius:16px;cursor:pointer;font-weight:bold;">Logout</button>
      </div>
    `;
    document.getElementById('logoutBtn').onclick = () => {
      Swal.fire({
        title: 'Logout?',
        text: 'Are you sure you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Logout',
        ...swalTheme
      }).then(result => {
        if (result.isConfirmed) {
          auth.signOut().then(() => {
            Swal.fire({
              title: 'Logged out',
              icon: 'success',
              ...swalTheme
            });
          });
        }
      });
    };
  } else {
    // Show login, hide account info
    loginDropdown.style.display = '';
    accountInfo.style.display = 'none';
    accountInfo.innerHTML = '';
  }
});

// --- Product Rendering ---
function renderProducts() {
  productGrid.innerHTML = '';
  const filtered = products.filter(p =>
    (selectedCategory === 'all' || p.category === selectedCategory) && p.price <= maxPrice
  );
  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-badge">${product.badge}</div>
      <div class="wishlist${wishlist.includes(product.id) ? ' active' : ''}" data-id="${product.id}">&#10084;</div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-prices">
          <span class="product-price">PKR ${product.price}</span>
          <span class="product-old-price">PKR ${product.oldPrice}</span>
        </div>
        <button class="add-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// --- Filtering ---
filterCategories.forEach(btn => {
  btn.onclick = () => {
    filterCategories.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedCategory = btn.dataset.category;
    renderProducts();
  };
});
priceRange.oninput = () => {
  maxPrice = parseInt(priceRange.value);
  priceValue.textContent = `PKR ${maxPrice}`;
  renderProducts();
};

// --- Cart Logic ---
function updateCartCount() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}
function updateCartModal() {
  cartItems.innerHTML = '';
  let subtotal = 0;
  if (cart.length === 0) {
    cartItems.innerHTML = '<div style="text-align:center;color:#bdbdbd;padding:2rem 0;">Your cart is empty.</div>';
  }
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    subtotal += product.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <span>
        <div style="font-weight:600;font-size:1.05rem;">${product.name}</div>
        <div style="font-size:0.97rem;color:#b8860b;">PKR ${product.price} <span style="color:#888;font-size:0.9rem;text-decoration:line-through;">PKR ${product.oldPrice}</span></div>
        <div style="margin-top:0.3em;display:flex;align-items:center;gap:0.5em;">
          <button class="qty-btn" data-id="${item.id}" data-action="dec" style="background:transparent;border:1.5px solid #d4af37;color:#d4af37;border-radius:50%;width:26px;height:26px;font-size:1.1rem;cursor:pointer;">-</button>
          <span style="min-width:2em;display:inline-block;text-align:center;">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="inc" style="background:transparent;border:1.5px solid #d4af37;color:#d4af37;border-radius:50%;width:26px;height:26px;font-size:1.1rem;cursor:pointer;">+</button>
        </div>
      </span>
      <span style="font-weight:600;color:#d4af37;">PKR ${product.price * item.qty}</span>
      <button class="remove-cart-item" data-id="${item.id}">&times;</button>
    `;
    cartItems.appendChild(div);
  });
  cartSubtotal.textContent = `PKR ${subtotal}`;
}
productGrid.onclick = (e) => {
  if (e.target.classList.contains('add-cart-btn')) {
    const id = parseInt(e.target.dataset.id);
    const found = cart.find(item => item.id === id);
    if (found) found.qty++;
    else cart.push({ id, qty: 1 });
    updateCartCount();
    Swal.fire({
      title: 'Added to Cart',
      icon: 'success',
      ...swalTheme
    });
  }
  if (e.target.classList.contains('wishlist')) {
    const id = parseInt(e.target.dataset.id);
    if (wishlist.includes(id)) wishlist = wishlist.filter(w => w !== id);
    else wishlist.push(id);
    renderProducts();
  }
};
cartBtn.onclick = () => {
  updateCartModal();
  cartModal.classList.add('open');
};
closeCart.onclick = () => cartModal.classList.remove('open');
cartItems.onclick = (e) => {
  if (e.target.classList.contains('remove-cart-item')) {
    const id = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== id);
    updateCartModal();
    updateCartCount();
  }
  if (e.target.classList.contains('qty-btn')) {
    const id = parseInt(e.target.dataset.id);
    const action = e.target.dataset.action;
    const found = cart.find(item => item.id === id);
    if (found) {
      if (action === 'inc') found.qty++;
      if (action === 'dec' && found.qty > 1) found.qty--;
      updateCartModal();
      updateCartCount();
    }
  }
};

// --- Checkout Logic ---
checkoutBtn.onclick = () => {
  if (cart.length === 0) return Swal.fire({
    title: 'Cart is empty',
    icon: 'info',
    ...swalTheme
  });
  orderSummary.innerHTML = `
    <div style="color:#d4af37;font-weight:600;font-size:1.1rem;margin-bottom:0.7em;">Order Summary</div>
    <div style="margin-bottom:0.7em;">
      ${cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return `<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3em;'><span>${product.name} × <b>${item.qty}</b></span><span style='color:#d4af37;'>PKR ${product.price * item.qty}</span></div>`;
      }).join('')}
    </div>
    <div style="border-top:1px solid #e0e0e0;padding-top:0.7em;display:flex;justify-content:space-between;font-weight:700;font-size:1.1rem;">
      <span>Total</span><span style="color:#d4af37;">PKR ${cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.qty, 0)}</span>
    </div>
  `;
  checkoutModal.classList.add('open');
};
closeCheckout.onclick = () => checkoutModal.classList.remove('open');
checkoutForm.onsubmit = async (e) => {
  e.preventDefault();
  const form = new FormData(checkoutForm);
  const userInfo = {
    name: form.get('name'),
    email: form.get('email'),
    number: form.get('number'),
    address1: form.get('address1'),
    address2: form.get('address2'),
    address3: form.get('address3')
  };
  const order = {
    user: userInfo,
    items: cart.map(item => {
      const product = products.find(p => p.id === item.id);
      return { name: product.name, qty: item.qty, price: product.price };
    }),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  try {
    await db.collection('orders').add(order);
    // Send order confirmation email via EmailJS
    if (window.emailjs) {
      const orderItemsHtml = order.items.map(item => `${item.name} × ${item.qty} (PKR ${item.price * item.qty})`).join('\n');
      const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      emailjs.send('service_4360mnd', 'template_gzx8kp8', {
        from_name: userInfo.name,
        from_email: userInfo.email,
        to_name: userInfo.name,
        to_email: userInfo.email,
        phone: userInfo.number,
        address1: userInfo.address1,
        address2: userInfo.address2,
        address3: userInfo.address3,
        order_items: orderItemsHtml,
        order_total: total
      })
      .then(function() {
        // Email sent successfully (do nothing extra)
      }, function(error) {
        Swal.fire({
          title: 'Order Placed! (Email Failed)',
          text: 'Order saved, but confirmation email could not be sent. Please contact support if needed.',
          icon: 'warning',
          ...swalTheme
        });
      });
    }
    Swal.fire({
      title: 'Order Placed!',
      text: 'Thank you for your purchase.',
      icon: 'success',
      ...swalTheme
    });
    cart = [];
    updateCartCount();
    checkoutModal.classList.remove('open');
    cartModal.classList.remove('open');
  } catch (err) {
    Swal.fire({
      title: 'Error',
      text: err.message,
      icon: 'error',
      ...swalTheme
    });
  }
};

// --- Newsletter (HTML only) ---
document.getElementById('newsletterForm').onsubmit = e => {
  e.preventDefault();
  Swal.fire({
    title: 'Subscribed!',
    text: 'Thank you for subscribing.',
    icon: 'success',
    ...swalTheme
  });
};

// --- EmailJS Contact Form Integration ---
if (window.emailjs) {
  emailjs.init('1nr9veGnJy1JmvgFK');
}
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.onsubmit = function(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const subject = form.subject.value;
    const message = form.message.value;
    emailjs.send('service_4360mnd', 'template_gzx8kp8', {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message
    })
    .then(function() {
      Swal.fire({
        title: 'Message Sent!',
        text: 'Thank you for contacting us. We will get back to you soon.',
        icon: 'success',
        ...swalTheme
      });
      form.reset();
    }, function(error) {
      Swal.fire({
        title: 'Error',
        text: 'There was a problem sending your message. Please try again later.',
        icon: 'error',
        ...swalTheme
      });
    });
  };
}

// --- Initial Render ---
renderProducts();
updateCartCount();

// --- SweetAlert2 Custom CSS ---
const style = document.createElement('style');
style.innerHTML = `
.swal2-gold-dark {
  background: #181818 !important;
  color: #fff !important;
  border-radius: 18px !important;
}
.swal2-btn-gold {
  background: #d4af37 !important;
  color: #181818 !important;
  border-radius: 20px !important;
  font-weight: bold !important;
  font-size: 1.1rem !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0.6em 2em !important;
}
.swal2-btn-gold:focus, .swal2-btn-gold:hover {
  background: #fff !important;
  color: #d4af37 !important;
}
.swal2-btn-outline {
  background: transparent !important;
  border: 2px solid #d4af37 !important;
  color: #d4af37 !important;
  border-radius: 20px !important;
  font-weight: bold !important;
  font-size: 1.1rem !important;
  box-shadow: none !important;
  padding: 0.6em 2em !important;
}
.swal2-btn-outline:focus, .swal2-btn-outline:hover {
  background: #d4af37 !important;
  color: #181818 !important;
}
.swal2-title-gold {
  color: #d4af37 !important;
  font-weight: bold !important;
}
.swal2-html-white {
  color: #fff !important;
}
.swal2-input-dark {
  background: #222 !important;
  color: #fff !important;
  border: 1px solid #d4af37 !important;
  border-radius: 12px !important;
}
`;
document.head.appendChild(style);

// --- Make close (cross) button more prominent ---
function enhanceModalCloseButtons() {
  const closeBtns = document.querySelectorAll('.modal .close');
  closeBtns.forEach(btn => {
    btn.style.fontSize = '2.2rem';
    btn.style.color = '#d4af37';
    btn.style.fontWeight = 'bold';
    btn.style.transition = 'color 0.2s';
    btn.onmouseover = () => btn.style.color = '#fff';
    btn.onmouseout = () => btn.style.color = '#d4af37';
  });
}
setTimeout(enhanceModalCloseButtons, 100); // Run after DOM is ready 

// --- Mobile Nav Logic ---
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');

hamburgerBtn.onclick = (e) => {
  e.stopPropagation();
  const isOpen = mobileNav.classList.toggle('open');
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
  mobileNav.setAttribute('aria-hidden', !isOpen);
};

// Close mobile nav when clicking a link or outside
mobileNav.onclick = (e) => {
  if (e.target.tagName === 'A') {
    mobileNav.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', false);
    mobileNav.setAttribute('aria-hidden', true);
  }
};
document.addEventListener('click', (e) => {
  if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && e.target !== hamburgerBtn) {
    mobileNav.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', false);
    mobileNav.setAttribute('aria-hidden', true);
  }
});

// --- Mobile Account Dropdown Logic ---
const mobileAccountDropdown = document.getElementById('mobileAccountDropdown');
const mobileAccountBtn = document.getElementById('mobileAccountBtn');
const mobileAccountOptions = document.getElementById('mobileAccountOptions');
const googleLoginMobile = document.getElementById('googleLoginMobile');
const emailLoginMobile = document.getElementById('emailLoginMobile');
const guestLoginMobile = document.getElementById('guestLoginMobile');
const emailSignupMobile = document.getElementById('emailSignupMobile');

if (mobileAccountBtn) {
  mobileAccountBtn.onclick = (e) => {
    e.stopPropagation();
    mobileAccountDropdown.classList.toggle('open');
  };
  document.addEventListener('click', (e) => {
    if (mobileAccountDropdown.classList.contains('open') && !mobileAccountDropdown.contains(e.target)) {
      mobileAccountDropdown.classList.remove('open');
    }
  });
}
if (googleLoginMobile) {
  googleLoginMobile.onclick = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(() => Swal.fire({
        title: 'Logged in with Google!',
        icon: 'success',
        ...swalTheme
      }))
      .catch(err => Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
        ...swalTheme
      }));
    mobileAccountDropdown.classList.remove('open');
  };
}
if (emailLoginMobile) {
  emailLoginMobile.onclick = () => {
    Swal.fire({
      title: 'Email Login',
      html: '<input id="swal-email" class="swal2-input" placeholder="Email"><input id="swal-pass" type="password" class="swal2-input" placeholder="Password">',
      preConfirm: () => {
        const email = document.getElementById('swal-email').value;
        const pass = document.getElementById('swal-pass').value;
        return { email, pass };
      },
      showCancelButton: true,
      ...swalTheme
    }).then(result => {
      if (result.isConfirmed) {
        auth.signInWithEmailAndPassword(result.value.email, result.value.pass)
          .then(() => Swal.fire({
            title: 'Logged in!',
            icon: 'success',
            ...swalTheme
          }))
          .catch(err => Swal.fire({
            title: 'Error',
            text: err.message,
            icon: 'error',
            ...swalTheme
          }));
      }
    });
    mobileAccountDropdown.classList.remove('open');
  };
}
if (guestLoginMobile) {
  guestLoginMobile.onclick = () => {
    auth.signInAnonymously()
      .then(() => Swal.fire({
        title: 'Logged in as Guest!',
        icon: 'success',
        ...swalTheme
      }))
      .catch(err => Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
        ...swalTheme
      }));
    mobileAccountDropdown.classList.remove('open');
  };
}
if (emailSignupMobile) {
  emailSignupMobile.onclick = () => {
    Swal.fire({
      title: 'Sign Up',
      html: '<input id="swal-email" class="swal2-input" placeholder="Email"><input id="swal-pass" type="password" class="swal2-input" placeholder="Password">',
      preConfirm: () => {
        const email = document.getElementById('swal-email').value;
        const pass = document.getElementById('swal-pass').value;
        return { email, pass };
      },
      showCancelButton: true,
      ...swalTheme
    }).then(result => {
      if (result.isConfirmed) {
        auth.createUserWithEmailAndPassword(result.value.email, result.value.pass)
          .then(() => Swal.fire({
            title: 'Account created!',
            icon: 'success',
            ...swalTheme
          }))
          .catch(err => Swal.fire({
            title: 'Error',
            text: err.message,
            icon: 'error',
            ...swalTheme
          }));
      }
    });
    mobileAccountDropdown.classList.remove('open');
  };
} 
