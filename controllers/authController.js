const userInfo = require('../models/user_info');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const loginUser = async (req, res) => {
  const { email, profileUrl, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required.' });
  }

  try {
    let user = await userInfo.findOne({ email });

    if (!user) {
      user = new userInfo({
        email,
        name,
        profile_url: profileUrl,
        points: 0,
      });
      await user.save();
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, points: user.points,profile_url:user.profile_url },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
      const message = 'Login successful';

    res.json({message,user});
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userInfo.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      email: user.email,
      name: user.name,
      profile_url: user.profile_url,
      points: user.points,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};


module.exports = { loginUser, getUser, logoutUser };
