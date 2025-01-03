const populate = async (value) => {
    let myStr = "";
  
    try {
      // API URL
      const url = `https://v6.exchangerate-api.com/v6/2cae938db760a997f8f84387/latest/USD`;
  
      // Fetching API data
      const response = await fetch(url);
      console.log("API Response Status:", response.status); // Debugging
      if (!response.ok) throw new Error("API call failed");
  
      const rJson = await response.json();
      console.log("API Response Data:", rJson); // Debugging
  
      // Making the output container visible
      document.querySelector(".output").style.display = "block";
  
      // Looping through conversion rates and populating table
      for (let key of Object.keys(rJson["conversion_rates"])) {
        const rate = rJson["conversion_rates"][key];
        myStr += `
          <tr>
            <td>${key}</td>
            <td>${rate}</td>
            <td>${Math.round(rate * value)}</td>
          </tr>
        `;
      }
  
      // Updating the table body
      const tableBody = document.querySelector("tbody");
      tableBody.innerHTML = myStr;
      console.log("Table populated successfully"); // Debugging
    } catch (error) {
      console.error("Error in populate function:", error);
      alert("Failed to fetch exchange rates. Please try again later.");
    }
  };
  
  const btn = document.querySelector(".btn");
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("Button clicked"); // Debugging
  
    // Fetching user input
    const value = parseInt(document.querySelector("input[name='quantity']").value);
    console.log("User Input Value:", value); // Debugging
  
    if (isNaN(value) || value <= 0) {
      alert("Please enter a valid positive number");
      return;
    }
  
    // Call populate function
    await populate(value);
  });







