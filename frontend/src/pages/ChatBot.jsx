import axios from "axios";
import React, { useState, useEffect } from "react";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [fashionTips, setFashionTips] = useState([]); // State for fashion tips

  // Sample fashion tips
  const sampleFashionTips = [
    "Sri Lankan cotton is great for summer wear, consider incorporating it into your collection.",
    "Bright colors are popular in Sri Lanka; use them to attract local customers.",
    "Incorporate traditional Sri Lankan designs to create a unique fashion line.",
    "Sustainable fashion is gaining popularity; consider using eco-friendly materials.",
    "Accessorizing with traditional jewelry can elevate your outfits and appeal to local tastes.",
  ];

  useEffect(() => {
    // Function to get random tips
    const getRandomTips = () => {
      const tips = sampleFashionTips.map((tip) => ({
        text: tip,
        id: Math.random(), // Unique ID for key
      }));
      setFashionTips(tips);
    };

    getRandomTips();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter a strategy before submitting.");
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/chatbot/submit",
        { message }
      );
      if (response.request.statusText === "OK") {
        setResponse(response.data.reply);
        setHistory((prev) => [
          ...prev,
          { question: message, answer: response.data.reply },
        ]);
      } else {
        setResponse("Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error occurred while connecting to the server.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start", // Changed to flex-start for better alignment
        justifyContent: "center",
        backgroundColor: "#f7fafc",
        padding: "20px",
      }}
    >
      {/* Fashion Tips Section */}
      <div
        style={{
          maxWidth: "300px",
          width: "100%",
          margin: "0 20px",
          padding: "24px",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#3b82f6",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Fashion Tips
        </h3>
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          {fashionTips.map((tip) => (
            <li
              key={tip.id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "#f0f4ff",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              {tip.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Chatbot Section */}
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          padding: "24px",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Title and Description */}
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "16px",
            color: "#3b82f6",
          }}
        >
          AI Fashion Strategist
        </h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: "24px",
            color: "#6b7280",
          }}
        >
          Submit your business strategy and get insights on the current fashion
          trends in Sri Lanka.
        </p>

        {/* AI Illustration Image */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <img
            src="https://reactdigitally.com/img/chatbots-for-website.gif" // Placeholder image URL
            alt="AI Illustration"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>

        {/* Previous Questions and Responses Section */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #374151",
            marginBottom: "24px",
            boxShadow: "inset 0 10px 15px -3px rgba(0, 0, 0, 0.05)",
            overflowY: "auto",
            maxHeight: "250px",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            Previous Interactions
          </h3>
          {history.length > 0 ? (
            <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
              {history.map((entry, index) => (
                <li key={index} style={{ marginBottom: "16px" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      marginBottom: "4px",
                    }}
                  >
                    Q: {entry.question}
                  </p>
                  <div
                    style={{
                      marginLeft: "8px",
                      marginTop: "4px",
                      padding: "8px",
                      backgroundColor: "#111827",
                      color: "#ffffff",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    dangerouslySetInnerHTML={{ __html: entry.answer }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#6b7280", fontStyle: "italic" }}>
              No previous interactions. Submit your first strategy to get
              started!
            </p>
          )}
        </div>

        {/* Form for New Submission */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="message"
              style={{
                display: "block",
                color: "#374151",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Your Strategy
            </label>
            <textarea
              style={{
                width: "calc(100% - 40px)",
                padding: "12px",
                border: "1px solid #374151",
                borderRadius: "8px",
                outline: "none",
                transition: "border-color 0.2s ease-in-out",
                margin: "20px",
              }}
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  // Prevent default new line behavior
                  e.preventDefault();
                  // Call the function to submit or handle form logic here
                  handleSubmit(); // Replace this with your submit function
                }
              }}
              placeholder="Describe your fashion strategy..."
              rows="4"
            />
          </div>
          {error && (
            <div
              style={{
                color: "#ef4444",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.3s",
              }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;

// import axios from "axios";
// import React, { useState } from "react";

// function Chatbot() {
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null); // State for error message

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!message.trim()) {
//       setError("Please enter a strategy before submitting."); // Set error message
//       setTimeout(() => {
//         setError(null); // Clear error after 3 seconds
//       }, 3000);
//       return;
//     }

//     setLoading(true);
//     setError(null); // Clear previous errors
//     try {
//       const response = await axios.post(
//         "http://localhost:3001/api/chatbot/submit",
//         { message }
//       );
//       if (response.request.statusText === "OK") {
//         setResponse(response.data.reply);
//       } else {
//         setResponse("Something went wrong.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setResponse("Error occurred while connecting to the server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-md w-full mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-xl bg-white">
//         <h2 className="text-3xl font-bold text-center mb-4 text-blue-600">
//           AI Fashion Strategist
//         </h2>
//         <p className="text-center mb-6 text-gray-500">
//           Submit your business strategy and get insights on the current fashion
//           trends in Sri Lanka.
//         </p>
//         {/* AI Illustration Image */}
//         <div className="pt-4"></div>
//         <div className="flex justify-center mb-6">
//           <img
//             src="https://reactdigitally.com/img/chatbots-for-website.gif" // Placeholder image URL
//             alt="AI Illustration"
//             className="rounded-full shadow-lg"
//             style={{ width: "150px", height: "150px" }}
//           />
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label
//               htmlFor="message"
//               className="block text-gray-700 font-semibold mb-2"
//             >
//               Your Strategy
//             </label>
//             <textarea
//               id="message"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className="w-full p-3 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
//               placeholder="Describe your fashion strategy..."
//               rows="4"
//             />
//           </div>
//           <div className="py-4"></div>
//           {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <button
//               type="submit"
//               className={`w-full py-3 px-4 text-white rounded-lg ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-blue-500 hover:bg-blue-700 transition duration-200 ease-in-out"
//               }`}
//               style={{ width: "220px" }}
//               disabled={loading}
//             >
//               {loading ? "Generating..." : "Submit"}
//             </button>
//           </div>
//         </form>
//         <div className="py-4"></div>
//         {response ? (
//           <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-900 shadow-inner">
//             <h3 className="text-lg font-semibold text-gray-500">
//               AI Insights:
//             </h3>
//             <div className="text-white mt-2">
//               <div dangerouslySetInnerHTML={{ __html: response }} />
//             </div>
//           </div>
//         ) : (
//           <div
//             className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-900 text-center flex items-center justify-center"
//             style={{ height: "120px" }}
//           >
//             <p className="text-white italic">
//               No response yet. Submit your strategy to get AI-powered fashion
//               insights!
//             </p>
//           </div>
//         )}
//         <div className="py-4"></div>
//       </div>
//     </div>
//   );
// }

// export default Chatbot;
