const resultContainer = document.getElementById("resultContainer");

function handleEnter(event) {
  if (event.key === "Enter") {
    searchUser();
  }
}

async function searchUser() {
  const username = document.getElementById("usernameInput").value.trim();
  const loader = document.getElementById("loader");
  const reposPerPageSelect = document.getElementById("reposPerPageSelect");

  if (username === "") {
    alert("Please enter a valid username.");
    return;
  }

  try {
    loader.style.display = "block";

    const userData = await getUserData(username);

    const reposPerPage = parseInt(reposPerPageSelect.value);

    const repoData = await getUserRepos(username, 1, reposPerPage);

    console.log("USER PROFILE", userData);
    console.log("USER REPO", repoData);
    displayUserProfile(userData);
    displayUserRepo(repoData, 1);
  } catch (error) {
    console.log("error", error.message);
  } finally {
    loader.style.display = "none";
  }
}

async function getUserData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    alert("Enter Valid Username");
    throw new Error("User not found.");
  }

  return await response.json();
}

async function getUserRepos(username, page = 1, reposPerPage = 10) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=created&page=${page}&per_page=${reposPerPage}`
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

function displayUserRepo(repoData, currentPage) {
  const repoContainer = document.getElementById("repoContainer");
  repoContainer.innerHTML = "";
  repoData.forEach((repo) => {
    const repoDiv = document.createElement("div");
    repoDiv.className = "col-12 col-md-6 mb-3 repoID";

    repoDiv.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description available"}</p>
            <div class="mt-2">
                ${repo.topics
                  .map(
                    (topic) =>
                      `<button class="repoBtn btn btn-primary mb-2">${topic}</button>`
                  )
                  .join(" ")}
            </div>
        `;

    repoContainer.appendChild(repoDiv);
  });
}
