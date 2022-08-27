import axios from "axios";
import config from "../../../../../config/config";

export const GET_ALL_SUPPORT_ITEMS = config.baseUrl + "SupportItem";
export const GET_SUPPORT_ITEM = config.baseUrl + "SupportItem/";
export const CREATE_SUPPORT_ITEM = config.baseUrl + "SupportItem";
export const DELETE_SUPPORT_ITEM = config.baseUrl + "SupportItem/";
export const UPDATE_SUPPORT_ITEM = config.baseUrl + "SupportItem/";
export const FILTER_SUPPORT_ITEM = config.baseUrl + "SupportItem/filter";

export function SupportItemFilter(user, params) {
  return axios.get(FILTER_SUPPORT_ITEM, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}
export function getAllSupportItems(user, params) {
  return axios.get(GET_ALL_SUPPORT_ITEMS, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}

export function getSupportItem(user) {
  return axios.get(GET_SUPPORT_ITEM, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function createSupportItem(user, data) {
  return axios.post(CREATE_SUPPORT_ITEM, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function updateSupportItem(user, SupportItemId, data) {
  return axios.put(UPDATE_SUPPORT_ITEM + SupportItemId, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function deleteSupportItem(user, champaignId) {
  return axios.delete(DELETE_SUPPORT_ITEM + champaignId, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
