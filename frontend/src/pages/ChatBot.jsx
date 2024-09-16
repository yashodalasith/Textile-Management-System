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
      if (response.request.statusText === "OK") {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-xl bg-white">
        <h2 className="text-3xl font-bold text-center mb-4 text-blue-600">
          AI Fashion Strategist
        </h2>
        <p className="text-center mb-6 text-gray-500">
          Submit your business strategy and get insights on the current fashion
          trends in Sri Lanka.
        </p>
        {/* AI Illustration Image */}
        <div className="pt-4"></div>
        <div className="flex justify-center mb-6">
          <img
            src="https://reactdigitally.com/img/chatbots-for-website.gif" // Placeholder image URL
            alt="AI Illustration"
            className="rounded-full shadow-lg"
            style={{ width: "150px", height: "150px" }}
          />
        </div>
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
              className="w-full p-3 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
              placeholder="Describe your fashion strategy..."
              rows="4"
            />
          </div>
          <div className="py-4"></div>
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className={`w-full py-3 px-4 text-white rounded-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700 transition duration-200 ease-in-out"
            }`}
            style={{ marginLeft: "480px", width: "200px" }}
            disabled={loading}
          >
            {loading ? "Generating..." : "Submit"}
          </button>
        </form>
        <div className="py-4"></div>
        {response ? (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-900 shadow-inner">
            <h3 className="text-lg font-semibold text-gray-500">
              AI Insights:
            </h3>
            <div className="text-white mt-2">
              <div dangerouslySetInnerHTML={{ __html: response }} />
            </div>
          </div>
        ) : (
          <div
            className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-900 text-center flex items-center justify-center"
            style={{ height: "120px" }}
          >
            <p className="text-white italic">
              No response yet. Submit your strategy to get AI-powered fashion
              insights!
            </p>
          </div>
        )}
        <div className="py-4"></div>
      </div>
    </div>
  );
}

export default Chatbot;
