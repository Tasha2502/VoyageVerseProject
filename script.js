const slideshowVideo = document.getElementById("slideshowVideo");
const closeBtn = document.getElementById("closeSlideshow");

// Ensure autoplay works with muted video initially
window.addEventListener("load", () => {
  if (slideshowVideo) {
    slideshowVideo.play()
      .then(() => {
        console.log("Video is playing, muted initially");
      })
      .catch((error) => {
        console.error("Error playing video:", error);
      });
  }
});

// Handle Close Button (Stop the video and reset it)
closeBtn.addEventListener("click", () => {
  slideshowVideo.pause(); // Stop the video
  slideshowVideo.currentTime = 0; // Reset the video to the start
  slideshowVideo.muted = false; // Unmute the video (to play with sound)

  console.log("Video stopped, reset, and unmuted");

  // Optional: Hide the video container or add any other UI updates here
  const slideshowContainer = document.getElementById("videoSlideshow");
  slideshowContainer.style.display = "none"; // Hide the slideshow container (optional)
});

// Allow unmuting and continuing the video on user interaction (click anywhere on the video)
slideshowVideo.addEventListener('click', () => {
  if (slideshowVideo.muted) {
    slideshowVideo.muted = false; // Unmute the video on first click
    slideshowVideo.play(); // Continue playing with sound
    console.log("Video unmuted and playing with sound");
  }
});


let searchBtn = document.querySelector('#search-btn');
let searchBar = document.querySelector('.search-bar-container');
let formBtn = document.querySelector('#login-btn');
let loginForm = document.querySelector('.login-form-container');
let formClose = document.querySelector('#form-close');
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let videoBtn = document.querySelectorAll('.vid-btn');


window.onscroll = () =>{
    searchBtn.classList.remove('fa-times');
    searchBar.classList.remove('active');
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
    loginForm.classList.remove('active');

}
menu.addEventListener('click',()=>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');

});



searchBtn.addEventListener('click',()=>{
    searchBtn.classList.toggle('fa-times');
    searchBar.classList.toggle('active');

});

formBtn.addEventListener('click',()=>{
    loginForm.classList.add('active');
});

formClose.addEventListener('click',()=>{
    loginForm.classList.remove('active');
});

videoBtn.forEach(btn =>{
    btn.addEventListener('click',()=>{
        document.querySelector('.controls .active').classList.remove('active');
        btn.classList.add('active');
        let src=btn.getAttribute('data-src');
        document.querySelector('#video-slider').src=src;

    });

});

var swiper = new Swiper(".review-slider",{
    spaceBetween: 20,
    loop:true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});
var swiper = new Swiper(".brand-slider",{
    spaceBetween: 20,
    loop:true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});


const search_Btn = document.getElementById("search-btn");
const search_Bar = document.getElementById("search-bar");
const unsplashContainer = document.getElementById("unsplash-container");


const AccessKey="iADZkK-R9fNdhCJ_uc6K3NlFdRMcC6nbjt6BIBsXuFM";

function fetchUnsplashImages(query){
    const unsplashURL = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${AccessKey}&per_page=12`;

unsplashContainer.innerHTML = " ";



fetch(unsplashURL)
.then(response => {
    if (!response.ok) {
        throw new Error("Error fetching Unsplash API");
    }
    return response.json();
})
.then(data => {
    if (data.results.length === 0) {
        unsplashContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    data.results.forEach(photo => {
        const img = document.createElement("img");
        img.src = photo.urls.small;
        img.alt = photo.alt_description || "Unsplash Image";
        unsplashContainer.appendChild(img);
    });
})
.catch(error => {
    console.error("Error:", error);
    unsplashContainer.innerHTML = "<p>Failed to load images. Please try again later.</p>";
});
}
searchBtn.addEventListener("click", () => {
    const query = searchBar.value.trim(); // Get the search query
    if (query) {
        fetchUnsplashImages(query);
    }
});
// Function to create rain effect
function createRain(container) {
    const rainContainer = document.createElement('div');
    rainContainer.classList.add('rain');
    container.appendChild(rainContainer);

    // Create multiple raindrops
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.classList.add('drop');
        
        // Set random positions and animation duration for the drops
        drop.style.left = Math.random() * container.offsetWidth + 'px';
        drop.style.animationDuration = Math.random() * 2 + 2 + 's';  // between 2s and 4s for variation
        drop.style.animationDelay = Math.random() * 2 + 's';  // random delay
        
        rainContainer.appendChild(drop);
    }

    // Show rain
    rainContainer.style.display = 'block';
}

// Select the button and weather section
const weatherButton = document.querySelector('.check-weather-btn');
const weatherSection = document.querySelector('#weather');

// Add hover effect to the button
weatherButton.addEventListener('mouseenter', () => {
    createRain(weatherSection); // Trigger rain when button is hovered
});

// Optionally, hide rain when hover ends
weatherButton.addEventListener('mouseleave', () => {
    const rainContainer = weatherSection.querySelector('.rain');
    if (rainContainer) {
        rainContainer.style.display = 'none'; // Hide rain on mouse leave
    }
});
