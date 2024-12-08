import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userDetails: null,
  loading: false, 
  error: null,
  isLoggedIn: false,
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
        loginInStart : (state) => {
            state.loading = true;
            state.error = false;
        },

        loginInSuccess: (state, action) => {
            state.userDetails = action.payload;
            state.error = null;
            state.loading = false;
            state.isLoggedIn = true;
        },

        loginInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        logout: (state) => {
          state.userDetails = null;
          state.error = null;
          state.loading = false;
          state.isLoggedIn = false;
        },

        updateProfile: (state, action) => {
          state.userDetails = action.payload;
        },

        
  },
})

export const { loginInStart, loginInSuccess, loginInFailure, logout, updateProfile } = counterSlice.actions

export default counterSlice.reducer