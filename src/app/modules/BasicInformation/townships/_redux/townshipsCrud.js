/** @format */

import axios from "axios"
import config from "../../../../../config/config"

export const GET_ALL_TOWNSHIPS = config.baseUrl + "township/getAll"
export const CREATE_TOWNSHIP = config.baseUrl + "township/create"
export const DELETE_TOWNSHIP = config.baseUrl + "township/"
export const UPDATE_TOWNSHIP = config.baseUrl + "Township/"

export function getAllTownships(user, params) {
  return axios.get(GET_ALL_TOWNSHIPS, {
    headers: { Authorization: `Bearer ${user.authToken}` },
    params,
  })
}

export function createTownship(user, data) {
  return axios.post(CREATE_TOWNSHIP, data, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}

export function updateTownship(user, TownshipId, data) {
  return axios.put(UPDATE_TOWNSHIP + TownshipId, data, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}

export function deleteTownship(user, champaignId) {
  return axios.delete(DELETE_TOWNSHIP + champaignId, {
    headers: { Authorization: `Bearer ${user.authToken}` },
  })
}
