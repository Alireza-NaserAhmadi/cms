/** @format */

import axios from "axios"
import config from "../../../../../config/config"

export const GET_ALL_BRANDS = config.baseUrl + "brand"
export const CREATE_BRAND = config.baseUrl + "brand/create"
export const DELETE_BRAND = config.baseUrl + "brand/"
export const UPDATE_BRAND = config.baseUrl + "brand/"

export function getAllBrands(user, params) {
  return axios.get(GET_ALL_BRANDS, {
    headers: { Authorization: `Bearer ${user.authToken}` },
    params,
  })
}

export function createBrand(user, data) {
  return axios.post(CREATE_BRAND, data, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}

export function updateBrand(user, CarbrandId, data) {
  return axios.put(UPDATE_BRAND + CarbrandId, data, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}

export function deleteBrand(user, champaignId) {
  return axios.delete(DELETE_BRAND + champaignId, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}
