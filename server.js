require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ התחברת למונגו בהצלחה!'))
  .catch(err => console.error('❌ שגיאת חיבור למונגו:', err));

// הפעלת שרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על פורט ${PORT}`);
});


const app = express();

// מידלווארים
app.use(cors());
app.use(express.json()); // פענוח JSON מהבקשות

// חיבור למסד הנתונים (תעדכן את ה-MONGO_URI ב־.env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ התחברת ל-MongoDB'))
  .catch(err => console.error('❌ שגיאה בהתחברות ל-MongoDB:', err));

// חיבור ראוטים
app.use('/api/auth', authRoutes);

// בדיקת תקינות שרת בסיסית
app.get('/', (req, res) => {
  res.send('המערכת עובדת! 🎉');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על פורט ${PORT}`);
});

