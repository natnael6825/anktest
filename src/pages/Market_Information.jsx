import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import {
  coffeeData,
  pintoBeansData,
  sesameSeedsData,
  redKidneyBeansData
} from "@/data"; // Adjust imports accordingly
import NavStyle from "@/widgets/layout/nav_style";
import routes from "@/routes";
import { Button, Card, Typography } from "@material-tailwind/react";
import { ProductCard } from "@/widgets/cards";
import { Footer } from "@/widgets/layout";
import tableData from "@/data/tableData";
import { FlagIcon } from "@heroicons/react/24/solid";

export function Market_information() {
  const [selectedCommodity, setSelectedCommodity] = useState("");

  const filteredData = tableData.filter((item) => {
    const matchCommodity =
      selectedCommodity === "" || item.commodity === selectedCommodity;

    return matchCommodity;
  });

  // Extract unique values for dropdowns
  const uniqueCommodities = [
    ...new Set(tableData.map((item) => item.commodity))
  ];
  const uniqueRegions = [...new Set(tableData.map((item) => item.region))];

  const TABLE_HEAD = [
    "Commodity",
    "Arrival Date",
    "Variety",
    "Region",
    "Zone",
    "Market",
    "Min Price",
    "Max Price",
    "Avg Price"
  ];

  const TABLE_ROWS = tableData;
  const [activeTab, setActiveTab] = useState("product");
  const { id } = useParams();
  const allProducts = [
    ...coffeeData,
    ...pintoBeansData,
    ...sesameSeedsData,
    ...redKidneyBeansData
  ];

  const product = allProducts.find((item) => item.id === parseInt(id)) || {};

  return (
    // <>
    //   <NavStyle />

    //   {/* Commodity Dropdown */}
    //   <div className="bg-gray-100 flex flex-col lg:flex-row justify-between items-center px-4 lg:px-20 pb-8 pt-10">
    //     {/* Dropdown Component */}
    //     <div className="w-full lg:max-w-sm min-w-[200px]">
    //       <select
    //         id="commodity"
    //         className="w-full lg:w-[525px] h-10 border border-gray-400 rounded-md pl-2 text-gray-800"
    //         value={selectedCommodity}
    //         onChange={(e) => setSelectedCommodity(e.target.value)}
    //       >
    //         <option value="">Select Commodity</option>
    //         {uniqueCommodities.map((commodity) => (
    //           <option key={commodity} value={commodity}>
    //             {commodity}
    //           </option>
    //         ))}
    //       </select>
    //     </div>
    //   </div>

    //   {/* Dynamic Table */}
    //   <div className="px-4 lg:px-20 pt-8">
    //     <table className="w-full min-w-max rounded-md table-auto text-left">
    //       <thead>
    //         <tr>
    //           {TABLE_HEAD.map((head, index) => {
    //             const isFirst = index === 0;
    //             const isLast = index === TABLE_HEAD.length - 1;
    //             return (
    //               <th
    //                 key={head}
    //                 className={`border-b border-blue-gray-100 bg-green-400 p-4 ${
    //                   isFirst ? "rounded-tl-md" : ""
    //                 } ${isLast ? "rounded-tr-md" : ""}`}
    //               >
    //                 <Typography
    //                   variant="small"
    //                   color="black"
    //                   className="font-bold leading-none"
    //                 >
    //                   {head}
    //                 </Typography>
    //               </th>
    //             );
    //           })}
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {filteredData.map(
    //           (
    //             {
    //               commodity,
    //               arrivalDate,
    //               variety,
    //               region,
    //               zone,
    //               market,
    //               minPrice,
    //               maxPrice,
    //               avgPrice
    //             },
    //             index
    //           ) => {
    //             const isLast = index === filteredData.length - 1;
    //             const classes = isLast
    //               ? "p-4"
    //               : "p-4 border-b border-blue-gray-50";

    //             return (
    //               <tr key={index}>
    //                 <td className={classes}>
    //                   <Typography
    //                     variant="small"
    //                     color="blue-gray"
    //                     className="font-normal"
    //                   >
    //                     {commodity}
    //                   </Typography>
    //                 </td>
    //                 <td className={classes}>
    //                   <Typography
    //                     variant="small"
    //                     color="blue-gray"
    //                     className="font-normal"
    //                   >
    //                     {arrivalDate}
    //                   </Typography>
    //                 </td>
    //                 <td className={classes}>
    //                   <Typography
    //                     variant="small"
    //                     color="blue-gray"
    //                     className="font-normal"
    //                   >
    //                     {variety}
    //                   </Typography>
    //                 </td>
    //                 <td className={classes}>
    //                   <Typography
    //                     variant="small"
    //                     color="blue-gray"
    //                     className="font-normal"
    //                   >
    //                     {region}
    //                   </Typography>
    //                 </td>
    //                 <td className={classes}>
    //                   <Typography
    //                     variant="small"
    //                     color="blue-gray"
    //                     className="font-normal"
    //                   >
    //                     {zone}
    //                   </Typography>
    //                 </td>
    //                 <td className={classes}>
    //                   <Typography
    //                     variant="small"
    //                     color="blue-gray"
    //                     className="font-normal"
    //                   >
    //                     {market}
    //                   </Typography>
    //                 </td>
    //                 <td className={classes}>
    //                   <Typography
    //                     variant="small"
    //                     color="blue-gray"
    //                     className="font-normal"
    //                   >
    //                     {minPrice}
    //                   </Typography>
    //                 </td>
    //                 <td className={classes}>
    //                   <Typography
    //                     variant="small"
    //                     color="blue-gray"
    //                     className="font-normal"
    //                   >
    //                     {maxPrice}
    //                   </Typography>
    //                 </td>
    //                 <td className={classes}>
    //                   <Typography
    //                     variant="small"
    //                     color="blue-gray"
    //                     className="font-normal"
    //                   >
    //                     {avgPrice}
    //                   </Typography>
    //                 </td>
    //               </tr>
    //             );
    //           }
    //         )}
    //       </tbody>
    //     </table>
    //   </div>

    //   {/* Latest Leads From Buyers */}
    //   <section
    //     className="px-4 lg:px-20 pt-8"
    //     onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    //   >
    //     <div className="container">
    //       <div className="text-left mb-6">
    //         <Typography variant="h4" color="gray">
    //           Latest Offers from Buyers
    //         </Typography>
    //       </div>
    //       <div className="mt-2 grid grid-cols-1 gap-6 gap-x-12 md:grid-cols-2 xl:grid-cols-4 pb-6">
    //         {allProducts.map((product) => (
    //           <ProductCard key={product.name} {...product} />
    //         ))}
    //       </div>
    //     </div>
    //   </section>

    //   {/* Latest Leads From Sellers */}
    //   <section
    //     className="px-4 lg:px-20 pt-8"
    //     onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    //   >
    //     <div className="container">
    //       <div className="text-left mb-6">
    //         <Typography variant="h4" color="gray">
    //           Latest Offers from Sellers
    //         </Typography>
    //       </div>
    //       <div className="mt-2 grid grid-cols-1 gap-6 gap-x-12 md:grid-cols-2 xl:grid-cols-4 pb-6">
    //         {allProducts.map((product) => (
    //           <ProductCard key={product.name} {...product} />
    //         ))}
    //       </div>
    //     </div>
    //   </section>

    //   <div className="bg-white pt-6">
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

export default Market_information;
