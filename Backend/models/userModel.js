import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    enum : ["admin", "user"],
    default: "user"
  },
  status: {
    type: Number,
    default: 1,
  }
 },
  {
    timestamps: true,
  }
  
);
export const UsersModel = mongoose.model("users", UserSchema);

export const encryptThePassword = async(password) =>{
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  return hash;
}

const Registration = async (data) => {
  const hashPass = await encryptThePassword(data.password);
  let saveUser = new UsersModel({
    name: data.name,
    email: data.email,
    password: hashPass
  });
  console.log(saveUser);
  const reponse = await saveUser.save();
  return reponse;
};


const findByUserId = async(_id) => {
  return await UsersModel.findById(_id); 
}

const findbyEmail = async (email) => {
  let result = await UsersModel.findOne({ email });
  return result;
};

const login = async (data) => {
  let email = data.email
  let password = data.password;
  let result = UsersModel.findOne({ email: email, password: password });
  return result;
}


export default { findByUserId,findbyEmail, login, Registration };