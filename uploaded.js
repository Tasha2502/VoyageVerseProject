// Debugging Utility
function logMessage(message) {
  console.log(`[DEBUG]: ${message}`);
}

// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIJRpM5QyamZVrMokeMDtp03lSlhveSAc",
  authDomain: "voyageverse2-3d69a.firebaseapp.com",
  projectId: "voyageverse2-3d69a",
  storageBucket: "voyageverse2-3d69a.appspot.com",
  messagingSenderId: "176824786662",
  appId: "1:176824786662:web:56462e5a12b89cf592a527",
};

// Initialize Firebase
let db;
try {
  const app = initializeApp(firebaseConfig);
  logMessage("Firebase initialized successfully.");
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// DOM Elements
const destinationInput = document.getElementById("destinationInput");
const searchInput = document.getElementById("searchInput");
const photosGrid = document.getElementById("photosGrid");
const reviewText = document.getElementById("reviewText");
const uploadPhoto = document.getElementById("uploadPhoto");
const submitReviewButton = document.getElementById("submitReview");

// Get all rating values (thumbs, stars, smiley)
function getSelectedRatings() {
  const thumbs = document.querySelector('input[name="thumbs-rating"]:checked')?.value || null;
  const stars = document.querySelector('input[name="star-rating"]:checked')?.value || null;
  const smiley = document.querySelector('input[name="smiley-rating"]:checked')?.value || null;
  return { thumbs, stars, smiley };
}

// Display Reviews
async function displayReviews(destination) {
  logMessage(`Fetching reviews for: ${destination}`);
  photosGrid.innerHTML = ""; // Clear existing content

  try {
    const photosRef = collection(db, "photos");
    const q = query(photosRef, where("destination", "==", destination));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const photoItem = document.createElement("div");
        photoItem.classList.add("photo-item");

        // Create star rating display
        let ratingStars = '';
        for (let i = 0; i < 5; i++) {
          if (i < data.stars) {
            ratingStars += '⭐'; // Full star for the rating
          } else {
            ratingStars += '☆'; // Empty star for the remaining
          }
        }

        const thumbs = data.thumbs === 'up' ? '👍' : data.thumbs === 'down' ? '👎' : '';
        const smiley = data.smiley === 'happy' ? '😊' : data.smiley === 'neutral' ? '😐' : '☹️';

        photoItem.innerHTML = `
          <img src="${data.photoUrl}" alt="${data.destination}">
          <p>${data.review}</p>
          <p><strong>Thumbs: </strong>${thumbs}</p>
          <p><strong>Rating: </strong>${ratingStars}</p>
          <p><strong>Smiley: </strong>${smiley}</p>
        `;
        photosGrid.appendChild(photoItem);
      });
    } else {
      photosGrid.innerHTML = "<p>No reviews found for this destination.</p>";
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    photosGrid.innerHTML = "<p>Error loading reviews. Please try again later.</p>";
  }
}

// Submit Review
async function submitReview(destination) {
  const text = reviewText.value.trim();
  const file = uploadPhoto.files[0];
  const { thumbs, stars, smiley } = getSelectedRatings(); // Get all selected ratings

  if (!text || !file || !thumbs || !stars || !smiley || !destination) {
    alert("Please provide all required inputs (destination, review, ratings, and photo).");
    return;
  }

  try {
    logMessage("Uploading photo to Cloudinary...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Travel_whishlist");

    const response = await fetch("https://api.cloudinary.com/v1_1/diimspeuw/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.secure_url) {
      logMessage("Photo uploaded successfully. Saving review to Firestore...");

      await addDoc(collection(db, "photos"), {
        destination,
        photoUrl: data.secure_url,
        review: text,
        thumbs,  // Store thumbs rating
        stars: parseInt(stars),  // Store star rating
        smiley,  // Store smiley rating
        timestamp: new Date(),
      });

      logMessage("Review submitted successfully.");
      alert("Review submitted successfully!");
      displayReviews(destination); // Refresh reviews after submission
    } else {
      logMessage("Photo upload failed.");
      alert("Failed to upload the photo. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("An error occurred while submitting your review. Please try again.");
  }
}

// Event Listeners
submitReviewButton.addEventListener("click", () => {
  const destination = destinationInput.value.trim();
  if (destination) {
    submitReview(destination);
  } else {
    alert("Please enter a destination.");
  }
});

searchInput.addEventListener("input", () => {
  const queryText = searchInput.value.trim();
  if (queryText) {
    displayReviews(queryText); // Only call displayReviews if there’s input
  }
});