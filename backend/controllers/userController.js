import userModel from "../Models/Users.js";
import bcrypt from "bcrypt";
import { use } from "bcrypt/promises.js";
import jwt from "jsonwebtoken";
import Validator from "validator";

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey);
};

/**
 * Handles user registration.
 *
 * Checks if the user already exists with the given email.
 * If the user does not exist, it creates a new user with the provided details.
 * Hashes the password with a salt and saves the user to the database.
 * Returns a JSON response with the user's _id, name, email, and a JWT token.
 *
 * Returns a 400 error if the user already exists or if the request body is invalid.
 * Returns a 500 error if an error occurs while processing the request.
 */

const registeruser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) return res.status(400).json("user already exists!...");
    if (!name || !email || !password)
      return res.status(400).json("please fill all the details");
    if (!Validator.isEmail(email))
      return res.status(400).json("enter a valid email...");
    user = new userModel({ name, email, password });
    const salt = await bcrypt.genSalt(10); // Generate a salt and hash the password

    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = createToken(user._id); // Generate a JWT token for the user
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

/**
 * Handles user login.
 *
 * Verifies the email and password provided in the request body.
 * If the email and password are valid, returns a JSON response with the user's
 * _id, name, email, and a JWT token.
 *
 * Returns a 400 error if the email or password is invalid.
 *
 * Returns a 500 error if an error occurs while processing the request.
 */
const loginuser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("invalid email or password");

    const isValidPassword = await bcrypt.compare(password, user.password); // Check if password matches hashed password in database

    if (!isValidPassword) return res.status(400).json("invalid password");

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const finduser = async (req, res) => {
  const userid = req.user.id; // Get user ID from request
  try {
    const user = await userModel.findById(userid);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export { registeruser, loginuser, finduser };
