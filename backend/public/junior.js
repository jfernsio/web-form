let qualificationIndex = 0;
let experienceIndex = 0;
let researchPaperIndex = 0;

// Calculate Age from DOB
function calculateAge() {
  const dobInput = document.getElementById('dob');
  const ageInput = document.getElementById('age');
  if (dobInput.value) {
    const birthDate = new Date(dobInput.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    ageInput.value = age;
  } else {
    ageInput.value = '';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const dobInput = document.getElementById('dob');
  if (dobInput) {
    dobInput.addEventListener('change', calculateAge);
  }

    // Initial setup for gender, marital status, NET/SET, and work experience toggles
  selectGender('male'); // Default to Male or your preferred default
  selectMaritalStatus('unmarried'); // Default to Unmarried or your preferred default
  workExperience('experience'); // Default to 'Experience'
});

// Toggle Gender
function selectGender(gender) {
  document.getElementById('gender').value = gender;
  document.querySelectorAll('.button-group .toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === gender);
  });
}

// Toggle Marital Status
function selectMaritalStatus(status) {
  document.getElementById('maritalStatus').value = status;
  // Use a more specific selector
  document.querySelectorAll('.marital-status-toggle-group .toggle-btn').forEach(button => {
    if (button.dataset.value === status) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

// Work Experience Toggle (Experience / Fresher)
function workExperience(type) {
  const container = document.getElementById('experienceContainer');
  const addBtn = document.querySelector('.add-experience-section');
  document.querySelectorAll('.work-exp-toggle .toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === type);
  });

  if (type === 'experience') {
    container.style.display = 'block';
    addBtn.style.display = 'block';
  } else {
    container.style.display = 'none';
    addBtn.style.display = 'none';
  }
  updateRemoveButtons('experience');
}

// Add Qualification
function addQualification() {
  qualificationIndex++;
  const container = document.getElementById('qualificationsContainer');
  const div = document.createElement('div');
  div.className = 'qualification-item';
  div.dataset.index = qualificationIndex;
  div.innerHTML = `
    <div class="form-row">
      <div class="form-field">
        <label>Degree<span class="required">*</span></label>
        <select class="degree-select" required>
          <option value="">Select degree</option>
          <option value="phd">Ph.D</option>
          <option value="masters">Master's</option>
          <option value="bachelors">Bachelor's</option>
          <option value="diploma">Diploma</option>
          <option value="certificate">Certificate</option>
        </select>
      </div>
      <div class="form-field">
        <label>Degree Name</label>
        <input type="text" class="degree-name" placeholder="Enter degree name" required />
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label>Education Mode<span class="required">*</span></label>
        <select class="education-mode" required>
          <option value="">Select mode</option>
          <option value="regular">Regular</option>
          <option value="distance">Distance</option>
          <option value="online">Online</option>
          <option value="correspondence">Correspondence</option>
        </select>
      </div>
      <div class="form-field">
        <label>University Name<span class="required">*</span></label>
        <input type="text" class="university-name" placeholder="Enter university name" required />
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label>Specialization</label>
        <input type="text" class="specialization" placeholder="Enter specialization" />
      </div>
      <div class="form-field">
        <label>Year of Passing<span class="required">*</span></label>
        <input type="date" class="qualification-year-of-passing" required />
      </div>
      <div class="form-field">
        <label>Percentage</label>
        <input type="tel" class="percentage" placeholder="Enter Percentage" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label>CGPA</label>
        <input type="text" class="cgpa" placeholder="Enter CGPA" />
      </div>
      <div class="form-field remove-btn-container">
        <button type="button" class="remove-qualification-btn" onclick="removeQualification(${qualificationIndex})">Remove</button>
      </div>
    </div>
  `;
  container.appendChild(div);
  updateRemoveButtons('qualification');
}

function removeQualification(index) {
  document.querySelector(`.qualification-item[data-index="${index}"]`)?.remove();
  updateRemoveButtons('qualification');
}

// Add Experience
function addExperience() {
  experienceIndex++;
  const container = document.getElementById('experienceContainer');
  const div = document.createElement('div');
  div.className = 'experience-item';
  div.dataset.index = experienceIndex;
  div.innerHTML = `
    <div class="form-row">
      <div class="form-field">
        <label>Organization / University<span class="required">*</span></label>
        <input type="text" class="experience-organization" required />
      </div>
      <div class="form-field">
        <label>Designation/Post held<span class="required">*</span></label>
        <input type="text" class="experience-designation" required />
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label>From Date<span class="required">*</span></label>
        <input type="date" class="experience-from" required />
      </div>
      <div class="form-field">
        <label>To Date<span class="required">*</span></label>
        <input type="date" class="experience-to" required />
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label>Current Salary (Gross per month)</label>
        <input type="text" class="experience-salary" />
      </div>
      <div class="form-field checkbox-field">
        <input type="checkbox" class="experience-current-role" />
        <label>I am currently working in this role</label>
      </div>
    </div>
    <div class="form-row">
      <div class="form-field remove-btn-container">
        <button type="button" class="remove-experience-btn" onclick="removeExperience(this)">Remove</button>
      </div>
    </div>
  `;
  container.appendChild(div);
  updateRemoveButtons('experience');
}

function removeExperience(btn) {
  btn.closest('.experience-item').remove();
  updateRemoveButtons('experience');
}

// Add Research Paper
function addResearchPaper() {
  researchPaperIndex++;
  const container = document.getElementById('researchPapersContainer');
  const div = document.createElement('div');
  div.className = 'research-paper-item';
  div.dataset.index = researchPaperIndex;
  div.innerHTML = `
    <div class="form-row">
      <div class="form-field">
        <label>Scopus Indexed Publications</label>
      <input type="text" class="scopus-publications" />
      </div>
      <div class="form-field">
        <label>Scopus ID</label>
        <input type="text" class="scopus-id" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label>Presented in Conference</label>
        <select class="conference-select">
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div class="form-field">
        <label>Title Of The Paper</label>
        <input type="text" class="paper-title" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label>Name of Journal</label>
        <input type="text" class="journal-name" />
      </div>
      <div class="form-field">
        <label>Year of Publication</label>
        <input type="date" class="publication-year" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label>Number of Approved Papers</label>
        <input type="number" class="approved-papers" />
      </div>
      <div class="form-field remove-btn-container">
        <button type="button" class="remove-research-paper-btn" onclick="removeResearchPaper(${researchPaperIndex})">Remove</button>
      </div>
    </div>
  `;
  container.appendChild(div);
  updateRemoveButtons('research-paper');
}

function removeResearchPaper(index) {
  document.querySelector(`.research-paper-item[data-index="${index}"]`)?.remove();
  updateRemoveButtons('research-paper');
}

// Show/hide remove buttons
function updateRemoveButtons(type) {
  const items = document.querySelectorAll(
    type === 'qualification' ? '.qualification-item' :
    type === 'experience' ? '.experience-item' : '.research-paper-item'
  );
  items.forEach((item, i) => {
    const btn = item.querySelector(type === 'experience' ? '.remove-experience-btn' :
                                 type === 'research-paper' ? '.remove-research-paper-btn' : '.remove-qualification-btn');
    if (btn) btn.style.display = items.length > 1 ? 'block' : 'none';
  });
}

function updatePhdFields() {
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
    
  };
}

// Resume Upload Handler
function handleFileUpload(input) {
  const file = input.files[0];
  const label = document.getElementById('uploadText');
  const error = document.getElementById('fileError');

  if (!file) {
    label.textContent = 'Upload RESUME';
    error.style.display = 'none';
    return;
  }

  if (file.type !== 'application/pdf') {
    error.textContent = 'Only PDF files are allowed.';
    error.style.display = 'block';
    input.value = '';
    label.textContent = 'Upload RESUME';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    error.textContent = 'File size must be under 5MB.';
    error.style.display = 'block';
    input.value = '';
    label.textContent = 'Upload RESUME';
    return;
  }

  label.textContent = file.name;
  error.style.display = 'none';
}

// Populate States
const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('state');
  states.forEach(s => {
    const opt = document.createElement('option');
    opt.value = opt.textContent = s;
    select.appendChild(opt);
  });


  updateRemoveButtons('qualification');
  updateRemoveButtons('experience');
  updateRemoveButtons('research-paper');
});

// FORM SUBMISSION
document.getElementById('applicationForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  if (!document.getElementById('declaration').checked) {
    alert('Please accept the declaration.');
    return;
  }

  const fd = new FormData();

  // Basic fields
  fd.append('postApplied', document.getElementById('postApplied').value);
  fd.append('title', document.getElementById('title').value);
  fd.append('firstName', document.getElementById('firstName').value);
  fd.append('middleName', document.getElementById('middleName').value);
  fd.append('lastName', document.getElementById('lastName').value);
  fd.append('dob', document.getElementById('dob').value);
  fd.append('age', document.getElementById('age').value);
  fd.append('altEmail', document.getElementById('altEmail').value);
  fd.append('altMobile', document.getElementById('altMobile').value);
  fd.append('gender', document.getElementById('gender').value);
  fd.append('maritalStatus', document.getElementById('maritalStatus').value);
  fd.append('email', document.getElementById('email').value);
  fd.append('caste', document.getElementById('caste').value);
  fd.append('aadhar', document.getElementById('aadhar').value);
  fd.append('pan', document.getElementById('pan').value);
  fd.append('state', document.getElementById('state').value);
  fd.append('city', document.getElementById('city').value);
  fd.append('address', document.getElementById('Address').value);
  fd.append('pinCode', document.getElementById('pinCode').value);
  fd.append('mobile', document.getElementById('mobile').value);
  fd.append('institute', document.getElementById('institute').value);

  // Qualifications
  const quals = [];
  document.querySelectorAll('.qualification-item').forEach(item => {
    quals.push({
      degree: item.querySelector('.degree-select').value,
      degreeName: item.querySelector('.degree-name').value,
      mode: item.querySelector('.education-mode').value,
      university: item.querySelector('.university-name').value,
      specialization: item.querySelector('.specialization').value,
      yearOfPassing: item.querySelector('.qualification-year-of-passing').value,
      percentage: item.querySelector('.percentage').value,
      cgpa: item.querySelector('.cgpa').value
    });
  });
  fd.append('qualifications', JSON.stringify(quals));

  //PHD
  fd.append('phdStatus', document.getElementById('phdStatus').value);
  fd.append('phdUniversity', document.getElementById('phdUniversity').value);
  fd.append('phdYear', document.getElementById('phdYear').value);

  // B.Ed 
  fd.append('bedUniversity', document.getElementById('bedUniversity').value);
  fd.append('bedYear', document.getElementById('bedYear').value);

  // Experience
  const exps = [];
  document.querySelectorAll('.experience-item').forEach(item => {
    exps.push({
      organization: item.querySelector('.experience-organization').value,
      designation: item.querySelector('.experience-designation').value,
      from: item.querySelector('.experience-from').value,
      to: item.querySelector('.experience-to').value,
      salary: item.querySelector('.experience-salary').value,
      current: item.querySelector('.experience-current-role').checked
    });
  });
  fd.append('workExperiences', JSON.stringify(exps));
  
  //Research Papers
  const papers = [];
  document.querySelectorAll('.research-paper-item').forEach(item => {
    papers.push({
      scopusPublications: item.querySelector('.scopus-publications').value,
      scopusId: item.querySelector('.scopus-id').value,
      conferencePresented: item.querySelector('.conference-select').value,
      paperTitle: item.querySelector('.paper-title').value,
      journalName: item.querySelector('.journal-name').value,
      publicationYear: item.querySelector('.publication-year').value,
      approvedPapers: item.querySelector('.approved-papers').value
    });
  });
  fd.append('researchPapers', JSON.stringify(papers));
  // Courses Taught
  fd.append('courseCollegeName', document.getElementById('courseCollegeName').value);
  fd.append('courseClassName', document.getElementById('courseClassName').value);
  fd.append('courseSubjectName', document.getElementById('courseSubjectName').value);
  fd.append('courseYearsOfExp', document.getElementById('courseYearsOfExp').value);
  fd.append('courseFromDate', document.getElementById('courseFromDate').value);
  fd.append('courseToDate', document.getElementById('courseToDate').value);
  fd.append('courseDepartmentType', document.getElementById('courseDepartmentType').value);
  fd.append('courseTypeOfContract', document.getElementById('courseTypeOfContract').value);
  fd.append('courseLastSalary', document.getElementById('courseLastSalary').value);
  fd.append('courseApprovedByUni', document.getElementById('courseApprovedByUni').value);
  fd.append('courseLetterNumber', document.getElementById('courseLetterNumber').value);
  fd.append('courseLetterDate', document.getElementById('courseLetterDate').value);
  // Awards
  fd.append('awardTitle', document.getElementById('awardTitle').value);
  fd.append('awardOrganizationName', document.getElementById('awardOrganizationName').value);
  fd.append('awardNature', document.getElementById('awardNature').value); // Corrected ID
  fd.append('awardOrganizationRecognition', document.getElementById('awardOrganizationRecognition').value);

  // Additional Information 
  fd.append('referenceName', document.getElementById('referenceName').value);
  fd.append('appliedFor', document.getElementById('appliedFor').value);
  fd.append('currentSalary', document.getElementById('currentSalary').value);
  fd.append('expectedSalary', document.getElementById('expectedSalary').value);
  fd.append('extraCurricular', document.getElementById('extraCurricular').value);
  // Resume
  const resume = document.getElementById('resumeUpload').files[0];
  if (resume) fd.append('resume', resume);

  try {
    const res = await fetch('https://web-form-g7a5.onrender.com/api/v1/apply/junior-college', { 
      method: 'POST',
      body: fd
    });

    if (res.ok) {
      alert('Application submitted successfully!');
      this.reset();
      window.location.href = 'success.html';
    } else {
      alert('Submission failed. Please try again.');
    }
  } catch (err) {
    console.error(err);
    alert('Network error.');
  }
});