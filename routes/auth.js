const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// הרשמה
router.post('/register', async (req, res) => {
  const { username, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if(existingUser) return res.status(400).json({ message: 'המשתמש כבר קיים' });
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      phone,
      passwordHash,
      code: Math.floor(1000 + Math.random() * 9000).toString() // קוד רנדומלי
    });

    await user.save();
    res.json({ message: 'ההרשמה בוצעה בהצלחה!' });
  } catch(err) {
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// כניסה
router.post('/login', async (req, res) => {
  const { username, code, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if(!user) return res.status(400).json({ message: 'פרטי התחברות שגויים' });

    if(user.code !== code) return res.status(400).json({ message: 'קוד אישי שגוי' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if(!isMatch) return res.status(400).json({ message: 'פרטי התחברות שגויים' });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, username: user.username, isAdmin: user.isAdmin, code: user.code });
  } catch(err) {
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

module.exports = router;
