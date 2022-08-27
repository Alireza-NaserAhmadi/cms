import axios from "axios";
import config from "../../../../../config/config";

export const GET_ALL_DIRECTION_DETAILS = config.baseUrl + "DirectionDetail";
export const GET_ALL_STATIONS = config.baseUrl + "Station";
export const GET_DIRECTION_DETAIL = config.baseUrl + "DirectionDetail/";
export const CREATE_DIRECTION_DETAIL = config.baseUrl + "DirectionDetail";
export const DELETE_DIRECTION_DETAIL = config.baseUrl + "DirectionDetail/";
export const UPDATE_DIRECTION_DETAIL = config.baseUrl + "DirectionDetail/";
export const FILTER_DIRECTION_DETAIL =
  config.baseUrl + "directiondetail/filter";

export function DirectionDetailFilter(user, params) {
  return axios.get(FILTER_DIRECTION_DETAIL, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}

export function getAllStations(user, params) {
  return axios.get(GET_ALL_STATIONS, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}

export function getAllDirectionDetails(user, params) {
  return axios.get(GET_ALL_DIRECTION_DETAILS, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}

export function getDirectionDetail(user) {
  return axios.get(GET_DIRECTION_DETAIL, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function createDirectionDetail(user, data) {
  return axios.post(CREATE_DIRECTION_DETAIL, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function updateDirectionDetail(user, DirectionDetailId, data) {
  return axios.put(UPDATE_DIRECTION_DETAIL + DirectionDetailId, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function deleteDirectionDetail(user, champaignId) {
  return axios.delete(DELETE_DIRECTION_DETAIL + champaignId, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
