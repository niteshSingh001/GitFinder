// const resultContainer = document.getElementById("resultContainer");

// function handleEnter(event) {
//   if (event.key === "Enter") {
//     searchUser();
//   }
// }

// async function searchUser() {
//   const username = document.getElementById("usernameInput").value.trim();
//   const loader = document.getElementById("loader");
//   const reposPerPageSelect = document.getElementById("reposPerPageSelect");

//   if (username === "") {
//     alert("Please enter a valid username.");
//     return;
//   }

//   try {
//     loader.style.display = "block";

//     const userData = await getUserData(username);

//     const reposPerPage = parseInt(reposPerPageSelect.value);

//     const repoData = await getUserRepos(username, 1, reposPerPage);

//     console.log("USER PROFILE", userData);
//     console.log("USER REPO", repoData);
//     displayUserProfile(userData);
//     displayUserRepo(repoData, 1);
//   } catch (error) {
//     console.log("error", error.message);
//   } finally {
//     loader.style.display = "none";
//   }
// }

// async function getUserData(username) {
//   const response = await fetch(`https://api.github.com/users/${username}`);
//   if (!response.ok) {
//     alert("Enter Valid Username");
//     throw new Error("User not found.");
//   }

//   return await response.json();
// }

// async function getUserRepos(username, page = 1, reposPerPage = 10) {
//   const response = await fetch(
//     `https://api.github.com/users/${username}/repos?sort=created&page=${page}&per_page=${reposPerPage}`
//   );
//   if (!response.ok) {
//     throw new Error("Error fetching repositories.");
//   }

//   return await response.json();
// }

// function displayUserProfile(userData) {
//   const imgContainer = document.getElementById("imgContainer");
//   const bioContainer = document.getElementById("bioContainer");

//   imgContainer.innerHTML = `
//     <img src=${userData.avatar_url} alt="userImg">
//     <a href=${userData.html_url}><i class="fa-solid fa-link"></i> ${userData.html_url}</a>
//     `;

//   bioContainer.innerHTML = `<h3>${userData.name}</h3>
//     <p>${userData.bio}</p>
//     <p><i class="fa-solid fa-location-dot"></i> ${userData.location}</p>
//     <p>Twitter:${userData.twitter_username}</p>`;
// }

// function displayUserRepo(repoData, currentPage) {
//   const repoContainer = document.getElementById("repoContainer");
//   repoContainer.innerHTML = "";
//   repoData.forEach((repo) => {
//     const repoDiv = document.createElement("div");
//     repoDiv.className = "col-12 offset-md-1 col-md-5 mb-4 repoID";

//     repoDiv.innerHTML = `
//             <h3>${repo.name}</h3>
//             <p>${repo.description || "No description available"}</p>
//             <div class="mt-2">
//                 ${repo.topics
//                   .map(
//                     (topic) =>
//                       `<button class="repoBtn btn btn-primary mb-2">${topic}</button>`
//                   )
//                   .join(" ")}
//             </div>
//         `;

//     repoContainer.appendChild(repoDiv);
//   });
// }

function handleEnter(event) {
  if (event.key === "Enter") {
    searchUser();
  }
}
let currentPage = 1;
async function searchUser(currentPage = 1) {
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

    const repoData = await getUserRepos(username, currentPage, reposPerPage);
    displayPagination(userData.public_repos, reposPerPage, currentPage);

    console.log("USER PROFILE", userData);
    console.log("USER REPO", repoData);
    displayUserProfile(userData);
    displayUserRepo(repoData, currentPage, reposPerPage);
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

function displayUserRepo(repoData, currentPage, reposPerPage) {
  const repoContainer = document.getElementById("repoContainer");
  repoContainer.innerHTML = "";

  const startIndex = (currentPage - 1) * reposPerPage;
  const endIndex = startIndex + reposPerPage;
  const displayedRepos = repoData.slice(startIndex, endIndex);

  repoData.forEach((repo) => {
    const repoDiv = document.createElement("div");
    repoDiv.className = "col-12 offset-md-1 col-md-5 mb-4 repoID";
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

function displayPagination(totalRepos, reposPerPage, currentPage) {
  const totalPages = Math.ceil(totalRepos / reposPerPage);

  paginationContainer.innerHTML = ""; // Clear previous pagination

  // Previous Page Button
  paginationContainer.appendChild(
    createPaginationButton("Previous", currentPage > 1, currentPage - 1)
  );

  // Page Buttons
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.appendChild(
      createPaginationButton(i, i === currentPage, i)
    );
  }

  // Next Page Button
  paginationContainer.appendChild(
    createPaginationButton("Next", currentPage < totalPages, currentPage + 1)
  );
}

function createPaginationButton(text, enabled, page) {
  const pageBtn = document.createElement("li");
  pageBtn.className = "page-item";

  const link = document.createElement("a");
  link.className = "page-link";
  link.href = "#";
  link.textContent = text;
  link.addEventListener("click", function () {
    if (enabled) {
      searchUser(page);
    }
  });

  pageBtn.appendChild(link);
  if (!enabled) {
    pageBtn.classList.add("disabled");
  }

  return pageBtn;
}
