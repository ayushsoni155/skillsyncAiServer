const cleanResponse = require('../utils/cleanResponse');
const generateID = require('../utils/generateID');
const QuizData = require('../models/quiz_info');  
const Result = require('../models/result_info');
const userInfo = require('../models/user_info'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuiz = async (req, res) => {
  const { subjectName, difficulty, numberOfQuestions } = req.body;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Generate ${numberOfQuestions} multiple-choice questions on ${subjectName} with a ${difficulty} difficulty level. Provide the response in a JSON object with the following structure:  
{
  "questions": [ 
    {
      "index": 1,
      "Questions": "Question text here",
      "Options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Correct Option"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    const cleanText = cleanResponse(rawText);
    const generatedQuestions = JSON.parse(cleanText);
    

    if (!generatedQuestions.questions || !Array.isArray(generatedQuestions.questions)) {
      throw new Error("Invalid response format from Gemini API");
    }
      const questionsForDb = generatedQuestions.questions.map((q) => ({
      questionID: q.index,
      Questions: q.Questions,
      Options: q.Options,
      correctAnswer:q.correctAnswer
    }));
   
    
    const quizID = generateID("QZ");
    const quiz = new QuizData({
      quizID,
      email: req.user.email,
      datetime: new Date(),
      difficulty_level: difficulty,
      number_of_questions: numberOfQuestions,
      subject_name: subjectName,
      questions: questionsForDb
    });

    await quiz.save();

    const responseQuestions = generatedQuestions.questions.map((q) => ({
      questionID: q.index,
      Questions: q.Questions,
      Options: q.Options,
    }));
    res.json({
      quizID,
      questions: responseQuestions,
    });
  } catch (err) {
    console.error("Error in /generateQuiz:", err.message);
    res.status(500).json({ error: err.message });
  }
};
const result = async (req, res) => {
  const { quizID, userAnswers } = req.body;
  try {
    const quiz = await QuizData.findOne({ quizID });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let totalCorrectAnswers = 0;
    const correctAnswersMap = {};

    quiz.questions.forEach((q, index) => {
      const key = index + 1;
      const correctAnswer = q.correctAnswer;
      const userAnswer = userAnswers[key];

      correctAnswersMap[index + 1] = correctAnswer;

      if (userAnswer === correctAnswer) {
        totalCorrectAnswers++;
      }
    });

    const quizScore = Math.round((totalCorrectAnswers / quiz.number_of_questions) * 100);
    const timeTakenMs = Date.now() - new Date(quiz.datetime).getTime();

    const resultEntry = new Result({
      resultID: generateID("RS"),
      email: req.user.email,
      quizID,
      quiz_score: quizScore,
      time_taken: timeTakenMs,
      total_correct_answers: totalCorrectAnswers,
    });

    await resultEntry.save();

    // Update user points
    const user = await userInfo.findOne({ email: req.user.email });
    if (user) {
      user.points += totalCorrectAnswers;
      await user.save();
    }

    res.json({
      resultID: resultEntry.resultID,
      quizID,
      subject: quiz.subject_name,
      difficulty: quiz.difficulty_level,
      totalQuestions: quiz.number_of_questions,
      totalCorrectAnswers,
      quizScore,
      timeTakenMs,
      quizDatetime: quiz.datetime,
      correctAnswers: correctAnswersMap,
    });
  } catch (err) {
    console.error("Error in /result:", err.message);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { generateQuiz, result };
