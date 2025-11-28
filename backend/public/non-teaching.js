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

  const allowedTypes = ["application/pdf"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    fileError.textContent = "Only PDF files are allowed.";
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
        <input type="text" id="degree-name" placeholder="Degree" required />
      </div>
      <div class="form-field">
        <label>University<span class="required">*</span></label>
        <input type="text" id="university-name" placeholder="University" required />
      </div>
      <div class="form-field">
        <label>Year<span class="required">*</span></label>
        <input type="number" id="year-of-passing" placeholder="Year" required min="1980" max="2050" />
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

});


  const postSelect = document.getElementById("postApplied");
  const otherField = document.getElementById("otherPostField");
  const otherInput = document.getElementById("otherPostInput");

  postSelect.addEventListener("change", () => {
    if (postSelect.value === "other") {
      otherField.style.display = "block";
      otherInput.setAttribute("required", "required");
    } else {
      otherField.style.display = "none";
      otherInput.removeAttribute("required");
      otherInput.value = "";
    }
  });


//semd data to backend 
document.getElementById("applicationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

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
      return;
    }


  const fd = new FormData();
  fd.append('firstName', document.getElementById('firstName').value);
  fd.append('middleName', document.getElementById('middleName').value);
  fd.append('lastName', document.getElementById('lastName').value);
  fd.append('dob', document.getElementById('dob').value);
  fd.append('email', document.getElementById('email').value);
  fd.append('mobile', document.getElementById('mobile').value);
  fd.append('address', document.getElementById('address').value);
  fd.append("postApplied", postSelect.value === "other" ? otherInput.value : postSelect.value);
  fd.append("experienceType", document.querySelector('input[name="experienceType"]:checked').value);
  
const qualifications = [];
    document.querySelectorAll("#qualificationsList .form-row").forEach((row) => {
      const degree = row.querySelector("input[placeholder='Degree']") || row.querySelector("input[id^='degree-name']");
      const university = row.querySelector("input[placeholder='University']") || row.querySelector("input[id^='university-name']");
      const year = row.querySelector("input[type='number']");

      if (degree?.value.trim() && university?.value.trim() && year?.value) {
        qualifications.push({
          degree: degree.value.trim(),
          universityName: university.value.trim(),
          yearOfPassing: year.value,
        });
      }
    });
    fd.append("qualifications", JSON.stringify(qualifications));

const experiences = [];
    if (document.querySelector('input[name="experienceType"]:checked').value !== "fresher") {
      document.querySelectorAll("#experiencesList .form-row").forEach((row) => {
        const org = row.querySelector("input[placeholder='Organization']");
        const role = row.querySelector("input[placeholder='Role']");
        const duration = row.querySelector("input[placeholder='e.g., 2 years']");

        if (org?.value.trim() && role?.value.trim() && duration?.value.trim()) {
          experiences.push({
            organization: org.value.trim(),
            designation: role.value.trim(),
            duration: duration.value.trim(),
          });
        }
      });
    }
    fd.append("workExperiences", JSON.stringify(experiences));  
    
const additionalInfo = {
  currentSalary: document.getElementById('currentSalary').value,
  expectedSalary: document.getElementById('expectedSalary').value,
  joiningDate: document.getElementById('joiningDate').value,
  marTypingSpeed: document.getElementById('marathiTypingSpeed').value,
  engTypingSpeed: document.getElementById('englishTypingSpeed').value,
  otherLang: document.getElementById('otherLanguage').value,
  motherTongue: document.getElementById('motherTongue').value,
  comment: document.getElementById('comments').value,
};

fd.append("additionalInfo", JSON.stringify(additionalInfo));
fd.append("resume",file)
  try {
    const response = await fetch("https://3cww7b0d-5000.inc1.devtunnels.ms/api/v1/apply/non-teaching", {
      method: "POST",
      body: fd,
    });

    if (response.ok) {
      alert("Application submitted successfully!");
      this.reset();
      window.location.href = 'success.html';
    } else {
      const errorData = await response.json();
      alert("Error submitting application: " + (errorData.message || "Please try again."));
    }
  } catch (error) {
    console.error("Submission error:", error);
    alert("Network error. Please try again later.");
  }
});

