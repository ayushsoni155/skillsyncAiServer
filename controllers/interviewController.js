const { GoogleGenerativeAI } = require('@google/generative-ai');
const cleanResponse = require('../utils/cleanResponse');
const formatConversation =require('../utils/formatConversation')
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Start Interview
const startInterview = async (req, res) => {
  const { type, experience } = req.body;

  try { 
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Generate a unique first interview question for a B.Tech student for a ${type} interview at ${experience} level. Ensure the question is relevant, challenging, and tailored to the specified type and experience. Response format:
{
  "question": "Your question here"
}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanText = cleanResponse(rawText);
    const { question } = JSON.parse(cleanText);

    res.json({ question });
  } catch (err) {
    console.error("Error in startInterview:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 2. Process Answer and generate next question
const processAnswer = async (req, res) => {
  const { conversation, type, experience } = req.body;

  try {
    const formattedQA = formatConversation(conversation);

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are conducting a ${type} mock interview for a B.Tech student at ${experience} level. Analyze the following conversation and generate the next relevant and tailored interview question. Ensure the question builds on the previous context and matches the specified type and experience level. Response format:
{
  "question": "Your next question here"
}
Conversation:
${formattedQA}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanText = cleanResponse(rawText);
    const { question } = JSON.parse(cleanText);

    res.json({ question });
  } catch (err) {
    console.error("Error in processAnswer:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 3. Evaluate performance
const evaluate = async (req, res) => {
  const { conversation, type, experience } = req.body;

  try {
    const formattedQA = formatConversation(conversation);

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert interview evaluator for a ${type} mock interview of a B.Tech student at ${experience} level. Analyze the following conversation and provide a detailed assessment of the candidate's performance. Evaluate their answers based on clarity, technical accuracy, confidence, relevance, and response time. Provide feedback in the following JSON format:
{
  "score": "x/100",
  "strengths": "strengths observed in the answers in 50 words",
  "areasToImprove": "Specific areas where the candidate can improve in 50 words",
  "avgResponseTime": "Average response time in seconds"
}
Conversation:
${formattedQA}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanText = cleanResponse(rawText);
    const evaluation = JSON.parse(cleanText);

    res.json(evaluation);
  } catch (err) {
    console.error("Error in evaluate:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { startInterview, processAnswer, evaluate };
