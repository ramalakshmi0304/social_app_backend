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

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // for local development
    'https://social-app-frontend-blond.vercel.app' // your deployed frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true // if you are using cookies/auth
}));


app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// ✅ FIXED STATIC UPLOADS

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));