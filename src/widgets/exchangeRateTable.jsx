import React, { useState, useEffect } from "react";
import { fetchAllExchangeRate } from "@/services/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/widgets/ui/card";
import { Input } from "@/widgets/ui/input";
import { Button } from "@/widgets/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/widgets/ui/tabs";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

// Helper function: Today in YYYY-MM-DD format.
const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = (today.getMonth() + 1).toString().padStart(2, "0");
  const dd = today.getDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Helper: Given a date string in YYYY-MM-DD, returns previous day's date.
const getPreviousDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Helper: Format date for display.
const formatDateForDisplay = (dateString) => {
  const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

function ExchangeRateTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [activeTab, setActiveTab] = useState("all");
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("bank");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    setLoading(true);
    fetchAllExchangeRate()
      .then((data) => {
        const records = Array.isArray(data) ? data : data.data;
        setExchangeRates(records);
        setLoading(false);
        toast.success("Exchange rates loaded successfully");
      })
      .catch((err) => {
        console.error("Error fetching exchange rates", err);
        setError("Error fetching exchange rates");
        setLoading(false);
        toast.error("Failed to load exchange rates");
      });
  }, []);

  // Find today's record.
  const rateRecord = exchangeRates.find(
    (record) => record.createdAt.substring(0, 10) === selectedDate
  );

  // Determine previous date.
  const previousDate = getPreviousDate(selectedDate);
  // Try to find an exact record for previous date.
  let yesterdayRecord = exchangeRates.find(
    (record) => record.createdAt.substring(0, 10) === previousDate
  );
  // Fallback: find the latest record before selectedDate.
  if (!yesterdayRecord) {
    const previousRecords = exchangeRates.filter(
      (record) => record.createdAt.substring(0, 10) < selectedDate
    );
    if (previousRecords.length > 0) {
      previousRecords.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      yesterdayRecord = previousRecords[0];
    }
  }

  const banksData = rateRecord ? rateRecord.body : null;
  const banksArray = banksData
    ? Object.entries(banksData).filter(([bankName]) => bankName !== "Average")
    : [];

  // Filter banks based on search and tab.
  const filteredBanksArray = banksArray.filter(([bankName, data]) => {
    const matchesSearch = bankName.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "increased" && yesterdayRecord && yesterdayRecord.body[bankName]) {
      return matchesSearch && (data.buyPrice > yesterdayRecord.body[bankName].buyPrice);
    }
    if (activeTab === "decreased" && yesterdayRecord && yesterdayRecord.body[bankName]) {
      return matchesSearch && (data.buyPrice < yesterdayRecord.body[bankName].buyPrice);
    }
    return matchesSearch;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedBanksArray = [...filteredBanksArray].sort((a, b) => {
    let aVal, bVal;
    if (sortField === "bank") {
      aVal = a[0].toLowerCase();
      bVal = b[0].toLowerCase();
    } else if (sortField === "buyRate") {
      aVal = a[1]?.buyPrice ?? 0;
      bVal = b[1]?.buyPrice ?? 0;
    } else if (sortField === "sellRate") {
      aVal = a[1]?.sellPrice ?? 0;
      bVal = b[1]?.sellPrice ?? 0;
    } else if (sortField === "spread") {
      aVal = (a[1]?.buyPrice ?? 0) - (a[1]?.sellPrice ?? 0);
      bVal = (b[1]?.buyPrice ?? 0) - (b[1]?.sellPrice ?? 0);
    }
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const getDiffDisplay = (todayValue, yesterdayValue) => {
    if (todayValue === undefined || yesterdayValue === undefined) {
      return { diff: 0, arrow: "" };
    }
    const diff = todayValue - yesterdayValue;
    const arrow = diff >= 0 ? "↑" : "↓";
    return { diff: Math.abs(diff), arrow };
  };

  const exportToCSV = () => {
    if (!rateRecord) {
      toast.error("No data available to export");
      return;
    }
    let csvContent = "Bank,Buy Rate (USD),Sell Rate (USD),Spread\n";
    sortedBanksArray.forEach(([bank, data]) => {
      const buyPrice = data.buyPrice?.toFixed(4) || "-";
      const sellPrice = data.sellPrice?.toFixed(4) || "-";
      const spread =
        data.buyPrice && data.sellPrice
          ? (data.buyPrice - data.sellPrice).toFixed(4)
          : "-";
      csvContent += `${bank},${buyPrice},${sellPrice},${spread}\n`;
    });
    if (banksData?.Average) {
      const avgBuy = banksData.Average.buyPrice?.toFixed(4) || "-";
      const avgSell = banksData.Average.sellPrice?.toFixed(4) || "-";
      const avgSpread =
        banksData.Average.buyPrice && banksData.Average.sellPrice
          ? (banksData.Average.buyPrice - banksData.Average.sellPrice).toFixed(4)
          : "-";
      csvContent += `Average,${avgBuy},${avgSell},${avgSpread}\n`;
    }
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `exchange-rates-${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully");
  };

  return (
    <div className="space-y-6 animate-fade-in px-1 bg-white sm:px-6 lg:px-24">
      <Card className="w-full bg-white">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl dark:text-white font-bold">
              Exchange Rates {selectedDate && `- ${formatDateForDisplay(selectedDate)}`}
            </CardTitle>
            <div className="flex flex-row gap-3 ">
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-8 w-full sm:w-auto"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2" onClick={exportToCSV}>
                <Download className="h-4 w-4 " />
                <span className="dark:text-white">Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search banks..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto dark:text-white"
            >
              <TabsList>
                <TabsTrigger value="all">All Banks</TabsTrigger>
                <TabsTrigger value="increased">Increased</TabsTrigger>
                <TabsTrigger value="decreased">Decreased</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-secondary mb-4"></div>
                <div className="h-4 w-32 bg-secondary rounded"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1">Please try again later or contact support.</p>
            </div>
          )}

          {!loading && !rateRecord && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg font-medium">No exchange rate record for the selected date.</p>
              <p className="mt-1">Try selecting a different date.</p>
            </div>
          )}

          {rateRecord && (
            <div className="rounded-md border overflow-x-auto w-full">
              <table className="table-auto w-full">
                <thead>
                  <tr className="bg-gray-300/50 dark:text-white">
                    <th
                      className="px-3 py-2 sm:px-6 sm:py-3 dark:text-white text-left text-xs sm:text-sm font-medium text-muted-foreground cursor-pointer select-none"
                      onClick={() => handleSort("bank")}
                    >
                      <div className="flex items-center gap-2 dark:text-white">
                        Bank{" "}
                        {sortField === "bank" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2 sm:px-6 sm:py-3 text-left dark:text-white text-xs sm:text-sm font-medium text-muted-foreground cursor-pointer select-none"
                      onClick={() => handleSort("buyRate")}
                    >
                      <div className="flex items-center gap-2 dark:text-white">
                        Buy Rate (USD)
                        {sortField === "buyRate" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2 sm:px-6 sm:py-3 text-left dark:text-white text-xs sm:text-sm font-medium text-muted-foreground cursor-pointer select-none"
                      onClick={() => handleSort("sellRate")}
                    >
                      <div className="flex items-center gap-2 dark:text-white">
                        Sell Rate (USD)
                        {sortField === "sellRate" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2 sm:px-6 sm:py-3 text-left dark:text-white text-xs sm:text-sm font-medium text-muted-foreground cursor-pointer select-none"
                      onClick={() => handleSort("spread")}
                    >
                      <div className="flex items-center gap-2 dark:text-white">
                        Spread
                        {sortField === "spread" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:text-white">
                  {sortedBanksArray.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-2 dark:text-white sm:px-6 sm:py-4 text-center text-muted-foreground text-xs sm:text-sm">
                        No matching banks found.
                      </td>
                    </tr>
                  ) : (
                    sortedBanksArray.map(([bankName, data], index) => {
                      const buyPrice =
                        data && typeof data.buyPrice === "number"
                          ? data.buyPrice.toFixed(4)
                          : "-";
                      const sellPrice =
                        data && typeof data.sellPrice === "number"
                          ? data.sellPrice.toFixed(4)
                          : "-";

                      const yesterdayBanksData = yesterdayRecord ? yesterdayRecord.body : null;
                      const yesterdayBankData =
                        yesterdayBanksData && yesterdayBanksData[bankName]
                          ? yesterdayBanksData[bankName]
                          : undefined;

                      const buyDiffObj =
                        yesterdayBankData &&
                        typeof yesterdayBankData.buyPrice === "number" &&
                        typeof data.buyPrice === "number"
                          ? getDiffDisplay(data.buyPrice, yesterdayBankData.buyPrice)
                          : { diff: 0, arrow: "" };
                      const sellDiffObj =
                        yesterdayBankData &&
                        typeof yesterdayBankData.sellPrice === "number" &&
                        typeof data.sellPrice === "number"
                          ? getDiffDisplay(data.sellPrice, yesterdayBankData.sellPrice)
                          : { diff: 0, arrow: "" };

                      const spread =
                        data &&
                        typeof data.buyPrice === "number" &&
                        typeof data.sellPrice === "number"
                          ? data.buyPrice - data.sellPrice
                          : 0;

                      return (
                        <tr key={bankName} className={`transition-colors hover:bg-secondary/20 ${index % 2 === 0 ? "bg-secondary/5" : ""}`}>
                          <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                              {/* Hide bank logo on small screens */}
                              <img
                                src="https://via.placeholder.com/40"
                                alt="Bank logo"
                                className="hidden sm:block w-10 h-10 rounded-full"
                              />
                              {bankName}
                            </div>
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                            <div className="flex flex-col text-xs sm:text-sm">
                              <span className="font-medium">{buyPrice}</span>
                              {yesterdayBankData && (
                                (() => {
                                  const buyPercentDiff =
                                    yesterdayBankData &&
                                    typeof yesterdayBankData.buyPrice === "number" &&
                                    yesterdayBankData.buyPrice !== 0
                                      ? ((data.buyPrice - yesterdayBankData.buyPrice) / yesterdayBankData.buyPrice) * 100
                                      : null;
                                  return (
                                    <span className={buyDiffObj.arrow === "↑" ? "text-green-600 flex items-center mt-1" : "text-red-600 flex items-center mt-1"}>
                                      {buyDiffObj.arrow === "↑" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                      {buyDiffObj.diff.toFixed(4)} {buyPercentDiff !== null && `(${buyPercentDiff.toFixed(2)}%)`}
                                    </span>
                                  );
                                })()
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                            <div className="flex flex-col text-xs sm:text-sm">
                              <span className="font-medium">{sellPrice}</span>
                              {yesterdayBankData && (
                                (() => {
                                  const sellPercentDiff =
                                    yesterdayBankData &&
                                    typeof yesterdayBankData.sellPrice === "number" &&
                                    yesterdayBankData.sellPrice !== 0
                                      ? ((data.sellPrice - yesterdayBankData.sellPrice) / yesterdayBankData.sellPrice) * 100
                                      : null;
                                  return (
                                    <span className={sellDiffObj.arrow === "↑" ? "text-green-600 flex items-center mt-1" : "text-red-600 flex items-center mt-1"}>
                                      {sellDiffObj.arrow === "↑" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                      {sellDiffObj.diff.toFixed(4)} {sellPercentDiff !== null && `(${sellPercentDiff.toFixed(2)}%)`}
                                    </span>
                                  );
                                })()
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                            <span className="font-medium">{typeof spread === "number" ? spread.toFixed(4) : "-"}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                  {banksData && banksData["Average"] && (
                    <tr className="bg-primary/5 font-bold border-t">
                      <td className="px-3 py-2 sm:px-6 sm:py-4">Today's Average</td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        {typeof banksData["Average"].buyPrice === "number"
                          ? banksData["Average"].buyPrice.toFixed(4)
                          : "-"}
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        {typeof banksData["Average"].sellPrice === "number"
                          ? banksData["Average"].sellPrice.toFixed(4)
                          : "-"}
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        {typeof banksData["Average"].buyPrice === "number" &&
                        typeof banksData["Average"].sellPrice === "number"
                          ? (banksData["Average"].buyPrice - banksData["Average"].sellPrice).toFixed(4)
                          : "-"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ExchangeRateTable;
