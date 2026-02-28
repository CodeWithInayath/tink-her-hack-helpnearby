// ===============================
// STORAGE SETUP
// ===============================

let requests = JSON.parse(localStorage.getItem("requests")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

function saveRequests() {
    localStorage.setItem("requests", JSON.stringify(requests));
}

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

// ===============================
// PAGE SWITCHING
// ===============================

function showPage(pageId) {
    document.querySelectorAll(".page-view").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");
}

// ===============================
// COLLEGE ID VALIDATION
// ===============================

function validateCollegeID(id) {
    const pattern = /^CET\d{5}$/;
    return pattern.test(id);
}

// ===============================
// GUEST REQUEST SUBMISSION
// ===============================

document.getElementById("form-guest-request").addEventListener("submit", function (e) {
    e.preventDefault();

    const collegeID = document.getElementById("guest-id").value;
    const title = document.getElementById("guest-title").value;
    const contact = document.getElementById("guest-contact").value;
    const desc = document.getElementById("guest-desc").value;

    if (!validateCollegeID(collegeID)) {
        alert("Invalid College ID format! Example: CET12345");
        return;
    }

    const newRequest = {
        id: Date.now(),
        title,
        description: desc,
        category: "General",
        urgency: "High",
        contact,
        postedBy: collegeID,
        status: "Active"
    };

    requests.push(newRequest);
    saveRequests();

    alert("Request posted successfully!");
    this.reset();
});

// ===============================
// LOGIN SYSTEM
// ===============================

document.getElementById("form-login").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const user = users.find(user =>
        user.email === email && user.password === password
    );

    if (!user) {
        alert("Invalid credentials!");
        return;
    }

    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));

    updatePointsBadge();
    displayRequests();
    showPage("page-dashboard");
});

// ===============================
// LOGOUT
// ===============================

document.getElementById("btn-logout").addEventListener("click", function () {
    currentUser = null;
    localStorage.removeItem("currentUser");
    showPage("page-landing");
});

// ===============================
// DISPLAY REQUESTS
// ===============================

function displayRequests() {
    const container = document.getElementById("requestContainer");

    if (!container) return;

    container.innerHTML = "";

    if (requests.length === 0) {
        container.innerHTML = "<p>No requests yet.</p>";
        return;
    }

    requests.forEach(request => {

        const card = document.createElement("div");
        card.classList.add("request-card");

        card.innerHTML = `
            <h3>${request.title}</h3>
            <p>${request.description || ""}</p>
            <p><strong>Contact:</strong> ${request.contact}</p>
            <p><strong>Status:</strong> ${request.status}</p>
            ${currentUser && request.status === "Active"
                ? `<button onclick="markResolved(${request.id})">Mark as Helped</button>`
                : ""
            }
        `;

        container.appendChild(card);
    });
}

// ===============================
// MARK RESOLVED + POINTS SYSTEM
// ===============================

function markResolved(id) {

    const request = requests.find(req => req.id === id);

    if (!request || request.status === "Resolved") return;

    request.status = "Resolved";

    if (currentUser) {
        currentUser.points += 10;

        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers();
        }

        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        updatePointsBadge();
    }

    saveRequests();
    displayRequests();
}

// ===============================
// UPDATE POINTS BADGE
// ===============================

function updatePointsBadge() {
    const badge = document.querySelector(".activity-badge");
    if (badge && currentUser) {
        badge.textContent = `⭐ ${currentUser.points} Pts`;
    }
}

// ===============================
// PAGE NAVIGATION BUTTONS
// ===============================

document.getElementById("btn-go-to-login").addEventListener("click", function () {
    showPage("page-login");
});

document.getElementById("btn-back-to-guest").addEventListener("click", function () {
    showPage("page-landing");
});

// ===============================
// AUTO LOGIN IF SESSION EXISTS
// ===============================

window.onload = function () {
    if (currentUser) {
        updatePointsBadge();
        displayRequests();
        showPage("page-dashboard");
    }
};