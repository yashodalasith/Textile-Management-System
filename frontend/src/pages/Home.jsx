import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Simulate a loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the delay time as needed

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          {/* Rotating Loading Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
        </div>
      ) : (
        // The main content once loading is complete
        <div className="flex flex-col items-center space-y-4">
          <div className="text-3xl font-bold">Home</div>
          <div>
            <Link to="/cart">
              <Button>To Cart</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
