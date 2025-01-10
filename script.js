// Simulated Data
const assignments = [];

// Logout Function
function logout() {
    window.location.href = "index.html";
}

// Load Assignments for Student
function loadStudentAssignments() {
    const assignmentList = document.getElementById("assignments");
    assignments.forEach(assignment => {
        const li = document.createElement("li");
        li.textContent = `${assignment.title} - ${assignment.description}`;
        assignmentList.appendChild(li);
    });
}

// Load Assignments for Parent
function loadParentAssignments() {
    const parentList = document.getElementById("parent-assignments");
    assignments.forEach(assignment => {
        const li = document.createElement("li");
        li.textContent = `${assignment.student}: ${assignment.title} - ${assignment.description}`;
        parentList.appendChild(li);
    });
}

// Add Assignment for Institute
function addAssignment(e) {
    e.preventDefault();
    const studentName = document.getElementById("studentName").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    assignments.push({ student: studentName, title, description });

    const allAssignments = document.getElementById("all-assignments");
    const li = document.createElement("li");
    li.textContent = `${studentName}: ${title} - ${description}`;
    allAssignments.appendChild(li);

    document.getElementById("assignmentForm").reset();
}

// Attach Events
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("assignments")) loadStudentAssignments();
    if (document.getElementById("parent-assignments")) loadParentAssignments();
    if (document.getElementById("assignmentForm")) {
        document.getElementById("assignmentForm").addEventListener("submit", addAssignment);
    }
});
// Hardcoded User Data
const users = {
    student: { username: "student1", password: "password123" },
    parent: { username: "parent1", password: "password123" },
    institute: { username: "admin", password: "admin123" },
};

// Handle Login
document.addEventListener("DOMContentLoaded", () => {
    // Student Login
    const studentLoginForm = document.getElementById("studentLoginForm");
    if (studentLoginForm) {
        studentLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("studentUsername").value;
            const password = document.getElementById("studentPassword").value;

            if (
                users.student.username === username &&
                users.student.password === password
            ) {
                window.location.href = "student.html";
            } else {
                document.getElementById("studentErrorMessage").textContent =
                    "Invalid username or password!";
            }
        });
    }

    // Parent Login
    const parentLoginForm = document.getElementById("parentLoginForm");
    if (parentLoginForm) {
        parentLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("parentUsername").value;
            const password = document.getElementById("parentPassword").value;

            if (
                users.parent.username === username &&
                users.parent.password === password
            ) {
                window.location.href = "parent.html";
            } else {
                document.getElementById("parentErrorMessage").textContent =
                    "Invalid username or password!";
            }
        });
    }

    // Institute Login
    const instituteLoginForm = document.getElementById("instituteLoginForm");
    if (instituteLoginForm) {
        instituteLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("instituteUsername").value;
            const password = document.getElementById("institutePassword").value;

            if (
                users.institute.username === username &&
                users.institute.password === password
            ) {
                window.location.href = "institute.html";
            } else {
                document.getElementById("instituteErrorMessage").textContent =
                    "Invalid username or password!";
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    // Handle Student Signup
    const studentSignupForm = document.getElementById("studentSignupForm");
    if (studentSignupForm) {
        studentSignupForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Collect Data
            const studentData = {
                name: document.getElementById("studentName").value,
                fatherName: document.getElementById("fatherName").value,
                motherName: document.getElementById("motherName").value,
                dob: document.getElementById("dob").value,
                class: document.getElementById("class").value,
                bloodGroup: document.getElementById("bloodGroup").value,
                mobile: document.getElementById("mobile").value,
                email: document.getElementById("email").value,
                username: document.getElementById("signupUsername").value,
                password: document.getElementById("signupPassword").value,
            };

            // Handle Photo and Signature
            const photoFile = document.getElementById("photo").files[0];
            const signatureFile = document.getElementById("signature").files[0];

            // Convert files to Base64 for storage
            const reader = new FileReader();
            reader.onloadend = () => {
                studentData.photo = reader.result; // Photo in Base64
                const signatureReader = new FileReader();
                signatureReader.onloadend = () => {
                    studentData.signature = signatureReader.result; // Signature in Base64

                    // Save to localStorage
                    const students = JSON.parse(localStorage.getItem("students")) || [];
                    const userExists = students.some((s) => s.username === studentData.username);

                    if (userExists) {
                        document.getElementById("signupMessage").textContent =
                            "Username already exists!";
                        document.getElementById("signupMessage").style.color = "red";
                    } else {
                        students.push(studentData);
                        localStorage.setItem("students", JSON.stringify(students));
                        document.getElementById("signupMessage").textContent =
                            "Signup successful! Please log in.";
                        document.getElementById("signupMessage").style.color = "green";
                        studentSignupForm.reset();
                    }
                };
                signatureReader.readAsDataURL(signatureFile);
            };
            reader.readAsDataURL(photoFile);
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const handleSignup = (formId, role) => {
        const signupForm = document.getElementById(formId);
        if (signupForm) {
            signupForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const username = document.getElementById("signupUsername").value;
                const password = document.getElementById("signupPassword").value;
                const otherDetails = Array.from(signupForm.elements)
                    .filter((el) => el.id && el.id !== "signupUsername" && el.id !== "signupPassword")
                    .reduce((acc, el) => ({ ...acc, [el.id]: el.value }), {});

                const users = JSON.parse(localStorage.getItem(role)) || [];
                if (users.some((user) => user.username === username)) {
                    document.getElementById("signupMessage").textContent = "Username already exists!";
                    document.getElementById("signupMessage").style.color = "red";
                } else {
                    users.push({ username, password, ...otherDetails });
                    localStorage.setItem(role, JSON.stringify(users));
                    document.getElementById("signupMessage").textContent = "Signup successful!";
                    document.getElementById("signupMessage").style.color = "green";
                    signupForm.reset();
                }
            });
        }
    };

    handleSignup("studentSignupForm", "students");
    handleSignup("parentSignupForm", "parents");
    handleSignup("instituteSignupForm", "institutes");
});
// Function to open the modal
function showContact() {
    document.getElementById('contactModal').style.display = 'block';
}

// Function to close the modal
function closeContact() {
    document.getElementById('contactModal').style.display = 'none';
}

// Close the modal if the user clicks anywhere outside of it
window.onclick = function(event) {
    if (event.target === document.getElementById('contactModal')) {
        closeContact();
    }
};