import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './models/index.js';
import authRouter from './routes/authRoutes.js';
import applicationRouter from './routes/applications.js';
import exportRouter from './routes/exportDegree.js';
import JuniorRouter from './routes/juniorApplication.js'
import NonTeachingRoute from './routes/nonTeaching.js';
import exportJuniorRouter from './routes/exportJunior.js';
import nonTeachingRouter from './routes/exportNT.js';
import path from 'path';
dotenv.config();
const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://web-form-g7a5.onrender.com"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/admin',(req,res) => res.sendFile(path.join(__dirname,'public/admin-login.html')));

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRouter);
app.use('/api/v1/apply', applicationRouter);
app.use('/api/v1/apply',JuniorRouter)
app.use('/api/v1/export',exportRouter,exportJuniorRouter,nonTeachingRouter)
app.use('/api/v1/apply',NonTeachingRoute)
app.get('/hi', (req, res) => {
  res.send('Hello from the server!');
});

// Database synchronization
// db.sequelize.sync()
//   .then(() => {
//     console.log('Database synced successfully.');
//   })
//   .catch(err => {
//     console.error('Failed to sync database:', err.message);
//   });

const PORT = process.env.PORT || 3000;
db.sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
