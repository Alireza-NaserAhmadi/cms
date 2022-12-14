import axios from "axios";
import config from "../../../../../config/config";

export const GET_ALL_PROVINCES = config.baseUrl + "province";
export const GET_PROVINCE = config.baseUrl + "province/";
export const CREATE_PROVINCE = config.baseUrl + "province";
export const DELETE_PROVINCE = config.baseUrl + "province/";
export const UPDATE_PROVINCE = config.baseUrl + "province/";
export const FILTER_PROVINCE = config.baseUrl + "province/filter";

export function ProvinceFilter(user, params) {
  return axios.get(FILTER_PROVINCE, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}
export function getAllProvinces(user, params) {
  return axios.get(GET_ALL_PROVINCES, {
    headers: { Authorization: `Bearer ${user.token}` },
    params,
  });
}

export function getProvince(user) {
  return axios.get(GET_PROVINCE, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function createProvince(user, data) {
  return axios.post(CREATE_PROVINCE, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function updateProvince(user, ProvinceId, data) {
  return axios.put(UPDATE_PROVINCE + ProvinceId, data, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export function deleteProvince(user, champaignId) {
  return axios.delete(DELETE_PROVINCE + champaignId, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
