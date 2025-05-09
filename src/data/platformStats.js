// PlatformStats.js
import { fetchOfferByFilterNoToken } from "@/services/userServices";

export const PlatformStats = async () => {
  try {
    const response = await fetchOfferByFilterNoToken({ statusbar: true });
    // Extract stats object from the response
    const { stats } = response;
    // Combine buy and sell offers

    stats.buyOffer + stats.sellOffer;

    return [
      {
        title: "TOTAL REGISTERED USERS",
        count: stats.user  ,
        icon: "/img/usericon.png",
        bgColor: "bg-white-500",
      },
      {
        title: "BUY OFFERS",
        count: stats.buyOffer,
        icon: "/img/buy_offer.png",
        bgColor: "bg-white-500",
      },
      {
        title: "SELL OFFERS",
        count: stats.sellOffer,
        icon: "/img/sell_offer.png",
        bgColor: "bg-white-500",
      },
      {
        title: "B2B INTERACTIONS",
        count: stats.interaction,
        icon: "/img/b2b.png",
        bgColor: "bg-white-500",
      },
    ];
  } catch (error) {
    console.error("Error fetching platform statistics:", error);
    return [];
  }
};

export default PlatformStats;
