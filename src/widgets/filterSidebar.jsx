import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCategories, getAllProductsByCategory } from "@/services/productServices";
import { fetchOfferByFilter } from "@/services/userServices"; // import the fetch function
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export function FilterSidebar({ filters, onFilterChange, onOffersReset }) {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  // Add state for mobile dropdown toggles
  const [mobileOffersOpen, setMobileOffersOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileAdditionalOpen, setMobileAdditionalOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const defaultFilter = path.includes("/sell")
      ? "Sell"
      : path.includes("/buy")
      ? "Buy"
      : null;

    if (defaultFilter && (!filters.Offers || filters.Offers[0] !== defaultFilter)) {
      setSelectedFilters((prev) => {
        const updatedFilters = {
          ...prev,
          Offers: [defaultFilter],
        };
        // Call onFilterChange with the updated state
        onFilterChange(updatedFilters);
        return updatedFilters;
      });
    }
  }, [location.pathname, filters, onFilterChange]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchProductsByCategory = async (categoryName) => {
    try {
      setLoadingProducts((prev) => ({ ...prev, [categoryName]: true }));
      const fetchedProducts = await getAllProductsByCategory(categoryName);
      setCategoryProducts((prev) => ({
        ...prev,
        [categoryName]: fetchedProducts || [],
      }));
    } catch (error) {
      console.error(`Error fetching products for category: ${categoryName}`, error);
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [categoryName]: false }));
    }
  };

  const handleCategoryToggle = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));

    if (!categoryProducts[categoryName]) {
      fetchProductsByCategory(categoryName);
    }
  };

  const handleCheckboxChange = (filterName, option) => {
    setSelectedFilters((prev) => {
      const filterOptions = prev[filterName] || [];
      const isSelected = filterOptions.includes(option);

      const updatedFilterOptions = isSelected
        ? filterOptions.filter((item) => item !== option)
        : [...filterOptions, option];

      const updatedFilters = {
        ...prev,
        [filterName]: updatedFilterOptions.length > 0 ? updatedFilterOptions : undefined,
      };

      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  // Modified Reset Filters function to re-fetch offers based on the default "Sell" or "Buy" filter.
  const handleResetFilters = async () => {
    const path = location.pathname.toLowerCase();
    const defaultFilter = path.includes("/sell")
      ? "Sell"
      : path.includes("/buy")
      ? "Buy"
      : null;

    // Reset all filters except the route-based offer type
    const resetFilters = defaultFilter ? { Offers: [defaultFilter] } : {};
    setSelectedFilters(resetFilters);
    onFilterChange(resetFilters);

    try {
      // Fetch offers using the default filter.
      const offers = await fetchOfferByFilter({
        offerType: defaultFilter,
        latest: true,
        limit: 4,
      });
      if (onOffersReset) {
        onOffersReset(offers);
      }
    } catch (error) {
      console.error("Error fetching offers for default filter:", error);
    }
  };

  // Determine if any filter is selected.
  // (This example considers a filter "selected" if its array has one or more items.)
  const hasFiltersSelected =
    Object.keys(selectedFilters).length > 0 &&
    Object.values(selectedFilters).some(
      (filterValue) => Array.isArray(filterValue) && filterValue.length > 0
    );

  const productSelected = selectedFilters.Products?.length > 0;

  return (
    <>
      {/* Mobile Filters (visible on small devices) */}
      <div className="md:hidden p-4 border-b">
        {/* Flex row for filter titles */}
        <div className="flex justify-around items-center">
          <button
            className="flex items-center space-x-1"
            onClick={() => setMobileOffersOpen((prev) => !prev)}
          >
            <span className="text-xl font-rthin text-gray-500">Offers</span>
            {mobileOffersOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <button
            className="flex items-center space-x-1"
            onClick={() => setMobileProductsOpen((prev) => !prev)}
          >
            <span className="text-xl font-rthin text-gray-500">Products</span>
            {mobileProductsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {productSelected && (
            <button
              className="flex items-center space-x-1"
              onClick={() => setMobileAdditionalOpen((prev) => !prev)}
            >
              <span className="text-xl font-rthin text-gray-500">Filters</span>
              {mobileAdditionalOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          )}
        </div>

        {/* Dropdown Contents */}
        {mobileOffersOpen && (
          <div className="mt-2">
            {["Buy", "Sell"].map((offer) => (
              <label key={offer} className="flex items-center font-rlight mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedFilters.Offers?.includes(offer) || false}
                  onChange={() => handleCheckboxChange("Offers", offer)}
                />
                {offer}
              </label>
            ))}
          </div>
        )}

        {mobileProductsOpen && (
          <div className="mt-2">
            {loadingCategories ? (
              <p>Loading categories...</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="mb-4 font-rlight border-b">
                  <div
                    className="flex items-center justify-between cursor-pointer mb-2"
                    onClick={() => handleCategoryToggle(category.name)}
                  >
                    <h3 className="text-md font-roboto">{category.name}</h3>
                    {expandedCategories[category.name] ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {expandedCategories[category.name] &&
                    (loadingProducts[category.name] ? (
                      <p>Loading products...</p>
                    ) : (
                      categoryProducts[category.name] && (
                        <div className="ml-4">
                          {categoryProducts[category.name].map((product) => (
                            <label key={product.id} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={
                                  selectedFilters.Products?.includes(product.name) || false
                                }
                                onChange={() =>
                                  handleCheckboxChange("Products", product.name)
                                }
                              />
                              {product.name}
                            </label>
                          ))}
                        </div>
                      )
                    ))}
                </div>
              ))
            )}
          </div>
        )}

        {productSelected && mobileAdditionalOpen && (
          <div className="mt-2">
            <div className="mb-4">
              <h3 className="text-2xl font-rthin text-gray-500 mb-2">User Type</h3>
              {["KYC Verified", "Trusted", "Default"].map((type) => (
                <label key={type} className="flex items-center font-rlight mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedFilters["User Type"]?.includes(type) || false}
                    onChange={() => handleCheckboxChange("User Type", type)}
                  />
                  {type}
                </label>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-rthin text-gray-500 mb-2">Date Range</h3>
              {["Last 7 days", "14 days", "30 days"].map((range) => (
                <label key={range} className="flex items-center font-rlight mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedFilters["Date Range"]?.includes(range) || false}
                    onChange={() => handleCheckboxChange("Date Range", range)}
                  />
                  {range}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Only show Reset Filters button if any filter is selected */}
        {hasFiltersSelected && (
          <button
            onClick={handleResetFilters}
            className="text-blue-500 text-sm mt-4 underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Desktop Sidebar Filters */}
      <div className="hidden md:block w-64 border-r p-4">
        <h2 className="text-2xl font-rblack border-b mb-4">Filters</h2>
        {/* Offers Filter – Always visible */}
        <div className="mb-6">
          <h3 className="text-2xl font-rthin text-gray-500 mb-2">Offers</h3>
          {["Buy", "Sell"].map((offer) => (
            <label key={offer} className="flex items-center font-rlight mb-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedFilters.Offers?.includes(offer) || false}
                onChange={() => handleCheckboxChange("Offers", offer)}
              />
              {offer}
            </label>
          ))}
        </div>

        {!selectedFilters.Products?.length ? (
          // Product Selection Interface
          <div className="mb-6">
            <h3 className="text-2xl font-rthin text-gray-500 mb-2">Products</h3>
            {loadingCategories ? (
              <p>Loading categories...</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="mb-4 font-rlight border-b">
                  <div
                    className="flex items-center justify-between cursor-pointer mb-2"
                    onClick={() => handleCategoryToggle(category.name)}
                  >
                    <h3 className="text-md font-roboto">{category.name}</h3>
                    {expandedCategories[category.name] ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {expandedCategories[category.name] &&
                    (loadingProducts[category.name] ? (
                      <p>Loading products...</p>
                    ) : (
                      categoryProducts[category.name] && (
                        <div className="ml-4">
                          {categoryProducts[category.name].map((product) => (
                            <label key={product.id} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={
                                  selectedFilters.Products?.includes(product.name) || false
                                }
                                onChange={() =>
                                  handleCheckboxChange("Products", product.name)
                                }
                              />
                              {product.name}
                            </label>
                          ))}
                        </div>
                      )
                    ))}
                </div>
              ))
            )}
          </div>
        ) : (
          // Additional Filters when product is selected
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-rthin text-gray-500 mb-2">User Type</h3>
              {["KYC Verified", "Trusted", "Default"].map((type) => (
                <label key={type} className="flex items-center font-rlight mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedFilters["User Type"]?.includes(type) || false}
                    onChange={() => handleCheckboxChange("User Type", type)}
                  />
                  {type}
                </label>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-rthin text-gray-500 mb-2">Date Range</h3>
              {["Last 7 days", "14 days", "30 days"].map((range) => (
                <label key={range} className="flex items-center font-rlight mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedFilters["Date Range"]?.includes(range) || false}
                    onChange={() => handleCheckboxChange("Date Range", range)}
                  />
                  {range}
                </label>
              ))}
            </div>
            {hasFiltersSelected && (
              <button
                onClick={handleResetFilters}
                className="text-blue-500 text-sm mt-4 underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default FilterSidebar;
