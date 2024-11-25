import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import Authenticate from "./service/bcryptService.js";
import { login, registration } from './controller/userController.js';
import {createNewPost, getAllPosts, getPostByID, getAllPostsByUser, updatePostByID, deletePostByID} from './controller/postController.js';

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


app.post('/api/register', registration);
app.post('/api/login', login);
// Create Post
app.post('/api/posts', Authenticate.isAuthenticatedUser, createNewPost);

// Read All Posts
app.get('/api/posts', getAllPosts);
app.get('/api/user-posts',Authenticate.isAuthenticatedUser, getAllPostsByUser);

// Get Post
app.get('/api/posts/:id', getPostByID);

// Update Post
app.put('/api/posts/:id', updatePostByID);

// Delete Post
app.delete('/api/posts/:id', deletePostByID);

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
