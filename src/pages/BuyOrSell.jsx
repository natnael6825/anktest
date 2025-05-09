import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Typography } from "@material-tailwind/react"; // For pagination controls
import { FilterSidebar } from "@/widgets";
import NavStyle from "@/widgets/layout/nav_style";
import { Footer } from "@/widgets/layout";
import { getAllProductNames } from "@/services/productServices";
import { fetchOfferByFilterNoToken } from "@/services/userServices";
import { setSelectedOffer } from "@/store/offerSlice";
import { subscribeToNewOffers, unsubscribeFromNewOffers } from "@/services/socket";
import { setRedirectRoute } from '@/store/routeSlice';
import { FlagIcon } from "@heroicons/react/24/solid";

export function BuyOrSell() {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productNames, setProductNames] = useState([]);
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFromQuery = searchParams.get("category");
  const navigate = useNavigate();

  // Define items per page (15 offers per page)
  const pageSize = 15;
  const totalPages = Math.ceil(offers.length / pageSize);
  const indexOfLastOffer = currentPage * pageSize;
  const indexOfFirstOffer = indexOfLastOffer - pageSize;
  const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);

  const getPageNumbers = (currentPage, totalPages) => {
    let pages = [];
    if (currentPage < 3) {
      pages = [1, 2, 3];
    } else if (currentPage <= totalPages - 3) {
      pages = [currentPage + 1, currentPage + 2, currentPage + 3];
    } else {
      pages = [totalPages - 2, totalPages - 1, totalPages];
    }
    if (pages[pages.length - 1] < totalPages) {
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePostOfferClick = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (token) {
      navigate("/postForm");
    } else {
      dispatch(setRedirectRoute(window.location.pathname));
      navigate("/sign-in")
    }
  };

  // Determine the heading text based on the route or query
  const getHeadingText = () => {
    if (categoryFromQuery) {
      return `${categoryFromQuery.replace(/([A-Z])/g, " $1")} Offers`;
    }
    if (location.pathname === "/sell") {
      return "Sell Offers";
    }
    if (location.pathname === "/buy") {
      return "Buy Offers";
    }
    return "Latest Offers";
  };

  // Set default filters based on the route (buy or sell)
  useEffect(() => {
    const path = location.pathname;
    const routeFilter = path === "/buy" ? ["Buy"] : path === "/sell" ? ["Sell"] : [];
    setFilters({ Offers: routeFilter });
  }, [location.pathname]);

  useEffect(() => {
    const loadProductNames = async () => {
      try {
        const names = await getAllProductNames();
        setProductNames(names);
      } catch (err) {
        console.error("Product names error:", err);
      }
    };
    loadProductNames();
  }, []);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiFilters = {
          ...(filters.Offers?.[0] && { offerType: filters.Offers[0].toLowerCase() }),
          ...(filters.Products?.[0] && { productName: filters.Products[0] }),
          ...(categoryFromQuery && { category: categoryFromQuery }),
          latest: true,
        };

        const response = await fetchOfferByFilterNoToken(apiFilters);

        if (!Array.isArray(response)) {
          throw new Error("Invalid data format received from server");
        }

        setOffers(response);
        setCurrentPage(1);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load offers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(filters).length > 0 || categoryFromQuery) {
      loadOffers();
    }
  }, [filters, categoryFromQuery]);

  useEffect(() => {
    const handleNewOffer = (newOffer) => {
      // Normalize the incoming data structure
      const normalizedOffer = newOffer.offer
        ? { ...newOffer.offer, product: newOffer.offer.product || {} }
        : { ...newOffer, product: newOffer.product || {} };


      // Determine if the new offer matches current filters
      let matches = true;
      if (filters.Offers && filters.Offers.length > 0) {
        matches =
          matches &&
          filters.Offers[0].toLowerCase() === normalizedOffer.offer_type?.toLowerCase();
      }
      if (filters.Products && filters.Products.length > 0) {
        matches = matches && filters.Products[0] === normalizedOffer.product_name;
      }
      if (categoryFromQuery) {
        matches = matches && categoryFromQuery === normalizedOffer.category;
      }

      // If the new offer matches, prepend it to the offers list
      if (matches) {
        setOffers((prevOffers) => [normalizedOffer, ...prevOffers]);
      }
    };

    subscribeToNewOffers(handleNewOffer);
    return () => {
      unsubscribeFromNewOffers(handleNewOffer);
    };
  }, [filters, categoryFromQuery]);

  // Override filters rather than merging them
  const handleFilterChange = (selectedFilters) => {
    setFilters(selectedFilters);
  };

  const handleOfferClick = (offer) => {
    dispatch(setSelectedOffer(offer));
  };

  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8">
        <div>
          <FlagIcon className="w-20 h-20 mx-auto" />
          <Typography
            variant="h1"
            color="blue-gray"
            className="mt-10 !text-3xl !leading-snug md:!text-4xl"
          >
            Error 404 <br /> It looks like something went wrong.
          </Typography>
          <Typography className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
            Don&apos;t worry, our team is already on it.Please try refreshing
            the page or come back later.
          </Typography>
          <Button color="gray" className="w-full px-4 md:w-[8rem]">
            back home
          </Button>
        </div>
      </div>
  );
}

export default BuyOrSell;
