import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2, Plus, Pencil, Trash2, X, ChevronDown, ChevronUp,
  PlusCircle, Package, Search, RefreshCw, Tag, Image, AlertCircle,
} from 'lucide-react';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getCategories, getProductVariants, addProductVariant, deleteProductVariant,
} from '../../services/api';

/* ─── helpers ─── */
const fmt = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n ?? 0);

const EMPTY_FORM = {
  name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '', galleryImages: '',
};
const EMPTY_VARIANT = { size: '', color: '', stock: '' };

/* ─── sub-components ─── */
function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
    </div>
  );
}

const iStyle = (err) =>
  `w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors bg-white ${
    err ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-gray-900'
  }`;

/* ════════════════════════════════════════════════════════════════ */
export default function AdminProducts() {
  /* ── State ── */
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(null);
  const [search,      setSearch]      = useState('');
  const [filterCat,   setFilterCat]   = useState('all');

  const [modalOpen,   setModalOpen]   = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [formErrors,  setFormErrors]  = useState({});

  const [expandedId,      setExpandedId]      = useState(null);
  const [variantMap,      setVariantMap]      = useState({});
  const [variantLoading,  setVariantLoading]  = useState(false);
  const [newVariant,      setNewVariant]      = useState(EMPTY_VARIANT);
  const [addingVariant,   setAddingVariant]   = useState(false);

  /* ── Load ── */
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([getProducts(0, 200), getCategories()]);
      const arr = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.content ?? []);
      setProducts(arr);
      setCategories(Array.isArray(catRes.data) ? catRes.data : (catRes.data?.content ?? []));
    } catch { alert('Lỗi khi tải dữ liệu.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Variants ── */
  const toggleVariants = async (pid) => {
    if (expandedId === pid) { setExpandedId(null); return; }
    setExpandedId(pid);
    setNewVariant(EMPTY_VARIANT);
    if (!variantMap[pid]) {
      setVariantLoading(true);
      try {
        const res = await getProductVariants(pid);
        setVariantMap(prev => ({ ...prev, [pid]: Array.isArray(res.data) ? res.data : [] }));
      } catch { /* silent */ }
      finally { setVariantLoading(false); }
    }
  };

  const handleAddVariant = async (pid) => {
    if (!newVariant.size && !newVariant.color) { alert('Nhập ít nhất Size hoặc Màu sắc.'); return; }
    if (!newVariant.stock || newVariant.stock < 0) { alert('Nhập số lượng hợp lệ.'); return; }
    try {
      setAddingVariant(true);
      const res = await addProductVariant(pid, {
        size: newVariant.size || null, color: newVariant.color || null, stock: Number(newVariant.stock),
      });
      setVariantMap(prev => ({ ...prev, [pid]: [...(prev[pid] ?? []), res.data] }));
      setNewVariant(EMPTY_VARIANT);
    } catch { alert('Lỗi khi thêm biến thể.'); }
    finally { setAddingVariant(false); }
  };

  const handleDeleteVariant = async (pid, vid) => {
    if (!window.confirm('Xoá biến thể này?')) return;
    try {
      await deleteProductVariant(pid, vid);
      setVariantMap(prev => ({ ...prev, [pid]: prev[pid].filter(v => v.id !== vid) }));
    } catch { alert('Lỗi khi xoá biến thể.'); }
  };

  /* ── Modal ── */
  const openCreate = () => { setEditProduct(null); setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); };
  const openEdit   = (p) => {
    setEditProduct(p);
    setForm({ name: p.name ?? '', description: p.description ?? '', price: p.price ?? '', stock: p.stock ?? '', imageUrl: p.imageUrl ?? '', categoryId: p.categoryId ?? '', galleryImages: (p.galleryImages ?? []).join('\n') });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                               e.name = 'Tên không được để trống.';
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = 'Giá phải > 0.';
    if (form.stock === '' || isNaN(form.stock) || +form.stock < 0) e.stock = 'Tồn kho ≥ 0.';
    if (!form.categoryId)                                e.categoryId = 'Chọn danh mục.';
    setFormErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      name: form.name, description: form.description,
      price: +form.price, stock: +form.stock,
      imageUrl: form.imageUrl, categoryId: +form.categoryId,
      galleryImages: form.galleryImages ? form.galleryImages.split('\n').map(s => s.trim()).filter(Boolean) : [],
    };
    try {
      if (editProduct) await updateProduct(editProduct.id, payload);
      else             await createProduct(payload);
      setModalOpen(false);
      await load();
    } catch (err) { alert(err.response?.data?.message || 'Lỗi khi lưu sản phẩm.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xoá sản phẩm này?')) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch { alert('Lỗi khi xoá sản phẩm.'); }
    finally { setDeleting(null); }
  };

  /* computed */
  const displayed = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name?.toLowerCase().includes(q);
    const matchCat = filterCat === 'all' || String(p.categoryId) === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 xl:p-8 min-h-screen bg-gray-50/50">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.25em] uppercase text-amber-600 mb-2 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <Package size={10} /> Quản lý sản phẩm
          </span>
          <h1 className="text-[2rem] font-serif font-normal text-gray-900 leading-tight">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} sản phẩm · {categories.length} danh mục</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all">
            <RefreshCw size={14} /> Làm mới
          </button>
          <button onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
            <Plus size={16} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* ── Filter + Search ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-sm flex-wrap max-w-sm">
          <button onClick={() => setFilterCat('all')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterCat === 'all' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            Tất cả
          </button>
          {categories.slice(0, 5).map(c => (
            <button key={c.id} onClick={() => setFilterCat(String(c.id))}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterCat === String(c.id) ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              {c.name}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 shadow-sm transition-colors"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 size={28} className="animate-spin text-gray-300" />
            <p className="text-sm">Đang tải sản phẩm...</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <Package size={40} className="text-gray-200" />
            <p className="text-sm font-medium">Không có sản phẩm nào</p>
            <button onClick={openCreate} className="text-xs text-blue-600 hover:underline">+ Thêm sản phẩm đầu tiên</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="grid grid-cols-[44px_1fr_110px_90px_70px_90px_110px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <div />
              <div>Sản phẩm</div>
              <div className="text-right">Giá</div>
              <div className="text-center">Kho</div>
              <div className="text-center">SKU</div>
              <div className="text-center">Danh mục</div>
              <div className="text-right">Hành động</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {displayed.map(p => (
                <React.Fragment key={p.id}>
                  <div className="grid grid-cols-[44px_1fr_110px_90px_70px_90px_110px] gap-4 px-5 py-3.5 items-center hover:bg-gray-50/80 transition-colors">
                    {/* Image */}
                    <div>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Image size={14} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-400">ID: {p.id}</p>
                    </div>

                    {/* Price */}
                    <div className="text-right text-sm font-bold text-amber-700">{fmt(p.price)}</div>

                    {/* Stock */}
                    <div className="flex justify-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                        (p.stock ?? 0) === 0 ? 'bg-red-100 text-red-700 border-red-200' :
                        (p.stock ?? 0) <= 5  ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                               'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}>
                        {(p.stock ?? 0) === 0 ? 'Hết' : p.stock}
                      </span>
                    </div>

                    {/* Variant toggle */}
                    <div className="flex justify-center">
                      <button onClick={() => toggleVariants(p.id)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          expandedId === p.id
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'border-gray-200 text-gray-600 hover:border-gray-900'
                        }`}>
                        {p.variants?.length ?? 0}
                        {expandedId === p.id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>
                    </div>

                    {/* Category */}
                    <div className="flex justify-center">
                      <span className="text-[11px] px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium truncate max-w-[80px]">
                        {p.categoryName ?? '—'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEdit(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all">
                        <Pencil size={12} /> Sửa
                      </button>
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 hover:border-red-200 transition-all disabled:opacity-40">
                        {deleting === p.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* ── Variant accordion ── */}
                  {expandedId === p.id && (
                    <div className="px-6 pb-5 pt-4 bg-gray-50/80 border-t border-gray-100">
                      <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                          Biến thể · {p.name}
                        </p>

                        {variantLoading ? (
                          <div className="flex items-center gap-2 py-4 text-gray-400 text-sm">
                            <Loader2 size={16} className="animate-spin" /> Đang tải...
                          </div>
                        ) : (
                          <>
                            {/* Existing variants */}
                            {(variantMap[p.id] ?? []).length === 0 ? (
                              <p className="text-sm text-gray-400 mb-4">Chưa có biến thể nào.</p>
                            ) : (
                              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
                                <div className="grid grid-cols-[1fr_1fr_80px_36px] gap-3 px-4 py-2 bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                                  <div>Size</div><div>Màu</div><div className="text-center">Kho</div><div />
                                </div>
                                {(variantMap[p.id] ?? []).map(v => (
                                  <div key={v.id} className="grid grid-cols-[1fr_1fr_80px_36px] gap-3 px-4 py-2.5 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <span className="text-sm text-gray-700">{v.size || <span className="text-gray-300">—</span>}</span>
                                    <span className="text-sm text-gray-700">{v.color || <span className="text-gray-300">—</span>}</span>
                                    <div className="flex justify-center">
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${v.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{v.stock}</span>
                                    </div>
                                    <button onClick={() => handleDeleteVariant(p.id, v.id)}
                                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all">
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add variant form */}
                            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-4">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Thêm biến thể</p>
                              <div className="flex items-end gap-2 flex-wrap">
                                {['size', 'color'].map(field => (
                                  <div key={field}>
                                    <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase">{field === 'size' ? 'Size' : 'Màu'}</label>
                                    <input
                                      value={newVariant[field]}
                                      onChange={e => setNewVariant(v => ({ ...v, [field]: e.target.value }))}
                                      placeholder={field === 'size' ? 'S, M, L...' : 'Đen, Trắng...'}
                                      className="w-24 px-2.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
                                    />
                                  </div>
                                ))}
                                <div>
                                  <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase">Kho *</label>
                                  <input
                                    type="number" min="0"
                                    value={newVariant.stock}
                                    onChange={e => setNewVariant(v => ({ ...v, stock: e.target.value }))}
                                    placeholder="0"
                                    className="w-20 px-2.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
                                  />
                                </div>
                                <button onClick={() => handleAddVariant(p.id)} disabled={addingVariant}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-all">
                                  {addingVariant ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
                                  Thêm
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ══ Slide-in Drawer Modal ══ */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="w-[520px] max-w-full h-full bg-white shadow-2xl flex flex-col overflow-hidden"
            style={{ animation: 'slideIn 0.25s ease' }}>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-amber-600 mb-1">
                  {editProduct ? 'Chỉnh sửa' : 'Sản phẩm mới'}
                </p>
                <h2 className="text-xl font-serif text-gray-900">
                  {editProduct ? editProduct.name : 'Thêm sản phẩm'}
                </h2>
              </div>
              <button onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">

              {/* Image preview */}
              {form.imageUrl && (
                <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover"
                    onError={e => { e.target.style.opacity = '0'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}

              <Field label="Tên sản phẩm" error={formErrors.name} required>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Áo thun Premium..." className={iStyle(formErrors.name)} />
              </Field>

              <Field label="Mô tả">
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Mô tả ngắn..." rows={3} className={`${iStyle()} resize-none`} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Giá bán (VNĐ)" error={formErrors.price} required>
                  <input type="number" min="0" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="250000" className={iStyle(formErrors.price)} />
                </Field>
                <Field label="Tồn kho" error={formErrors.stock} required>
                  <input type="number" min="0" value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    placeholder="100" className={iStyle(formErrors.stock)} />
                </Field>
              </div>

              <Field label="Danh mục" error={formErrors.categoryId} required>
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  className={`${iStyle(formErrors.categoryId)} appearance-auto`}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>

              <Field label="URL Hình ảnh chính">
                <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://..." className={iStyle()} />
              </Field>

              <Field label="Ảnh phụ (mỗi URL một dòng)">
                <textarea value={form.galleryImages} onChange={e => setForm(f => ({ ...f, galleryImages: e.target.value }))}
                  placeholder={'https://url-1.jpg\nhttps://url-2.jpg'} rows={3}
                  className={`${iStyle()} resize-none font-mono text-xs`} />
              </Field>

              {/* Actions */}
              <div className="flex gap-3 pt-2 mt-auto border-t border-gray-100">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Đang lưu...</> : (editProduct ? 'Cập nhật' : 'Tạo sản phẩm')}
                </button>
                <button type="button" onClick={() => setModalOpen(false)}
                  className="px-5 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all">
                  Huỷ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
