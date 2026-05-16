import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, User, Check } from 'lucide-react';
import {
  getProvinces,
  getDistricts,
  getWards,
} from '../services/addressApi';

export default function AddressForm({ initialData, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    receiverName: '',
    phoneNumber: '',
    province: '',
    district: '',
    ward: '',
    detailAddress: '',
    isDefault: false,
    ...initialData,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [provinceCode, setProvinceCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    getProvinces()
      .then((data) => {
        setProvinces(data);
        setLoadingProvinces(false);
      })
      .catch(() => {
        setLoadingProvinces(false);
      });
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (!provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }
    setLoadingDistricts(true);
    getDistricts(provinceCode)
      .then((data) => {
        setDistricts(data);
        setLoadingDistricts(false);
      })
      .catch(() => {
        setLoadingDistricts(false);
      });
  }, [provinceCode]);

  // Load wards when district changes
  useEffect(() => {
    if (!districtCode) {
      setWards([]);
      return;
    }
    setLoadingWards(true);
    getWards(districtCode)
      .then((data) => {
        setWards(data);
        setLoadingWards(false);
      })
      .catch(() => {
        setLoadingWards(false);
      });
  }, [districtCode]);

  const handleProvinceChange = (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const code = selectedOption.dataset.code;
    const name = selectedOption.value;

    setProvinceCode(code);
    setFormData({ ...formData, province: name, district: '', ward: '' });
    setDistrictCode('');
  };

  const handleDistrictChange = (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const code = selectedOption.dataset.code;
    const name = selectedOption.value;

    setDistrictCode(code);
    setFormData({ ...formData, district: name, ward: '' });
  };

  const handleWardChange = (e) => {
    const name = e.target.value;
    setFormData({ ...formData, ward: name });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fadeUp" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-serif text-xl font-semibold text-gray-900">
          {initialData ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
        </h3>
        <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors" onClick={onCancel}>
          <X size={18} />
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Receiver name */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <User size={14} className="text-gray-400" />
            Tên người nhận <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400"
            value={formData.receiverName}
            onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <Phone size={14} className="text-gray-400" />
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="0912345678"
            required
          />
        </div>

        {/* Province */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <MapPin size={14} className="text-gray-400" />
            Tỉnh/Thành phố <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-400"
            value={formData.province}
            onChange={handleProvinceChange}
            required
            disabled={loadingProvinces}
          >
            <option value="">
              {loadingProvinces ? 'Đang tải...' : '-- Chọn Tỉnh/Thành --'}
            </option>
            {provinces.map((p) => (
              <option key={p.code} value={p.name} data-code={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            Quận/Huyện <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-400"
            value={formData.district}
            onChange={handleDistrictChange}
            required
            disabled={!provinceCode || loadingDistricts}
          >
            <option value="">
              {loadingDistricts ? 'Đang tải...' : '-- Chọn Quận/Huyện --'}
            </option>
            {districts.map((d) => (
              <option key={d.code} value={d.name} data-code={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ward */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            Phường/Xã <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-400"
            value={formData.ward}
            onChange={handleWardChange}
            required
            disabled={!districtCode || loadingWards}
          >
            <option value="">
              {loadingWards ? 'Đang tải...' : '-- Chọn Phường/Xã --'}
            </option>
            {wards.map((w) => (
              <option key={w.code} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Detail address */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            Địa chỉ chi tiết <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400"
            value={formData.detailAddress}
            onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
            placeholder="Số nhà, tên đường..."
            required
          />
        </div>

        {/* Is default */}
        <div className="flex flex-col gap-1.5 md:col-span-2 mt-2">
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <input
              type="checkbox"
              className="hidden"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            />
            <span className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isDefault ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-transparent group-hover:border-gray-400'}`}>
              <Check size={14} />
            </span>
            <span className="text-sm font-medium text-gray-700 select-none">Đặt làm địa chỉ mặc định</span>
          </label>
        </div>
      </div>

      <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
        <button type="button" className="btn btn-outline bg-white hover:bg-gray-50" onClick={onCancel} disabled={loading}>
          Hủy
        </button>
        <button type="submit" className="btn btn-dark" disabled={loading}>
          {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thêm địa chỉ'}
        </button>
      </div>
    </form>
  );
}
