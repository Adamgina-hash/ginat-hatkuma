const express = require('express');
const router = express.Router();
const WorkRecord = require('../models/WorkRecord');
const authMiddleware = require('../middleware/auth');

// הוספת רשומת עבודה
router.post('/add', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { taskName, date, hoursWorked } = req.body;

  try {
    const record = new WorkRecord({
      userId,
      taskName,
      date,
      hoursWorked
    });
    await record.save();
    res.json({ message: `תודה על השתתפותך! עבדת ${hoursWorked} שעות.` });
  } catch(err) {
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// סיכום שעות למתנדב
router.get('/summary', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const records = await WorkRecord.find({ userId }).sort({ date: -1 });
    res.json(records);
  } catch(err) {
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

module.exports = router;