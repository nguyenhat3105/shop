import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// ════════════════════════════════════════
// ADDRESS APIs
// ════════════════════════════════════════

export const getMyAddresses = () => 
  axios.get(`${API_BASE}/addresses`);

export const getDefaultAddress = () => 
  axios.get(`${API_BASE}/addresses/default`);

export const getAddressById = (id) => 
  axios.get(`${API_BASE}/addresses/${id}`);

export const createAddress = (data) => 
  axios.post(`${API_BASE}/addresses`, data);

export const updateAddress = (id, data) => 
  axios.put(`${API_BASE}/addresses/${id}`, data);

export const setDefaultAddress = (id) => 
  axios.patch(`${API_BASE}/addresses/${id}/set-default`);

export const deleteAddress = (id) => 
  axios.delete(`${API_BASE}/addresses/${id}`);

// ════════════════════════════════════════
// VIETNAM ADDRESS DATA
// ════════════════════════════════════════

export const getProvinces = async () => {
  // Using Vietnam Provinces API
  const res = await axios.get('https://provinces.open-api.vn/api/p/');
  return res.data;
};

export const getDistricts = async (provinceCode) => {
  const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
  return res.data.districts;
};

export const getWards = async (districtCode) => {
  const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
  return res.data.wards;
};
