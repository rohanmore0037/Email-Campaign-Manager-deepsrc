import User from '../models/userModel.js';
import dotenv from 'dotenv';
import passport from 'passport';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs';

dotenv.config()

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64') // standard Base64
    .replace(/\+/g, '-') // replace '+' with '-'
    .replace(/\//g, '_') // replace '/' with '_'
    .replace(/=+$/, ''); // remove padding '='
}
// const encoded = base64UrlEncode('Hello World!');
// console.log(encoded); // Output: SGVsbG8gV29ybGQh


function base64UrlDecode(base64Url) {
  // Restore Base64 format
  let base64 = base64Url
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  // Pad with '=' if necessary
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  return Buffer.from(base64, 'base64').toString();
}
// const decoded = base64UrlDecode(encoded);
// console.log(decoded); // Output: Hello World!




export const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already used' });

        const user = await new User({ email, password, username }).save();
        res.status(201).json({ message: 'User created successfully', user ,success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const login = async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Login failed' });
            }

            const { password, ...safeUser } = user.toObject ? user.toObject() : user;
            const token = generateToken(user);
            return res.json({ token ,user:safeUser});
        });
    })(req, res, next);
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetToken = token;
        user.resetTokenExpires = Date.now() + 3600000;
        await user.save();

        const total = token + email;
        const hashed = await bcrypt.hash(total, 10);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASS
            }
        });

        const link = base64UrlEncode(hashed);

        const resetLink = `${process.env.BASE_URL}/reset-password/${link}`;

        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`
        });

        res.json({ message: 'Password reset email sent!' });

    } catch (err) {
        console.error("Forgot Password Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const resetPassword = async (req, res) => {
    const link = req.params.token;
    const { email, password } = req.body;

    const token = base64UrlDecode(link);

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.resetToken || user.resetTokenExpires < Date.now()) {
            return res.status(400).json({ message: 'Reset token expired or invalid' });
        }

        const combined = user.resetToken + email;

        const isMatch = await bcrypt.compare(combined, token);
        if (!isMatch) return res.status(400).json({ message: 'Invalid reset token' });

        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();

        res.json({ message: 'Password has been reset successfully' });

    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};