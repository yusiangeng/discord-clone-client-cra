import { PayloadAction } from "@reduxjs/toolkit";
import { UserDetails } from "../../types/types";
import { authActions } from "../actions/authActions";

const initialState: {
  userDetails: UserDetails | null;
} = {
  userDetails: null,
};

const reducer = (state = initialState, action: PayloadAction<UserDetails>) => {
  switch (action.type) {
    case authActions.SET_USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
