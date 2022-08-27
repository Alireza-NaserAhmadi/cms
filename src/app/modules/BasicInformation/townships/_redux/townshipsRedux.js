import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";

export const actionTypes = {
    getAllTownships: "[getAllTownships] Action",
    getProvinces: "[getTownships] Action",
    addTownship: "[addTownship] Action",
    deleteTownship: "[deleteTownship] Action",
    editTownship: "[editTownship] Action",

};

const initialCountreiesState = {
    townships: [],
    provinces:[],
    isProvincesLoaded: false,
    isTownshipsLoaded: false,

};

export const reducer = persistReducer(
    { storage, key: "v705-demo1-townships", whitelist: ["user", "townships","provinces"] },
    (state = initialCountreiesState, action) => {
        switch (action.type) {
            case actionTypes.getAllTownships: {
                console.log("action.payload  townships::::", action.payload)
                const townships = action.payload;
                return {...state , townships, isTownshipsLoaded: true };
            }
            case actionTypes.getProvinces: {
                console.log("action.payload  provinces::::", action.payload)
                const provinces = action.payload;
                return { ...state ,provinces,isTownshipsLoaded:true};
            }

            case actionTypes.addTownship: {
                console.log("action.payload ::::", action.payload)
                const province = action.payload;
                return { ...state};
            }
            case actionTypes.editTownship: {
                console.log("action.payload ::::", action.payload)
                const province = action.payload;
                return { ...state};
            }
            case actionTypes.deleteTownship: {
                console.log("action.payload ::::", action.payload)
                const province = action.payload;
                return { ...state};
            }

        
            default:
                return state;
        }
    }
);

export const actions = {
    getAllTownships: townships => ({ type: actionTypes.getAllTownships, payload: { townships } }),
    getProvinces: provinces => ({ type: actionTypes.getProvinces, payload: { provinces } }),
    addTownship: townships => ({ type: actionTypes.addTownship, payload: { townships } }),
    editTownship: townships => ({ type: actionTypes.editTownship, payload: { townships } }),
    deleteTownship: townships => ({ type: actionTypes.deleteTownship, payload: { townships } }),

};
