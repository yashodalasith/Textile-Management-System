const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Create an object to store chat histories for each session.
const chatHistories = {};

// Chatbot response function
const getChatbotResponse = async (req, res) => {
  const { message, sessionId } = req.body; // Include a unique sessionId for each user or conversation

  if (!message || !message.trim()) {
    return res
      .status(400)
      .json({ error: "Please enter a strategy before submitting." });
  }

  // Check if a sessionId is provided, otherwise create one
  const userSessionId = sessionId || Math.random().toString(36).substring(7);

  // Initialize chat history for the session if not already present
  if (!chatHistories[userSessionId]) {
    chatHistories[userSessionId] = [
      {
        role: "user",
        parts: [
          {
            text: "You are an AI expert in the fashion industry in Sri Lanka. Provide insights and recommendations related to fashion trends, market conditions, and strategies specific to Sri Lanka. Don't generate long paragraphs. A simple response would be fine.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "I am ready to help with your fashion strategy and trends in Sri Lanka.",
          },
        ],
      },
    ];
  }

  try {
    // Retrieve the chat history for the session
    const chatHistory = chatHistories[userSessionId];

    // Add the new user message to the history
    chatHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Create a chat session with the full history
    const chat = model.startChat({ history: chatHistory });

    // Send the user's message and get a response
    let result = await chat.sendMessage(message);

    // Add the model's response to the chat history
    chatHistory.push({
      role: "model",
      parts: [{ text: result.response.text() }],
    });

    // Send the response as HTML
    res.json({
      reply: result.response.text().replace(/\*/g, "").replace(/\n/g, "<br />"),
      sessionId: userSessionId, // Return the session ID for the user to continue the conversation
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Error occurred while connecting to the server." });
  }
};

module.exports = { getChatbotResponse };
