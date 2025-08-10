require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // צריך לייבא את cors אם אתה משתמש בו
const authRoutes = require('./routes/auth');
 // ודא שזה הנתיב הנכון לראוטים שלך

const app = express();  // רק פעם אחת!

// מידלווארים
app.use(cors());
app.use(express.json());

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ התחברת ל-MongoDB'))
  .catch(err => console.error('❌ שגיאה בהתחברות ל-MongoDB:', err));

// חיבור ראוטים
app.use('/api/auth', authRoutes);

// בדיקת תקינות שרת בסיסית
app.get('/', (req, res) => {
  res.send('המערכת עובדת! 🎉');
});

// הפעלת שרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על פורט ${PORT}`);
});
