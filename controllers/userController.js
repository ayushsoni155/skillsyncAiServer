const QuizData = require('../models/quiz_info');
const Result = require('../models/result_info');
const userInfo = require('../models/user_info');

const getReportCard = async (req, res) => {
  try {
    const results = await Result.find({ email: req.user.email });

    const quizReports = await Promise.all(
      results.map(async (result) => {
        const quiz = await QuizData.findOne({ quizID: result.quizID });
        return {
          quizId: result.quizID,
          resultId: result.resultID,
          quizScore: result.quiz_score,
          timeTaken: result.time_taken,
          totalNoofquestions: quiz.number_of_questions,
          totalCorrectAnswers: result.total_correct_answers,
          subjectName: quiz.subject_name,
          dateTime: quiz.datetime.toISOString().replace('T', ' ').split('.')[0],
          difficultyLevel: quiz.difficulty_level,
        };
      })
    );

    res.json(quizReports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const email = req.user.email;
     const user = await userInfo.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const results = await Result.find({ email });
     const totalTests = results.length;
    const totalScore = results.reduce((sum, r) => sum + r.quiz_score, 0);
    const totalTime = results.reduce((sum, r) => sum + r.time_taken, 0);
    const highestScore = results.reduce(
      (max, r) => (r.quiz_score > max ? r.quiz_score : max),
      0
    );
     const avgScore = totalTests > 0 ? (totalScore / totalTests).toFixed(2) : 0;
    const avgTime = totalTests > 0 ? (totalTime / totalTests).toFixed(2) : 0;

  const userStates={
     userEmail: user.email,
      userName: user.name,
      profileUrl: user.profile_url,
      currentPoints: user.points,
      totalTests,
      avgScore: parseFloat(avgScore),
      avgTime: parseFloat(avgTime),
      highestScore
  }
    const users = await userInfo.find().sort({ points: -1 });
    const leaderboard = users.map((user) => ({
      userEmail: user.email,
      userName: user.name,
      profileUrl: user.profile_url,
      userPoints: user.points,
    }));
    res.json({userStates,leaderboard});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getReportCard, getLeaderboard };
