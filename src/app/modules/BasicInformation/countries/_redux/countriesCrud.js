import axios from "axios";
import config from "../../../../../config/config";

export const GET_ALL_COUNTRIES = config.baseUrl + "Country";
export const GET_COUNTRY = config.baseUrl + "Country/";
export const CREATE_COUNTRY = config.baseUrl + "Country";
export const DELETE_COUNTRY = config.baseUrl + "Country/";
export const UPDATE_COUNTRY = config.baseUrl + "Country/";
export const FILTER_COUNTRY = config.baseUrl + "country/filter";

export function CountryFilter(user, params) {
  return axios.get(FILTER_COUNTRY, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}
export function getAllCountries(user, params) {
  return axios.get(GET_ALL_COUNTRIES, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}

export function getCountry(user) {
  return axios.get(GET_COUNTRY, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function createCountry(user, data) {
  return axios.post(CREATE_COUNTRY, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function updateCountry(user, CountryId, data) {
  return axios.put(UPDATE_COUNTRY + CountryId, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function deleteCountry(user, champaignId) {
  return axios.delete(DELETE_COUNTRY + champaignId, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
