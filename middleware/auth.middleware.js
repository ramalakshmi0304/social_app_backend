// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Ensure header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('AUTH FAIL: No Bearer token in Authorization header');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
  // Replace process.env.JWT_SECRET with the ACTUAL string for one test
  const decoded = jwt.verify(token, "a-string-secret-at-least-256-bits-long"); 
  req.user = await User.findById(decoded.id).select('-password');
  next();
} catch (error) {
  console.log('JWT Error:', error.message);
  res.status(401).json({ message: 'Not authorized' });
}
};