import express from 'express';
import mysql from 'mysql2/promise';
import ExcelJS from 'exceljs';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const app = express();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

app.get('/degreeExcel', async (req, res) => {
      try {
        const connection = await mysql.createConnection(dbConfig);
    
        const [applicants] = await connection.execute('SELECT * FROM Applications');
        const [qualifications] = await connection.execute('SELECT * FROM Qualifications');
        const [experience] = await connection.execute('SELECT * FROM Experiences');
    
        const workbook = new ExcelJS.Workbook();
    
        // 📄 Applicants
        const applicantSheet = workbook.addWorksheet('Applicants');
        applicantSheet.columns = [
          { header: 'ID', key: 'id' },
          { header: 'Post', key: 'postAppliedFor' },
          { header: 'Institute', key: 'institute' },
          { header: 'First Name', key: 'firstName' },
          { header: 'Middle Name', key: 'middleName' },
          { header: 'Last Name', key: 'lastName' },
          { heaader: 'Gender', key: 'gender'},
          { header: 'DOB', key: 'dob' },
          { header: 'Age', key: 'age'},
          { header: 'Martial Status', key: 'maritalStatus'},
          { header: 'Email', key: 'email' },
          { header: 'Alternate Email', key: 'altEmail'},
          { header: 'Mobile', key: 'mobiler' },
          { header: 'Alternate Mobile', key: 'altMobile' },
          { header: 'Address', key: 'address' },
          { header: 'City', key: 'city'},
          { header: 'State', key: 'state' },
          { header: 'Pincode', key: 'pinCode' },
          { header: 'Caste', key: 'caste' },
          { header: 'Aadhar Number', key: 'aadhar' },
          { header: 'Pan Number', key: 'pan' },
          { header: 'Resume', key: 'resumeFile'},
          { header: 'Created At', key: 'createdAt', width: 20, // Give it enough width, especially if including time
    style: { numFmt: 'yyyy-mm-dd hh:mm:ss' } // Example: date and time
   },
        ];
        applicants.forEach(row => applicantSheet.addRow(row));
    
        // 🎓 Qualifications
        const qualSheet = workbook.addWorksheet('Qualifications');
        qualSheet.columns = [
          { header: 'ID', key: 'id' },
          { header: 'Applicant ID', key: 'applicationId' },
          { header: 'Degree', key: 'degree' },
          { header: 'Degree Name', key: 'degreeName'},
          { header: 'Education Mode', key: 'educationMode'},
          { header: 'University Name', key: 'universityName'},
          { header: 'Specialization', key: 'specialization' },
          { header: 'Percentage', key: 'percentage' },
          { header: 'CGPA', key: 'cgpa'},
          { header: 'Year of Passing', key: 'yearOfPassing' },
        ];
        qualifications.forEach(row => qualSheet.addRow(row));
    
        // 💼 Work Experience
        const expSheet = workbook.addWorksheet('Work Experience');
        expSheet.columns = [
          { header: 'ID', key: 'id' },
          { header: 'Applicant ID', key: 'applicationId' },
          { header: 'Organization', key: 'organization' },
          { header: 'Role', key: 'designation' },
          { header: 'From Date', key: 'fromDate', width: 20, // Give it enough width, especially if including time
   },
          { header: 'To Date', key: 'toDate', width: 20, // Give it enough width, especially if including time
   },
          { header: 'Currently Working', key: 'currentlyWorking' },
          { header: 'Current Salary', key: 'currentSalary'}
        ];
        experience.forEach(row => expSheet.addRow(row));
    
        // 📤 Output
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=applicants.xlsx');
    
        await workbook.xlsx.write(res);
        res.end();
        await connection.end();
      } catch (err) {
        console.error(err);
        res.status(500).send('Error exporting data');
      }
    })

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});