import Post from '../models/Post.js';

// Create a new post (with optional image)
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    const imageUrl = req.file ? req.file.path : null; // ✅ FIX

    const newPost = new Post({
      content,
      imageUrl,
      user: req.user._id,
      username: req.user.username,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like / unlike a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.findIndex(
      (like) => like.userId.toString() === req.user._id.toString()
    );

    if (index === -1) {
      // Like: add user
      post.likes.push({ userId: req.user._id, username: req.user.username });
    } else {
      // Unlike: remove
      post.likes.splice(index, 1);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      text,
      userId: req.user._id,
      username: req.user.username,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts (newest first)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch posts',
      error: error.message,
    });
  }
};

// Delete a post (owned by the user only)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a post (edit content or imageUrl)
export const updatePost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.content = (content || '').trim() || post.content;
    post.imageUrl = (imageUrl || '').trim() || post.imageUrl;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search posts by content or username
export const searchPosts = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const posts = await Post.find({
      $or: [
        { content: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
      ],
    })
      .populate('user', 'username profilePic') // attach user info
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: 'Server error during search',
      error: err.message,
    });
  }
};