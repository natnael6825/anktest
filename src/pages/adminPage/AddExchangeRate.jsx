import React, { useState, useEffect } from "react";
import { getAllBanks, createExchangeRate, fetchAllExchangeRate, updateExchangeRate } from "@/services/adminService";
import { isSameDay } from "date-fns";
import NavStyle from '@/widgets/layout/nav_style';

function AddExchangeRate() {
  const [banks, setBanks] = useState([]);
  const [source, setSource] = useState("");
  const [hashtag, setHashtag] = useState("");
  // Each rate entry holds bankId, sell, and buy values.
  const [rateEntries, setRateEntries] = useState([{ bankId: "", sell: "", buy: "" }]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  // New state to store the exchange rate ID for updating:
  const [exchangeRateId, setExchangeRateId] = useState(null);

  // Fetch banks and today's exchange rate on mount.
  useEffect(() => {
    const fetchBanksAndRates = async () => {
      try {
        // --- Fetch Banks ---
        const banksResponse = await getAllBanks();
        console.log("getAllBanks response:", banksResponse);

        // Defensive check for banks data.
        let banksData = [];
        if (Array.isArray(banksResponse)) {
          banksData = banksResponse;
        } else if (banksResponse && Array.isArray(banksResponse.banks)) {
          banksData = banksResponse.banks;
        } else {
          console.error("Unexpected banks response format:", banksResponse);
        }
        setBanks(banksData);
        // For new entry, set default bankId if not in edit mode.
        if (!isEditMode && banksData.length > 0 && !rateEntries[0].bankId) {
          setRateEntries([{ bankId: banksData[0].id, sell: "", buy: "" }]);
        }

        // --- Fetch Exchange Rates ---
const ratesResponse = await fetchAllExchangeRate();
console.log("fetchAllExchangeRate response:", ratesResponse);

// Check if an exchange rate exists for today.
if (ratesResponse && Array.isArray(ratesResponse.data)) {
  const todayRate = ratesResponse.data.find(rate =>
    isSameDay(new Date(rate.createdAt), new Date())
  );
  if (todayRate) {
    // Switch to edit mode if today's rate exists.
    setIsEditMode(true);
    setSource(todayRate.source || "");
    setHashtag(todayRate.hashtag || "");
    // Save the exchange rate ID so we can update it later.
    setExchangeRateId(todayRate.id);
    // Here, the body keys are bank names; filter out the averages.
    const body = todayRate.body;
    const entries = Object.keys(body)
      .filter(key => key !== "Average")
      .map(bankName => {
        // Find the bank from banksData using its name.
        const bank = banksData.find(b => b.name === bankName);
        return {
          bankId: bank ? bank.id : "",
          sell: body[bankName].sellPrice || "",
          buy: body[bankName].buyPrice || "",
        };
      });
    setRateEntries(entries);
  }
}

      } catch (error) {
        console.error("Error fetching banks and exchange rates:", error);
      }
    };

    fetchBanksAndRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler to update individual rate entry fields.
  const handleRateChange = (index, field, value) => {
    const updatedRates = [...rateEntries];
    updatedRates[index][field] = value;
    setRateEntries(updatedRates);
  };

  // Add a new empty rate entry row.
  const addRateEntry = () => {
    const defaultBankId = banks.length > 0 ? banks[0].id : "";
    setRateEntries([...rateEntries, { bankId: defaultBankId, sell: "", buy: "" }]);
  };

  // Remove a specific rate entry row.
  const removeRateEntry = (index) => {
    const updatedRates = rateEntries.filter((_, i) => i !== index);
    setRateEntries(updatedRates);
  };

  // Form submission handler.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setMessage("");
  
    // Build the ratesBody as an object with bank names as keys.
    const ratesBody = {};
    let totalSell = 0;
    let totalBuy = 0;
    let count = 0;
  
    rateEntries.forEach((entry) => {
      // Convert both values to numbers to ensure proper calculations.
      const bank = banks.find(b => String(b.id) === String(entry.bankId));
      if (bank) {
        const sellPrice = parseFloat(entry.sell) || 0;
        const buyPrice = parseFloat(entry.buy) || 0;
        ratesBody[bank.name] = {
          sellPrice: sellPrice,
          buyPrice: buyPrice,
        };
        totalSell += sellPrice;
        totalBuy += buyPrice;
        count++;
      }
    });
  
    // Calculate averages (if count is zero, default to 0)
    const sellAverage = count > 0 ? totalSell / count : 0;
    const buyAverage = count > 0 ? totalBuy / count : 0;
  
    // Add the computed averages to the ratesBody.
    ratesBody.Average = { buyPrice: buyAverage, sellPrice: sellAverage };
  
    try {
      let result;
      if (isEditMode) {
        // Update using updateExchangeRate when in edit mode.
        // Notice the order: (body, source, hashtag, id)
        result = await updateExchangeRate(ratesBody, source, hashtag, exchangeRateId);
        setMessage("Exchange rate updated successfully.");
      } else {
        // Create new exchange rate using createExchangeRate.
        result = await createExchangeRate(ratesBody, source, hashtag);
        setMessage("Exchange rate created successfully.");
      }
      console.log("Create/Update response:", result);
  
      // Reset form values if necessary.
      setSource("");
      setHashtag("");
      setRateEntries([{ bankId: banks.length > 0 ? banks[0].id : "", sell: "", buy: "" }]);
      setIsEditMode(false);
      setExchangeRateId(null); // Reset the ID for new entries.
  
      // Reload the page after successful submission.
      window.location.reload();
    } catch (error) {
      console.error("Error saving exchange rate:", error);
      setMessage("There was an error saving the exchange rate.");
    } finally {
      setFormSubmitting(false);
    }
  };
  
  

  return (
    <div>
      <NavStyle />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white p-8 shadow-lg rounded-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {isEditMode ? "Edit Exchange Rate" : "Add Exchange Rate"}
          </h2>
          {message && (
            <div className="mb-4 text-center text-sm text-green-600">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Source Field */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="source">
                Source
              </label>
              <input
                type="text"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter source"
                required
              />
            </div>

            {/* Hashtag Field (Optional) */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="hashtag">
                Hashtag (Optional)
              </label>
              <input
                type="text"
                id="hashtag"
                value={hashtag}
                onChange={(e) => setHashtag(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter hashtag"
              />
            </div>

            {/* Dynamic List of Rate Entries */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Exchange Rates</h3>
              {rateEntries.map((entry, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4 p-4 border rounded-md"
                >
                  {/* Bank Dropdown */}
                  <div className="flex-1">
                    <label className="block text-gray-700 mb-1">Bank</label>
                    <select
                      value={entry.bankId}
                      onChange={(e) => handleRateChange(index, "bankId", e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-md"
                    >
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Sell Price Input */}
                  <div className="flex-1">
                    <label className="block text-gray-700 mb-1">Sell Price</label>
                    <input
                      type="number"
                      value={entry.sell}
                      onChange={(e) => handleRateChange(index, "sell", e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-md"
                      placeholder="Sell Price"
                      required
                    />
                  </div>
                  {/* Buy Price Input */}
                  <div className="flex-1">
                    <label className="block text-gray-700 mb-1">Buy Price</label>
                    <input
                      type="number"
                      value={entry.buy}
                      onChange={(e) => handleRateChange(index, "buy", e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-md"
                      placeholder="Buy Price"
                      required
                    />
                  </div>
                  {/* Remove Rate Button (only if more than one entry exists) */}
                  {rateEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRateEntry(index)}
                      className="text-red-500 hover:underline mt-6"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRateEntry}
                className="text-blue-600 hover:underline"
              >
                + Add another rate
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              disabled={formSubmitting}
            >
              {formSubmitting
                ? isEditMode ? "Updating..." : "Saving..."
                : isEditMode ? "Update Exchange Rate" : "Save Exchange Rate"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddExchangeRate;
