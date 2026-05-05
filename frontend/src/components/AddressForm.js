import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, User, Check } from 'lucide-react';
import {
  getProvinces,
  getDistricts,
  getWards,
} from '../services/addressApi';
import './AddressForm.css';

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
    <form className="address-form" onSubmit={handleSubmit}>
      <div className="address-form__header">
        <h3 className="address-form__title">
          {initialData ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
        </h3>
        <button type="button" className="address-form__close" onClick={onCancel}>
          <X size={20} />
        </button>
      </div>

      <div className="address-form__body">
        {/* Receiver name */}
        <div className="form-group">
          <label className="form-label">
            <User size={14} />
            Tên người nhận <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.receiverName}
            onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label">
            <Phone size={14} />
            Số điện thoại <span className="required">*</span>
          </label>
          <input
            type="tel"
            className="form-input"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="0912345678"
            required
          />
        </div>

        {/* Province */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={14} />
            Tỉnh/Thành phố <span className="required">*</span>
          </label>
          <select
            className="form-select"
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
        <div className="form-group">
          <label className="form-label">Quận/Huyện <span className="required">*</span></label>
          <select
            className="form-select"
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
        <div className="form-group">
          <label className="form-label">Phường/Xã <span className="required">*</span></label>
          <select
            className="form-select"
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
        <div className="form-group form-group--full">
          <label className="form-label">
            Địa chỉ chi tiết <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.detailAddress}
            onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
            placeholder="Số nhà, tên đường..."
            required
          />
        </div>

        {/* Is default */}
        <div className="form-group form-group--full">
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            />
            <span className="form-checkbox__box">
              {formData.isDefault && <Check size={14} />}
            </span>
            <span>Đặt làm địa chỉ mặc định</span>
          </label>
        </div>
      </div>

      <div className="address-form__footer">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
          Hủy
        </button>
        <button type="submit" className="btn btn-dark" disabled={loading}>
          {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thêm địa chỉ'}
        </button>
      </div>
    </form>
  );
}
