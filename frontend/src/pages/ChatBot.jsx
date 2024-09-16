import axios from "axios";
import React, { useState } from "react";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null); // State for error message

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter a strategy before submitting."); // Set error message
      setTimeout(() => {
        setError(null); // Clear error after 3 seconds
      }, 3000);
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.post(
        "http://localhost:3001/api/chatbot/submit",
        { message }
      );
      if (response.request.statusText == "OK") {
        setResponse(response.data.reply);
      } else {
        setResponse("Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error occurred while connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded shadow-lg bg-white">
        <div className="py-4"></div>
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
          AI Fashion Strategist
        </h2>
        <p className="text-center mb-6 text-gray-500">
          Submit your business strategy and get insights on the current fashion
          trends in Sri Lanka.
        </p>
        <div className="py-4"></div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-gray-700 font-semibold mb-2"
            >
              Your Strategy
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your fashion strategy..."
              rows="4"
            />
          </div>
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
          <div className="py-4"></div>
          <div className="py-4"></div>
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white rounded ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Submit"}
          </button>
        </form>
        {response ? (
          <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700">
              AI Insights:
            </h3>
            <div className="text-gray-700 mt-2">
              <div dangerouslySetInnerHTML={{ __html: response }} />
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 border border-dashed border-gray-300 rounded bg-gray-50 text-center">
            <p className="text-gray-500 italic">
              No response yet. Submit your strategy to get AI-powered fashion
              insights!
            </p>
          </div>
        )}
      </div>
      <div className="py-4"></div>
      <div className="py-4"></div>
    </div>
  );
}

export default Chatbot;
