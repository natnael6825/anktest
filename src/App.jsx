import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import routes from "@/routes";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import ProductDetail from "@/pages/productDetails";
import Posting_form from "./pages/posting_form";
import Posting_form_admin from "./pages/posting_form_admin";
import Admin from "./pages/admin";
import Viewpost from "./pages/viewPostUser";

 

import Profile from "./pages/profile";
import Otp from "./pages/otp";
import EnterName from "./pages/enterName";
import OfferDetailsTelegram from "./pages/OfferDetailsTelegram";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OfferSuccesScreen from "./pages/successPage";
import VerificationConfirmation from "./pages/verificationConfirmation";
import AdminLogin from "./pages/adminPage/adminLogin";
import AddProduct from "./pages/adminPage/addProduct";
import CreatePost from "./pages/adminPage/createPost";
import ViewPosts from "./pages/adminPage/viewPosts";
import EditPost from "./pages/adminPage/EditPost";
import AddExchangeRate from "./pages/adminPage/AddExchangeRate";
import ViewExchangeRates from "./pages/viewExchangeRates";

function App() {
  const { pathname } = useLocation();

  const navbarTextColor = pathname === "/home" ? "white" : "black";
  const navbarStyleVariant = pathname === "/home" ? "transparent" : "shadow";

  // Check if the app is loaded from Telegram safely
  const isTelegram = window.Telegram?.WebApp?.initDataUnsafe?.user;

  // Conditional Navbar Visibility
  const hideNavbarRoutes = ["/offerDetails"];
  const showNavbar = !pathname.startsWith("/offerDetails") && !isTelegram;

  return (
    <>
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
      
      {/* Conditionally Render Navbar */}
      {showNavbar && (
        <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
          <Navbar
            routes={routes}
            textColor={navbarTextColor}
            styleVariant={navbarStyleVariant}
          />
        </div>
      )}

      {/* App Routes */}
      <Routes>
        {routes.map(
          ({ path, element }, key) =>
            element && <Route key={key} exact path={path} element={element} />
        )}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/postForm" element={<Posting_form />} />
        <Route path="/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR" element={<Posting_form_admin />} />
        <Route path="/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR/login" element={<AdminLogin />} />
        <Route path="/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR/addProduct" element={<AddProduct />} />
        <Route path="/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR/createPost" element={<CreatePost />} />
        <Route path="/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR/adminLogin" element={<AdminLogin />} />
        <Route path="/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR/ViewPosts" element={<ViewPosts />} />
        <Route path="/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR/editPost/:id" element={<EditPost />} />
        <Route path="/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR/addExchangeRate" element={<AddExchangeRate />} />
        <Route path="/post" element={<Viewpost />} />
        <Route path="/exchangeRates" element={<ViewExchangeRates />} />
        <Route path="/VerificationConfirmation" element={<VerificationConfirmation />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/admin" element={<Admin />} />z
        <Route path="/name" element={<EnterName />} />
        <Route path="/offerDetails" element={<OfferDetailsTelegram />} />
        <Route path="/offerSuccess" element={<OfferSuccesScreen />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
