import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { fetchOfferByFilter } from "@/services/userServices";
import { getCategories, updateOffer, getAllProductsByCategory } from "@/services/productServices";

function OfferSettings() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    finishDate: "",
    category: "",
    productName: "",
    userType: ""
  });
  const [categories, setCategories] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const role = localStorage.getItem("userRole");

  // Helper: Convert YYYY-MM-DD to YYYY/MM/DD format.
  const formatDate = (dateStr) => dateStr.split("-").join("-");

  // Fetch categories on mount.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Function to fetch product names based on the selected category.
  const fetchProducts = async (category) => {
    if (!category) {
      setProductNames([]);
      return;
    }
    try {
      const products = await getAllProductsByCategory(category);
      const names = products.map((product) => product.name);
      setProductNames(names);
    } catch (error) {
      console.error("Error fetching products for category:", error);
      setProductNames([]);
    }
  };

  // When category changes, fetch products and reset productName filter.
  useEffect(() => {
    fetchProducts(filters.category);
    setFilters((prev) => ({ ...prev, productName: "" }));
  }, [filters.category]);

  // Function to fetch offers based on filters.
  const fetchFilteredOffers = async () => {
    try {
      setIsLoading(true);
      // Build payload based on selected filters.
      const payload = {
        fetchUserOffers: true,
        category: filters.category || undefined,
        productName: filters.productName || undefined,
      };

      // Use dateBetween if both startDate and finishDate are set.
      if (filters.startDate && filters.finishDate) {
        payload.dateBetween = [formatDate(filters.startDate), formatDate(filters.finishDate)];
      } else if (filters.startDate) {
        payload.dateAfter = formatDate(filters.startDate);
      } else if (filters.finishDate) {
        payload.dateBefore = formatDate(filters.finishDate);
      }

      const response = await fetchOfferByFilter(payload);
      // Check for empty array response or a 404 status.
      if ((Array.isArray(response) && response.length === 0) || (response?.status == 404)) {
        setNotFound(true);
        setOffers([]);
      } else if (Array.isArray(response)) {
        setNotFound(false);
        setOffers(response);
      } else {
        console.error("Invalid data format", response);
      }
    } catch (error) {
      if (error.response?.status == 404) {
        setNotFound(true);
        setOffers([]);
      } else {
        console.error("Error fetching offers:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch default offers on mount.
  useEffect(() => {
    fetchFilteredOffers();
  }, []);

  // Handle status change for an offer.
  const handleStatusChange = async (offer, newStatus) => {
    try {
      const updatePayload = { offerId: offer.id, status: newStatus };
      await updateOffer(offer.category, updatePayload);
      setOffers((prevOffers) =>
        prevOffers.map((o) =>
          o.id === offer.id ? { ...o, status: newStatus } : o
        )
      );
    } catch (error) {
      console.error("Error updating offer status:", error);
    }
  };

  // Update filters state on input change.
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Filter button click.
  const handleFilterButtonClick = () => {
    fetchFilteredOffers();
  };

  // Client-side filtering for userType.
  const filteredOffers = offers.filter((offer) => {
    return !filters.userType || offer.poster === filters.userType;
  });

  if (isLoading) return <p>Loading offers...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Posted Offers</h1>

      {role === "admin" && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Start Date filter with a built-in calendar */}
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded"
            />
            {/* Finish Date filter with a built-in calendar */}
            <input
              type="date"
              name="finishDate"
              value={filters.finishDate}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded"
            />
            {/* Category dropdown */}
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {/* Product Name dropdown */}
            <select
              name="productName"
              value={filters.productName}
              onChange={handleFilterChange}
              onFocus={() => fetchProducts(filters.category)}
              className="p-2 border border-gray-300 rounded"
              disabled={!filters.category || productNames.length === 0}
            >
              <option value="">All Products</option>
              {productNames.map((product, index) => (
                // If product doesn't have an id, index is used as key.
                <option key={index} value={product}>
                  {product}
                </option>
              ))}
            </select>
            {/* User Type dropdown */}
            <select
              name="userType"
              value={filters.userType}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">All User Types</option>
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </div>
          {/* Filter Button */}
          <div className="mt-4">
            <button
              onClick={handleFilterButtonClick}
              className="p-2 bg-blue-500 text-white rounded w-40"
            >
              Filter
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <Link to={`/product/${offer.id}`} key={offer.id}>
            <div className="border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-40 overflow-hidden rounded-t-lg">
                <img
                  className="w-full h-full object-cover"
                  src={offer.product?.picture_link || "/img/default-placeholder.png"}
                  alt={offer.product_name}
                />
              </div>
              <div className="px-4 py-4">
                <h3 className="text-lg font-roboto font-semibold text-gray-900">
                  {offer.product_name}
                </h3>
                <p className="text-base font-roboto text-gray-500">
                  <span className="font-semibold">I want to:</span> {offer.offer_type || "N/A"}
                </p>
                <p className="text-base font-roboto text-gray-500">
                  <span className="font-semibold">Posted by:</span> {offer.user_name || "N/A"}
                </p>
                <p className="text-base font-roboto text-gray-500">
                  <span className="font-semibold">Quantity:</span> {offer.quantity || "Not specified"}
                </p>
                <p className="text-base font-roboto text-gray-500">
                  <span className="font-semibold">Post date:</span> {new Date(offer.createdAt).toLocaleDateString("en-GB")}
                </p>
                <p className="text-base font-roboto text-gray-500">
                  <span className="font-semibold">View count:</span> {offer.interactionCount}
                </p>
                {offer.status === true ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleStatusChange(offer, false);
                    }}
                    className="mt-2 inline-block px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleStatusChange(offer, true);
                    }}
                    className="mt-2 inline-block px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OfferSettings;
