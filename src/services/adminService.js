import axios from "axios";
import Cookies from "js-cookie";

// const baseUrl = "https://eac.awakilo.com/api/Admin";
const baseUrl = "http://localhost:7050/api/Admin";

const getCookie = (name) => {
    const cookieArr = document.cookie.split(";");
    for (let cookie of cookieArr) {
      const [key, value] = cookie.split("=");
      if (key.trim() === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  };
  const token = getCookie('token');

export const adminLogin = async (email, password) => {
    try {
        const response = await axios.post(`${baseUrl}/adminLogin`, {
            email, password
        })
        return response.data;
    } catch (error) {
        console.error("Error logging in admin :", error)
        throw error;
    }
}

export const getAllBanks = async () => {
  try {
    const response = await axios.get(`${baseUrl}/getAllBanks`)
    return response.data
  } catch (error) {
    console.error("Error getting all banks : ", error);
    throw error
  }
}

export const createExchangeRate = async (body, source, hashtag) => {
  try {

    const response = await axios.post(`${baseUrl}/createExchangeRate`, {
      body, source, hashtag : "#ExchangeRates"
    }, { headers: { Authorization: `Bearer ${token}` } })
    return response.data
  } catch (error) {
    console.error("Error creating rate:  ", error)
    throw error
  }
}

export const fetchAllExchangeRate = async () => {
  try {
    const response = await axios.get(`${baseUrl}/getAllExchangeRates`)
    return response.data
  } catch (error) {
    console.error("Error fetching rate: ", error)
    throw error
  }
}

// export const fetchExchangeRateByDate = async () => {
//   try {
//     const response  = await axios.get(``)
//   } catch (error) {
//     console.error("Error fetcing ExchangeRateByDate : ", error)
//     throw error
//   }
// }

export const updateExchangeRate = async (body, source, hashtag , id) => {
  try {
    const response = await axios.put(`${baseUrl}/updateExchangeRate`, {
      exchangeId:id,body, source, hashtag : "#ExchangeRates"
    }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data
  } catch (error) {
    console.error("Error updating the exchnge rate: ", error);
  }
}

export const viewCount = async (postId) => {
  try {
    console.log("Count")
    const response = await axios.post(`${baseUrl}/incrementViewCount`, {
      postId
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Error updating view count : ", error);
    throw error
  }
}