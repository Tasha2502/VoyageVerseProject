import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";

import { 
  getDatabase, 
  ref, 
  set, 
  push, 
  get 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIJRpM5QyamZVrMokeMDtp03lSlhveSAc",
  authDomain: "voyageverse2-3d69a.firebaseapp.com",
  projectId: "voyageverse2-3d69a",
  storageBucket: "voyageverse2-3d69a.firebaseapp.com",
  messagingSenderId: "176824786662",
  appId: "1:176824786662:web:56462e5a12b89cf592a527",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// UI Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginSection = document.getElementById("login-section");
const wishlist = document.getElementById("wishlist");
const searchBtn = document.getElementById("search-btn");
const destinationInput = document.getElementById("destination-input");
const imageResults = document.getElementById("image-results");
const reviewForm = document.getElementById('review-form');
const reviewText = document.getElementById('review-text');
const reviewRating = document.getElementById('review-rating');
const reviewPhotosInput = document.getElementById('review-photos');
const reviewsFeed = document.getElementById('reviews-feed');
const destinationNameElement = document.getElementById('destination-name');

// Unsplash API Key
const UNSPLASH_ACCESS_KEY = "pj5oPsBvs8OTBUJK9fGYol1tk_GL9LSDfv5WUEi1bbI";

// Search Unsplash API
const searchUnsplash = async (query) => {
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=5`, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });

    if (!response.ok) {
      throw new Error("Error fetching images from Unsplash");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Unsplash Error:", error);
    return [];
  }
};

// Display images
const displayImages = (images) => {
  imageResults.innerHTML = "";
  images.forEach((img) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${img.urls.small}" alt="${img.alt_description || 'No description'}">
      <div class="info">
        <p>${img.description || "No description available"}</p>
        <button class="add-btn">Add to Wishlist</button>
      </div>
    `;
    imageResults.appendChild(card);

    card.querySelector(".add-btn").addEventListener("click", async () => {
      const uploadedImageUrl = await uploadToCloudinary(img.urls.small);
      if (uploadedImageUrl) {
        addToWishlist(uploadedImageUrl, img.description || "No description available");
        saveWishlistToDatabase(uploadedImageUrl, img.description || "No description available");
      } else {
        alert("Failed to add the destination.");
      }
    });
  });
};

// Upload image to Cloudinary
const uploadToCloudinary = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "Travel_whishlist");

    const cloudinaryResponse = await fetch("https://api.cloudinary.com/v1_1/diimspeuw/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!cloudinaryResponse.ok) {
      throw new Error("Error uploading to Cloudinary");
    }

    const data = await cloudinaryResponse.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Error:", error);
    return null;
  }
};

// Save wishlist to Firebase
const saveWishlistToDatabase = (imageUrl, description) => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to save wishlist items!");
    return;
  }

  const wishlistRef = ref(db, `users/${user.uid}/wishlist`);
  const newItemRef = push(wishlistRef);
  set(newItemRef, { imageUrl, description })
    .then(() => console.log("Wishlist item saved"))
    .catch((error) => console.error("Database Error:", error));
};

// Load wishlist from Firebase
const loadWishlistFromDatabase = () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to view your wishlist!");
    return;
  }

  const wishlistRef = ref(db, `users/${user.uid}/wishlist`);
  get(wishlistRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const items = snapshot.val();
        Object.values(items).forEach((item) => addToWishlist(item.imageUrl, item.description));
      }
    })
    .catch((error) => console.error("Fetch Wishlist Error:", error));
};

// Add to wishlist UI
const addToWishlist = (imageUrl, description) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${imageUrl}" alt="Wishlist Image">
    <div class="info">
      <p>${description}</p>
    </div>
  `;
  wishlist.appendChild(card);
};

// Event Listeners
loginBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("Please enter both email and password!");

  signInWithEmailAndPassword(auth, email, password)
    .then(() => console.log("Login successful"))
    .catch((error) => alert("Login failed: " + error.message));
});

signupBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("Please enter both email and password!");

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => console.log("Signup successful"))
    .catch((error) => alert("Signup failed: " + error.message));
});

logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("Logout successful");
      wishlist.innerHTML = "";
    })
    .catch((error) => console.error("Logout Error:", error));
});

searchBtn.addEventListener("click", async () => {
  const query = destinationInput.value.trim();
  if (!query) return alert("Please enter a destination!");
  const images = await searchUnsplash(query);
  displayImages(images);
});

// Monitor auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
    loginSection.style.display = "none";
    logoutBtn.style.display = "block";
    loadWishlistFromDatabase();
  } else {
    console.log("No user logged in.");
    loginSection.style.display = "block";
    logoutBtn.style.display = "none";
  }
});
// Function to load reviews for a selected destination
const loadReviews = async (destinationId) => {
  // Set the destination name
  destinationNameElement.textContent = destinationId;

  // Fetch reviews from Firestore
  const reviewsQuerySnapshot = await getDocs(collection(db, 'reviews', destinationId, 'reviews'));
  reviewsFeed.innerHTML = ''; // Clear previous reviews
  reviewsQuerySnapshot.forEach((doc) => {
    const review = doc.data();
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('review');
    reviewElement.innerHTML = `
      <p><strong>${review.username}</strong> (${review.rating}/5)</p>
      <p>${review.reviewText}</p>
      ${review.photos ? review.photos.map(photo => `<img src="${photo}" alt="Review Photo" />`).join('') : ''}
    `;
    reviewsFeed.appendChild(reviewElement);
  });
};

// Function to handle review form submission
reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const destinationId = destinationNameElement.textContent;
  const username = prompt("Enter your name");
  const text = reviewText.value.trim();
  const rating = reviewRating.value;
  const photos = [];

  if (!destinationId || !username || !text || !rating) {
    alert("All fields are required!");
    return;
  }

  // Upload photos to Cloudinary or Firebase
  if (reviewPhotosInput.files.length > 0) {
    for (let i = 0; i < reviewPhotosInput.files.length; i++) {
      const file = reviewPhotosInput.files[i];
      const storageRef = ref(storage, `reviews/${destinationId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      photos.push(photoURL);
    }
  }

  // Save review to Firestore
  await addDoc(collection(db, 'reviews', destinationId, 'reviews'), {
    username,
    reviewText: text,
    rating,
    photos,
    createdAt: new Date()
  });

  alert("Review submitted successfully!");

  // Clear the form and reload the reviews
  reviewText.value = '';
  reviewRating.value = '';
  reviewPhotosInput.value = '';
  loadReviews(destinationId);
});

// Load reviews when page is loaded
window.addEventListener('DOMContentLoaded', () => {
  // Assuming the destination ID is passed to this page via URL or other methods
  const destinationId = "your-destination-id"; // Replace this with dynamic value
  loadReviews(destinationId);
});