import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './models/index.js';
import authRouter from './routes/authRoutes.js';
import applicationRouter from './routes/applications.js';
import exportRouter from './routes/exportDegree.js';
import JuniorRouter from './routes/juniorApplication.js'
import NonTeachingRoute from './routes/nonTeaching.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRouter);
app.use('/api/v1/apply', applicationRouter);
app.use('/api/v1/apply',JuniorRouter)
app.use('/api/v1/export',exportRouter)
app.use('/api/v1/apply',NonTeachingRoute)
app.get('/hi', (req, res) => {
  res.send('Hello from the server!');
});

// Database synchronization
db.sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch(err => {
    console.error('Failed to sync database:', err.message);
  });

const PORT = process.env.PORT || 3000;
db.sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
