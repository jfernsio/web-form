// Ensure this script runs after the DOM is loaded, e.g., at the end of <body> or with defer attribute

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:3000/api/auth';

// Get DOM elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

// Function to redirect on successful login
// function redirectToDashboard() {
//     window.location.href = 'admin-dashboard.html';
// }
// Check if already logged in
if (localStorage.getItem('accessToken') === 'true') {
    window.location.href = 'admin-dashboard.html';
}
// Check if already logged in (by checking for the JWT token)
// In a real app, you might also want to verify the token's validity with the backend here
// const accessToken = localStorage.getItem('accessToken');
// if (accessToken) {
//     // Optionally, you could try to decode the token to get user info
//     // For simplicity, we'll just redirect if a token exists.
//     redirectToDashboard();
// }

// Event listener for form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission

    const username = usernameInput.value;
    const password = passwordInput.value;

    // Clear previous error message
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    try {
        const response = await fetch(`${API_BASE_URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json(); // Parse the JSON response

        if (response.ok) { // Check if the HTTP status code is 2xx (success)
            // Store the JWT token and user info in localStorage
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('user', JSON.stringify({ id: data.id, username: data.username, email: data.email })); // Store user details

            // Redirect to admin dashboard
        //  redirectToDashboard();
        
        } else {
            // Display error message from the backend
            errorMessage.textContent = data.message || 'Login failed. Please try again.';
            errorMessage.style.display = 'block';
            passwordInput.value = ''; // Clear password field
        }
    } catch (error) {
        console.error('Error during login:', error);
        errorMessage.textContent = 'Network error or server is unreachable. Please try again later.';
        errorMessage.style.display = 'block';
        passwordInput.value = ''; // Clear password field
    }
});

// Auto-focus on username field
usernameInput.focus();
