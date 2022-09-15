/** @format */

import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

export const actionTypes = {
  getAllColors: "[getAllColors] Action",
  addColor: "[addColor] Action",
  deleteColor: "[deleteColor] Action",
  editColor: "[editColor] Action",
}

const initialState = {
  colors: [],
  isColorsLoaded: false,
}

export const reducer = persistReducer(
  { storage, key: "v705-demo1-colors", whitelist: ["user", "colors"] },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.getAllColors: {
        const colors = action.payload
        return { colors, isColorsLoaded: true }
      }

      case actionTypes.addColor: {
        const color = action.payload
        return { colors: initialState.colors.push(color), isColorsLoaded: true }
      }
      case actionTypes.editColor: {
        const color = action.payload
        return { colors: initialState.colors.push(color), isColorsLoaded: true }
      }
      case actionTypes.deleteColor: {
        const color = action.payload
        return { colors: initialState.colors.push(color), isColorsLoaded: true }
      }

      default:
        return state
    }
  }
)

export const actions = {
  getAllColors: (colors) => ({
    type: actionTypes.getAllColors,
    payload: { colors },
  }),
  addColor: (color) => ({ type: actionTypes.addColor, payload: { color } }),
  editColor: (color) => ({ type: actionTypes.editColor, payload: { color } }),
  deleteColor: (color) => ({
    type: actionTypes.deleteColor,
    payload: { color },
  }),
}
