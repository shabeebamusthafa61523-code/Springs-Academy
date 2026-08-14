import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallbacksecret', {
    expiresIn: '30d'
  });
};

export const registerUser = async (req, res) => {
  const { name, username, email, password, role, department, designation, salary, phoneNumber } = req.body;
  try {
    const rawUsername = (username || name || 'user').trim();
    const userEmail = (email || `${rawUsername.toLowerCase().replace(/\s+/g, '')}@academy.com`).trim().toLowerCase();
    const userName = name || username || 'User';

    const safeEmailRegex = new RegExp(`^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    const safeUsernameRegex = new RegExp(`^${rawUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');

    const userExists = await User.findOne({ 
      $or: [
        { email: safeEmailRegex },
        { username: safeUsernameRegex }
      ] 
    });

    if (userExists) {
      console.log(`Registration notice: User ${userEmail} / ${rawUsername} already exists in MongoDB Atlas.`);
      return res.status(400).json({
        message: `Username '${rawUsername}' or email '${userEmail}' already exists. Please choose a different username or sign in.`
      });
    }

    const user = await User.create({
      name: userName,
      username: rawUsername,
      email: userEmail,
      phoneNumber: phoneNumber ? phoneNumber.trim() : '',
      password: password || 'password123',
      role: role || 'Super Admin',
      department: department || (role === 'Super Admin' ? 'Executive' : 'Finance & HR'),
      designation: designation || (role === 'Super Admin' ? 'Academy Director' : 'Accounts Manager'),
      salary: salary || (role === 'Super Admin' ? 120000 : 60000)
    });

    console.log(`✓ MongoDB Atlas: Successfully registered new user [${user.email}] (${user.role})!`);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    if (error.code === 11000) {
      console.log(`Notice: Duplicate key caught in MongoDB Atlas for registration (${error.message}). Fetching existing user.`);
      try {
        const rawUsername = (username || name || 'user').trim();
        const userEmail = (email || `${rawUsername.toLowerCase().replace(/\s+/g, '')}@academy.com`).trim().toLowerCase();
        const safeEmailRegex = new RegExp(`^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
        const safeUsernameRegex = new RegExp(`^${rawUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');

        const existingUser = await User.findOne({
          $or: [
            { email: safeEmailRegex },
            { username: safeUsernameRegex }
          ]
        });

        if (existingUser) {
          return res.status(200).json({
            _id: existingUser._id,
            name: existingUser.name,
            username: existingUser.username || existingUser.name,
            email: existingUser.email,
            phoneNumber: existingUser.phoneNumber,
            role: existingUser.role,
            token: generateToken(existingUser._id)
          });
        }
      } catch (innerErr) {
        console.error("Error retrieving existing user after duplicate key:", innerErr);
      }
    }
    console.error('MongoDB Atlas Registration Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const identifier = (email || username || '').trim();
    const safeRegex = new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');

    const user = await User.findOne({
      $or: [
        { email: safeRegex },
        { username: safeRegex },
        { name: safeRegex }
      ]
    });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        username: user.username || user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        department: user.department,
        designation: user.designation,
        salary: user.salary,
        token: generateToken(user._id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email/username or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPasswordByPhone = async (req, res) => {
  const { phoneNumber, newPassword } = req.body;
  try {
    if (!phoneNumber || !phoneNumber.trim()) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }
    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({ message: 'New password must be at least 4 characters long.' });
    }

    const cleanInputPhone = phoneNumber.trim().replace(/\D/g, '');
    const rawInputPhone = phoneNumber.trim();

    const users = await User.find({});
    const user = users.find(u => {
      if (!u.phoneNumber) return false;
      const cleanUserPhone = u.phoneNumber.replace(/\D/g, '');
      return (cleanInputPhone.length > 0 && cleanUserPhone.includes(cleanInputPhone)) || u.phoneNumber.trim() === rawInputPhone;
    });

    if (!user) {
      return res.status(404).json({ message: 'No registered user account found with this phone number.' });
    }

    user.password = newPassword;
    await user.save();

    console.log(`✓ MongoDB Atlas: Successfully reset password for user [${user.username || user.name}] via phone!`);

    return res.status(200).json({
      message: 'Password reset successfully!',
      username: user.username || user.name || user.email
    });
  } catch (error) {
    console.error("Reset password by phone error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        department: user.department,
        designation: user.designation,
        salary: user.salary
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
