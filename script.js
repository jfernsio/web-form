
document.addEventListener("DOMContentLoaded", () => {
  // Gender toggle logic
  window.selectGender = function (value) {
    const genderButtons = document.querySelectorAll('[onclick^="selectGender"]');
    genderButtons.forEach((btn) => btn.classList.remove("active"));
    const selected = document.querySelector(`[onclick="selectGender('${value}')"]`);
    if (selected) selected.classList.add("active");
    document.getElementById("gender").value = value;
  };

  // Marital status toggle
  window.selectMaritalStatus = function (value) {
    const statusButtons = document.querySelectorAll('[onclick^="selectMaritalStatus"]');
    statusButtons.forEach((btn) => btn.classList.remove("active"));
    const selected = document.querySelector(`[onclick="selectMaritalStatus('${value}')"]`);
    if (selected) selected.classList.add("active");
    document.getElementById("maritalStatus").value = value;
  };

  // Paper Presented toggle
  window.togglePaperPresented = function (value) {
    const buttons = document.querySelectorAll('[onclick^="togglePaperPresented"]');
    buttons.forEach((btn) => btn.classList.remove("active"));
    const selected = document.querySelector(`[onclick="togglePaperPresented('${value}')"]`);
    if (selected) selected.classList.add("active");
    document.getElementById("paperPresented").value = value;
  };

  // Exam toggle (NET/SET/SLET/GATE)
  window.toggleExam = function (exam, value) {
    const yesBtn = document.querySelector(`[onclick="toggleExam('${exam}', 'yes')"]`);
    const noBtn = document.querySelector(`[onclick="toggleExam('${exam}', 'no')"]`);
    const yearInput = document.getElementById(`${exam}Year`);
    const statusInput = document.getElementById(`${exam}Status`);

    if (value === "yes") {
      yearInput.disabled = false;
      yesBtn.classList.add("active");
      noBtn.classList.remove("active");
    } else {
      yearInput.disabled = true;
      yearInput.value = "";
      yesBtn.classList.remove("active");
      noBtn.classList.add("active");
    }
    statusInput.value = value;
  };

  // Work experience toggle
  window.toggleWorkExperience = function (value) {
    const experienceSection = document.getElementById("experienceFields");
    const buttons = document.querySelectorAll(".work-exp-toggle .toggle-btn");

    buttons.forEach((btn) => btn.classList.remove("active"));
    const selected = document.querySelector(`[onclick="toggleWorkExperience('${value}')"]`);
    if (selected) selected.classList.add("active");

    experienceSection.style.display = value === "experience" ? "block" : "none";
  };

  // Ph.D. section logic
  window.updatePhdFields = function () {
    const status = document.getElementById("phdStatus").value;
    const university = document.getElementById("phdUniversity");
    const year = document.getElementById("phdYear");

    if (status === "completed") {
      university.disabled = false;
      year.disabled = false;
    } else if (status === "pursuing" || status === "thesis-submitted") {
      university.disabled = false;
      year.disabled = true;
      year.value = "";
    } else if (status === "not-applicable") {
      university.disabled = true;
      university.value = "";
      year.disabled = true;
      year.value = "";
    } else {
      university.disabled = false;
      year.disabled = false;
    }
  };

  // Resume upload feedback
  window.handleFileUpload = function (input) {
    const file = input.files[0];
    const errorText = document.getElementById("fileError");
    const uploadText = document.getElementById("uploadText");

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        errorText.style.display = "block";
        errorText.textContent = "File size exceeds 5MB.";
        input.value = "";
        uploadText.textContent = "BROWSE RESUME";
      } else if (!file.name.endsWith(".pdf")) {
        errorText.style.display = "block";
        errorText.textContent = "Only PDF files are allowed.";
        input.value = "";
        uploadText.textContent = "BROWSE RESUME";
      } else {
        errorText.style.display = "none";
        uploadText.textContent = file.name;
      }
    }
  };

  // Age auto-calculation
  document.getElementById("dob").addEventListener("change", function () {
    const dob = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    document.getElementById("age").value = age > 0 ? age : "";
  });

  // Initial toggle setup (prevent broken state on load)
  updatePhdFields();
  ["net", "set", "slet", "gate"].forEach((exam) => {
    const status = document.getElementById(`${exam}Status`).value;
    toggleExam(exam, status);
  });
  toggleWorkExperience("experience");
});

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const stateSelect = document.getElementById("state");
indianStates.forEach((state) => {
  const option = document.createElement("option");
  option.value = state;
  option.textContent = state;
  stateSelect.appendChild(option);
});
