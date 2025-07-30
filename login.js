// Import Firebase modules (same version)
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvVOiZ9brgYkEmI8tJzHAPWSezRcQiJEU",
  authDomain: "login-example-364d8.firebaseapp.com",
  projectId: "login-example-364d8",
  storageBucket: "login-example-364d8.firebasestorage.app",
  messagingSenderId: "775673848703",
  appId: "1:775673848703:web:c62995c0e404e77611704a"
};

// Initialize Firebase safely
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();

// Add event listener after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.querySelector(".btn");

  submitBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login successful!");
        window.location.href = "menu.html";
      })
      .catch((error) => {
        alert("Login failed: " + error.message);
      });
  });
});
