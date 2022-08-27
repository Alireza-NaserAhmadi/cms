import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";

export const actionTypes = {
    getAllDirections: "[getAllDirections] Action",
    getTownships: "[getTownships] Action",
    addDirections: "[addDirections] Action",
    editDirections: "[editDirections] Action",
    deleteDirections: "[deleteDirections] Action",


};

const initialCountreiesState = {
    directions: [],
    townships:[],
    isDirectionsLoaded: false,
};

export const reducer = persistReducer(
    { storage, key: "v705-demo1-direction", whitelist: ["user", "directions"] },
    (state = initialCountreiesState, action) => {
        switch (action.type) {
            case actionTypes.getAllDirections: {
                console.log("action.payload ::::", action.payload)
                const directions = action.payload;
                return { ...state,directions, isDirectionsLoaded: true };
            }
            case actionTypes.getTownships: {
                console.log("action.payload ::::", action.payload)
                const townships = action.payload;
                return { ...state,townships };
            }
            case actionTypes.addDirections: {
                return { ...state};
            }
            case actionTypes.deleteDirections: {
                return { ...state};
            }
            case actionTypes.editDirections: {
                return { ...state};
            }

            default:
                return state;
        }
    }
);

export const actions = {
    getAllDirections: directions => ({ type: actionTypes.getAllDirections, payload: { directions } }),
    getTownships: townships => ({ type: actionTypes.getTownships, payload: { townships } }),
    addDirections: directions => ({ type: actionTypes.addDirections, payload: { directions } }),
    deleteDirections: directions => ({ type: actionTypes.deleteDirections, payload: { directions } }),
    editDirections: directions => ({ type: actionTypes.editDirections, payload: { directions } }),


    
};
