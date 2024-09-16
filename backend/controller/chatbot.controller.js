const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getChatbotResponse = async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res
      .status(400)
      .json({ error: "Please enter a strategy before submitting." });
  }

  try {
    // Start a chat session
    const context =
      "You are an AI expert in the fashion industry in Sri Lanka. Provide insights and recommendations related to fashion trends, market conditions, and strategies specific to Sri Lanka.Don't generate long paragraphs. A simple response would be fine.";

    // Start a chat session with the context included
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: context }],
        },
        {
          role: "user",
          parts: [{ text: message }], // User's message with additional context
        },
        {
          role: "model",
          parts: [
            {
              text: "I am ready to help with your fashion strategy and trends in Sri Lanka.",
            },
          ],
        },
      ],
    });

    // Send the user's message
    let result = await chat.sendMessage(message);

    // Send the response from Gemini AI
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Error occurred while connecting to the server." });
  }
};

module.exports = { getChatbotResponse };
