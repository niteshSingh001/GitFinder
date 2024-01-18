function fetchUser() {
  const userName = document.querySelector("#userName").value;
  fetchProfile(userName);
}

async function fetchProfile(userName) {
  try {
    const apiURL = `https://api.github.com/users/${userName}`;

    document.getElementById("loading").style.display = "block";

    const response = await fetch(apiURL);

    if (!response.ok) {
      alert("Enter correct username");
      throw new Error("Network response was not ok");
    } else {
      const userData = await response.json();
      document.getElementById("loading").style.display = "none";
      setUserData(userData);

      console.log("API RESPONSE", userData);
    }
  } catch (error) {
    document.getElementById("loading").style.display = "none";
    console.error("Fetch error:", error);
  }
}

function setUserData() {}
