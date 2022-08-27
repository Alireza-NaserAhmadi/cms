  import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";

export const actionTypes = {
    getAllProvinces: "[getAllProvinces] Action",
    getCountries: "[getCountries] Action",
    addProvince: "[addProvince] Action",
    deleteProvince: "[deleteProvince] Action",
    editProvince: "[editProvince] Action",

};

const initialCountreiesState = {
    provinces: [],
    countries:[],
    isProvincesLoaded: false,
    isCountriesLoaded: false,

};

export const reducer = persistReducer(
    { storage, key: "v705-demo1-province", whitelist: ["user", "provinces","countries"] },
    (state = initialCountreiesState, action) => {
        switch (action.type) {
            case actionTypes.getAllProvinces: {
                console.log("action.payload  provinces::::", action.payload)
                const provinces = action.payload;
                return {...state , provinces, isProvincesLoaded: true };
            }
            case actionTypes.getCountries: {
                console.log("action.payload  countries::::", action.payload)
                const countries = action.payload;
                return { ...state ,countries,isCountriesLoaded:true};
            }

            case actionTypes.addProvince: {
                console.log("action.payload ::::", action.payload)
                const country = action.payload;
                return { ...state};
            }
            case actionTypes.editProvince: {
                console.log("action.payload ::::", action.payload)
                const country = action.payload;
                return { ...state};
            }
            case actionTypes.deleteProvince: {
                console.log("action.payload ::::", action.payload)
                const country = action.payload;
                return { ...state};
            }

            

            default:
                return state;
        }
    }
);

export const actions = {
    getAllProvinces: provinces => ({ type: actionTypes.getAllProvinces, payload: { provinces } }),
    getCountries: countries => ({ type: actionTypes.getCountries, payload: { countries } }),
    addProvince: provinces => ({ type: actionTypes.addCountry, payload: { provinces } }),
    editProvince: provinces => ({ type: actionTypes.editCountry, payload: { provinces } }),
    deleteProvince: provinces => ({ type: actionTypes.deleteCountry, payload: { provinces } }),

};
