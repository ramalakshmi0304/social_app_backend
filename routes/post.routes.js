import express from 'express';
import upload from '../middleware/upload.js'; // Multer + Cloudinary
import { protect } from '../middleware/auth.middleware.js';
import {
  createPost,
  likePost,
  addComment,
  getAllPosts,
  deletePost,
  updatePost,
  searchPosts
} from '../controllers/post.controller.js';

const router = express.Router();

router.get('/search', searchPosts);
router.get('/', getAllPosts);

// Create post with optional image upload
router.post('/', protect, upload.single('image'), createPost);

router.patch('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);
router.put('/:id', protect, updatePost);

export default router;