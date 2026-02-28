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

