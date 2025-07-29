import express from 'express';
import multer from 'multer';
import path from 'path';
import db from '../models/index.js';
const applicationRouter = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// POST /api/apply
applicationRouter.post('/', upload.single('resume'), async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      postAppliedFor, firstName, middleName, lastName, gender,
      dob, email, altEmail, mobile, altMobile, address, state,
      city, pinCode, caste, aadhar, pan, declaration,
      currentSalary, expectedSalary,
      qualifications, experiences, awards, publications,
      courses, phds, additionalInfo,
    } = req.body;

    const app = await db.Application.create({
      postAppliedFor,
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      email,
      altEmail,
      mobile,
      altMobile,
      address,
      state,
      city,
      pinCode,
      caste,
      aadhar,
      pan,
      declaration: declaration === 'true',
      resumeFile: req.file?.filename,
      currentSalary,
      expectedSalary,
    }, { transaction: t });

    const application_id = app.id;

    // Bulk create child tables
    if (qualifications) await db.Qualification.bulkCreate(
      JSON.parse(qualifications).map((q) => ({ ...q, application_id })), { transaction: t }
    );
    if (experiences) await db.Experience.bulkCreate(
      JSON.parse(experiences).map((e) => ({ ...e, application_id })), { transaction: t }
    );
    if (awards) await db.Award.bulkCreate(
      JSON.parse(awards).map((a) => ({ ...a, application_id })), { transaction: t }
    );
    if (publications) await db.Publication.bulkCreate(
      JSON.parse(publications).map((p) => ({ ...p, application_id })), { transaction: t }
    );
    if (courses) await db.Course.bulkCreate(
      JSON.parse(courses).map((c) => ({ ...c, application_id })), { transaction: t }
    );
    if (phds) await db.Phd.bulkCreate(
      JSON.parse(phds).map((phd) => ({ ...phd, application_id })), { transaction: t }
    );
    if (additionalInfo) await db.AdditionalInfo.create(
      { ...JSON.parse(additionalInfo), application_id }, { transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default applicationRouter;