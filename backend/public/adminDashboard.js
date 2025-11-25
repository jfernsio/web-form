const token = localStorage.getItem("accessToken");
const user = JSON.parse(localStorage.getItem("user") || "null");

if (!token || !user) {
  window.location.href = "admin-login.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "admin-login.html";
}


document.getElementById("logoutButton")
  .addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) logout();
  });

async function apiRequest(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  // If token expired or invalid backend returns 401
  if (res.status === 401 || res.status === 403) {
    alert("Session expired. Please login again.");
    logout();
    return; // prevents further execution
  }

  return res;
}



async function handleExcelDownload(type) {
  try {
    const res = await apiRequest(`https://web-form-g7a5.onrender.com/api/v1/export/${type}Excel`);
    if (!res || !res.ok) throw new Error("Failed to download Excel");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "applicants.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("Error: " + err.message);
  }
}

async function handlePdfDownload(type) {
  try {
    const res = await apiRequest(`https://web-form-g7a5.onrender.com/api/v1/export/${type}Pdf`);
    if (!res || !res.ok) throw new Error("Failed to download PDF");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "applicants.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("Error: " + err.message);
  }
}
