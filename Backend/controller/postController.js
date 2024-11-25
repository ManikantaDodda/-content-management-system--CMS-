import Post from "../models/Post.js";
const createNewPost = async (req, res) => {
    try {
      const user_id = req.user._id;
      const { title, content } = req.body;
      const slug = title.toLowerCase().replace(/ /g, '-');
      const post = new Post({ title, slug, content, user_id });
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  const getAllPosts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; 
  
      const skip = (page - 1) * limit;
  
      const totalPosts = await Post.countDocuments();
  
      // Fetch the posts with pagination (limit and skip)
      const posts = await Post.find()
        .populate("user_id", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      const totalPages = Math.ceil(totalPosts / limit);
  
      res.status(200).send({
        data: posts,
        totalPages: totalPages,
        currentPage: page,
        totalPosts: totalPosts,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  const getAllPostsByUser =  async (req, res) => {
    try {
      const user_id = req.user._id;
      const posts = await Post.find({user_id}).sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

const getPostByID = async (req, res) => {
    try {
      const { id } = req.params;
      const getPost = await Post.findById(id);
      res.status(200).json(getPost);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

const updatePostByID = async (req, res) => {
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
  }


const deletePostByID =  async (req, res) => {
    try {
      const { id } = req.params;
      await Post.findByIdAndDelete(id);
      res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

export {createNewPost, getAllPosts, getPostByID, getAllPostsByUser, updatePostByID, deletePostByID}
