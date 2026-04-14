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

const loginForm = document.querySelector("#login-form");
const loginSection = document.querySelector("#login-section");
const dashboard = document.querySelector("#dashboard");
const authSection = document.querySelector("#auth-section");
const createStudentForm = document.querySelector("#create-student-form");
const courseSelect = document.querySelector("#student-course");
const studentSearchInput = document.querySelector("#student-search");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
let allStudents = [];

function setActiveTab(tabId) {
    tabButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === tabId);
    });

    tabPanels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.id !== tabId);
        panel.classList.toggle("active", panel.id === tabId);
    });
}

tabButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

if (studentSearchInput) {
    studentSearchInput.addEventListener("input", () => {
        applyStudentFilter();
    });
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value;

    const success = await login(username, password);
    if (!success) {
        alert("Login failed. Check your username and password.");
        return;
    }

    loginSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    if (!document.querySelector("#logout-btn")) {
        authSection.innerHTML = '<button id="logout-btn" type="button">Logout</button>';
        document.querySelector("#logout-btn").addEventListener("click", logout);
    }
    setActiveTab("students-panel");

    alert("Login successful.");
    await loadCourses();
    await loadStudents();

    loginForm.reset();
});

createStudentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#student-name").value.trim();
    const email = document.querySelector("#student-email").value.trim();
    const grade = document.querySelector("#student-grade").value.trim();
    const courseId = Number(courseSelect.value);

    if (!courseId) {
        alert("Please select a course.");
        return;
    }

    const success = await createStudent(name, email, grade, courseId);
    if (success) {
        createStudentForm.reset();
        setActiveTab("students-panel");
    }
});




async function login(username, password) {
    // TODO: POST to API_URL + "/token/" with username and password
    // Store the access token (hint: localStorage.setItem)
    // Return true if successful, false if not
    try {
        const response = await fetch(`${API_URL}/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        return true;
    } catch (error) {
        console.error("Login request failed:", error);
        return false;
    }
}


function getToken() {
    return localStorage.getItem("access_token");
}


function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // TODO: hide dashboard, show login section
    dashboard.classList.add("hidden");
    loginSection.classList.remove("hidden");
    authSection.innerHTML = "";
    setActiveTab("students-panel");
    setStudentCountMessage("");
    allStudents = [];
    if (studentSearchInput) {
        studentSearchInput.value = "";
    }
}

function setStudentCountMessage(message) {
    const studentCountMessage = document.querySelector("#student-count-message");
    if (studentCountMessage) {
        studentCountMessage.textContent = message;
    }
}

function applyStudentFilter() {
    const searchValue = studentSearchInput ? studentSearchInput.value.trim().toLowerCase() : "";
    const filteredStudents = allStudents.filter((student) => {
        const name = (student.name || "").toLowerCase();
        const email = (student.email || "").toLowerCase();
        return name.includes(searchValue) || email.includes(searchValue);
    });

    if (searchValue) {
        setStudentCountMessage(`Showing ${filteredStudents.length} of ${allStudents.length} students`);
    } else {
        setStudentCountMessage(`Students fetched: ${allStudents.length}`);
    }

    renderStudents(filteredStudents);
}

function renderCourseOptions(courses) {
    courseSelect.innerHTML = '<option value="">Select a course</option>';

    courses.forEach((course) => {
        const option = document.createElement("option");
        option.value = String(course.id);
        option.textContent = `${course.code} - ${course.name}`;
        courseSelect.appendChild(option);
    });
}

async function loadCourses() {
    const token = getToken();
    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/courses/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch courses. Status: ${response.status}`);
        }

        const courses = await response.json();
        renderCourseOptions(courses);
        return courses;
    } catch (error) {
        console.error("loadCourses failed:", error);
        alert("Could not load available courses.");
        return null;
    }
}


// ═══ Load Students ═══

async function loadStudents() {
    // TODO: GET from API_URL + "/students/"
    // Include the Authorization header with the JWT token
    // Parse the JSON response
    // Call renderStudents() with the data
    const token = getToken();
    if (!token) {
        alert("No access token found. Please login first.");
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/students/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            alert("Unauthorized or token expired. Please login again.");
            return null;
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch students. Status: ${response.status}`);
        }

        const students = await response.json();
        console.log("Fetched students:", students);
        allStudents = students;
        applyStudentFilter();
        console.log(`Students fetched: ${students.length}`);
        return students;
    } catch (error) {
        console.error("loadStudents failed:", error);
        alert("Could not fetch students from API.");
        return null;
    }
}


function renderStudents(students) {
    const list = document.querySelector("#student-list");
    list.innerHTML = "";

    // TODO: loop through students
    // For each student, create a div with class "card"
    // Set its innerHTML to show the student's name, email, and grade
    // Append it to the list
    if (!students || students.length === 0) {
        list.innerHTML = "<p>No students found.</p>";
        return;
    }

    students.forEach((student) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${student.name}</h3>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Grade:</strong> ${student.grade}</p>
            <button type="button" class="delete-student-btn">Delete</button>
        `;

        const deleteButton = card.querySelector(".delete-student-btn");
        deleteButton.addEventListener("click", async () => {
            const confirmed = confirm(`Delete student ${student.name}?`);
            if (!confirmed) {
                return;
            }

            await deleteStudent(student.id);
        });

        list.appendChild(card);
    });
}


// ═══ Create Student ═══

async function createStudent(name, email, grade, courseId) {
    // TODO: POST to API_URL + "/students/"
    // Include Content-Type and Authorization headers
    // Send the student data as JSON in the body
    // After creating, call loadStudents() to refresh the list
    const token = getToken();
    if (!token) {
        alert("Please login first.");
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/students/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                email,
                grade,
                course: courseId,
            }),
        });

        if (response.status === 401) {
            alert("Unauthorized or token expired. Please login again.");
            return false;
        }

        if (!response.ok) {
            const errorData = await response.json();
            console.error("createStudent failed:", errorData);
            alert("Could not create student. Check form values.");
            return false;
        }

        alert("Student created successfully.");
        await loadStudents();
        return true;
    } catch (error) {
        console.error("createStudent request failed:", error);
        alert("Could not create student right now.");
        return false;
    }
}

async function deleteStudent(studentId) {
    const token = getToken();
    if (!token) {
        alert("Please login first.");
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/students/${studentId}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            alert("Unauthorized or token expired. Please login again.");
            return false;
        }

        if (!response.ok) {
            throw new Error(`Failed to delete student. Status: ${response.status}`);
        }

        await loadStudents();
        return true;
    } catch (error) {
        console.error("deleteStudent failed:", error);
        alert("Could not delete student right now.");
        return false;
    }
}


// ═══ On Page Load ═══

// TODO: check if a token already exists in localStorage
// If yes, hide login and show dashboard, then loadStudents()
// If no, show login section