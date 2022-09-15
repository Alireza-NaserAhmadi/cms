/** @format */

import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { put, takeLatest } from "redux-saga/effects"

export const actionTypes = {
  getAllBrands: "[getAllCarBrands] Action",
  addBrand: "[addCarBrand] Action",
  editBrand: "[editCarBrand] Action",
  deleteBrand: "[deleteCarBrand] Action",
}

const initialCountreiesState = {
  brands: [],
  brandsLoaded: false,
}

export const reducer = persistReducer(
  { storage, key: "v705-demo1-car-brands", whitelist: ["user", "brands"] },
  (state = initialCountreiesState, action) => {
    switch (action.type) {
      case actionTypes.getAllBrands: {
        console.log("action.payload ::::", action.payload)
        const brands = action.payload
        return { brands, brandsLoaded: true }
      }

      case actionTypes.addBrand: {
        return { ...state }
      }
      case actionTypes.editBrand: {
        return { ...state }
      }
      case actionTypes.deleteBrand: {
        return { ...state }
      }

      default:
        return state
    }
  }
)

export const actions = {
  getAllBrands: (brands) => ({
    type: actionTypes.getAllBrands,
    payload: { brands },
  }),
  addBrand: (brands) => ({
    type: actionTypes.addBrand,
    payload: { brands },
  }),
  editBrand: (brands) => ({
    type: actionTypes.editBrand,
    payload: { brands },
  }),
  deleteBrand: (brands) => ({
    type: actionTypes.deleteBrand,
    payload: { brands },
  }),
}
