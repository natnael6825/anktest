import React, { useState, useRef, useEffect } from 'react';
import { getOtp } from '@/services/userServices';
import { useNavigate } from 'react-router-dom';

function VerificationConfirmation() {
  const navigate = useNavigate();
  const unVerifiedPhoneNumber = sessionStorage.getItem("unVerifiedPhoneNumber");

  // Separate state variables to track each button's submission status
  const [isSubmittingContinue, setIsSubmittingContinue] = useState(false);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

  const handleContinue = async () => {
    setIsSubmittingContinue(true);
    try {
      const response = await getOtp(unVerifiedPhoneNumber);
      sessionStorage.setItem("phoneNumber", unVerifiedPhoneNumber);
      sessionStorage.setItem("verificationId", response.verificationId);
      navigate('/otp');
    } catch (error) {
      console.error("Error sending OTP:", error);
      setIsSubmittingContinue(false);
    }
  };

  const handleUpdatePhone = () => {
    setIsSubmittingUpdate(true);
    sessionStorage.setItem("isUpdatePhone", true);
    sessionStorage.setItem("oldNumber", unVerifiedPhoneNumber);
    navigate('/sign-in');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="shadow-sm p-6 bg-white rounded text-center mb-6 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold flex flex-col gap-2">
          <span>Do you want to verify using this phone number?</span>
          <span>ስልኮትን መቀየር ይፈለጋሉ ?</span>
        </h2>
        <p className="mt-4 font-medium">{unVerifiedPhoneNumber}</p>
      </div>
      <div className="flex flex-col items-center justify-center  px-auto bg-gray-100">
      <button
        onClick={handleContinue}
        disabled={isSubmittingContinue}
        className="px-6 py-2 mb-4 bg-green-500  text-white font-semibold rounded shadow hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {isSubmittingContinue ? "Loading..." : (
          <div className="flex flex-col">
            <span>Continue by same number</span>
            <span>አይ በዚሁ ቁጥር ይቀጥል</span>
          </div>
        )}
      </button>
      <button
        onClick={handleUpdatePhone}
        disabled={isSubmittingUpdate}
        className="px-6 py-2  bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {isSubmittingUpdate ? "Loading..." : (
          <div className="flex flex-col">
            <span>No, update phone number</span>
            <span>አዎ ቀይር</span>
          </div>
        )}
      </button>
      </div>
      </div>
  );
}

export default VerificationConfirmation;
