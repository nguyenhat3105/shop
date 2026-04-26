import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus, Pencil, Trash2, X, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getCategories,
  getProductVariants, addProductVariant, deleteProductVariant,
} from '../../services/api';

/* ─────────── Helpers ─────────── */
const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n ?? 0);

const EMPTY_FORM = {
  name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '', galleryImages: '',
};

const EMPTY_VARIANT = { size: '', color: '', stock: '' };

/* ════════════════════════════════════════════════════════════════
   AdminProducts — Full CRUD + Variant Management
════════════════════════════════════════════════════════════════ */
export default function AdminProducts() {
  /* ── State ── */
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(null); // id being deleted

  // Modal/form state
  const [modalOpen, setModalOpen]     = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null = create, obj = edit
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]   = useState({});

  // Variant accordion
  const [expandedId, setExpandedId]   = useState(null);
  const [variantMap, setVariantMap]   = useState({}); // { productId: [variants] }
  const [variantLoading, setVariantLoading] = useState(false);
  const [newVariant, setNewVariant]   = useState(EMPTY_VARIANT);
  const [addingVariant, setAddingVariant] = useState(false);

  /* ── Load Data ── */
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        getProducts(0, 200),
        getCategories(),
      ]);
      setProducts(prodRes.data.content ?? []);
      setCategories(catRes.data ?? []);
    } catch {
      alert('Lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Open variant accordion ── */
  const toggleVariants = async (productId) => {
    if (expandedId === productId) { setExpandedId(null); return; }
    setExpandedId(productId);
    setNewVariant(EMPTY_VARIANT);
    if (!variantMap[productId]) {
      setVariantLoading(true);
      try {
        const res = await getProductVariants(productId);
        setVariantMap(prev => ({ ...prev, [productId]: res.data }));
      } catch { /* ignore */ }
      finally { setVariantLoading(false); }
    }
  };

  /* ── Add variant ── */
  const handleAddVariant = async (productId) => {
    if (!newVariant.size && !newVariant.color) {
      alert('Vui lòng nhập ít nhất Size hoặc Màu sắc.'); return;
    }
    if (!newVariant.stock || newVariant.stock < 0) {
      alert('Vui lòng nhập số lượng hợp lệ.'); return;
    }
    try {
      setAddingVariant(true);
      const res = await addProductVariant(productId, {
        size: newVariant.size || null,
        color: newVariant.color || null,
        stock: Number(newVariant.stock),
      });
      setVariantMap(prev => ({
        ...prev,
        [productId]: [...(prev[productId] ?? []), res.data],
      }));
      setNewVariant(EMPTY_VARIANT);
    } catch {
      alert('Lỗi khi thêm biến thể.');
    } finally {
      setAddingVariant(false);
    }
  };

  /* ── Delete variant ── */
  const handleDeleteVariant = async (productId, variantId) => {
    if (!window.confirm('Xoá biến thể này?')) return;
    try {
      await deleteProductVariant(productId, variantId);
      setVariantMap(prev => ({
        ...prev,
        [productId]: prev[productId].filter(v => v.id !== variantId),
      }));
    } catch {
      alert('Lỗi khi xoá biến thể.');
    }
  };

  /* ── Open modal ── */
  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name:          product.name ?? '',
      description:   product.description ?? '',
      price:         product.price ?? '',
      stock:         product.stock ?? '',
      imageUrl:      product.imageUrl ?? '',
      categoryId:    product.categoryId ?? '',
      galleryImages: (product.galleryImages ?? []).join('\n'),
    });
    setFormErrors({});
    setModalOpen(true);
  };

  /* ── Validate ── */
  const validate = () => {
    const errs = {};
    if (!form.name.trim())      errs.name = 'Tên không được để trống.';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errs.price = 'Giá phải > 0.';
    if (form.stock === '' || isNaN(form.stock) || Number(form.stock) < 0) errs.stock = 'Tồn kho phải >= 0.';
    if (!form.categoryId)       errs.categoryId = 'Chọn danh mục.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      name:          form.name,
      description:   form.description,
      price:         Number(form.price),
      stock:         Number(form.stock),
      imageUrl:      form.imageUrl,
      categoryId:    Number(form.categoryId),
      galleryImages: form.galleryImages
        ? form.galleryImages.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
    };
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi lưu sản phẩm.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete product ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch {
      alert('Lỗi khi xoá sản phẩm.');
    } finally {
      setDeleting(null);
    }
  };

  /* ── Render ── */
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
      <Loader2 className="spin" size={36} />
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Sản phẩm <span style={{ fontSize: '16px', fontWeight: 400, color: '#64748b' }}>({products.length})</span></h1>
        <button className="admin-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={openCreate}>
          <Plus size={16} /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Kho</th>
              <th>Biến thể</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <React.Fragment key={product.id}>
                <tr>
                  <td>
                    <img
                      src={product.imageUrl || `https://picsum.photos/seed/${product.id}/40/40`}
                      alt={product.name}
                      style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    />
                  </td>
                  <td style={{ fontWeight: 500, maxWidth: '240px' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>ID: {product.id}</div>
                  </td>
                  <td>
                    <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, color: '#475569' }}>
                      {product.categoryName}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#b8955a' }}>{formatVND(product.price)}</td>
                  <td>
                    <span style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600,
                      background: product.stock > 0 ? '#dcfce7' : '#fee2e2',
                      color: product.stock > 0 ? '#15803d' : '#b91c1c',
                    }}>
                      {product.stock > 0 ? product.stock : 'Hết'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleVariants(product.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '5px 10px', borderRadius: '6px', border: '1px solid #e2e8f0',
                        background: expandedId === product.id ? '#eff6ff' : '#fff',
                        color: expandedId === product.id ? '#2563eb' : '#475569',
                        cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                      }}
                    >
                      {product.variants?.length ?? 0} SKU
                      {expandedId === product.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEdit(product)}
                        style={{
                          padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0',
                          background: '#fff', color: '#334155', cursor: 'pointer', fontSize: '13px',
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                      >
                        <Pencil size={13} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        style={{
                          padding: '6px 10px', borderRadius: '6px', border: 'none',
                          background: '#fee2e2', color: '#b91c1c', cursor: 'pointer', fontSize: '13px',
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                      >
                        {deleting === product.id ? <Loader2 size={13} className="spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Variant accordion row */}
                {expandedId === product.id && (
                  <tr>
                    <td colSpan={7} style={{ background: '#f8fafc', padding: '20px 24px', borderBottom: '2px solid #e2e8f0' }}>
                      <div style={{ maxWidth: '700px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '14px' }}>
                          🎨 Biến thể của sản phẩm: <em>{product.name}</em>
                        </h4>

                        {variantLoading ? (
                          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <Loader2 className="spin" size={20} />
                          </div>
                        ) : (
                          <>
                            {/* Existing variants */}
                            {(variantMap[product.id] ?? []).length === 0 ? (
                              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>Chưa có biến thể. Thêm bên dưới.</p>
                            ) : (
                              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '13px' }}>
                                <thead>
                                  <tr style={{ background: '#f1f5f9' }}>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', borderRadius: '4px 0 0 4px' }}>Size</th>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Màu</th>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Tồn kho</th>
                                    <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#64748b', borderRadius: '0 4px 4px 0' }}>Xoá</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(variantMap[product.id] ?? []).map(v => (
                                    <tr key={v.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                      <td style={{ padding: '9px 12px' }}>{v.size || <span style={{ color: '#ccc' }}>—</span>}</td>
                                      <td style={{ padding: '9px 12px' }}>
                                        {v.color
                                          ? <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{v.color}</span>
                                          : <span style={{ color: '#ccc' }}>—</span>}
                                      </td>
                                      <td style={{ padding: '9px 12px' }}>
                                        <span style={{
                                          padding: '3px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '12px',
                                          background: v.stock > 0 ? '#dcfce7' : '#fee2e2',
                                          color: v.stock > 0 ? '#15803d' : '#b91c1c',
                                        }}>{v.stock}</span>
                                      </td>
                                      <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                                        <button
                                          onClick={() => handleDeleteVariant(product.id, v.id)}
                                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}

                            {/* Add new variant form */}
                            <div style={{ background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '14px 16px' }}>
                              <p style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>+ Thêm biến thể mới</p>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Size</label>
                                  <input
                                    value={newVariant.size}
                                    onChange={e => setNewVariant(v => ({ ...v, size: e.target.value }))}
                                    placeholder="S, M, L, XL..."
                                    style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', width: '90px', fontSize: '13px' }}
                                  />
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Màu sắc</label>
                                  <input
                                    value={newVariant.color}
                                    onChange={e => setNewVariant(v => ({ ...v, color: e.target.value }))}
                                    placeholder="Đen, Trắng..."
                                    style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', width: '110px', fontSize: '13px' }}
                                  />
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Tồn kho *</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={newVariant.stock}
                                    onChange={e => setNewVariant(v => ({ ...v, stock: e.target.value }))}
                                    placeholder="0"
                                    style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', width: '80px', fontSize: '13px' }}
                                  />
                                </div>
                                <button
                                  onClick={() => handleAddVariant(product.id)}
                                  disabled={addingVariant}
                                  style={{
                                    padding: '7px 14px', background: '#0f172a', color: '#fff',
                                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                  }}
                                >
                                  {addingVariant ? <Loader2 size={14} className="spin" /> : <PlusCircle size={14} />}
                                  Thêm
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
            <p style={{ fontSize: '16px' }}>Chưa có sản phẩm nào.</p>
            <button className="admin-btn" style={{ marginTop: '16px' }} onClick={openCreate}>
              + Thêm sản phẩm đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* ── Modal Drawer ── */}
      {modalOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
          }}
        >
          <div style={{
            width: '520px', maxWidth: '100%', height: '100vh', overflowY: 'auto',
            background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '24px 28px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, background: '#fff', zIndex: 10,
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>
                {editProduct ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#64748b' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ flex: 1, padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <FormField label="Tên sản phẩm *" error={formErrors.name}>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Áo thun Premium..."
                  style={inputStyle(formErrors.name)}
                />
              </FormField>

              <FormField label="Mô tả">
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Mô tả ngắn về sản phẩm..."
                  rows={3}
                  style={{ ...inputStyle(), resize: 'vertical' }}
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Giá bán (VNĐ) *" error={formErrors.price}>
                  <input
                    type="number" min="0"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="250000"
                    style={inputStyle(formErrors.price)}
                  />
                </FormField>
                <FormField label="Tồn kho (tổng) *" error={formErrors.stock}>
                  <input
                    type="number" min="0"
                    value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    placeholder="100"
                    style={inputStyle(formErrors.stock)}
                  />
                </FormField>
              </div>

              <FormField label="Danh mục *" error={formErrors.categoryId}>
                <select
                  value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  style={{ ...inputStyle(formErrors.categoryId), appearance: 'auto' }}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="URL Hình ảnh chính">
                <input
                  value={form.imageUrl}
                  onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://..."
                  style={inputStyle()}
                />
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px', border: '1px solid #e2e8f0' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                )}
              </FormField>

              <FormField label="Ảnh phụ (mỗi URL một dòng)">
                <textarea
                  value={form.galleryImages}
                  onChange={e => setForm(f => ({ ...f, galleryImages: e.target.value }))}
                  placeholder={'https://url-anh-1.jpg\nhttps://url-anh-2.jpg'}
                  rows={3}
                  style={{ ...inputStyle(), resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }}
                />
              </FormField>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1, padding: '12px', background: '#0f172a', color: '#fff',
                    border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px',
                  }}
                >
                  {saving ? <><Loader2 size={16} className="spin" /> Đang lưu...</> : (editProduct ? '💾 Cập nhật' : '✅ Tạo sản phẩm')}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '12px 20px', background: '#f1f5f9', color: '#334155',
                    border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '15px',
                  }}
                >
                  Huỷ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */
function FormField({ label, error, children }) {
  return (
    <div>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
      {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}

function inputStyle(error = false) {
  return {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${error ? '#f87171' : '#d1d5db'}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    background: '#fff',
  };
}
