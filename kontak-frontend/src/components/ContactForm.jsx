import { useState } from 'react';
import { apiFetch } from '../api';

const JENIS_OPTIONS = [
  { value: 'HP', label: '📱 HP', color: 'indigo' },
  { value: 'Rumah', label: '🏠 Rumah', color: 'emerald' },
  { value: 'Kantor', label: '🏢 Kantor', color: 'amber' },
];

export default function ContactForm({ onAdded, showToast }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [phones, setPhones] = useState([{ jenis: 'HP', nomor_telepon: '' }]);

  const updatePhone = (i, key, val) => {
    const copy = [...phones];
    copy[i][key] = val;
    setPhones(copy);
  };

  const addPhone = () => setPhones([...phones, { jenis: 'HP', nomor_telepon: '' }]);
  const removePhone = (i) => setPhones(phones.filter((_, idx) => idx !== i));

  const reset = () => {
    setNama('');
    setAlamat('');
    setTanggalLahir('');
    setPhones([{ jenis: 'HP', nomor_telepon: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch('/kontak', {
        method: 'POST',
        body: JSON.stringify({ nama, alamat, tanggal_lahir: tanggalLahir, phones }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Kontak berhasil ditambahkan!', 'success');
        reset();
        setOpen(false);
        onAdded();
      } else {
        showToast(data.message || 'Gagal menambah kontak', 'error');
      }
    } catch {
      showToast('Gagal terhubung ke server', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-2xl shadow-xl shadow-indigo-300 hover:scale-110 transition flex items-center justify-center"
        title="Tambah Kontak"
      >
        +
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 animate-slide-in">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">Tambah Kontak Baru</h3>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
            <input
              placeholder="Nama lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
            <input
              placeholder="Alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
            <input
              type="date"
              value={tanggalLahir}
              onChange={(e) => setTanggalLahir(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-700">Nomor Telepon</label>
              <button
                type="button"
                onClick={addPhone}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                + Tambah Nomor
              </button>
            </div>
            <div className="space-y-2">
              {phones.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <select
                    value={p.jenis}
                    onChange={(e) => updatePhone(i, 'jenis', e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white text-sm"
                  >
                    {JENIS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <input
                    placeholder="Nomor telepon"
                    value={p.nomor_telepon}
                    onChange={(e) => updatePhone(i, 'nomor_telepon', e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                    required
                  />
                  {phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhone(i)}
                      className="px-3 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                      title="Hapus nomor ini"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl transition disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Kontak'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}