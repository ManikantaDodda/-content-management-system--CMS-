import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user_id : {type : mongoose.Schema.Types.ObjectId, ref: "users" , required : true},
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: false },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
