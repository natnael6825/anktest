import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import NavStyle from "@/widgets/layout/nav_style";
import { Footer } from "@/widgets/layout";
import { getOtp } from "@/services/userServices";
import { toast } from "react-toastify";
import TermAndCondition from "./termAndCondition";

const COUNTRIES = ["Ethiopia(+251)"];
const CODES = ["+251"];

export function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState(0);
  const [error, setError] = useState("");
  const [loadedFromTelegram, setLoadedFromTelegram] = useState(false);
  const [chatId, setChatId] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false); // Modal state

  useEffect(() => {
    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      Object.keys(window.Telegram.WebApp.initDataUnsafe).length !== 0
    ) {
      const { user } = window.Telegram.WebApp.initDataUnsafe;
      if (user) {
        setChatId(user.id);
        setLoadedFromTelegram(true);
      }
    }
  }, []);

  useEffect(() => {
    toast.error("Please enter your phone number to continue.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validatePhoneNumber = (phone) => {
    if (phone.startsWith("0")) {
      setError("Please remove the leading 0 from your phone number.");
      return false;
    }
    const regex = /^[79][0-9]{8}$/;
    if (!regex.test(phone)) {
      setError(
        "Invalid phone number. It must start with 7 or 9 and be 9 digits long."
      );
      return false;
    }
    setError("");
    return true;
  };

  const handleSignin = async () => {
    if (!validatePhoneNumber(form.phoneNumber)) {
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhoneNumber = `0${form.phoneNumber}`;
      sessionStorage.setItem("phoneNumber", formattedPhoneNumber);
      const response = await getOtp(formattedPhoneNumber, chatId);
      sessionStorage.setItem("verificationId", response.verificationId);
      
      navigate("/otp");
      // window.location.reload();
    } catch (error) {
      console.error("Error during sign-in:", error);
      const errorMessage =
      error.response?.data?.message ||
      "Failed to send OTP. Please try again.";
      setError(errorMessage );
    }
 finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-white">
      {!loadedFromTelegram && <NavStyle />}

      <section className="m-8 flex gap-4 bg-white">
        <div className="w-2/5 h-full hidden lg:flex flex-col justify-center items-start rounded-3xl pt-40">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Welcome Back!</h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Sign in to access your account and continue your journey with us.
            We're excited to have you here!
          </p>
        </div>

        <div className="w-full lg:w-3/5 mt-24">
          <div className="text-center hidden sm:block">
            <Typography variant="h2" className="font-bold mb-4">
              Sign In
            </Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your Phone Number / እባኮትን ስልክ ቁጥር ያስገቡ 
              </Typography>
              <div className="relative flex w-full">
                <Menu placement="bottom-start">
                  <MenuHandler>
                    <Button
                      ripple={false}
                      variant="text"
                      color="blue-gray"
                      className="h-10 w-14 shrink-0 rounded-r-none border border-r-0 border-blue-gray-200 bg-transparent px-3"
                    >
                      {CODES[country]}
                    </Button>
                  </MenuHandler>
                  <MenuList className="max-h-[20rem] max-w-[18rem]">
                    {COUNTRIES.map((country, index) => (
                      <MenuItem key={country} value={country} onClick={() => setCountry(index)}>
                        {country}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Input
                  value={form.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="912-345-678"
                  className="appearance-none rounded-l-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  containerProps={{ className: "min-w-0" }}
                />
              </div>
              {error && (
                <Typography variant="small" color="red" className="mt-1 font-medium">
                  {error}
                </Typography>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="terms-checkbox"
                className="w-4 h-4"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="terms-checkbox" className="text-blue-gray-500 font-medium">
                By checking this box you agree to / ከጎን ያለውን በመንካት ውልና ሁኔታዎችን ይቀበሉ።{" "}
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(true)}
                  className="text-green-600 underline"
                >
                  Ankuaru's Terms and Conditions
                </button>
              </label>
            </div>

            <Button
              className="mt-6 bg-green-600"
              fullWidth
              onClick={handleSignin}
              disabled={isLoading || !isChecked}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>
      </section>

      <div className="bg-white pt-40">
        {!loadedFromTelegram && <Footer />}

      </div>

      {/* Modal Popup for Terms and Conditions */}
      <Dialog open={isTermsOpen} handler={() => setIsTermsOpen(false)} size="lg">
        <DialogHeader>Terms and Conditions</DialogHeader>
        <DialogBody className="max-h-[70vh] overflow-auto">
          <TermAndCondition />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setIsTermsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default SignIn;
