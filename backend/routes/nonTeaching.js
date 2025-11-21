import express from 'express';
import multer from 'multer';
import db from '../models/index.js';
const NonTeachingRoute = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// POST /api/apply
NonTeachingRoute.post('/non-teaching', upload.single('resume'), async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    console.log("Request Body:", req.body); 
    console.log("Uploaded File:", req.file);
    const {
      postApplied,title, firstName, middleName, lastName, email,  mobile, address, declaration, dob,
      qualifications, workExperiences,  additionalInfo
    } = req.body;

    const app = await db.Application.create({
      postAppliedFor:postApplied,
      form_type: 'non_teaching',
      title,
      firstName,
      middleName,
      lastName,
      email,
      mobile,
      dob,
      address,
      declaration: declaration === 'true',
      resumeFile: req.file?.filename,
    }, { transaction: t });

    const applicationId = app.id;

    // Bulk create child tables
    if (qualifications) await db.Qualification.bulkCreate(
      JSON.parse(qualifications).map((q) => ({ ...q, applicationId })), { transaction: t }
    );
    if (workExperiences) await db.Experience.bulkCreate(
      JSON.parse(workExperiences).map((e) => ({ ...e, applicationId })), { transaction: t }
    );

    if (additionalInfo) {
  await db.AdditionalInfo.create({
    ...JSON.parse(additionalInfo),
    applicationId
  }, { transaction: t });
}


    await t.commit();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default NonTeachingRoute;