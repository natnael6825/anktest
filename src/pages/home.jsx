import React, { useState, useEffect } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { Footer } from "@/widgets/layout";
import { InfoCard, ProductCard } from "@/widgets/cards";
import PlatformStats from "@/data/platformStats";
import { getCategories } from "@/services/productServices";
import { fetchOfferByFilterNoToken } from "@/services/userServices";
import { useDispatch } from "react-redux";
import { setSelectedOffer } from "@/store/offerSlice";
import { Link, useNavigate } from "react-router-dom";
import { subscribeToNewOffers, unsubscribeFromNewOffers } from "@/services/socket";
import { setRedirectRoute } from "@/store/routeSlice";

import { FlagIcon } from "@heroicons/react/24/solid";



export function Home() {
  const [categoriesData, setCategoriesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryNames, setCategoryNames] = useState([]);
  const [platformStats, setPlatformStats] = useState([
    {
      title: "TOTAL REGISTERED USERS",
      count: "Loading ...",
      icon: "/img/usericon.png",
      bgColor: "bg-white-500",
    },
    {
      title: "BUY OFFERS",
      count: "Loading ...",
      icon: "/img/buy_offer.png",
      bgColor: "bg-white-500",
    },
    {
      title: "SELL OFFERS",
      count: "Loading ...",
      icon: "/img/sell_offer.png",
      bgColor: "bg-white-500",
    },
    {
      title: "B2B INTERACTIONS",
      count: "Loading ...",
      icon: "/img/b2b.png",
      bgColor: "bg-white-500",
    },
  ]);
  const categoriesPerPage = 5;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categoryNameMap = {
    "Coffee / ቡና": "CoffeeAndMainCommodities",
    "Building Materials / የግንባታ እቃዎች": "BuildingMaterials",
    "Fruit Crops / ፍራፍሬች": "FruitCrops",
    "Grains and Cereals / የእህል ሰብሎች": "GrainsAndCereals",
    "Oil Seeds / የቅባት እህሎች": "OilSeeds",
    "Pulses & Legumes / ጥራጥሬዎች ": "PulsesLegumes",
    "Root Crops / የስራስር ሰብሎች": "RootCrops",
    "Spice & Herbs / ቅመማ ቅመሞቾ": "SpicesHerbs",
    "Vegetables  / አትክልቶች": "Vegetables",
  };

  // Fetch platform stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await PlatformStats();
        setPlatformStats(stats);
      } catch (error) {
        console.error("Error loading platform stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Fetch category names
  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        const categoryResponse = await getCategories();
        if (!categoryResponse || !Array.isArray(categoryResponse)) {
          console.error("Invalid categories response:", categoryResponse);
          setLoading(false);
          return;
        }

        const validCategories = categoryResponse
          .filter((item) => categoryNameMap[item.name])
          .map((item) => item.name);

        setCategoryNames(validCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };
    fetchCategoryNames();
  }, []);

  // Fetch offers for all categories and listen for new offers
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const offersPromises = categoryNames.map(async (displayName) => {
          const mappedName = categoryNameMap[displayName];
          try {
            const offers = await fetchOfferByFilterNoToken({
              category: mappedName,
              latest: true,
              limit: 4,
            });
            return { displayName, offers: offers ? offers.slice(0, 4) : [] };
          } catch (error) {
            console.error(`Error fetching offers for ${displayName}:`, error);
            return { displayName, offers: [] };
          }
        });

        const results = await Promise.all(offersPromises);
        const newData = results.reduce((acc, { displayName, offers }) => {
          acc[displayName] = offers;
          return acc;
        }, {});

        setCategoriesData(newData);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();

    // Subscribe to real-time updates
    const handleNewOffer = (newOffer) => {
      setCategoriesData((prev) => {
        const categoryKey = Object.keys(categoryNameMap).find(
          (key) => categoryNameMap[key] === newOffer.offer.category
        );

        if (!categoryKey) {
          return prev;
        }
        return {
          ...prev,
          [categoryKey]: [newOffer, ...(prev[categoryKey] || [])].slice(0, 4),
        };
      });
    };

    subscribeToNewOffers(handleNewOffer);
    return () => unsubscribeFromNewOffers(handleNewOffer);
  }, [categoryNames]);

  const handlePostOfferClick = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (token) {
      const userRole = localStorage.getItem("userRole");
      if (userRole === "admin") {
        navigate("/postFormAdmin")  
      } else {
        navigate("/postForm");
      }
    } else {
      dispatch(setRedirectRoute(window.location.pathname));
      navigate("/sign-in");
    }
  };

  return (
    // <>
    //   {/* Hero Section */}
    //   <div className="relative flex h-[60vh] content-center items-center justify-center pt-4 pb-8 lg:pt-8 lg:pb-16">
    //     <div className="absolute top-0 h-full w-full bg-[url('/img/background-4.jpg')] bg-cover bg-center" />
    //     <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
    //     <div className="max-w-8xl container relative mx-auto text-center lg:text-left">
    //       <div className="flex flex-wrap items-center">
    //         <div className="w-full px-4">
    //           <Typography
    //             variant="h1"
    //             color="white"
    //             className="mb-6 font-black text-3xl lg:text-6xl"
    //           >
    //             Ethiopian's Largest Online Commodity B2B
    //           </Typography>
    //           <Typography
    //             variant="lead"
    //             color="white"
    //             className="opacity-80 text-base lg:text-lg"
    //           >
    //             Empowering businesses to connect, trade, and grow on a trusted platform.
    //           </Typography>
    //           <div
    //             className="mt-6 w-fit mx-auto lg:mx-0"
    //             onClick={handlePostOfferClick}
    //             role="button"
    //           >
    //             <Button variant="gradient" color="green" size="lg" fullWidth>
    //               Post Offer
    //             </Button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Platform Stats Card */}
    //   <section className="-mt-16 lg:-mt-32 bg-white px-2 md:px-4 pb-4 pt-4">
    //     <div className="container mx-auto">
    //       <div className="mx-auto mt-12 max-w-7xl">
    //         <Card className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:items-center lg:justify-center gap-6 p-6 rounded-lg shadow-lg bg-white">
    //           {platformStats.map((stat) => (
    //             <InfoCard
    //               key={stat.title}
    //               title={stat.title}
    //               count={stat.count}
    //               icon={stat.icon}
    //               bgColor={stat.bgColor}
    //             />
    //           ))}
    //         </Card>
    //       </div>
    //     </div>
    //   </section>

    //   {loading ? (
    //     <div className="text-center p-8">
    //       <Typography variant="h6" color="gray">
    //         Loading products...
    //       </Typography>
    //     </div>
    //   ) : (
    //     <>
    //       {categoryNames
    //         .filter(
    //           (categoryName) =>
    //             categoriesData[categoryName] && categoriesData[categoryName].length > 0
    //         )
    //         .map((categoryName) => {
    //           const offers = categoriesData[categoryName];
    //           return (
    //             <section key={categoryName} className="px-2 md:px-4 pb-10">
    //               <div className="container mx-auto">
    //                 <div className="flex flex-col md:flex-row justify-between items-center mb-6">
    //                   <Typography variant="h4" color="gray" className="mb-2 md:mb-0">
    //                     Latest from {categoryName}
    //                   </Typography>
    //                   <Link
    //                     to={`/buy?category=${categoryNameMap[categoryName]}`}
    //                     className="flex items-center text-green-500 text-sm md:text-base"
    //                   >
    //                     View More <i className="fa fa-arrow-right ml-1"></i>
    //                   </Link>
    //                 </div>
    //                 <div className="mt-2 grid grid-cols-1 gap-6 gap-x-12 md:grid-cols-2 xl:grid-cols-4">
    //                   {offers.map((offer) => (
    //                     <Link
    //                       key={offer.id}
    //                       to={`/product/${offer.id}`}
    //                       onClick={() => dispatch(setSelectedOffer(offer))}
    //                     >
    //                       <ProductCard
    //                         id={offer.id}
    //                         name={offer.product_name || offer.offer.product_name}
    //                         img={
    //                           offer.pic_link ||
    //                           offer.product?.picture_link ||
    //                           offer.product?.pic_link
    //                         }
    //                         date={
    //                           offer.createdAt
    //                             ? new Date(offer.createdAt).toLocaleDateString("en-GB", {
    //                                 day: "2-digit",
    //                                 month: "short",
    //                                 year: "numeric",
    //                               })
    //                             : offer.offer?.createdAt
    //                             ? new Date(offer.offer.createdAt).toLocaleDateString("en-GB", {
    //                                 day: "2-digit",
    //                                 month: "short",
    //                                 year: "numeric",
    //                               })
    //                             : "N/A"
    //                         }
    //                         seller={offer.user_name || offer.offer?.user_name}
    //                         quantity={
    //                           (offer.quantity || offer.offer?.quantity)
    //                             ? `${offer.quantity || offer.offer?.quantity} ${offer.measurement || offer.offer?.measurement}`
    //                             : "Not specified"
    //                         }
    //                         offerType={offer.offer_type || offer.offer.offer_type}
    //                       />
    //                     </Link>
    //                   ))}
    //                 </div>
    //               </div>
    //             </section>
    //           );
    //         })}
    //     </>
    //   )}

    //   {/* Footer */}
    //   <div className="bg-white mt-10">
    //     <Footer />
    //   </div>
    // </>
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

export default Home;
