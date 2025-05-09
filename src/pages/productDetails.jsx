import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import NavStyle from "@/widgets/layout/nav_style";
import { Card, Typography, Button } from "@material-tailwind/react";
import { ProductCard } from "@/widgets/cards";
import { Footer } from "@/widgets/layout";
import { fetchOfferByFilterNoToken } from "@/services/userServices";
import { setSelectedOffer } from "@/store/offerSlice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { setRedirectRoute } from "@/store/routeSlice";
import { FlagIcon } from "@heroicons/react/24/solid";


export function ProductDetails() {
  // const [activeTab, setActiveTab] = useState("product");
  // const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  // const [latestBuyOffers, setLatestBuyOffers] = useState([]);
  // const [latestSellOffers, setLatestSellOffers] = useState([]);
  // const [relatedOffers, setRelatedOffers] = useState([]);
  // const [offersPerPage, setOffersPerPage] = useState(15);
  // const { id } = useParams();
  // const dispatch = useDispatch();
  // const selectedOfferFromRedux = useSelector((state) => state.offers.selectedOffer);
  // const allOffers = useSelector((state) => state.offers.allOffers);
  // const [cookies] = useCookies(["token"]); // Access cookie token
  // const navigate = useNavigate();


  // useEffect(() => {
  //   const updateOffersPerPage = () => {
  //     if (window.innerWidth < 768) {
  //       setOffersPerPage(5);
  //     } else {
  //       setOffersPerPage(15);
  //     }
  //   };
  
  //   // Set the initial value
  //   updateOffersPerPage();
  
  //   // Listen for resize events
  //   window.addEventListener("resize", updateOffersPerPage);
  
  //   // Cleanup the event listener on unmount
  //   return () => window.removeEventListener("resize", updateOffersPerPage);
  // }, []);

  // // Pagination state for Related Offers
  // const [currentPage, setCurrentPage] = useState(1);
  // const totalPages = Math.ceil(relatedOffers.length / offersPerPage);

  // // Calculate the current offers (for the grid) based on currentPage
  // const indexOfLastOffer = currentPage * offersPerPage;
  // const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  // const currentOffers = relatedOffers.slice(indexOfFirstOffer, indexOfLastOffer);

  // // --- Pagination Group Logic ---
  // let displayedPages = [];
  // if (currentPage < 3) {
  //   displayedPages = [1, 2, 3];
  // } else {
  //   displayedPages = [currentPage + 1, currentPage + 2, currentPage + 3];
  // }
  // displayedPages = displayedPages.filter((page) => page <= totalPages);

  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const selectedOffer = Array.isArray(selectedOfferFromRedux)
  //   ? selectedOfferFromRedux[0]
  //   : selectedOfferFromRedux;

  // // Determine headings and call button text based on offer type:
  // // If offer_type is "sell", show Seller Details; otherwise Buyer Details.
  // const detailsHeading =
  //   selectedOffer?.offer_type === "sell" ? "Seller Details" : "Buyer Details";
  // const callButtonText =
  //   selectedOffer?.offer_type === "sell" ? "Call Seller" : "Call Buyer";

  // const handleShowPhoneNumber = () => {
  //   if (!cookies.token) {
  //     dispatch(setRedirectRoute(window.location.pathname));
  //     navigate("/sign-in");
  //   } else {
  //     setShowPhoneNumber(true);
  //   }
  // };

  // const handlePostOfferClick = () => {
  //   const token = document.cookie.split("; ").find((row) => row.startsWith("token="));
  //   if (token) {
  //     navigate("/postForm");
  //   } else {
  //     dispatch(setRedirectRoute(window.location.pathname));
  //     navigate("/sign-in");
  //   }
  // };

  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, []);

  // const handleOfferClick = (offer) => {
  //   dispatch(setSelectedOffer(offer));
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  // useEffect(() => {
  //   const fetchRelatedOffers = async () => {
  //     try {
  //       if (selectedOffer?.product_name) {
  //         const filters = { productName: selectedOffer.product_name };
  //         const offers = await fetchOfferByFilterNoToken(filters);
  //         setRelatedOffers(offers);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching related offers:", error.message);
  //     }
  //   };

  //   fetchRelatedOffers();
  // }, [selectedOffer?.product_name]);

  // useEffect(() => {
  //   const fetchLatestSellOffers = async () => {
  //     if (selectedOffer?.product_name) {
  //       try {
  //         const filters = {
  //           productName: selectedOffer.product_name,
  //           offerType: "sell",
  //         };
  //         const offers = await fetchOfferByFilterNoToken(filters);
  //         setLatestSellOffers(offers);
  //       } catch (error) {
  //         console.error("Error fetching latest sell offers:", error.message);
  //       }
  //     }
  //   };

  //   const fetchLatestBuyOffers = async () => {
  //     if (selectedOffer?.product_name) {
  //       try {
  //         const filters = {
  //           productName: selectedOffer.product_name,
  //           offerType: "buy",
  //         };
  //         const offers = await fetchOfferByFilterNoToken(filters);
  //         setLatestBuyOffers(offers);
  //       } catch (error) {
  //         console.error("Error fetching latest buy offers:", error.message);
  //       }
  //     }
  //   };

  //   fetchLatestSellOffers();
  //   fetchLatestBuyOffers();
  // }, [selectedOffer]);

  // // Renders product or seller details based on activeTab
  // const renderContent = () => {
  //   if (activeTab === "product") {
  //     const {
  //       region,
  //       grade,
  //       class: productClass,
  //       process,
  //       brand_name,
  //       type,
  //       size,
  //       season,
  //     } = selectedOffer || {};
    
  //     const productDetails = [
  //       { label: "Region", value: region },
  //       { label: "Grade", value: grade },
  //       { label: "Class", value: productClass },
  //       { label: "Process", value: process },
  //       { label: "Brand Name", value: brand_name },
  //       { label: "Type", value: type },
  //       { label: "Size", value: size },
  //       { label: "Season", value: season },
  //     ].filter((detail) => detail.value);

      return (
        //         <div className="border-2 border-dashed border-green-500 rounded-3xl p-6 mt-4 mx-auto">
        //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700">
        //             <div>
        //               <span className="font-medium">Product Name:</span>{" "}
        //               {selectedOffer?.product_name || "N/A"}
        //             </div>
        //             <div>
        //               <span className="font-medium">I want to:</span>{" "}
        //               {selectedOffer?.offer_type || "N/A"}
        //             </div>
        //             <div>
        //               <span className="font-medium">Date of Post:</span>{" "}
        //               {new Date(selectedOffer.createdAt).toLocaleDateString("en-GB", {
        //                 day: "2-digit",
        //                 month: "short",
        //                 year: "numeric",
        //               }) || "N/A"}
        //             </div>
        //             {productDetails.map((detail, index) => (
        //               <div key={index}>
        //                 <span className="font-medium">{detail.label}:</span> {detail.value}
        //               </div>
        //             ))}
        //             <div>
        //               <span className="font-medium">Description:</span>{" "}
        //               <span className="font-semibold">
        //                 {selectedOffer?.description || "N/A"}
        //               </span>
        //             </div>
        //           </div>
        //         </div>
        //       );
        //     } else if (activeTab === "seller") {
        //       return (
        //         <div className="border-2 border-dashed border-green-500 rounded-lg p-6 mt-4 mx-auto">
        //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 text-gray-700">
        //             <div>
        //               <span className="font-medium">Seller Name:</span>{" "}
        //               {selectedOffer?.user_name}
        //             </div>
        //             <div>
        //               <span className="font-medium">Featured:</span>{" "}
        //               {selectedOffer?.is_featured ? "Yes" : "No"}
        //             </div>
        //           </div>
        //         </div>
        //       );
        //     }
        //   };

        //   // This helper renders the contact details based on conditions.
        //   // It now shows the user name without "@" and, if it's a Telegram user,
        //   // the name is a clickable Telegram link.
        //   const renderContactDetails = () => {
        //     const phone = selectedOffer?.phone_number;
        //     const userName = selectedOffer?.user_name;
        //     const isTelegramUser = userName && userName.startsWith("@");

        //     if (!phone && userName) {
        //       return (
        //         <div className="text-sm text-green-500 mt-4">
        //           Phone number not available use the link above
        //         </div>
        //       )
        //     } else if (!phone && !userName) {
        //       return (
        //         <div className="text-sm text-green-500 mt-4">
        //           Phone number not available
        //         </div>
        //       )
        //     } else {
        //       return (
        
        //         <div className="text-lg text-green-500 mt-4">
        //           {phone || "N/A"}
        //         </div>
        //       );
        //     }
    
        //   };

        //   const category = selectedOffer?.product?.name;
        //   const offersInCategory = allOffers[category] || [];

        //   return (
        //     <div>
        //       <NavStyle />
        //       <div className="bg-whiten flex flex-col lg:flex-row justify-between items-center px-4 lg:px-20 pb-5 pt-5">
        //         <div className="w-full lg:max-w-sm min-w-[200px]">
        //           <div className="relative">
        //             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        //               <i className="fa fa-search text-gray-500"></i>
        //             </span>
        //             <input
        //               type="text"
        //               className="w-full lg:w-[525px] h-[40px] bg-transparent placeholder:text-gray-500 text-gray-800 text-lg font-roboto border border-gray-400 rounded-md pl-10 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        //               placeholder="Search Commodities"
        //             />
        //           </div>
        //         </div>
        //         <div
        //           className="mt-4 lg:mt-0 w-[138px] h-[42px] rounded-lg bg-[#5EB562] items-center justify-center flex text-white"
        //           onClick={handlePostOfferClick}
        //           role="button"
        //         >
        //           Post Offer
        //         </div>
        //       </div>
        //       <div className="flex justify-center items-center mb-14">
        //         <div className="w-full max-w-7xl bg-white rounded-lg">
        //           <div className="flex flex-col lg:flex-row justify-between px-4 lg:px-10 space-y-6 lg:space-y-0 bg-white pt-10 pb-5">
        //             <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        //               <div className="w-full lg:w-[330px] h-[285px] ">
        //                 <img
        //                   src={selectedOffer?.product?.picture_link || "/default-image.jpg"}
        //                   alt={selectedOffer?.product_name || "Product"}
        //                   className="rounded-lg shadow-lg w-full h-full object-cover"
        //                 />
        //               </div>
        //               <div className="flex flex-col">
        //                 <h1 className="text-gray-600 mb-4 font-light font-roboto text-sm lg:text-base">
        //                   Posting date:{" "}
        //                   {new Date(selectedOffer.createdAt).toLocaleDateString("en-GB", {
        //                     day: "2-digit",
        //                     month: "short",
        //                     year: "numeric",
        //                   }) || "N/A"}
        //                 </h1>
        //                 <h1 className="text-2xl lg:text-3xl font-roboto mb-4">
        //                   {selectedOffer?.product_name || "N/A"}
        //                 </h1>
        //                 <p className="text-lg lg:text-xl font-bold ">
        //                   Quantity available: {selectedOffer?.quantity || "Not Specified"}
        //                   <span className="font-roboto font-light text-sm"> {selectedOffer?.measurement}</span>
        //                 </p>
        //                 <div className="flex flex-col lg:flex-row w-full lg:w-[554px] h-auto lg:h-[39px] mt-6 lg:mt-14 justify-between space-y-4 lg:space-y-0">
        //                   {selectedOffer?.featured && (
        //                     <span className="w-full lg:w-[163px] bg-green-500 text-white flex items-center justify-center text-lg font-light">
        //                       Featured
        //                     </span>
        //                   )}
        //                 </div>
        //               </div>
        //             </div>
        //             {/* Contact Details Card */}
        //             <div className="p-8 lg:mt-0 w-full lg:w-[250px] h-auto border flex items-center flex-col border-gray-300 rounded-lg shadow-lg">
        //               <h2 className="text-xl font-light mb-4">{detailsHeading}</h2>
        //               <div className="items-center justify-center flex-col flex mb-4">
        //                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-4">
        //                   <i className="fa fa-phone text-green-500 text-xl"></i>
        //                 </div>
        //                 <div>
        //                   {selectedOffer?.user_name && selectedOffer.user_name.startsWith("@") ? (
        //                     showPhoneNumber ? (
        //                       <a
        //                         href={`https://t.me/${selectedOffer.user_name.substring(1)}`}
        //                         target="_blank"
        //                         rel="noopener noreferrer"
        //                         className="font-medium mb-2 text-blue-500 underline"
        //                       >
        //                         {selectedOffer.user_name.substring(1)}
        //                       </a>
        //                     ) : (
        //                       <span className="font-medium mb-2">
        //                         {selectedOffer.user_name.substring(1)}
        //                       </span>
        //                     )
        //                   ) : (
        //                     <span className="font-medium mb-2">
        //                       {selectedOffer?.user_name || "N/A"}
        //                     </span>
        //                   )}
        //                 </div>
        //                 {/* Render contact details based on conditions */}
        //                 {showPhoneNumber ? (
        //                   renderContactDetails()
        //                 ) : (
        //                   <button
        //                     className="w-full bg-transparent text-[#5EB562] p-2 rounded-lg border border-[#5EB562] mt-5"
        //                     onClick={handleShowPhoneNumber}
        //                   >
        //                     {callButtonText}
        //                   </button>
        //                 )}
        //               </div>
        //             </div>
        //           </div>

        //           <div className="px-4 lg:px-10 pt-8">
        //             <div className="flex justify-start space-x-4 pb-2">
        //               <button
        //                 className={`py-2 px-4 ${
        //                   activeTab === "product"
        //                     ? "border-b-2 border-green-500 text-green-500"
        //                     : "text-gray-600"
        //                 }`}
        //                 onClick={() => setActiveTab("product")}
        //               >
        //                 Product Details
        //               </button>
        //               <button
        //                 className={`py-2 px-4 ${
        //                   activeTab === "seller"
        //                     ? "border-b-2 border-green-500 text-green-500"
        //                     : "text-gray-600"
        //                 }`}
        //                 onClick={() => setActiveTab("seller")}
        //               >
        //                 Seller Details
        //               </button>
        //             </div>
        //             {renderContent()}
        //           </div>

        //           {/* Related Offers Header */}
        //           <div className=" lg:block mt-10 font-roboto text-3xl font-semibold">
        //             Related Offers
        //           </div>

        //           {/* Offers Grid: show only the offers for the current page */}
        //           <div className=" lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        //             {currentOffers.map((offer) => (
        //               <Link
        //                 key={offer.id}
        //                 to={`/product/${offer.id}`}
        //                 onClick={() => handleOfferClick(offer)}
        //                 className="border rounded-lg shadow-md p-4 bg-white block"
        //               >
        //                 <div className="relative h-40 overflow-hidden rounded-t-lg">
        //                   <img
        //                     className="w-full h-full object-cover"
        //                     src={offer.product.picture_link || "/img/default-placeholder.png"}
        //                     alt={offer.product_name}
        //                   />
        //                 </div>
        //                 <div className="px-4 py-4">
        //                   <h3 className="text-lg font-roboto font-semibold text-gray-900">
        //                     {offer.product_name}
        //                   </h3>
        //                   <p className="text-base font-roboto text-gray-500">
        //                     <span className="font-semibold">I want to:</span> {offer.offer_type}
        //                   </p>
        //                   <p className="text-base font-roboto text-gray-500">
        //                     <span className="font-semibold">Posted by:</span> {offer.user_name}
        //                   </p>
        //                   <p className="text-base font-roboto text-gray-500">
        //                     <span className="font-semibold">Quantity:</span>{" "}
        //                     {offer.quantity ? offer.quantity : "Not specified"}
        //                   </p>
        //                   <p className="text-base font-roboto text-gray-500">
        //                     <span className="font-semibold">Post date:</span>{" "}
        //                     {new Date(offer.createdAt).toLocaleDateString()}
        //                   </p>
        //                 </div>
        //               </Link>
        //             ))}
        //           </div>

        //           {/* Pagination Controls */}
        //           <div className="flex justify-center mt-6 lg:space-x-2 space-x-1 overflow-x-auto">
        //             <Button
        //               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        //               disabled={currentPage === 1}
        //               className="lg:px-4 lg:py-2 text-sm px-2 py-1"
        //               color={currentPage === 1 ? "gray" : "green"}
        //             >
        //               Previous
        //             </Button>

        //             {displayedPages.map((page) => (
        //               <Button
        //                 key={page}
        //                 onClick={() => setCurrentPage(page)}
        //                 className=" lg:px-4 lg:py-2 text-sm px-2 py-1"
        //                 color={currentPage === page ? "green" : "gray"}
        //               >
        //                 {page}
        //               </Button>
        //             ))}

        //             {displayedPages.length > 0 &&
        //               displayedPages[displayedPages.length - 1] < totalPages && (
        //                 <>
        //                   <span className="px-2 py-2">...</span>
        //                   <Button
        //                     onClick={() => setCurrentPage(totalPages)}
        //                     className=" lg:px-4 lg:py-2 text-sm px-2 py-1"
        //                     color={currentPage === totalPages ? "green" : "gray"}
        //                   >
        //                     {totalPages}
        //                   </Button>
        //                 </>
        //               )}

        //             <Button
        //               onClick={handleNextPage}
        //               disabled={currentPage === totalPages}
        //               className=" lg:px-4 lg:py-2 text-sm px-2 py-1"
        //               color={currentPage === totalPages ? "gray" : "green"}
        //             >
        //               Next
        //             </Button>
        //           </div>

        //         </div>
        //       </div>
        //       <Footer />
        //     </div>


        <div className="h-screen mx-auto grid place-items-center text-center px-8">
          <div>
            <FlagIcon className="w-20 h-20 mx-auto" />
            <Typography
              variant="h1"
              color="blue-gray"
              className="mt-10 !text-3xl !leading-snug md:!text-4xl"
            >
              404 Page not Found <br />
            </Typography>
            <Typography className="mt-8 mb-14 text-[25px] font-normal text-gray-500 mx-auto md:max-w-sm">
              
            </Typography>
            
          </div>
        </div>
      );
    }
  
export default ProductDetails;

