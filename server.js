import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js';
import connectDB from './config/db.js';
import fs from 'fs';

dotenv.config();
connectDB();

const app = express();

// Replace your existing app.use(cors(...)) with this:
const allowedOrigins = [
  'http://localhost:5173',
  'https://social-app-frontend-blond.vercel.app'
];

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // Explicitly allow these
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack); // This prints the REAL error to Render logs
  res.status(500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});
console.log("DEBUG: Current JWT Secret is:", process.env.JWT_SECRET ? "LOADED" : "MISSING");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));