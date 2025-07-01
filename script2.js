document.addEventListener("DOMContentLoaded", () => {
  // Toggle experience section based on selected radio
  window.toggleExperienceType = () => {
    const experienceSection = document.getElementById("experienceSection");
    const isFresher = document.querySelector('input[name="experienceType"]:checked').value === "fresher";
    experienceSection.style.display = isFresher ? "none" : "block";
  };
  toggleExperienceType(); // Initialize on load

  // Handle file upload validation
  window.handleFileUpload = (input) => {
    const file = input.files[0];
    const fileError = document.getElementById("fileError");
    const uploadText = document.getElementById("uploadText");

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      fileError.textContent = "Only PDF, DOC, or DOCX files are allowed.";
      fileError.style.display = "block";
      input.value = "";
      uploadText.textContent = "Choose a file";
      return;
    }

    if (file.size > maxSize) {
      fileError.textContent = "File size must not exceed 5MB.";
      fileError.style.display = "block";
      input.value = "";
      uploadText.textContent = "Choose a file";
      return;
    }

    fileError.style.display = "none";
    uploadText.textContent = file.name;
  };

  // Add qualification section
  let qualificationCount = 0;
  window.addQualification = () => {
    qualificationCount++;
    const container = document.createElement("div");
    container.className = "form-row";
    container.innerHTML = `
      <div class="form-field">
        <label>Degree<span class="required">*</span></label>
        <input type="text" placeholder="Degree" required />
      </div>
      <div class="form-field">
        <label>University<span class="required">*</span></label>
        <input type="text" placeholder="University" required />
      </div>
      <div class="form-field">
        <label>Year<span class="required">*</span></label>
        <input type="number" placeholder="Year" required min="1900" max="2099" />
      </div>
    `;
    document.getElementById("qualificationsList").appendChild(container);
  };

  // Add work experience section
  let experienceCount = 0;
  window.addWorkExperience = () => {
    experienceCount++;
    const container = document.createElement("div");
    container.className = "form-row";
    container.innerHTML = `
      <div class="form-field">
        <label>Organization<span class="required">*</span></label>
        <input type="text" placeholder="Organization" required />
      </div>
      <div class="form-field">
        <label>Role<span class="required">*</span></label>
        <input type="text" placeholder="Role" required />
      </div>
      <div class="form-field">
        <label>Duration<span class="required">*</span></label>
        <input type="text" placeholder="e.g., 2 years" required />
      </div>
    `;
    document.getElementById("experiencesList").appendChild(container);
  };

  // Basic form validation on submit
  document.getElementById("applicationForm").addEventListener("submit", function (e) {
    const requiredFields = this.querySelectorAll("input[required], select[required], textarea[required]");
    let allValid = true;

    requiredFields.forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add("invalid");
        allValid = false;
      } else {
        input.classList.remove("invalid");
      }
    });

    const file = document.getElementById("cvUpload").files[0];
    if (!file) {
      document.getElementById("fileError").textContent = "Please upload a CV file.";
      document.getElementById("fileError").style.display = "block";
      allValid = false;
    }

    if (!allValid) {
      e.preventDefault();
      alert("Please fill all required fields properly.");
    }
  });
});
