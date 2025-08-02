import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import userModel from './userModel.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: { max: 1, min: 0, acquire: 30000, idle: 10000 }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = userModel(sequelize); // Correct usage

export default db;