const resultContainer = document.getElementById("resultContainer");

function handleEnter(event) {
  if (event.key === "Enter") {
    searchUser();
  }
}

async function searchUser() {
  const username = document.getElementById("usernameInput").value.trim();
  const loader = document.getElementById("loader");
  // const paginationContainer = document.getElementById('pagination');

  if (username === "") {
    alert("Please enter a valid username.");
    return;
  }

  try {
    loader.style.display = "block";

    const userData = await getUserData(username);
    const repoData = await getUserRepos(username);

    console.log("USER PROFILE", userData);
    console.log("USER REPO", repoData);
    displayUserProfile(userData);

    // Display pagination
    // displayPagination(repoData.length, paginationContainer);
  } catch (error) {
    alert("Username not found.");
  } finally {
    loader.style.display = "none";
  }
}

async function getUserData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    throw new Error("User not found.");
  }

  return await response.json();
}

async function getUserRepos(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=created&per_page=10`
  );
  if (!response.ok) {
    throw new Error("Error fetching repositories.");
  }

  return await response.json();
}

function displayUserProfile(userData) {
  const imgContainer = document.getElementById("imgContainer");
  const bioContainer = document.getElementById("bioContainer");

  imgContainer.innerHTML = `
    <img src=${userData.avatar_url} alt="userImg">
    <a href=${userData.html_url}><i class="fa-solid fa-link"></i> ${userData.html_url}</a>
    `;

  bioContainer.innerHTML = `<h3>${userData.name}</h3>
    <p>${userData.bio}</p>
    <p><i class="fa-solid fa-location-dot"></i> ${userData.location}</p>
    <p>Twitter:${userData.twitter_username}</p>`;
}
