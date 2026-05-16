import api from './api';
import axios from 'axios';

// ════════════════════════════════════════
// ADDRESS APIs — use authenticated instance
// ════════════════════════════════════════

export const getMyAddresses    = ()       => api.get('/addresses');
export const getDefaultAddress = ()       => api.get('/addresses/default');
export const getAddressById    = (id)     => api.get(`/addresses/${id}`);
export const createAddress     = (data)   => api.post('/addresses', data);
export const updateAddress     = (id, d)  => api.put(`/addresses/${id}`, d);
export const setDefaultAddress = (id)     => api.patch(`/addresses/${id}/set-default`);
export const deleteAddress     = (id)     => api.delete(`/addresses/${id}`);

// ════════════════════════════════════════
// VIETNAM ADDRESS DATA — public API (no auth)
// ════════════════════════════════════════

export const getProvinces = async () => {
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
