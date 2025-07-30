
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBvVOiZ9brgYkEmI8tJzHAPWSezRcQiJEU",
  authDomain: "login-example-364d8.firebaseapp.com",
  projectId: "login-example-364d8",
  storageBucket: "login-example-364d8.firebasestorage.app",
  messagingSenderId: "775673848703",
  appId: "1:775673848703:web:c62995c0e404e77611704a"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const db = getFirestore();

let cart = {};
let currentUser = null;

const cartList = document.getElementById('cart-items');
const totalElement = document.getElementById('cart-total');

onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  if (user) {
    const docRef = doc(db, "carts", user.uid);
    const docSnap = await getDoc(docRef);
    cart = docSnap.exists() ? docSnap.data() : {};
  } else {
    cart = JSON.parse(localStorage.getItem('jaypeeCafeCart')) || {};
  }

  renderCart();
});

function renderCart() {
  cartList.innerHTML = '';
  let total = 0;

  Object.keys(cart).forEach(item => {
    const { price, quantity } = cart[item];
    total += price * quantity;

    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${item}</strong> - ₹${price} × ${quantity}
      </div>
      <div class="qty-btns">
        <button onclick="changeQty('${item}', -1)">-</button>
        <button onclick="changeQty('${item}', 1)">+</button>
        <button onclick="removeItem('${item}')" class="remove-btn">Remove</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  totalElement.textContent = total;
}

window.changeQty = function (item, delta) {
  if (cart[item]) {
    cart[item].quantity += delta;
    if (cart[item].quantity <= 0) delete cart[item];
    saveCart();
    renderCart();
  }
};

window.removeItem = function (item) {
  delete cart[item];
  saveCart();
  renderCart();
};

window.clearCart = function () {
  cart = {};
  saveCart();
  renderCart();
};

async function saveCart() {
  if (currentUser) {
    await setDoc(doc(db, "carts", currentUser.uid), cart);
  } else {
    localStorage.setItem("jaypeeCafeCart", JSON.stringify(cart));
  }
}

window.placeOrder = async function () {
  if (Object.keys(cart).length === 0) {
    alert("Cart is empty!");
    return;
  }

  const orderData = {
    items: cart,
    total: Object.keys(cart).reduce((sum, key) => sum + cart[key].price * cart[key].quantity, 0),
    timestamp: new Date().toISOString()
  };

  if (currentUser) {
    const orderId = `order_${Date.now()}`;
    await setDoc(doc(db, "orders", `${currentUser.uid}_${orderId}`), {
      ...orderData,
      userId: currentUser.uid
    });
    alert("Order placed successfully!");
    cart = {};
    await saveCart();
    renderCart();
  } else {
    alert("Please log in to place an order.");
  }
};


window.clearCart = clearCart;
window.placeOrder = placeOrder;
