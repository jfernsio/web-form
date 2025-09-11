
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import ApplicationModel from './Application.js';
import QualificationModel from './Qualification.js';
import ExperienceModel from './Experience.js';
import AwardModel from './Award.js';
import PublicationModel from './Publication.js';
import CourseModel from './Course.js';
import PhdModel from './Phd.js';
import AdditionalInfoModel from './AdditionalInfo.js';
import userModel from '../models/userModel.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 1,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Initialize models
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Application = ApplicationModel(sequelize);
db.Qualification = QualificationModel(sequelize);
db.Experience = ExperienceModel(sequelize);
db.Award = AwardModel(sequelize);
db.Publication = PublicationModel(sequelize);
db.Course = CourseModel(sequelize);
db.Phd = PhdModel(sequelize);
db.AdditionalInfo = AdditionalInfoModel(sequelize);
db.User = userModel(sequelize); 

// Setup associations
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
