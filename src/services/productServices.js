import axios from "axios";
import Cookies from "js-cookie";

// const categoryUrls = {
//   "Coffee / ቡና": "https://eac.awakilo.com/api/CoffeeandMainCommodity",
//   "Spice & Herbs / ቅመማ ቅመሞቾ": "https://eac.awakilo.com/api/spices",
//   "Building Materials / የግንባታ እቃዎች": "https://eac.awakilo.com/api/BuildingMaterials",
//   "Grains and Cereals / የእህል ሰብሎች": "https://eac.awakilo.com/api/GrainsandCerials",
//   "Pulses & Legumes / ጥራጥሬዎች ": "https://eac.awakilo.com/api/pulse",
//   "Oil Seeds / የቅባት እህሎች": "https://eac.awakilo.com/api/oilSeed",
//   "Root Crops / የስራስር ሰብሎች": "https://eac.awakilo.com/api/rootCrop",
//   "Vegetables  / አትክልቶች": "https://eac.awakilo.com/api/vegetable",
//   "Fruit Crops / ፍራፍሬች": "https://eac.awakilo.com/api/fruit",
// };

const categoryUrls = {
  "Coffee / ቡና": "https://backend.ankuaru.com/api/CoffeeandMainCommodity",
  "Spice & Herbs / ቅመማ ቅመሞቾ": "https://backend.ankuaru.com/api/spices",
  "Building Materials / የግንባታ እቃዎች": "https://backend.ankuaru.com/api/BuildingMaterials",
  "Grains and Cereals / የእህል ሰብሎች": "https://backend.ankuaru.com/api/GrainsandCerials",
  "Pulses & Legumes / ጥራጥሬዎች ": "https://backend.ankuaru.com/api/pulse",
  "Oil Seeds / የቅባት እህሎች": "https://backend.ankuaru.com/api/oilSeed",
  "Root Crops / የስራስር ሰብሎች": "https://backend.ankuaru.com/api/rootCrop",
  "Vegetables  / አትክልቶች": "https://backend.ankuaru.com/api/vegetable",
  "Fruit Crops / ፍራፍሬች": "https://backend.ankuaru.com/api/fruit",
};

export const addProducts = async (productData, categoryName, picture_link) => {
  try {
    const url = categoryUrls[categoryName];
    if (!url) {
      throw new Error(`Invalid category name: "${categoryName}"`);
    }
    console.log("Posting to:", url);
    // Post the product data to the backend endpoint
    const response = await axios.post(`${url}/addProduct`, {
      ...productData,
      picture_link
    });
    return response.data;
  } catch (error) {
    console.error("Error adding products:", error);
    throw error;
  }
};

export const addProperties = async (name, categoryName) => {
  try {
    const url = categoryUrls[categoryName];
    console.log(url)
    if (!url) {
      throw new Error(`Invalid category name: "${categoryName}"`);
    }
    const response = await axios.post(`${url}/addProductProperties`, { name });
    // axios throws on non-2xx responses so this check may be optional
    return response.data;
  } catch (error) {
    console.error("Error adding properties: ", error);
    throw error;
  }
};


export const addPropertyValues = async (productId, productPropertyId, value, categoryName) => {
  try {
    const url = categoryUrls[categoryName];
    console.log(url)
    if (!url) {
      throw new Error(`Invalid category name: "${categoryName}"`);
    }
    const response = await axios.post(`${url}/addProductPropertiesValue`, { productId, productPropertyId, value });
    // axios throws on non-2xx responses so this check may be optional
    return response.data
  } catch (error) {
    console.error("Error adding Property Values: ", error)
    throw error
  }
}

export const getAllProductNames = async () => {
  try {
    const allProductNames = [];
    for (const categoryName in categoryUrls) {
      const baseUrl = categoryUrls[categoryName];
      const response = await axios.get(`${baseUrl}/fetchProduct`);
      const productNames = response.data.map((product) => product.name);
      allProductNames.push(...productNames);
    }

    return allProductNames; // Return only the names
  } catch (error) {
    console.error("Error fetching all Product Names: ", error);
    throw error;
  }
};

export const getProductById = async (productId, category) => {
  try {
    const baseUrl = categoryUrls[category];
    const response = await axios.post(`${baseUrl}/fetchProductById`, { productId });
    return response.data;
  } catch (error) {
    console.error("Error finding the product: ", error);
    throw error;
  }
};

const categoryMapping = {
  CoffeeAndMainCommodities: "Coffee / ቡና",
  FruitCrops:               "Fruit Crops / ፍራፍሬች",
  BuildingMaterials:        "Building Materials / የግንባታ እቃዎች",
  GrainsAndCereals:         "Grains and Cereals / የእህል ሰብሎች",
  PulsesLegumes:            "Pulses & Legumes / ጥራጥሬዎች ",
  OilSeeds:                 "Oil Seeds / የቅባት እህሎች",
  RootCrops:                "Root Crops / የስራስር ሰብሎች",
  Vegetables:               "Vegetables  / አትክልቶች",
  SpicesHerbs:              "Spice & Herbs / ቅመማ ቅመሞቾ"
};


export const createInteraction = async (
  category,
  poster_name,
  poster_phone_number,
  poster_business_type,
  poster_chat_id,
  viewer_name,
  viewer_phone_number,
  viewer_business_type,
  viewer_chat_id,
  offerId
) => {
  try {
    const mappedCategory = categoryMapping[category];
    if (!mappedCategory) {
      throw new Error(`Invalid category: ${category}`);
    }
    
    
    const Baseurl = categoryUrls[mappedCategory];
    const response = await axios.post(`${Baseurl}/createInteraction`, {
      poster_name,
      poster_phone_number,
      poster_business_type,
      poster_chat_id,
      viewer_name,
      viewer_phone_number,
      viewer_business_type,
      viewer_chat_id,
      offerId
    });
    return response.data;
  } catch (error) {
      console.error("Error creating interaction:", error);
      throw error;
    
  }
};



export const fetchOffers = async (offerId, phoneNumber) => {
  try {
    for (const categoryName in categoryUrls) {
      const baseUrl = categoryUrls[categoryName];
      const response = await axios.get(`${baseUrl}/fetchOffers`, {
        params: { offerId, phoneNumber }
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching an offer : " , error)
  }
}

export const updateOffer = async (categoryName, offerData) => {
  try {
    const baseUrl = categoryUrls[categoryName];
    if (!baseUrl) {
      throw new Error(`No URL for category: ${categoryName}`);
    }
    
    const response = await axios.post(`${baseUrl}/updateOffer`, offerData);
    return response.data;
  } catch (error) {
    console.error("Error updating offer:", error);
    throw error;
  }
};

export const getAllProductsByCategory = async (categoryName) => {
  try {
    const baseUrl = categoryUrls[categoryName];
    if (!baseUrl) {
      throw new Error(`No URL for category: ${categoryName}`);
    }
    const response = await axios.get(`${baseUrl}/fetchProduct`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all Products: ", error);
    throw error;
  }
}

export const getPropertiesByProduct = async (productId, categoryName) => {
  try {
    const baseUrl = categoryUrls[categoryName];
    if (!baseUrl) {
      throw new Error(`No URL mapped for category: ${categoryName}`);
    }

    const response = await axios.get(`${baseUrl}/fetchPropertyByProduct`, {
      params: { productId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching properties by product: ", error);
    throw error;
  }
};

export const getPropertiesByCategory = async ( categoryName) => {
  try {
    const baseUrl = categoryUrls[categoryName];
    if (!baseUrl) {
      throw new Error(`No URL mapped for category: ${categoryName}`);
    }
    const response = await axios.get(`${baseUrl}/fetchProperties`);
    return response.data;
  } catch (error) {
    console.error("Error fetching properties by product: ", error);
    throw error;
  }
};

export const getPropertyValues = async (productId, ProductPropertyId, categoryName) => {
  try {
    const baseUrl = categoryUrls[categoryName];
    if (!baseUrl) {
      throw new Error(`No URL mapped for category: ${categoryName}`);
    }
    const response = await axios.get(`${baseUrl}/fetchPropertyValue`, {
      params: { productId, ProductPropertyId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching property values: ", error);
    throw error;
  }
};

const postOfferHelper = async (categoryKey, data) => {
  const baseUrl = categoryUrls[categoryKey];
  if (!baseUrl) {
    throw new Error(`No base URL defined for category: ${categoryKey}`);
  }
  return axios.post(`${baseUrl}/postOffer`, data);
};

export const mainCommoditiesOffer = async (data) => {
  try {
    const response = await postOfferHelper("Coffee / ቡና", data);
    return response.data;
  } catch (error) {
    console.error("Error saving Coffee offer: ", error);
    throw error;
  }
};

export const spiceOffer = async (data) => {
  try {
    const response = await postOfferHelper("Spice & Herbs / ቅመማ ቅመሞቾ", data);
    return response.data;
  } catch (error) {
    console.error("Error saving spices offer: ", error);
    throw error;
  }
};


export const buildingMaterialsOffer = async (data) => {
  try {
    const response = await postOfferHelper("Building Materials / የግንባታ እቃዎች", data);
    return response.data;
  } catch (error) {
    console.error("Error saving building materials offer: ", error);
    throw error;
  }
};

export const grainsOffer = async (
  data
) => {
  try {

    const response = await postOfferHelper("Grains and Cereals / የእህል ሰብሎች", data);
    return response.data;
  } catch (error) {
    console.error("Error saving grains offer: ", error);
    throw error;
  }
};

export const PulsesOffer = async (
  data
) => {
  try {
    const response = await postOfferHelper("Pulses & Legumes / ጥራጥሬዎች ", data);
    return response.data;
  } catch (error) {
    console.error("Error saving pulses offer: ", error);
    throw error;
  }
};

export const oilSeedsOffer = async (
  data
) => {
  try {

    const response = await postOfferHelper("Oil Seeds / የቅባት እህሎች", data);
    return response.data;
  } catch (error) {
    console.error("Error saving oil seeds offer: ", error);
    throw error;
  }
};

export const rootCropsOffer = async (
  data
) => {
  try {

    const response = await postOfferHelper("Root Crops / የስራስር ሰብሎች", data);
    return response.data;
  } catch (error) {
    console.error("Error saving root crops offer: ", error);
    throw error;
  }
};

export const VegetablesOffer = async (
  data
) => {
  try {

    const response = await postOfferHelper("Vegetables  / አትክልቶች", data);
    return response.data;
  } catch (error) {
    console.error("Error saving vegetables offer: ", error);
    throw error;
  }
};


export const fruitCropsOffer = async (
  data
) => {
  try {
    const response = await postOfferHelper("Fruit Crops / ፍራፍሬች", data);
    return response.data;
  } catch (error) {
    console.error("Error saving fruit offer: ", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`https://eac.awakilo.com/api/Preference/categories`);
    // const response = await axios.get(`https://backend.ankuaru.com/api/Preference/categories`);
    return response.data.categories

  } catch (error) {
    console.error("Error getting category :", error)
  }
}
