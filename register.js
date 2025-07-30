

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

  const firebaseConfig = {
  apiKey: "AIzaSyBvVOiZ9brgYkEmI8tJzHAPWSezRcQiJEU",
  authDomain: "login-example-364d8.firebaseapp.com",
  projectId: "login-example-364d8",
  storageBucket: "login-example-364d8.firebasestorage.app",
  messagingSenderId: "775673848703",
  appId: "1:775673848703:web:c62995c0e404e77611704a"
};

// Prevent double initialization
if (!getApps().length) {
  initializeApp(firebaseConfig);
}


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

function showMessage(message,divId){
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function(){
    messageDiv.style.opacity = 0;
  },5000);
}

  const submit = document.getElementById('submit');
  submit.addEventListener("click",function(event){
    event.preventDefault()
    //inputs
    const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value;
  
  const auth = getAuth();
  const db = getFirestore();
    
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    const userData = {
      email:email,
      name:name
    };
    showMessage("Account created successfully","signUpmessage");
    const docRef = doc(db,"users", user.uid);
    setDoc(docRef,userData)
    .then(()=>{
      window.location.href = "login.html";
    })
   .catch((error)=>{
    console.error("Error writing document: ", error);
   });
  })
  .catch((error) => {
    const errorCode = error.code;
   if(errorCode === 'auth/email-already-in-use'){
      showMessage("Email Address already Exists!","signUpmessage");
    }
    else{
      showMessage("Unable to Create Account " ,"signUpmessage");
    }
  });

  });
