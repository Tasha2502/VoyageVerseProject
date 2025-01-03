// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIJRpM5QyamZVrMokeMDtp03lSlhveSAc",
    authDomain: "voyageverse2-3d69a.firebaseapp.com",
    projectId: "voyageverse2-3d69a",
    storageBucket: "voyageverse2-3d69a.firebasestorage.app",
    messagingSenderId: "176824786662",
    appId: "1:176824786662:web:56462e5a12b89cf592a527"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Clear any previous error message
    document.getElementById("error-message").textContent = '';

    // Firebase authentication
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Login successful
            const user = userCredential.user;
            alert("Login successful! Welcome " + user.email);
            // Optionally redirect to another page or show user data
        })
        .catch((error) => {
            // Handle errors
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode === 'auth/wrong-password') {
                document.getElementById("error-message").textContent = "Incorrect password. Please try again.";
            } else if (errorCode === 'auth/user-not-found') {
                document.getElementById("error-message").textContent = "No user found with this email.";
            } else {
                document.getElementById("error-message").textContent = "Login failed: " + errorMessage;
            }
        });
});