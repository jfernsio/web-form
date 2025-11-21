import express from "express";
import mysql from "mysql2/promise";
import ExcelJS from "exceljs";
import dotenv from "dotenv";
import path from "path";
import PDFDocument from "pdfkit";
import verifyToken from "../middleware/auth.js";
dotenv.config();
const nonTeachingRouter = express.Router();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};


nonTeachingRouter.get("/nonTeachingExcel", verifyToken ,async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [applicants] = await connection.execute("SELECT * FROM Applications WHERE form_type = 'non_teaching'");
    console.log(applicants);
    const [qualifications] = await connection.execute(
      "SELECT * FROM Qualifications"
    );
    const [experience] = await connection.execute("SELECT * FROM Experiences");
    const [additionalInfo] = await connection.execute(
      "SELECT * FROM AdditionalInfos"
    );
    const workbook = new ExcelJS.Workbook();

    // 📄 Applicants
    const applicantSheet = workbook.addWorksheet("Applicants");
    applicantSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Post", key: "postAppliedFor" },
      { header: "First Name", key: "firstName" },
      { header: "Middle Name", key: "middleName" },
      { header: "Last Name", key: "lastName" },  
      { header: "DOB", key: "dob" }, 
      { header: "Email", key: "email" },
      { header: "Mobile", key: "mobiler" },
      { header: "Address", key: "address" },
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
          hyperlink: `http://localhost:5000/uploads/${row.resumeFile}`,
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
      { header: "University Name", key: "universityName" },
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
      { header: "Duration", key: "duration" },
    ];
    experience.forEach((row) => expSheet.addRow(row));

    //Addotipmal Info
    const additionalInfoSheet = workbook.addWorksheet("Additional Info");
    additionalInfoSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Applicant ID", key: "applicationId" },
      { header: "Mother Tongue", key: "motherTongue" },
      { header: "Other Lang", key: "otherLang" },
      { header: "English Typing Speed", key: "engTypingSpeed" },
      { header: "Marathi Typing Speed", key: "marTypingSpeed" },
      { header: "Joinig Date", key: "joiningDate" },  
      { header: "Current Salary", key: "currentSalary" },
      { header: "Expected Salary", key: "expectedSalary" },
      { header: "Comments", key: "comment", width: 20 },
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

nonTeachingRouter.get("/nonTeachingPdf", verifyToken ,async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [applicants] = await connection.execute("SELECT * FROM Applications WHERE form_type = 'non_teaching'");
    const [qualifications] = await connection.execute(
      "SELECT * FROM Qualifications"
    );
    const [experience] = await connection.execute("SELECT * FROM Experiences");
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
        const resumeLink = `http://localhost:5000/uploads/${app.resumeFile}`;
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

export default nonTeachingRouter;
