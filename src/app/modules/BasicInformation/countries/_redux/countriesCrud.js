/** @format */

import axios from "axios"
import config from "../../../../../config/config"

export const GET_ALL_COUNTRIES = config.baseUrl + "country/getAll"
export const CREATE_COUNTRY = config.baseUrl + "country/create"
export const DELETE_COUNTRY = config.baseUrl + "country/"
export const UPDATE_COUNTRY = config.baseUrl + "Country/"

export function getAllCountries(user) {
  return axios.get(GET_ALL_COUNTRIES, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}

export function createCountry(user, data) {
  return axios.post(CREATE_COUNTRY, data, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}

export function updateCountry(user, CountryId, data) {
  return axios.put(UPDATE_COUNTRY + CountryId, data, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}

export function deleteCountry(user, champaignId) {
  return axios.delete(DELETE_COUNTRY + champaignId, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}
