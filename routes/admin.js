const express = require('express');
const router = express.Router();
const User = require('../models/User');
const WorkRecord = require('../models/WorkRecord');
const authMiddleware = require('../middleware/auth');

// בדיקת קוד מנהל
function adminAuth(req, res, next) {
  const code = req.header('Admin-Code');
  if(!code || code !== process.env.ADMIN_CODE) {
    return res.status(403).json({ message: 'קוד מנהל שגוי' });
  }
  next();
}

// רשימת משתמשים
router.get('/users', authMiddleware, adminAuth, async (req, res) => {
  try {
    const users = await User.find({}, 'username code isAdmin');
    res.json(users);
  } catch(err) {
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// סיכום שעות משתמש
router.get('/user/:userId', authMiddleware, adminAuth, async (req, res) => {
  try {
    const records = await WorkRecord.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(records);
  } catch(err) {
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// הוספת רשומה למשתמש
router.post('/user/:userId/add', authMiddleware, adminAuth, async (req, res) => {
  try {
    const { taskName, date, hoursWorked } = req.body;
    const record = new WorkRecord({
      userId: req.params.userId,
      taskName,
      date,
      hoursWorked
    });
    await record.save();
    res.json({ message: 'רשומה נוספה בהצלחה' });
  } catch(err) {
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// מחיקת רשומה לפי id
router.delete('/record/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    await WorkRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'הרשומה נמחקה בהצלחה' });
  } catch(err) {
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

module.exports = router;
