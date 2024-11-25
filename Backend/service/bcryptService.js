import bcrypt from 'bcryptjs';
import UserModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';


const Login = async (req, res, response) => {
    const matchPass = bcrypt.compareSync(req.body.password, response.password);
    if (matchPass === true) {
        const token = jwt.sign({
            _id: response._id,
            email: response.email,
            role: response.role,
            name : response.name
        },
            `${process.env.JWT_PRIVATE_KEY}`, {
            expiresIn: "12h"
        });
        return res.send({
            status: "success",
            message: "Login successfully.",
            token : token
        });
    } else {
        res.status(400).send({ status: "error", message: "Password Incorrect." });
    }
}

// Authenticate Token Middleware
const authenticateToken = async (req, res, role) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            const authenticatedUser = await UserModel.findByUserId(decoded._id);

            if (authenticatedUser && (authenticatedUser.role === role || role===true)) {
                req.user = authenticatedUser; 
                return 1; // Success
            } else {
                return 2; // Unauthorized Role
            }
        } catch (error) {
            return error; // Token verification or other error
        }
    } else {
        return 3; // Missing token
    }
};

const isAuthenticated = (role) => {
    return async (req, res, next) => {
        const authenticatedStatus = await authenticateToken(req, res, role);

        if (authenticatedStatus === 1) {
            next(); // Proceed to the next middleware or route handler
        } else if (authenticatedStatus === 2) {
            return res.status(401).send({ status: "error", message: "Unauthorized User." });
        } else if (authenticatedStatus === 3) {
            return res.status(401).send({ status: "error", message: "Authorization token is missing." });
        } else {
            console.log("Authentication Error: ", authenticatedStatus); // Log unexpected error
            return res.status(500).send({ status: "error", message: "Unexpected error occurred It may Token Incorrect  or Expired." });
        }
    };
};

// User Middleware
const isAuthenticatedUser = isAuthenticated('user');

// Both Login Middleware
const isLoginAuthenticated = isAuthenticated(true);



export default {
     Login, isAuthenticatedUser, isLoginAuthenticated
}