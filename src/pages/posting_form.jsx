import React, { useState, useEffect, useRef } from "react";
import NavStyle from "@/widgets/layout/nav_style";
import { Footer } from "@/widgets/layout";
import {
  getAllProductsByCategory,
  getCategories,
  getPropertiesByProduct,
  getPropertyValues,
  mainCommoditiesOffer,
  spiceOffer,
  buildingMaterialsOffer,
  grainsOffer,
  PulsesOffer,
  oilSeedsOffer,
  rootCropsOffer,
  VegetablesOffer,
  fruitCropsOffer,
  getProductById,
} from "@/services/productServices";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUser, fetchUserByToken } from "@/services/userServices";
import { useDispatch } from "react-redux";
import { setRedirectRoute } from '@/store/routeSlice';
import TelegramNavbar from "@/widgets/layout/telegramNavbar";
import { Dialog, DialogBody, DialogFooter, DialogHeader ,  Button as DialogButton,
} from "@material-tailwind/react";

// Regex to detect phone numbers
const phoneRegex = /(?<!\d)(0[79]\d{8}|(?:\+251|251)[79]\d{8})(?!\d)/;
const spacedPhoneRegex = /(?<!\d)(?:0\s*[79](?:\s*\d){8}|(?:\+?\s*2\s*5\s*1)\s*[79](?:\s*\d){8})(?!\d)/;


function Posting_form() {
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Sell");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [commodityProperties, setCommodityProperties] = useState([]);
  const [propertyValues, setPropertyValues] = useState({});
  const [chatId, setChatId] = useState("");
  const [selectedCommodityName, setSelectedCommodityName] = useState("");

  const [productDescription, setProductDescription] = useState("");

  const [quantity, setQuantity] = useState(null);
  const [measurementType, setMeasurementType] = useState("");

  const [price, setPrice] = useState(null);
  const [currency, setCurrency] = useState("Birr"); // default "Birr"

  // Category & Product Lists
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // New state to track if the app is loaded from Telegram
  const [loadedFromTelegram, setLoadedFromTelegram] = useState(false);
  const [telegramUser, setTelegramUser] = useState(null);

  // The measurement options you requested:
  const measurementOptions = [
    "KG / ኪግ",
    "FERESULA / ፈረሱላ",
    "BAG / ከረጢት",
    "KESHA / ኬሻ",
    "QUINTAL / ኩንታል",
    "TON / ቶን",
    "FCL",
  ];

  const offerFunctionMapping = {
    "Coffee / ቡና": mainCommoditiesOffer,
    "Spice & Herbs / ቅመማ ቅመሞቾ": spiceOffer,
    "Building Materials / የግንባታ እቃዎች": buildingMaterialsOffer,
    "Grains and Cereals / የእህል ሰብሎች": grainsOffer,
    "Pulses & Legumes / ጥራጥሬዎች ": PulsesOffer,
    "Oil Seeds / የቅባት እህሎች": oilSeedsOffer,
    "Root Crops / የስራስር ሰብሎች": rootCropsOffer,
    "Vegetables  / አትክልቶች": VegetablesOffer,
    "Fruit Crops / ፍራፍሬች": fruitCropsOffer
  };

  const navigate = useNavigate();

  // 1) Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 2) When user picks a category, fetch that category’s products
  useEffect(() => {
    if (!selectedCategory) return;
  
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let products;
        if (selectedCategory === "Roasted Coffee") {
          // Replace with the actual roasted coffee product ID if needed.
          const roastedCoffeeId = 11;
          const product = await getProductById(roastedCoffeeId, selectedCategory);
          // Wrap the fetched product in an array.
          products = [product];
        } else {
          products = await getAllProductsByCategory(selectedCategory);
        }
        setAllProducts(products || []);
        // Auto-select if there's only one product fetched.
        if (products && products.length === 1) {
          setSelectedProductId(products[0].id);
          setSelectedCommodityName(products[0].name);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [selectedCategory]);
  
  // 3) Check if launched via Telegram and grab the Telegram user data
  useEffect(() => {
    if (Object.keys(window.Telegram.WebApp.initDataUnsafe).length !== 0) {
      const { user } = window.Telegram.WebApp.initDataUnsafe;
      if (user) {
        const { id } = user;
        setChatId(id);
        setLoadedFromTelegram(true);
      } 
    } 
  }, []);

  // 4) When user selects a product (ID), fetch that product’s properties
  useEffect(() => {
    if (!selectedProductId || !selectedCategory) return;

    const fetchPropsAndValues = async () => {
      try {
        // 1) Fetch the list of properties
        const propsResponse = await getPropertiesByProduct(selectedProductId, selectedCategory);
        setCommodityProperties(propsResponse);

        // 2) For each property, fetch the possible values
        const tempValuesMap = {};
        for (const prop of propsResponse) {
          const valResponse = await getPropertyValues(selectedProductId, prop.id, selectedCategory);
          tempValuesMap[prop.id] = valResponse;
        }
        setPropertyValues(tempValuesMap);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch property info.");
      }
    };

    fetchPropsAndValues();
  }, [selectedProductId, selectedCategory]);

  // Auto-resize logic for description textarea
  const descriptionRef = useRef(null);
  const handleDescriptionChange = (e) => {
    setProductDescription(e.target.value);

    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = descriptionRef.current.scrollHeight + "px";
    }
  };


  const handleFormSubmit = (e) => {
    e.preventDefault();
    setOpenDialog(true);
  };

  // 5) Handle the final form submission
  const handlePost = async (e) => {
    setIsSubmitting(true);
    if (!selectedCommodityName || !selectedCategory) {
      toast.error("Please fill in all required fields.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsSubmitting(false);
      return;
    }
    
     // Check if measurement type is selected
  // if (!measurementType) {
  //   toast.error("Please Select a measurement type", {
  //     position: "top-center",
  //     autoClose: 5000,
  //     hideProgressBar: true,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //   });
  //   setIsSubmitting(false);
  //   return;
  //   }
    
    // Instead of removing phone numbers, show an error if any are detected
    if (phoneRegex.test(productDescription) || spacedPhoneRegex.test(productDescription)) {
      toast.error("Entering contact information is not allowed. Please remove any phone numbers from the description.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsSubmitting(false);
      return;
    }
  
    // Proceed with the sanitized description if valid
    const sanitizedDescription = productDescription;

    const numericQuantity = parseFloat(quantity);
    if ( numericQuantity <= 0) {
      toast.error("Quantity must be a number greater than 0.");
      setIsSubmitting(false);
      return;
    }
    
    let userInfo = {};

    if (loadedFromTelegram) {
      try {
        const response = await fetchUser({ chat_id: chatId });
        if (response.data.exists && response.data.user.is_verified === "1") {
          const { name, chat_id, business_type, is_trusted_user, contact_information } = response.data.user;
          const user_name = name;
          const is_featured = is_trusted_user;
          const phone_number = contact_information;
          userInfo = { user_name, chat_id, business_type, is_featured, phone_number };
        } else if (response.data.exists && (response.data.user.is_verified === "0" || !response.data.user.is_verified)){
          sessionStorage.setItem("unVerifiedPhoneNumber", response.data.user.contact_information);
          dispatch(setRedirectRoute(window.location.pathname));
          navigate("/VerificationConfirmation")
          setIsSubmitting(false);
          return;
        }else {
          dispatch(setRedirectRoute(window.location.pathname));
          navigate("/sign-in");
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        console.error("Error checking user existence:", err);
        toast.error("Error checking user. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsSubmitting(false);
        return;
      }
    } else if (!chatId) {
      const response = await fetchUserByToken();
      const { name, chat_id, business_type, is_trusted_user, contact_information } = response.data.user;
      const user_name = name;
      const is_featured = is_trusted_user;
      const phone_number = contact_information;
      userInfo = { user_name, chat_id, business_type, is_featured, phone_number };
    }

    const selectedPropertyValues = {};
    commodityProperties.forEach((prop) => {
      const selectedValue = propertyValues[prop.id]?.selectedValue;
      if (selectedValue) {
        selectedPropertyValues[prop.name.toLowerCase()] = selectedValue;
      }
    });

    const newProduct = {
      product_name: selectedCommodityName,
      posted_from: "web",
      productId: selectedProductId,
      description: sanitizedDescription,
      quantity,
      measurement: measurementType,
      price, // price is optional and may be empty
      currency,
      categoryName: selectedCategory,
      offer_type: selectedOption.toLowerCase(),
      ...selectedPropertyValues,
      ...userInfo,
    };

    const offerFunction = offerFunctionMapping[selectedCategory];
    if (!offerFunction) {
      toast.error("Selected category does not support offers.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await offerFunction(newProduct);
      // toast.success(`${selectedCommodityName} has been posted successfully!`, {
      //   position: "top-center",
      //   autoClose: 5000,
      //   hideProgressBar: true,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });

      navigate("/offerSuccess");

      // Reset form fields if successful
      setSelectedOption("Sell");
      setSelectedCategory("");
      setAllProducts([]);
      setSelectedProductId("");
      setSelectedCommodityName("");
      setCommodityProperties([]);
      setPropertyValues({});
      setProductDescription("");
      setQuantity("");
      setMeasurementType("");
      setPrice("");
      setCurrency("Birr");
    } catch (error) {
      console.error("Error posting offer:", error);
      toast.error("There was an error saving your offer. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sm:bg-white bg-white min-h-screen flex flex-col lg:bg-whiten">
      {!loadedFromTelegram && <NavStyle />}
      {loadedFromTelegram && <TelegramNavbar/>}
      <div className="lg:flex lg:flex-row lg:items-center lg:justify-between lg:flex-1  lg:px-52 sm:px-8 md:px-32 lg:mt-3 mb-5 sm:bg-white lg:bg-whiten">
        <div className="bg-white rounded-lg lg:shadow-lg sm:shadow-none lg:p-8 px-14  w-full max-w-xl">
          <div className="flex items-center  justify-between">  
            <h1 className="text-2xl font-semibold">I want to</h1>
          </div>
          <div className="flex space-x-4 mb-6">
            <button
              type="button"
              className={`px-6 py-2 rounded-full ${selectedOption === "Sell" ? "bg-green-500 text-white" : "bg-gray-200"}`}
              onClick={() => setSelectedOption("Sell")}
            >
              Sell / ሽያጭ
            </button>
            <button
              type="button"
              className={`px-6 py-2 rounded-full ${selectedOption === "Buy" ? "bg-green-500 text-white" : "bg-gray-200"}`}
              onClick={() => setSelectedOption("Buy")}
            >
              Buy / ገዢ
            </button>
          </div>
          <form onSubmit={handlePost}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Category / የምርት ምድቦች*</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedProductId("");
                  setSelectedCommodityName("");
                }}
              >
                <option value="">Select Category / የምርት ምድቦች</option>
                {loading ? (
                  <option>Loading...</option>
                ) : error ? (
                  <option>{error}</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Product Name / ምርቱን ይምረጡ *</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={selectedProductId}
                onChange={(e) => {
                  const productId = e.target.value;
                  setSelectedProductId(productId);
                  const p = allProducts.find((prd) => String(prd.id) === productId);
                  setSelectedCommodityName(p?.name || "");
                }}
                disabled={!selectedCategory}
              >
                <option value="">Select Product / ምርቱን ይምረጡ</option>
                {loading ? (
                  <option>Loading...</option>
                ) : error ? (
                  <option>{error}</option>
                ) : (
                  allProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            {commodityProperties.length > 0 && (
              <div className="mb-4 p-4 border rounded-md bg-gray-50">
                <h2 className="font-semibold mb-2">Commodity Properties</h2>
                {commodityProperties.map((prop) => (
                  <div key={prop.id} className="mb-2">
                    <label className="block text-gray-700 mb-1">{prop.name}:</label>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={(propertyValues[prop.id] && propertyValues[prop.id].selectedValue) || ""}
                      onChange={(e) => {
                        setPropertyValues((prevValues) => {
                          const current = prevValues[prop.id];
                          const options = Array.isArray(current) ? current : current?.values || [];
                          return {
                            ...prevValues,
                            [prop.id]: { values: options, selectedValue: e.target.value },
                          };
                        });
                      }}
                    >
                      <option value="">Select {prop.name}</option>
                      {(Array.isArray(propertyValues[prop.id])
                        ? propertyValues[prop.id]
                        : propertyValues[prop.id]?.values || []).map((valObj, idx) => (
                        <option key={idx} value={valObj.value}>
                          {valObj.value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Product Description / ተጨማሪ መረጃ</label>
              <textarea
                ref={descriptionRef}
                className="w-full border border-gray-300 rounded-md p-2 resize-none overflow-hidden"
                placeholder="Enter description / ተጨማሪ መረጃ"
                value={productDescription}
                onChange={handleDescriptionChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Quantity / መጠኑን ያስገቡ</label>
              <div className="flex space-x-2">
              <input
                type="number"
                step="any"
                className="w-1/2 border border-gray-300 rounded-md p-2"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />


                <select
                  className="w-1/2 border border-gray-300 rounded-md p-2"
                  value={measurementType}
                  onChange={(e) => setMeasurementType(e.target.value)}
                >
                  <option value="">Select Unit</option>
                  {measurementOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="items-end flex justify-end mt-6">
            <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-md"
                disabled={isSubmitting}
                onClick={handleFormSubmit}
              >
                {isSubmitting ? "Loading..." : "Post / ጨርስ"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {!loadedFromTelegram && <Footer />}

       {/* Material Tailwind Confirmation Dialog */}
       <Dialog
        open={openDialog}
        size="xs"
        handler={() => setOpenDialog(false)}
      >
        <DialogHeader>Confirm Post</DialogHeader>
        <DialogBody>
          Please confirm that you would like to Post this offer <br/>እባክዎ ያረጋግጡ።
        </DialogBody>
        <DialogFooter>
          <DialogButton
            variant="text"
            color="red"
            onClick={() => setOpenDialog(false)}
            className="mr-1"
          >
            <span>Cancel / አቋርጥ</span>
          </DialogButton>
          <DialogButton
            variant="gradient"
            color="green"
            onClick={async () => {
              await handlePost();
              setOpenDialog(false);
            }}
          >
            <span>Confirm / ጨርስ</span>
          </DialogButton>
        </DialogFooter>
      </Dialog>
      <ToastContainer />
    </div>
  );
}

export default Posting_form;
