// enterName.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavStyle from "@/widgets/layout/nav_style";
import { Footer } from "@/widgets/layout";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { updateUser } from "@/services/userServices";
import { clearRedirectRoute } from "@/store/routeSlice";

function EnterName() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const redirectRoute = useSelector((state) => state.route.redirectRoute);
  const [form, setForm] = useState({
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
   const [loadedFromTelegram, setLoadedFromTelegram] = useState(false);
    const [chatId, setChatId] = useState("");

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
          setLoadedFromTelegram(true);
        }
      }
   }, []);
  
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    // Validation: Reject names containing numbers or '@'
    if (/\d/.test(form.fullName) || form.fullName.includes("@")) {
      setError("Name cannot contain numbers or the '@' symbol.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Retrieve token and user info from cookies.
      const token = Cookies.get("token");
      const user = JSON.parse(Cookies.get("user") || "{}");

      if (!token) {
        throw new Error("User token is missing. Please log in again.");
      }

      if (chatId) {
        const response = await updateUser(form.fullName);

        if (response && response.message === "User updated successfully.") {
          // Update the user object in cookies.
          user.name = form.fullName;
          Cookies.set("user", JSON.stringify(user), { expires: 7 });
  
        
          // Redirect to the stored redirect route (or default to "/home").
          const destination = redirectRoute || "/home";
          dispatch(clearRedirectRoute());
          navigate(destination);
          window.location.reload();
        } else {
          throw new Error(response?.message || "Failed to update user.");
        }  
      }
      // Update the user's name.
      const response = await updateUser(form.fullName);

      if (response && response.message === "User updated successfully.") {
        // Update the user object in cookies.
        user.name = form.fullName;
        Cookies.set("user", JSON.stringify(user), { expires: 7 });

      
        // Redirect to the stored redirect route (or default to "/home").
        const destination = redirectRoute || "/home";
        dispatch(clearRedirectRoute());
        navigate(destination);
        window.location.reload();
      } else {
        throw new Error(response?.message || "Failed to update user.");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message || "Failed to save your name. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavStyle />
      <div className="flex items-center justify-center mb-10">
        <div className="flex flex-col items-center justify-center mx-auto h-[500px] w-[529px] p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mt-10 font-roboto">Enter your name</h2>
          <div className="flex flex-col gap-2 mb-4 w-full mt-4">
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <button
            onClick={handleSubmit}
            className={`bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mb-4 mt-10 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit name"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EnterName;
