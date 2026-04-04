import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();

// Replace your existing app.use(cors(...)) with this:
const allowedOrigins = [
  'http://localhost:5173',
  'https://social-app-frontend-blond.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // Explicitly allow these
}));


app.use(express.json());

app.use('/uploads', express.json(), express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// ✅ FIXED STATIC UPLOADS

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));