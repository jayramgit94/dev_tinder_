import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
    name: 'user',
    initialState: {data: null, isLoading: true},
    reducers: {
      addUser:(state, action)=>{
        return {data: action.payload, isLoading: false};
      },
      removeUser:(state,action)=>{
        return {data: null, isLoading: false};
      }
    }
  });

export const {addUser, removeUser} = UserSlice.actions;
export default UserSlice.reducer;