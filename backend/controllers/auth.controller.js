import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const isBcryptHash = (value) => /^\$2[aby]\$\d{2}\$/.test(value);

export const registerUser = async (req, res) => {

  try {
    const { name, email, password, address } = req.body;
    const hashpassword = await bcrypt.hash(password , 10);
    const user = await User.create({
      name,
      email,
      password: hashpassword,
      address,
      role: "user",
    });

     res.status(201).json({
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let isMatch = false;

    if (isBcryptHash(user.password)) {
      isMatch = await bcrypt.compare(password, user.password);
    } else if (password === user.password) {
      // Migrate legacy/plain-text DB entries to bcrypt on successful login.
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,  
      user
    });
    
  }
  catch(error){
    res.status(500).json({
      message: error.message,
    });
  }
}

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    user.password = hashedNew;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
