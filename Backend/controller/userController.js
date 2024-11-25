import UserModel from '../models/userModel.js';
import BcryptService from '../service/bcryptService.js';
import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("user", "admin", "manager").required(),
    password: Joi.string().min(6).required()
});

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ status: "error", message: "Please provide email and password." });
        }

        const isUserExist = await UserModel.findbyEmail(email);
        if (isUserExist) {
            return await BcryptService.Login(req, res, isUserExist);
        } else {
            return res.status(400).send({ status: "error", message: "User does not exist." });
        }
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
}

const registration = async (req, res) => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ status: "error", message: error.details[0].message });
        }

        const { email } = req.body;
        const isUserExist = await UserModel.findbyEmail(email);
        if (!isUserExist) {
            const response = await UserModel.Registration(req.body);
            if (response) {
                return res.status(201).send({
                    status: "success",
                    message: "Record added successfully.",
                    data : response
                });
            }
        } else {
            return res.status(400).send({ status: "error", message: "User already exists." });
        }
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
}

const getAllUsers =  async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };
  
    try {
      const users = await UsersModel.find()
        .sort({ createdAt: -1 })
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);
  
      const totalUsers = await UsersModel.countDocuments();
  
      res.json({
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / options.limit),
        currentPage: options.page,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  };

export {
    registration,
    login,
    getAllUsers
}
