import React, { useState, useEffect } from "react";

const OfferSuccesScreen = () => {
  const [loadedFromTelegram, setLoadedFromTelegram] = useState(false);

  const handleClose = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.close();
    } else {
      console.warn("Telegram WebApp is not available.");
    }
  };

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp && Object.keys(window.Telegram.WebApp.initDataUnsafe).length !== 0) {
      const { user } = window.Telegram.WebApp.initDataUnsafe;
      if (user) {
        setLoadedFromTelegram(true);
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white p-4">
      <div className="w-full max-w-xs text-center">
        <img
          src="https://awakilofiles.nyc3.cdn.digitaloceanspaces.com/Archive_ankuaru_file/decd5863-e6cb-43e6-83a1-ed41950eb442-removebg-preview.png"
          alt="Illustration"
          className="w-full mb-6"
        />
        <h2 className="text-lg font-bold text-gray-800 font-sans">
          Success! Your offer has been posted.
        </h2>
        <br />
        <h2 className="text-lg font-bold text-gray-800 font-sans">
        ምርቶ በትክክል ተልኳል
        </h2>
        <div className="flex justify-center items-center mt-12">
          {loadedFromTelegram ? (
            <button
              onClick={handleClose}
              className="w-full bg-red-500 text-white text-lg font-medium py-3 rounded-xl shadow-lg transition-all duration-300 hover:bg-red-600 active:bg-red-700"
            >
              Close / ዝጋ
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-blue-500 text-white text-lg font-medium py-3 rounded-xl shadow-lg transition-all duration-300 hover:bg-blue-600 active:bg-blue-700"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferSuccesScreen;
