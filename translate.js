const phrases = [
    "Hello",
    "Goodbye",
    "Thank you",
    "Please",
    "Yes",
    "No",
    "How are you?",
    "I need help",
    "Where is the bathroom?",
    "How much does it cost?"
  ];
  
  const apiUrl = "https://api.mymemory.translated.net/get"; // MyMemory API endpoint
  
  document.getElementById("language").addEventListener("change", async function () {
    const selectedLanguage = this.value;
    const cheatSheetDiv = document.getElementById("cheatSheet");
    cheatSheetDiv.innerHTML = "<p>Loading translations...</p>";
  
    try {
      const translations = await Promise.all(
        phrases.map(async (phrase) => {
          const response = await fetch(`${apiUrl}?q=${encodeURIComponent(phrase)}&langpair=en|${selectedLanguage}`);
          const data = await response.json();
          return { original: phrase, translated: data.responseData.translatedText };
        })
      );
  
      cheatSheetDiv.innerHTML = translations
        .map(
          (item) => `
          <div class="phrase">
            <span>${item.original}:</span> ${item.translated}
          </div>
        `
        )
        .join("");
    } catch (error) {
      cheatSheetDiv.innerHTML = "<p>Error: Unable to fetch translations. Please try again later.</p>";
    }
  });