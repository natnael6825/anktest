import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store/userSlice';
import { clearRedirectRoute } from '@/store/routeSlice';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { verifyOtp, getOtp } from '@/services/userServices';
import NavStyle from "@/widgets/layout/nav_style";
import { Footer } from '@/widgets/layout';
import { PencilIcon } from "@heroicons/react/24/outline";

function Otp() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loadedFromTelegram, setLoadedFromTelegram] = useState(false);
  const [chatId, setChatId] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(120);
  const [errorMessage, setErrorMessage] = useState("");
  const [attempts, setAttempts] = useState(0); // new state for tracking attempts
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redirectRoute = useSelector((state) => state.route.redirectRoute);

  // Auto-focus the first OTP input when the component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    // Check if launched via Telegram
    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      Object.keys(window.Telegram.WebApp.initDataUnsafe).length !== 0
    ) {
      const { user } = window.Telegram.WebApp.initDataUnsafe;
      if (user) {
        const { id, first_name, last_name } = user;
        setChatId(id);
        setFullName(`${first_name} ${last_name}`);
        setLoadedFromTelegram(true);
      }
    }
  }, []);

  // Prevent focusing on later inputs if previous ones are empty
  const handleInputFocus = (index) => {
    for (let i = 0; i < index; i++) {
      if (!otp[i]) {
        inputRefs.current[i].focus();
        return;
      }
    }
  };

  const handleOtpChange = (index, event) => {
    const value = event.target.value;
    // Only keep the first character
    const digit = value.charAt(0) || "";
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    // If a digit is entered and it's not the last field,
    // move focus to the next field after a tiny delay.
    if (digit && index < otp.length - 1) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };
    
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const phoneNumber = sessionStorage.getItem("phoneNumber");
  const verificationId = sessionStorage.getItem("verificationId");
  const isUpdatePhone = sessionStorage.getItem("isUpdatePhone");
  const oldPhoneNumber = sessionStorage.getItem("oldNumber");

  const handleSendOtp = async () => {
    // Prevent further attempts if maximum reached
    if (attempts >= 5) {
      setErrorMessage("Maximum attempts reached. Please try again later.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const response = await verifyOtp(
        phoneNumber,
        otp.join(""),
        verificationId,
        chatId,
        isUpdatePhone,
        oldPhoneNumber
      );
      setErrorMessage("");

      Cookies.set("token", response.token, { expires: 7 });
      dispatch(setUser(response.user));
      localStorage.setItem("userRole", response.user.role);

      if (response.user.role === "admin") {
        navigate("/postFormAdmin");
        window.location.reload();
        return;
      }

      if (chatId && !response.user.name) {
        navigate("/name");
      } else if (chatId && response.user.name) {
        const destination = redirectRoute || "/home";
        dispatch(clearRedirectRoute());
        navigate(destination);
        window.location.reload();
      } else {
        if (!response.user.name) {
          navigate("/name");
        } else {
          const destination = redirectRoute || "/home";
          dispatch(clearRedirectRoute());
          navigate(destination);
          window.location.reload();
        }
      }
    } catch (error) {
      // Increment attempts on failure
      setAttempts((prev) => prev + 1);
      // If this was the 5th attempt, set a special error message.
      if (attempts + 1 >= 5) {
        setErrorMessage("Maximum attempts reached. Please try again later.");
      } else {
        setErrorMessage(
          error.response?.data?.message || "Incorrect OTP, please try again."
        );
      }
      console.error("Error verifying OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setTimer(120); // Reset timer to 2 minutes
    try {
      await getOtp(phoneNumber, chatId);
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className='bg-white'>
      {!loadedFromTelegram && <NavStyle />}
      <div className='flex items-center justify-center mb-10 bg-white'>
        <div className='flex flex-col items-center justify-center mx-auto h-[500px] w-[529px] p-6 rounded-lg'>
          <h2 className='text-xl font-bold mt-20 font-roboto'>Enter OTP / ማረጋገጫ ቁጥር ያስገቡ</h2>
          <h3 className='mt-4 text-gray-400 font-roboto'>
            OTP is sent on number / ማረጋገጫ ቁጥር ተልኳል:
          </h3>
          <div className='flex items-center mt-4 mb-4'>
            <p className='font-roboto'>{phoneNumber}</p>
            <PencilIcon
              onClick={() => navigate('/sign-in')}
              className='w-5 h-5 ml-2 text-green-500 cursor-pointer hover:text-gray-600'
            />
          </div>
          <div className='flex gap-2 mb-4'>
            {otp.map((digit, index) => (
              <div key={index} className='flex flex-col items-center'>
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => handleInputFocus(index)}
                  maxLength={1}
                  className="w-10 h-10 text-center border-b-2 border-gray-400 focus:outline-none bg-transparent text-lg"
                  disabled={attempts >= 5} // optionally disable input fields too
                />
              </div>
            ))}
          </div>
          {errorMessage && (
            <div className="text-red-500 mb-2">
              {errorMessage}
            </div>
          )}
          <button
            onClick={handleSendOtp}
            disabled={isSubmitting || attempts >= 5}
            className='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mb-4 mt-10'
          >
            {isSubmitting ? "Loading..." : "Verify / ይቀጥሉ"}
          </button>
          <p className='text-sm text-gray-600 mt-5'>
            Didn't get OTP? / ማረጋገጫ ቁጥር አልደረስዎም? እንደገና ላክ{" "}
            <span
              className={`cursor-pointer ${
                timer === 0 ? 'text-blue-500 hover:underline' : 'text-gray-400 cursor-not-allowed'
              }`}
              onClick={timer === 0 ? handleResendOtp : null}
            >
              {timer === 0 ? "Resend" : `Resend in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`}
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Otp;
