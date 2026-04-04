import User from '../models/User.js';
import Post from '../models/Post.js';


export const createPost = async (req, res) => {
  console.log("--- INSIDE CREATE POST CONTROLLER ---");
  try {
    const { content } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!content?.trim() && !imageUrl) {
      return res.status(400).json({ message: "Post must have text or an image" });
    }

    const newPost = new Post({
      content,
      imageUrl,
      user: req.user._id,
      username: req.user.username
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user already liked
    const index = post.likes.findIndex((like) => like.userId.toString() === req.user._id.toString());

    if (index === -1) {
      // LIKE: Add userId and username
      post.likes.push({ userId: req.user._id, username: req.user.username });
    } else {
      // UNLIKE: Remove from array
      post.likes.splice(index, 1);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    const newComment = {
      text,
      userId: req.user._id,
      username: req.user.username // This is 'lakshmi'
    };

    post.comments.push(newComment);
    await post.save();
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    // .find() gets all documents
    // .sort({ createdAt: -1 }) puts newest posts first
    const posts = await Post.find().sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch posts", 
      error: error.message 
    });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // only owner can delete
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EDIT POST
export const updatePost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.content = content?.trim() || post.content;
    post.imageUrl = imageUrl?.trim() || post.imageUrl;

    await post.save();

    res.status(200).json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const searchPosts = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const posts = await Post.find({
      $or: [
        { content: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } }
      ]
    })
    .populate('user', 'username profilePic') // Ensures user details come with the post
    .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error during search", error: err.message });
  }
};