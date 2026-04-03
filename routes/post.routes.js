import express from 'express';
import upload from '../middleware/upload.js'; // Import your new middleware
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

// Public: Anyone can view the feed
router.get('/', getAllPosts);

// Protected: Only logged-in users can create posts
router.post('/', protect, upload.single('image'), createPost);

router.patch('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);
router.put('/:id', protect, updatePost);

export default router;