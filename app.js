// ═══ Student Dashboard — app.js ═══
// This file handles login, fetching students, and creating students

const API_URL = "http://localhost:8000/api";

// ═══ Login ═══

// TODO: select the login form and add a submit event listener
// On submit:
//   1. Prevent default form submission
//   2. Get username and password from the inputs
//   3. Call the login function below
//   4. If successful, hide the login section and show the dashboard
//   5. Load the students


async function login(username, password) {
    // TODO: POST to API_URL + "/token/" with username and password
    // Store the access token (hint: localStorage.setItem)
    // Return true if successful, false if not
}


function getToken() {
    return localStorage.getItem("access_token");
}


function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // TODO: hide dashboard, show login section
}


// ═══ Load Students ═══

async function loadStudents() {
    // TODO: GET from API_URL + "/students/"
    // Include the Authorization header with the JWT token
    // Parse the JSON response
    // Call renderStudents() with the data
}


function renderStudents(students) {
    const list = document.querySelector("#student-list");
    list.innerHTML = "";

    // TODO: loop through students
    // For each student, create a div with class "card"
    // Set its innerHTML to show the student's name, email, and grade
    // Append it to the list
}


// ═══ Create Student ═══

async function createStudent(name, email, grade, courseId) {
    // TODO: POST to API_URL + "/students/"
    // Include Content-Type and Authorization headers
    // Send the student data as JSON in the body
    // After creating, call loadStudents() to refresh the list
}


// ═══ On Page Load ═══

// TODO: check if a token already exists in localStorage
// If yes, hide login and show dashboard, then loadStudents()
// If no, show login section
