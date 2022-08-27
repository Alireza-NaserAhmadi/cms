import axios from "axios";
import config from "../../../../../config/config";

export const GET_ALL_TOWNSHIPS = config.baseUrl + "Township";
export const GET_TOWNSHIP = config.baseUrl + "Township/";
export const CREATE_TOWNSHIP = config.baseUrl + "Township";
export const DELETE_TOWNSHIP = config.baseUrl + "Township/";
export const UPDATE_TOWNSHIP = config.baseUrl + "Township/";
export const FILTER_TOWNSHIP = config.baseUrl + "Township/filter";

export function TownshipFilter(user, params) {
  return axios.get(FILTER_TOWNSHIP, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}
export function getAllTownships(user, params) {
  return axios.get(GET_ALL_TOWNSHIPS, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}

export function getTownship(user, data) {
  return axios.get(GET_TOWNSHIP + data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function createTownship(user, data) {
  return axios.post(CREATE_TOWNSHIP, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function updateTownship(user, TownshipId, data) {
  return axios.put(UPDATE_TOWNSHIP + TownshipId, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function deleteTownship(user, champaignId) {
  return axios.delete(DELETE_TOWNSHIP + champaignId, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
