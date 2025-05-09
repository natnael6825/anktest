import { useDispatch } from "react-redux";
import { setSelectedOffer } from "@/store/offerSlice";
import { Link } from "react-router-dom";
import { fetchOfferByFilter } from "@/services/userServices";

export function ProductCard({ id, img, name, seller, quantity, date , offerType}) {
  const dispatch = useDispatch();

  const handleOfferClick = async () => {
    try {
      const fetchedOffer = await fetchOfferByFilter({ offerId: id, productName: name });
      dispatch(setSelectedOffer(fetchedOffer));
    } catch (error) {
      console.error("Error fetching offer details:", error);
    }
  };

  return (
    <Link to={`/product/${id}`} onClick={handleOfferClick} className="block">
      <div className="border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        {/* Product Image */}
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <img className="w-full h-full object-cover" src={img || "/img/default-placeholder.png"} alt={name} />
        </div>

        {/* Product Information */}
        <div className="px-4 py-4">
          {/* Product Name */}
          <h3 className="text-lg font-roboto font-semibold text-gray-900">{name}</h3>

          <p className="text-base font-roboto text-gray-500">
            <span className="font-semibold">I want to:</span> {offerType}
          </p>

          {/* Posted By */}
          <p className="text-base font-roboto text-gray-500">
            <span className="font-semibold">Posted by:</span> {seller}
          </p>

          {/* Quantity (if available) */}
          <p className="text-base font-roboto text-gray-500">
            <span className="font-semibold">Quantity:</span> {quantity ? quantity : <span className="block h-4" />}
          </p>

          {/* Posted Date */}
          <p className="text-base font-roboto text-gray-500">
            <span className="font-semibold">Post date:</span> {date}
          </p> 
        </div>
      </div>
    </Link>
  );
}
