// GLOBAL USER
let currentUser = null;

// HIDE APP BEFORE LOGIN
window.onload = () => {
  document.getElementById("posts").style.display = "none";
  document.querySelector(".create-post").style.display = "none";
};

// LOGIN FUNCTION
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.userId) {
      currentUser = data.userId;

      alert("Welcome " + data.name);

      // Hide login
      document.getElementById("loginBox").style.display = "none";

      // Show app
      document.getElementById("posts").style.display = "block";
      document.querySelector(".create-post").style.display = "block";

      getPosts();
    } else {
      alert(data.message);
    }
  });
}

// CREATE POST (WITH IMAGE)
function createPost() {
  const content = document.getElementById("content").value;
  const image = document.getElementById("image").files[0];

  if (!currentUser) {
    alert("Please login first");
    return;
  }

  const formData = new FormData();
  formData.append("userId", currentUser);
  formData.append("content", content);
  formData.append("image", image);

  fetch("http://localhost:5000/api/posts/create", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    document.getElementById("content").value = "";
    document.getElementById("image").value = "";
    getPosts();
  });
}

// GET POSTS
function getPosts() {
  fetch("http://localhost:5000/api/posts")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("posts");
      container.innerHTML = "";

      data.forEach(post => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
          <!-- User -->
          <div class="user">
            <img src="https://i.pravatar.cc/40" class="avatar">
            <span>Neha</span>
          </div>

          <!-- Content -->
          <p class="post-text">${post.content}</p>

          ${
            post.image
              ? `<img src="http://localhost:5000/uploads/${post.image}" style="width:100%; border-radius:10px;">`
              : ""
          }

          <!-- Actions -->
          <div class="actions">
            <button onclick="likePost('${post._id}')">❤️</button>
            <button onclick="showComments('${post._id}')">💬</button>
          </div>

          <!-- Likes -->
          <p id="likes-${post._id}">0 likes</p>

          <!-- Time -->
          <small class="time">${new Date(post.createdAt).toLocaleString()}</small>

          <!-- Comments -->
          <div id="comments-${post._id}" class="comments"></div>
        `;

        container.appendChild(div);

        getLikes(post._id);
      });
    });
}

// LIKE / UNLIKE
function likePost(postId) {
  fetch("http://localhost:5000/api/likes/toggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      postId: postId,
      userId: currentUser
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    getLikes(postId);
  });
}

// GET LIKE COUNT
function getLikes(postId) {
  fetch(`http://localhost:5000/api/likes/${postId}`)
    .then(res => res.json())
    .then(data => {
      const el = document.getElementById(`likes-${postId}`);
      if (el) {
        el.innerText = data.likes + " likes";
      }
    });
}

// SHOW COMMENTS
function showComments(postId) {
  fetch(`http://localhost:5000/api/comments/${postId}`)
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById(`comments-${postId}`);
      div.innerHTML = "";

      data.forEach(c => {
        div.innerHTML += `<p>💬 ${c.text}</p>`;
      });

      div.innerHTML += `
        <input type="text" id="commentInput-${postId}" placeholder="Add a comment...">
        <button onclick="addComment('${postId}')">Post</button>
      `;
    });
}

// ADD COMMENT
function addComment(postId) {
  const text = document.getElementById(`commentInput-${postId}`).value;

  if (!text) return;

  fetch("http://localhost:5000/api/comments/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      postId: postId,
      userId: currentUser,
      text: text
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    showComments(postId);
  });
}