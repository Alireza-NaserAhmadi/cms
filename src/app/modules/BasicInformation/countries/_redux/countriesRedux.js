import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";


export const actionTypes = {
    getAllCountries: "[getAllCountries] Action",
    addCountry: "[addCountry] Action",
    deleteCountry: "[deleteCountry] Action",
    editCountry: "[editCountry] Action",


};

const initialCountreiesState = {
    countries: [],
    isCountriesLoaded: false,
};

export const reducer = persistReducer(
    { storage, key: "v705-demo1-countries", whitelist: ["user", "countries"] },
    (state = initialCountreiesState, action) => {
        switch (action.type) {
            case actionTypes.getAllCountries: {
                console.log("action.payload getAllCountries::::", action.payload)
                const countries = action.payload;
                return { countries, isCountriesLoaded: true };
            }

            case actionTypes.addCountry: {
                console.log("action.payload ::::", action.payload)
                const country = action.payload;
                return { countries: initialCountreiesState.countries.push(country), isCountriesLoaded: true };
            }
            case actionTypes.editCountry: {
                console.log("action.payload ::::", action.payload)
                const country = action.payload;
                return { countries: initialCountreiesState.countries.push(country), isCountriesLoaded: true };
            }
            case actionTypes.deleteCountry: {
                console.log("action.payload ::::", action.payload)
                const country = action.payload;
                return { countries: initialCountreiesState.countries.push(country), isCountriesLoaded: true };
            }

            default:
                return state;
        }
    }
);

export const actions = {
    getAllCountries: countries => ({ type: actionTypes.getAllCountries, payload: { countries } }),
    addCountry: country => ({ type: actionTypes.addCountry, payload: { country } }),
    editCountry: country => ({ type: actionTypes.editCountry, payload: { country } }),
    deleteCountry: country => ({ type: actionTypes.deleteCountry, payload: { country } }),


};

