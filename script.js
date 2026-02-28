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

//function to validate college ID
function validateCollegeID(id) {
    const pattern = /^CET\d{5}$/;
    return pattern.test(id);
}

//Add Request
function addRequest(title, description, category, urgency, contact) {

    if (!currentUser) {
        alert("Please login to post a request.");
        return;
    }

    const newRequest = {
        id: Date.now(),
        title,
        description,
        category,
        urgency,
        contact,
        postedBy: currentUser.collegeID,
        status: "Active"
    };

    requests.push(newRequest);
    saveRequests();
}

//user registration
function registerUser(name, collegeID, contact, password) {

    if (!validateCollegeID(collegeID)) {
        alert("Invalid College ID format!");
        return;
    }

    // Check if user already exists
    const existingUser = users.find(user => user.collegeID === collegeID);

    if (existingUser) {
        alert("User already registered!");
        return;
    }

    const newUser = {
        name,
        collegeID,
        contact,
        password,
        points: 0
    };

    users.push(newUser);
    saveUsers();

    alert("Registration successful!");
}

//user login
function loginUser(collegeID, password) {

    const user = users.find(user => 
        user.collegeID === collegeID && user.password === password
    );

    if (!user) {
        alert("Invalid credentials!");
        return;
    }

    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Login successful!");
}

//logout function
function logoutUser() {
    currentUser = null;
    localStorage.removeItem("currentUser");
    alert("Logged out successfully!");
}

//display function
function displayRequests(filteredRequests = requests) {

    const container = document.getElementById("requestContainer");

    container.innerHTML = ""; // Clear old content

    if (filteredRequests.length === 0) {
        container.innerHTML = "<p>No requests available.</p>";
        return;
    }

    filteredRequests.forEach(request => {

        const card = document.createElement("div");
        card.classList.add("request-card");

        card.innerHTML = `
            <h3>${request.title}</h3>
            <p>${request.description}</p>
            <p><strong>Category:</strong> ${request.category}</p>
            <p><strong>Urgency:</strong> ${request.urgency}</p>
            <p><strong>Contact:</strong> ${request.contact}</p>
            <p><strong>Status:</strong> ${request.status}</p>
            ${request.status === "Active" ? 
                `<button onclick="markResolved(${request.id})">Mark as Resolved</button>` 
                : ""
            }
        `;

        container.appendChild(card);
    });
}

//Auto Load on page load
window.onload = function () {
    displayRequests();
};

//Update add request
displayRequests();

//Mark request as resolved
function markResolved(id) {

    const request = requests.find(req => req.id === id);

    if (request) {
        request.status = "Resolved";
        saveRequests();
        displayRequests();
    }
}
