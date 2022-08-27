import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";

export const actionTypes = {
  getAllDirectionDetails: "[getAllDirectionDetails] Action",
  getStations: "[getStations] Action",
};

const initialCountreiesState = {
  directionDetails: [],
  stations: [],
  isDirectionDetailsLoaded: false,
};

export const reducer = persistReducer(
  { storage, key: "v705-demo1-details", whitelist: ["user", "directionDetails"] },
  (state = initialCountreiesState, action) => {
    switch (action.type) {
      case actionTypes.getAllDirectionDetails: {
        console.log("action.payload ::::", action.payload);
        const directionDetails = action.payload;
        return { ...state, directionDetails, isDirectionDetailsLoaded: true };
      }
      case actionTypes.getStations: {
        console.log("action.payload ::::", action.payload);
        const stations = action.payload;
        return { ...state, stations };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  getAllDirectionDetails: (directionDetails) => ({
    type: actionTypes.getAllDirectionDetails,
    payload: { directionDetails },
  }),
  getAllStations: (stations) => ({
    type: actionTypes.getStations,
    payload: { stations },
  }),
};
