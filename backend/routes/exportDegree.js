import express from "express";
import mysql from "mysql2/promise";
import ExcelJS from "exceljs";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import verifyToken from "../middleware/auth.js";
dotenv.config();
const exportRouter = express.Router();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};


exportRouter.get("/degreeExcel", verifyToken ,async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [applicants] = await connection.execute("SELECT * FROM Applications WHERE form_type = 'degree_college'");
    console.log(applicants);
    const [qualifications] = await connection.execute(
      "SELECT * FROM Qualifications"
    );
    const [experience] = await connection.execute("SELECT * FROM Experiences");
    const [phds] = await connection.execute("SELECT * FROM Phds");
    const [courses] = await connection.execute("SELECT * FROM Courses");
    const [awards] = await connection.execute("SELECT * FROM Awards");
    const [publications] = await connection.execute(
      "SELECT * FROM Publications"
    );
    const [additionalInfo] = await connection.execute(
      "SELECT * FROM AdditionalInfos"
    );
    const workbook = new ExcelJS.Workbook();

    // 📄 Applicants
    const applicantSheet = workbook.addWorksheet("Applicants");
    applicantSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Post", key: "postAppliedFor" },
      { header: "Institute", key: "institute" },
      { header: "First Name", key: "firstName" },
      { header: "Middle Name", key: "middleName" },
      { header: "Last Name", key: "lastName" },
      { heaader: "Gender", key: "gender" },
      { header: "DOB", key: "dob" },
      { header: "Age", key: "age" },
      { header: "Martial Status", key: "maritalStatus" },
      { header: "Email", key: "email" },
      { header: "Alternate Email", key: "altEmail" },
      { header: "Mobile", key: "mobiler" },
      { header: "Alternate Mobile", key: "altMobile" },
      { header: "Address", key: "address" },
      { header: "City", key: "city" },
      { header: "State", key: "state" },
      { header: "Pincode", key: "pinCode" },
      { header: "Caste", key: "caste" },
      { header: "Aadhar Number", key: "aadhar" },
      { header: "Pan Number", key: "pan" },
      { header: "Resume", key: "resumeFile" },
      {
        header: "Created At",
        key: "createdAt",
        width: 20, // Give it enough width, especially if including time
        style: { numFmt: "yyyy-mm-dd hh:mm:ss" }, // Example: date and time
      },
    ];
    applicants.forEach((row) => {
      const newRow = applicantSheet.addRow(row);

      if (row.resumeFile) {
        const resumeCell = newRow.getCell("resumeFile"); // or newRow.getCell(4) if it's 4th column
        resumeCell.value = {
          text: "Download CV",
          hyperlink: `https://web-form-g7a5.onrender.com/uploads/${row.resumeFile}`,
        };
        resumeCell.font = { color: { argb: "FF0000FF" }, underline: true };
      }
    });

    // 🎓 Qualifications
    const qualSheet = workbook.addWorksheet("Qualifications");
    qualSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Applicant ID", key: "applicationId" },
      { header: "Degree", key: "degree" },
      { header: "Degree Name", key: "degreeName" },
      { header: "Education Mode", key: "educationMode" },
      { header: "University Name", key: "universityName" },
      { header: "Specialization", key: "specialization" },
      { header: "Percentage", key: "percentage" },
      { header: "CGPA", key: "cgpa" },
      { header: "Year of Passing", key: "yearOfPassing" },
    ];
    qualifications.forEach((row) => qualSheet.addRow(row));

    // 💼 Work Experience
    const expSheet = workbook.addWorksheet("Work Experience");
    expSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Applicant ID", key: "applicationId" },
      { header: "Organization", key: "organization" },
      { header: "Role", key: "designation" },
      {
        header: "From Date",
        key: "fromDate",
        width: 20, // Give it enough width, especially if including time
      },
      {
        header: "To Date",
        key: "toDate",
        width: 20, // Give it enough width, especially if including time
      },
      { header: "Currently Working", key: "currentlyWorking" },
      { header: "Current Salary", key: "currentSalary" },
    ];
    experience.forEach((row) => expSheet.addRow(row));

    //phds
    const phdSheet = workbook.addWorksheet("PHD");
    phdSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Applicant ID", key: "applicationId" },
      { header: "Status", key: "phdStatus" },
      { header: "University Name", key: "phdUniversity" },
      { header: "Phd Year", key: "phdYear" },
      { header: "Net Year", key: "netYear" },
      { header: "Set Year", key: "setYear" },
    ];
    phds.forEach((row) => phdSheet.addRow(row));

    //courses
    const courseSheet = workbook.addWorksheet("Courses");
    courseSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Applicant ID", key: "applicationId" },
      { header: "College Name", key: "courseCollegeName" },
      { header: "Class Name", key: "courseClassName" },
      { header: "Subject Name", key: "courseSubjectName" },
      { header: "Years of Experience", key: "courseYearsOfExp" },
      { header: "From Date", key: "courseFromDate", width: 20 },
      { header: "To Date", key: "courseToDate", width: 20 },
      { header: "Department Type", key: "courseDepartmentType" },
      { header: "Type of Contract", key: "courseTypeOfContract" },
      { header: "Last Salary", key: "courseLastSalary" },
      { header: "Approved By University", key: "courseApprovedByUni" },
      { header: "Letter Number", key: "courseLetterNumber" },
      { header: "Letter Date", key: "courseLetterDate", width: 20 },
    ];
    courses.forEach((row) => courseSheet.addRow(row));

    //Publications
    const publicationSheet = workbook.addWorksheet("Publications");
    publicationSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Applicant ID", key: "applicationId" },
      { header: "Scopus Publications", key: "scopusPublications" },
      { header: "Scopus ID", key: "scopusId" },
      { header: "Presented In Conference", key: "presentedInConference" },
      { header: "Paper Title", key: "paperTitle" },
      { header: "Journal Name", key: "journalName" },
      { header: "Publication Year", key: "publicationYear" },
      { header: "ApprovedPapers", key: "approvedPapers" },
    ];
    publications.forEach((row) => publicationSheet.addRow(row));

    //Awards
    const awardSheet = workbook.addWorksheet("Awards");
    awardSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Applicant ID", key: "applicationId" },
      { header: "Title", key: "awardTitle" },
      { header: "Organization Name", key: "awardOrganizationName" },
      { header: "Nature of Award", key: "awardNature" },
      {
        header: "Organization Recognition",
        key: "awardOrganizationRecognition",
      },
    ];
    awards.forEach((row) => awardSheet.addRow(row));

    //Addotipmal Info
    const additionalInfoSheet = workbook.addWorksheet("Additional Info");
    additionalInfoSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Applicant ID", key: "applicationId" },
      { header: "Reference Name", key: "referenceName" },
      { header: "Applied For", key: "appliedFor" },
      { header: "Current Salary", key: "currentSalary" },
      { header: "Expected Salary", key: "expectedSalary" },
      { header: "Extra Curricular", key: "extraCurricular", width: 20 },
    ];
    additionalInfo.forEach((row) => additionalInfoSheet.addRow(row));

    // 📤 Output
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applicants.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
    await connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error exporting data");
  }
});

exportRouter.get("/degreePdf", verifyToken ,async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [applicants] = await connection.execute("SELECT * FROM Applications WHERE form_type = 'degree_college'");
    const [qualifications] = await connection.execute(
      "SELECT * FROM Qualifications"
    );
    const [experience] = await connection.execute("SELECT * FROM Experiences");
    const [phds] = await connection.execute("SELECT * FROM Phds");
    const [courses] = await connection.execute("SELECT * FROM Courses");
    const [awards] = await connection.execute("SELECT * FROM Awards");
    const [publications] = await connection.execute(
      "SELECT * FROM Publications"
    );
    const [additionalInfo] = await connection.execute(
      "SELECT * FROM AdditionalInfos"
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=applicants.pdf");

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    doc.fontSize(20).text("Applicants Report", { align: "center" });
    doc.moveDown(2);

    applicants.forEach((app) => {
      doc
        .fontSize(14)
        .text(`${app.firstName} ${app.middleName || ""} ${app.lastName}`, {
          underline: true,
        });
      doc.fontSize(12).text(`Post Applied: ${app.postAppliedFor}`);
      doc.text(`Email: ${app.email} | Phone: ${app.mobile} `);
      doc.text(`Alt Email: ${app.altEmail} | Alt Phone: ${app.altMobile} `);
      doc.text(
        `DOB: ${app.dob} | Gender: ${app.gender} | Age: ${app.age} | Marital Status: ${app.maritalStatus}`
      );
      doc.text(
        `Address: ${app.address} | State: ${app.state} | City: ${app.city} | Pincode: ${app.pinCode}`
      );
      doc.text(`Caste: ${app.caste} | Aadhar: ${app.aadhar} | Pan: ${app.pan}`);
      doc.text(`Institute applied to: ${app.institute}`);
      doc.moveDown();

      // Qualifications
      doc.fontSize(13).text("Qualifications:", { underline: true });
      const appQuals = qualifications.filter((q) => q.applicationId === app.id);
      if (appQuals.length) {
        appQuals.forEach((q) => {
          doc
            .fontSize(11)
            .text(
              `- ${q.degree} | ${q.degreeName} |${q.universityName} | ${q.yearOfPassing}`
            );
          doc.text(
            `Education Mode: ${q.educationMode} | Specialization: ${
              q.specialization
            } | Percentage: ${q.percentage || "-"} | CGPA: ${q.cgpa || "-"}`
          );
        });
      } else {
        doc.fontSize(11).text("No qualifications listed.");
      }
      doc.moveDown();

      // Work Experience
      doc.fontSize(13).text("Work Experience:", { underline: true });
      const appExps = experience.filter((e) => e.applicationId === app.id);
      if (appExps.length) {
        appExps.forEach((e) => {
          doc
            .fontSize(11)
            .text(
              `- ${e.organization} | ${e.designation} | ${e.fromDate} - ${
                e.toDate || "Present"
              }`
            );
          doc.text(
            `Currently Working: ${
              e.currentlyWorking ? "Yes" : "No"
            } | Current Salary: ${e.currentSalary}`
          );
        });
      } else {
        doc.fontSize(11).text("Fresher");
      }
      doc.moveDown();

      // PhDs
      doc.fontSize(13).text("PhD Details:", { underline: true });
      const appPhds = phds.filter((p) => p.applicationId === app.id);
      if (appPhds.length) {
        appPhds.forEach((p) => {
          doc
            .fontSize(11)
            .text(`- ${p.phdStatus} | ${p.phdUniversity} | ${p.phdYear}`);
          doc.text(
            `NET Year: ${p.netYear || "na"} | SET Year: ${p.setYear || "na"}`
          );
        });
      } else {
        doc.fontSize(11).text("No PhD details.");
      }
      doc.moveDown();

      // Courses
      doc.fontSize(13).text("Courses Taught:", { underline: true });
      const appCourses = courses.filter((c) => c.applicationId === app.id);
      if (appCourses.length) {
        appCourses.forEach((c) => {
          doc
            .fontSize(11)
            .text(
              `- ${c.courseClassName} | ${c.courseSubjectName} | ${c.courseCollegeName} | Years of Exp: ${c.courseYearsOfExp}`
            );
          doc.text(
            `From: ${c.courseFromDate} To: ${c.courseToDate || "Present"}`
          );
          doc.text(
            `Department Type: ${c.courseDepartmentType} | Contract Type: ${c.courseTypeOfContract} | Last Salary: ${c.courseLastSalary}`
          );
          doc.text(
            `Approved By University: ${c.courseApprovedByUni} | Letter No: ${c.courseLetterNumber} | Letter Date: ${c.courseLetterDate}`
          );
        });
      } else {
        doc.fontSize(11).text("No courses listed.");
      }
      doc.moveDown();

      // Awards
      doc.fontSize(13).text("Awards:", { underline: true });
      const appAwards = awards.filter((a) => a.applicationId === app.id);
      if (appAwards.length) {
        appAwards.forEach((a) => {
          doc
            .fontSize(11)
            .text(
              `- ${a.awardTitle} | ${a.awardOrganizationName} | Award Nature: ${a.awardNature} | Recognition: ${a.awardOrganizationRecognition}`
            );
        });
      } else {
        doc.fontSize(11).text("No awards.");
      }
      doc.moveDown();

      // Publications
      doc.fontSize(13).text("Publications:", { underline: true });
      const appPubs = publications.filter((p) => p.applicationId === app.id);
      if (appPubs.length) {
        appPubs.forEach((p) => {
          doc
            .fontSize(11)
            .text(
              `- Paper Title: ${p.paperTitle} | Journal Name: ${p.journalName} | ${p.publicationYear}`
            );
          doc.text(
            `Scopus Publications: ${p.scopusPublications} | Scopus Id: ${
              p.scopusId
            } | Presented In Conference: ${
              p.presentedInConference ? "Yes" : "No"
            } | Approved Papers: ${p.approvedPapers}`
          );
        });
      } else {
        doc.fontSize(11).text("No publications.");
      }
      doc.moveDown();

      // Additional Info
      doc.fontSize(13).text("Additional Info:", { underline: true });
      const appInfo = additionalInfo.find((i) => i.applicationId === app.id);
      if (appInfo) {
        doc.fontSize(11).text(`Reference: ${appInfo.referenceName}`);
        doc.text(`Applied For: ${appInfo.appliedFor}`);
        doc.text(`Current Salary: ${appInfo.currentSalary || "-"}`);
        doc.text(`Expected Salary: ${appInfo.expectedSalary || "-"}`);
        doc.text(`Extra Curricular: ${appInfo.extraCurricular || "-"}`);
      } else {
        doc.fontSize(11).text("No additional info.");
      }
      doc.moveDown();

      doc.fontSize(12).text("Resume:", { underline: true });
      if (app.resumeFile) {
        const resumeLink = `https://web-form-g7a5.onrender.com/uploads/${app.resumeFile}`;
        doc.fillColor("blue").text("Download Resume", {
          link: resumeLink,
          underline: true,
        }); 
        doc.fillColor("black");
      } else {
        doc.text("Resume: Not Provided");
      }

      doc.moveDown(2);
      doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(2);
    });

    doc.end();
    await connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error exporting PDF");
  }
});

export default exportRouter;
