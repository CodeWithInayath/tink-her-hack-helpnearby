// ===== HELPNEARBY LOGIC =====

// Load requests from localStorage
let requests = JSON.parse(localStorage.getItem("requests")) || [];

// Load users
let users = JSON.parse(localStorage.getItem("users")) || [];

// Current logged-in user
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Save requests
function saveRequests() {
    localStorage.setItem("requests", JSON.stringify(requests));
}

// Save users
function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}