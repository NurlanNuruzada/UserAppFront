import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  username: null,
  role: null,
};

export const UserCredentialsSlice = createSlice({
  name: "UserCredentials",
  initialState,
  reducers: {
    setUserCreditinals: (state, action) => {
      state.userId = action.payload.Id;
      state.username = action.payload.UserName;
    },
    clearUserCreditinals: (state) => {
      return initialState;
    },
  },
});

// Export actions and reducer
export const { setUserCreditinals, clearUserCreditinals } = UserCredentialsSlice.actions;
export default UserCredentialsSlice.reducer;



