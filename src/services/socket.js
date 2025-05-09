import { io } from "socket.io-client";

const SOCKET_URL = "https://eac.awakilo.com"; // Ensure this matches your backend URL

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensures stable connection
  reconnectionAttempts: 5, // Retry connecting 5 times if disconnected
  reconnectionDelay: 3000, // Wait 3 seconds between retries
});


// ✅ Successful connection
socket.on("connect", () => {
});

// ⚠️ Disconnection event
socket.on("disconnect", (reason) => {
  console.warn("⚠️ Disconnected from WebSocket server:", reason);
});

// ❌ Connection error
socket.on("connect_error", (error) => {
  console.error("❌ WebSocket connection error:", error);
});

// 🔄 Reconnection attempt
socket.on("reconnect_attempt", (attemptNumber) => {
});

// 🚫 Reconnection failed
socket.on("reconnect_failed", () => {
  console.error("❌ Reconnection to WebSocket server failed.");
});

// 📢 Listen for new offers
const subscribeToNewOffers = (callback) => {

  socket.on("new_offer", (newOffer) => {

    if (typeof callback === "function") {
      callback(newOffer);
    } else {
      console.warn("⚠️ Callback function is not defined or is not a function.");
    }
  });
};

// 📤 Send messages (for future functionality)
const sendMessage = (event, data) => {
  socket.emit(event, data);
};

// 🛑 Unsubscribe from new offers
const unsubscribeFromNewOffers = () => {
  socket.off("new_offer");
};

export { socket, subscribeToNewOffers, sendMessage, unsubscribeFromNewOffers };
