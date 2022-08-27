import axios from "axios";
import config from "../../../../../config/config";

export const GET_ALL_CARBRANDS = config.baseUrl + "Carbrand";
export const GET_CARBRAND = config.baseUrl + "Carbrand/";
export const CREATE_CARBRAND = config.baseUrl + "Carbrand";
export const DELETE_CARBRAND = config.baseUrl + "Carbrand/";
export const UPDATE_CARBRAND = config.baseUrl + "Carbrand/";
export const FILTER_CARBRAND = config.baseUrl + "carbrand/filter";

export function CarbrandFilter(user, params) {
  return axios.get(FILTER_CARBRAND, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}
export function getAllCarbrands(user, params) {
  return axios.get(GET_ALL_CARBRANDS, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}

export function getCarbrand(user) {
  return axios.get(GET_CARBRAND, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function createCarbrand(user, data) {
  return axios.post(CREATE_CARBRAND, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function updateCarbrand(user, CarbrandId, data) {
  return axios.put(UPDATE_CARBRAND + CarbrandId, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function deleteCarbrand(user, champaignId) {
  return axios.delete(DELETE_CARBRAND + champaignId, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
