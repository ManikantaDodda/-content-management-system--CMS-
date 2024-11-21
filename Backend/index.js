import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import Post from './models/Post.js';
import dotenv from 'dotenv';

const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
const MONGO_URI = process.env.DATABASE;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create Post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-');
    const post = new Post({ title, slug, content });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All Posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const getPost = await Post.findById(id);
    res.status(200).json(getPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-');
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, slug, content },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
