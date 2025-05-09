import { createSlice } from "@reduxjs/toolkit";

const offersSlice = createSlice({
  name: "offers",
  initialState: {
    allOffers: {},
    selectedOffer: null,
  },
  reducers: {
    setOffers(state, action) {
      const { category, offers } = action.payload;
      state.allOffers[category] = offers;
    },
    setSelectedOffer(state, action) {
      state.selectedOffer = action.payload;
    },
    setAllOffers(state, action) {
      state.allOffers = action.payload;
    },
  },
});

export const { setOffers, setSelectedOffer, setAllOffers } = offersSlice.actions;
export default offersSlice.reducer;