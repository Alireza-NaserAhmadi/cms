/** @format */

import axios from "axios"
import config from "../../../../../config/config"

export const GET_ALL_COLORS = config.baseUrl + "color"
export const CREATE_COLOR = config.baseUrl + "color/create"
export const DELETE_COLOR = config.baseUrl + "color/"
export const UPDATE_COLOR = config.baseUrl + "color/"

export function getAllColors(user) {
  return axios.get(GET_ALL_COLORS, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}

export function createColor(user, data) {
  return axios.post(CREATE_COLOR, data, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}

export function updateColor(user, CountryId, data) {
  return axios.put(UPDATE_COLOR + CountryId, data, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}

export function deleteColor(user, champaignId) {
  return axios.delete(DELETE_COLOR + champaignId, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}
