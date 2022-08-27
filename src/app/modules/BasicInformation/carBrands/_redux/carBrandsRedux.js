import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";

export const actionTypes = {
  getAllCarBrands: "[getAllCarBrands] Action",
  addCarBrand: "[addCarBrand] Action",
  editCarBrand: "[editCarBrand] Action",
  deleteCarBrand: "[deleteCarBrand] Action",
};

const initialCountreiesState = {
  carBrands: [],
  isCarBrandsLoaded: false,
};

export const reducer = persistReducer(
  { storage, key: "v705-demo1-car-brands", whitelist: ["user", "carBrands"] },
  (state = initialCountreiesState, action) => {
    switch (action.type) {
      case actionTypes.getAllCarBrands: {
        console.log("action.payload ::::", action.payload);
        const carBrands = action.payload;
        return { carBrands, isCarBrandsLoaded: true };
      }

      case actionTypes.addCarBrand: {
        return { ...state };
      }
      case actionTypes.editCarBrand: {
        return { ...state };
      }
      case actionTypes.deleteCarBrand: {
        return { ...state };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  getAllCarBrands: (carBrands) => ({
    type: actionTypes.getAllCarBrands,
    payload: { carBrands },
  }),
  addCarBrand: (carBrands) => ({
    type: actionTypes.addCarBrand,
    payload: { carBrands },
  }),
  editCarBrand: (carBrands) => ({
    type: actionTypes.editCarBrand,
    payload: { carBrands },
  }),
  deleteCarBrand: (carBrands) => ({
    type: actionTypes.deleteCarBrand,
    payload: { carBrands },
  }),
};
