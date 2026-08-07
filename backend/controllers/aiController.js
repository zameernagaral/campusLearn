const OpenAI = require('openai');
const { successResponse, errorResponse } = require('../utils/response');

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// ─── @desc    Chat with AI Study Assistant
// ─── @route   POST /api/ai/chat
// ─── @access  Private
exports.chat = async (req, res, next) => {
  try {
    const { message, history = [], context } = req.body;

    if (!message?.trim()) {
      return errorResponse(res, 400, 'Message is required.');
    }

    // System prompt tailored for study assistant
    const systemPrompt = `You are CampusLearn AI, an intelligent study assistant for college students. 
You help students understand academic concepts, solve problems, explain topics, and guide their learning.
You are ${context?.courseName ? `currently assisting with the course: ${context.courseName}.` : 'a general academic assistant.'}
Be concise, encouraging, and educational. Use examples and analogies when helpful.
Format your responses with clear structure using markdown when appropriate.
Student name: ${req.user.name}, Role: ${req.user.role}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ];

    if (!openai) {
      // Fallback mock responses when OpenAI is not configured
      const mockResponses = [
        `Great question about "${message.substring(0, 50)}..."! Let me explain this concept step by step...`,
        `Here's a clear explanation: This topic involves understanding the fundamental principles. Let me break it down for you...`,
        `Excellent! Based on your question, I'll provide a comprehensive answer with examples...`,
      ];
      const reply = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      return successResponse(res, 200, 'AI response generated.', { reply, isDemo: true });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    successResponse(res, 200, 'AI response generated.', { reply });
  } catch (error) {
    // Graceful fallback
    if (error.code === 'insufficient_quota' || error.status === 429) {
      return errorResponse(res, 429, 'AI service is temporarily unavailable. Please try again later.');
    }
    next(error);
  }
};

// ─── @desc    Generate quiz questions from topic
// ─── @route   POST /api/ai/generate-quiz
// ─── @access  Private (Faculty)
exports.generateQuiz = async (req, res, next) => {
  try {
    const { topic, numQuestions = 5, difficulty = 'medium', type = 'mcq' } = req.body;

    if (!openai) {
      return errorResponse(res, 503, 'AI service not configured.');
    }

    const prompt = `Generate ${numQuestions} ${difficulty} difficulty ${type} questions about "${topic}" for a college exam.
Return a JSON array with this structure:
[{
  "question": "...",
  "type": "${type}",
  "options": [{"text": "...", "isCorrect": false}, ...],
  "explanation": "...",
  "marks": 1
}]
Return only valid JSON, no markdown.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const questions = JSON.parse(response.choices[0].message.content);
    successResponse(res, 200, 'Questions generated.', questions);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Summarize text / notes
// ─── @route   POST /api/ai/summarize
// ─── @access  Private
exports.summarize = async (req, res, next) => {
  try {
    const { text, length = 'medium' } = req.body;
    if (!text) return errorResponse(res, 400, 'Text is required.');

    if (!openai) return errorResponse(res, 503, 'AI service not configured.');

    const wordLimit = length === 'short' ? 100 : length === 'long' ? 400 : 200;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Summarize the following text in approximately ${wordLimit} words, preserving key concepts:\n\n${text}`,
      }],
      max_tokens: 600,
    });

    successResponse(res, 200, 'Summary generated.', { summary: response.choices[0].message.content });
  } catch (error) { next(error); }
};
