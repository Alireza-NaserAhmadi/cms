import axios from "axios";
import config from "../../../../../config/config";

export const GET_ALL_DIRECTIONS = config.baseUrl + "Direction";
export const GET_DIRECTION = config.baseUrl + "Direction/";
export const CREATE_DIRECTION = config.baseUrl + "Direction";
export const DELETE_DIRECTION = config.baseUrl + "Direction/";
export const UPDATE_DIRECTION = config.baseUrl + "Direction/";
export const FILTER_DIRECTION = config.baseUrl + "direction/filter";

export function DirectionFilter(user, params) {
  return axios.get(FILTER_DIRECTION, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}
export function getAllDirections(user, params) {
  return axios.get(GET_ALL_DIRECTIONS, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}

export function getDirection(user) {
  return axios.get(GET_DIRECTION, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function createDirection(user, data) {
  return axios.post(CREATE_DIRECTION, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function updateDirection(user, DirectionId, data) {
  return axios.put(UPDATE_DIRECTION + DirectionId, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function deleteDirection(user, champaignId) {
  return axios.delete(DELETE_DIRECTION + champaignId, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
