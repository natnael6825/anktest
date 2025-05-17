import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import NavStyle from "@/widgets/layout/nav_style";
import { Card, Typography, Button } from "@material-tailwind/react";
import { ProductCard } from "@/widgets/cards";
import { Footer } from "@/widgets/layout";
import { fetchOfferByFilterNoToken, fetchUser } from "@/services/userServices";
import { setSelectedOffer } from "@/store/offerSlice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { setRedirectRoute } from "@/store/routeSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img1 from "@/assets/Img2.jpg";
import TelegramNavbar from "@/widgets/layout/telegramNavbar";
import { createInteraction } from "@/services/productServices";

function OfferDetailsTelegram() {
  const [activeTab, setActiveTab] = useState("product");
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [latestBuyOffers, setLatestBuyOffers] = useState([]);
  const [latestSellOffers, setLatestSellOffers] = useState([]);
  const [relatedOffers, setRelatedOffers] = useState([]);
  const [offersPerPage, setOffersPerPage] = useState(15);
  const [sellerBusiness, setSellerBusiness] = useState(15);
  const [chatId, setChatId] = useState("499416454");
  const [isVerified, setIsVerified] = useState(false);
  const [loadedFromTelegram, setLoadedFromTelegram] = useState(false); // tracks Telegram launch
  const dispatch = useDispatch();
  const selectedOfferFromRedux = useSelector((state) => state.offers.selectedOffer);
  const allOffers = useSelector((state) => state.offers.allOffers);
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
const   [id , setId] = useState(null)
const [paramCategory , setCategory] = useState("")
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");

  const selectedOffer = Array.isArray(selectedOfferFromRedux)
    ? selectedOfferFromRedux[0]
    : selectedOfferFromRedux;

    useEffect(() => {
      const param = searchParams.get('tgWebAppStartParam');
      console.log(param); // e.g. "5110-CoffeeAndMainCommodities"
      if (param) {
        // Split by the first hyphen
        const parts = param.split('-');
        // The id is the first part
        setId(parts[0]);
        // The category is everything after the first hyphen (in case there are additional hyphens)
        if (parts.length > 1) {
          setCategory(parts.slice(1).join('-'));
        } else {
          setCategory("");
        }
      }
    }, [searchParams]);
    
  // Determine headings based on offer type:
  const detailsHeading =
    selectedOffer?.offer_type === "sell" ? "Seller Details / የሻጩ መረጃ" : "Buyer Details / የገዢ መረጃ";
  const callButtonText =
    selectedOffer?.offer_type === "sell" ? "Call Seller / ስልኩን ያውጡ" : "Call Buyer / ስልኩን ያውጡ";
  // Seller chat ID from fetched offer details
  const sellerChatId = selectedOffer?.chat_id;
  const sellerPhoneNumber = selectedOffer?.phone_number;
  

  // Fetch offer details
  useEffect(() => {

    const fetchOfferDetails = async () => {
      console.log("TTTTTTTTTTTTTTTTTTTTTTTTT")
console.log(id , paramCategory)
      try {
        const filters = { offerId: id, category: paramCategory };
        const response = await fetchOfferByFilterNoToken(filters);



        if (response && Array.isArray(response) && response.length > 0) {
          dispatch(setSelectedOffer(response[0]));
        } else {
          console.error("No offer found for the given id and category");
        }
      } catch (error) {
        console.error("Error fetching offer details:", error.message);
      }
    };

    if (id && paramCategory) {
      console.log("RRRRRRRRRRRRRRRRRRRR")
      console.log(id , paramCategory)
      fetchOfferDetails();
    }
  }, [id, category, dispatch]);

  // Check verification for seller using sellerChatId
  useEffect(() => {
    const handleIsVerified = async () => {
      try {
        if (sellerChatId) {
          const response = await fetchUser({ chat_id: sellerChatId });
          if (response.data.user && response.data.user.is_verified === "1") {
            setIsVerified(true);
            setSellerBusiness(response.data.user.business_type)
          } else {
            setIsVerified(false);
          }
        } else if(sellerPhoneNumber) {
          const response = await fetchUser({ contact_information: sellerPhoneNumber });
          if (response.data.exists === true && response.data.user && response.data.user.is_verified === "1") {
            setIsVerified(true);
          } else {
            setIsVerified(false);
          }
        }
      } catch (error) {
        console.error("Error checking for verification:", error);
        setIsVerified(false);
      }
    };  
    handleIsVerified();
  }, [sellerChatId, sellerPhoneNumber]);
  

  useEffect(() => {
    if (activeTab === "seller" && chatId) {
      const checkUserSignIn = async () => {
        try {
          const response = await fetchUser({ chat_id: chatId });
          if (response.data.exists === true && response.data.user.is_verified === "1") {
            setShowPhoneNumber(true);
            

            if (sellerPhoneNumber || sellerChatId) {
              const sellerData = await fetchUser(
                sellerChatId
                  ? { chat_id: sellerChatId }
                  : { contact_information: sellerPhoneNumber }
              );

              if (sellerData?.data?.user) {
                try {
                  await createInteraction(
                    selectedOffer?.category,
                    sellerData.data.user.name,
                    sellerData.data.user.contact_information,
                    sellerData.data.user.business_type,
                    sellerData.data.user.chat_id,
                    response.data.user.name,
                    response.data.user.contact_information,
                    response.data.user.business_type,
                    response.data.user.chat_id,
                    selectedOffer?.id
                  );
                } catch (error) {
                  console.error("error creating interaction" , error)
                }
              }
            } else {
              try {
              await createInteraction(
                selectedOffer?.category ?? null,
                selectedOffer?.user_name ?? null,
                selectedOffer?.phone_number ?? null,
                null,
                null,
                response.data.user.name ?? null,
                response.data.user.contact_information ?? null,
                response.data.user.business_type ?? null,
                response.data.user.chat_id ?? null,
                selectedOffer?.id 
              );
            } catch (error) {
              // Silently handle the 409 error
              if (error?.response?.status === 409) {
                // Do nothing when viewing own offer
              }
              }
            }
          } else if (response.data.exists === true && response.data.user.is_verified === "0") {
            dispatch(setRedirectRoute(window.location.pathname));
            sessionStorage.setItem("unVerifiedPhoneNumber", response.data.user.contact_information);
            navigate("/VerificationConfirmation");
          } else {
            dispatch(setRedirectRoute(window.location.pathname));
            navigate("/sign-in");
          }
        } catch (error) {
          console.error("Error checking user sign in:", error);
        }
      };
      checkUserSignIn();
    }
  }, [activeTab, chatId, dispatch, navigate]);
  

  // Existing handler for product tab (if needed)
  const handleShowPhoneNumber = async () => {
    try {
      if (!chatId) {
        dispatch(setRedirectRoute(window.location.pathname));
        navigate("/sign-in");
        return;
      }
      const response = await fetchUser({ chat_id: chatId });
      if (response.data.exists === true && response.data.user.is_verified === "1") {
        setShowPhoneNumber(true);
        // Fetch seller data using the actual seller's chat ID or phone number
        
        if (sellerPhoneNumber || sellerChatId) {
          const sellerData = await fetchUser(
            sellerChatId
              ? { chat_id: sellerChatId }
              : { contact_information: sellerPhoneNumber }
          );

          if (sellerData?.data?.user) {
            try {
              await createInteraction(
                selectedOffer?.category,
                sellerData.data.user.name,
                sellerData.data.user.contact_information,
                sellerData.data.user.business_type,
                sellerData.data.user.chat_id,
                response.data.user.name,
                response.data.user.contact_information,
                response.data.user.business_type,
                response.data.user.chat_id,
                selectedOffer?.id
              );
            } catch (error) {
              console.error("Error creating interaction")
            }
          }
        } else {
          try {
          await createInteraction(
            selectedOffer?.category ?? null,
            selectedOffer?.user_name ?? null,
            selectedOffer?.phone_number ?? null,
             null,
             null,
            response.data.user.name ?? null,
            response.data.user.contact_information ?? null,
            response.data.user.business_type ?? null,
            response.data.user.chat_id ?? null,
            selectedOffer?.id
          );
          } catch (error) {
            
          
            console.error("Error creating interaction" )
          
          }
        }
      } else if (response.data.exists === true && response.data.user.is_verified === "0") {
        dispatch(setRedirectRoute(window.location.pathname));
        sessionStorage.setItem("unVerifiedPhoneNumber", response.data.user.contact_information);
        navigate("/VerificationConfirmation");
        return;
      } else {
        dispatch(setRedirectRoute(window.location.pathname));
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Error checking user registration:", error);
      toast.error("An error occurred while checking your registration.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true, 
        progress: undefined,
      });
    }
  };

  // Retrieve Telegram user data
  useEffect(() => {
    if (Object.keys(window.Telegram.WebApp.initDataUnsafe).length !== 0) {
      const { user } = window.Telegram.WebApp.initDataUnsafe;
      if (user) {
        const { id, first_name, last_name, username, language_code } = user;
        setChatId(id);
        setLoadedFromTelegram(true);
      }
    }
  }, []);

  // Render product or seller details based on activeTab
  const renderContent = () => {
    if (activeTab === "product") {
      const { region, grade, class: productClass,item_status, process, brand_name, type, size, season } = selectedOffer || {};
      const productDetails = [
        { label: "Region", value: region },
        { label: "Grade", value: grade },
        { label: "Class", value: productClass },
        { label: "Process", value: process },
        { label: "Brand Name", value: brand_name },
        { label: "Type", value: type },
        { label: "Size", value: size },
        { label: "Season", value: season },
        { label: "Item Status", value: item_status },
      ].filter((detail) => detail.value);

      return (
        <div className="border-2 border-dashed border-green-500 rounded-lg p-6 mt-4 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700">
            <div>
              <span className="font-medium">Product Name / የምርት ስም:</span> {selectedOffer?.product_name || "N/A"}
            </div>
            <div>
              <span className="font-medium">I want to:</span> {selectedOffer?.offer_type || "N/A"}
            </div>
            <div>
              <span className="font-medium">Date of Post / ቀን:</span>{" "}
              {new Date(selectedOffer?.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }) || "N/A"}
            </div>
            {productDetails.map((detail, index) => (
              <div key={index}>
                <span className="font-medium">{detail.label}:</span> {detail.value}
              </div>
            ))}
            <div>
              <span className="font-medium">Quantity / መጠን:</span>{" "}
              <span className="">{selectedOffer?.quantity || "N/A"} <span className="font-light text-sm">{selectedOffer?.measurement || "N/A"}</span></span>
              <br/><br/>
              <span className="font-medium">Description / ተጨማሪ መረጃ:</span>{" "}
              <span className="font-semibold">{selectedOffer?.description || "N/A"}</span>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === "seller") {
      return (
        <div className="border-2 border-dashed border-green-500 rounded-lg p-6 mt-4 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 text-gray-700">
          <span className={`px-2 py-1 rounded text-white mx-auto ${isVerified ? "bg-green-500" : "bg-[#f09500]"}`}>
            Phone Number {isVerified ? "Verified" : "Not Verified"}
          </span>
          <div>
          <span className="font-medium">Seller Name:</span>{" "}
          {selectedOffer?.user_name && selectedOffer.user_name.startsWith("@") ? (
            showPhoneNumber ? (
              <a
                href={`https://t.me/${selectedOffer.user_name.substring(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium mb-2 text-blue-500 underline"
              >
                {selectedOffer.user_name.substring(1)}
              </a>
            ) : (
              <span className="font-medium mb-2">
                {selectedOffer.user_name.substring(1)}
              </span>
            )
          ) : (
            <span className="font-medium mb-2">
              {selectedOffer?.user_name || "N/A"}
            </span>
          )}
        </div>
            <div>
              <span className="font-medium">Phone Number:</span>{" "}
              {selectedOffer?.phone_number ? (
            showPhoneNumber ? (
              <span>{selectedOffer.phone_number}</span>
            ) : (
              "Hidden"
            )
          ) : (
            renderContactDetails()
          )}
            </div>
     
          </div>
        </div>
      );
    }
  };

  const renderContactDetails = () => {
    const phone = selectedOffer?.phone_number;
    const userName = selectedOffer?.user_name;
    const isTelegramUser = userName && userName.startsWith("@");

    if (!phone && userName) {
      return (
        <div className="text-sm text-green-500 mt-4">
          Phone number not available use the link above / ስልክ ቁጥሩ አልተገኘም። የላይኛውን ማስፈንጠሪይስ ይጠቀሙ።
        </div>
      )
    } else if (!phone && !userName) {
      return (
        <div className="text-sm text-green-500 mt-4">
          Phone number not available / ስልክ ቁጥሩ አልተገኘም።
        </div>
      )
    } else {
      return (

        <div className="text-lg text-green-500 mt-4">
          {phone || "N/A"}
        </div>
      );
    }

  };


  const productName = selectedOffer?.product?.name;
  const offersInProduct = allOffers[productName] || [];

  return (
    <div className="bg-white h-screen w-full ">
      <TelegramNavbar />
      <div className="bg-white flex flex-col lg:flex-row justify-between items-center px-7 lg:px-20 mt-5">
        <div className="w-full max-w-7xl bg-white rounded-lg">
          <div className="flex flex-col lg:flex-row justify-between px-4 lg:px-10 space-y-6 lg:space-y-0 bg-white pb-5">
            <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
              <div className="w-full lg:w-[330px] flex items-end space-y-7 flex-col">
                <img
                  src={selectedOffer?.product?.picture_link || "/default-image.jpg"}
                  alt={selectedOffer?.product_name || "Product"}
                  className="rounded-lg shadow-lg w-full object-cover h-[130px]"
                />
              </div>
            </div>
          </div>
          <div className="px-4">
            <div className="flex justify-start space-x-4 pb-2">
              <button
                className={`py-2 px-4 ${
                  activeTab === "product"
                    ? "border-b-2 border-green-500 text-green-500"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("product")}
              >
                Product Details / የምርት መረጃ
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === "seller"
                    ? "border-b-2 border-green-500 text-green-500"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("seller")}
              >
                {detailsHeading}
              </button>
            </div>
            {renderContent()}
          </div>
          <div className="flex items-center justify-center">
          {/* Only render the contact details section when NOT in the seller tab */}
          {activeTab !== "seller" && (
            <div className="p-2 mt-4 w-full h-fit max-w-xs border flex flex-col items-center border-gray-300 rounded-lg shadow-lg">
              <h2 className="text-sm font-light mb-3">{detailsHeading}</h2>
              <div>
              <span className={`px-2 py-1 mx-auto rounded text-white ${isVerified ? "bg-green-500" : "bg-[#f09500]"}`}>
              Phone Number {isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          <div className="mt-3">
                      {selectedOffer?.user_name && selectedOffer.user_name.startsWith("@") ? (
                            showPhoneNumber ? (
                              <a
                                href={`https://t.me/${selectedOffer.user_name.substring(1)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium mb-2 text-blue-500 underline"
                              >
                                {selectedOffer.user_name.substring(1)}
                              </a>
                            ) : (
                              <span className="font-medium mb-2">
                                {selectedOffer.user_name.substring(1)}
                              </span>
                            )
                          ) : (
                            <span className="font-medium mb-2">
                              {selectedOffer?.user_name || "N/A"}
                            </span>
                          )}
                        </div>
                        {/* Render contact details based on conditions */}
                        {showPhoneNumber ? (
                          renderContactDetails()
                        ) : (
                          <button
                            className="w-full bg-transparent text-[#5EB562] p-2 rounded-lg border border-[#5EB562] mt-5"
                            onClick={handleShowPhoneNumber}
                          >
                            {callButtonText}
                          </button>
                        )}

          </div>
        )}

        </div>
      </div>
    </div></div>
  );
}

export default OfferDetailsTelegram;
