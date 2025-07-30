
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

let currentUser = null;
let cart = {};

// Load cart as soon as Firebase auth state is known
onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  if (user) {
    try {
      const docRef = doc(db, "carts", user.uid);
      const docSnap = await getDoc(docRef);
      cart = docSnap.exists() ? docSnap.data() : {};
    } catch (e) {
      console.error("Failed to fetch cart from Firestore:", e);
    }
  } else {
    cart = JSON.parse(localStorage.getItem("jaypeeCafeCart")) || {};
  }

  console.log("User cart loaded:", cart);
});

// Attach cart logic and search only after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initializeCartButtons();
});

function initializeCartButtons() {
  const cards = document.querySelectorAll('.menu-card');
  const searchBox = document.querySelector('.search-box');

  if (!cards.length) {
    console.warn("No .menu-card elements found!");
    return;
  }

  cards.forEach(card => {
    const name = card.dataset.name;
    const priceText = card.querySelector(".item-price")?.textContent;
    const price = priceText ? parseInt(priceText.replace("₹", "")) : 0;
    const btn = card.querySelector('.cart-btn');

    if (!name || !price || !btn) {
      console.warn("Skipping invalid card:", card);
      return;
    }

    btn.addEventListener("click", () => {
      if (cart[name]) {
        cart[name].quantity++;
      } else {
        cart[name] = { price, quantity: 1 };
      }
      saveCart();
      alert(`${name} added to cart!`);
    });
  });

  // Search functionality
  if (searchBox) {
    searchBox.addEventListener('input', () => {
      const term = searchBox.value.toLowerCase();
      cards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        card.style.display = name.includes(term) ? 'inline-block' : 'none';
      });
    });
  } else {
    console.warn("Search box not found.");
  }

  console.log("Cart buttons and search initialized!");
}

async function saveCart() {
  if (currentUser) {
    const docRef = doc(db, "carts", currentUser.uid);
    await setDoc(docRef, cart);
  } else {
    localStorage.setItem("jaypeeCafeCart", JSON.stringify(cart));
  }
}


// Simulate a login action (you would replace this with real login logic)
function loginUser(username) {
  // Save the user's name to localStorage or session
  localStorage.setItem("loggedInUser", username);
  updateNavbar();
}

function updateNavbar() {
  const username = localStorage.getItem("loggedInUser");
  const signInBtn = document.getElementById("signInBtn");
  const userNameSpan = document.getElementById("userName");

  if (username) {
    signInBtn.style.display = "none";
    userNameSpan.textContent = username;
    userNameSpan.style.display = "inline";
  } else {
    signInBtn.style.display = "inline";
    userNameSpan.style.display = "none";
  }
}

// Run on page load
window.onload = function() {
  updateNavbar();
};

