const express = require("express");
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
require('./configs/db'); 

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // allow frontend origin
  credentials: true // to allow cookies/auth headers
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/interview', interviewRoutes);
app.get('/test',(req,res)=>{
  console.log("Everything is working fine! done with cicd");
  res.send("Everything is working fine! done");
})
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

// Function to keep the server awake
function keepServerAwake() {
  setInterval(async () => {
    try {
      const res = await fetch("https://skillsyncaiserver.onrender.com/"); // Replace with your Render URL
      console.log("Pinged self to prevent sleep");
    } catch (err) {
      console.error("Ping failed:", err.message);
    }
  }, 5 * 60 * 1000);
}  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});




