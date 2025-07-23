
// Check if user is logged in
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('loginTime');
        window.location.href = 'admin-login.html';
    }
}

// Auto-logout after 2 hours of inactivity
let lastActivity = Date.now();
const AUTO_LOGOUT_TIME = 2 * 60 * 60 * 1000; // 2 hours

function checkAutoLogout() {
    if (Date.now() - lastActivity > AUTO_LOGOUT_TIME) {
        alert('Session expired. Please login again.');
        logout();
    }
}

// Track user activity
document.addEventListener('click', () => lastActivity = Date.now());
document.addEventListener('keypress', () => lastActivity = Date.now());

// Check auto-logout every minute
setInterval(checkAutoLogout, 60000);

// Initialize dashboard when page loads
// document.addEventListener('DOMContentLoaded', initializeDashboard);

//fetch excel from backend

const fe = document.getElementById('download-excel');
const fp = document.getElementById('download-pdf');

const fetchExcel =  async () =>{
    try {
    const res = await fetch('http://localhost:3000/export');
    if (!res.ok) {
        throw new Error('Failed to fetch Excel');
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applicants.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} catch (error) {
    alert('Error downloading excel file: ' + error.message);
    console.error(error);
}
}

const fetchPdf =  async () =>{
    try {
    const res = await fetch('http://localhost:3000/export/pdf',{
        headers: {
            'Content-Type': 'application/pdf'
        }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch PDF');
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applicants.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} catch (error) {
    alert('Error downloading pdf file: ' + error.message);
    console.error(error);
}
}

fe.addEventListener('click', ()=>{
    fetchExcel();
});

fp.addEventListener('click', ()=>{
    fetchPdf();
});