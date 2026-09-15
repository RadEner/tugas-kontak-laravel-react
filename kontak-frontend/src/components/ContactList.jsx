import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import Avatar from './Avatar';
import ConfirmModal from './ConfirmModal';

const JENIS_BADGE = {
  HP: 'bg-indigo-100 text-indigo-700',
  Rumah: 'bg-emerald-100 text-emerald-700',
  Kantor: 'bg-amber-100 text-amber-700',
};

export default function ContactList({ refresh, showToast }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState({ open: false, id: null, nama: '' });

  const loadContacts = () => {
    setLoading(true);
    apiFetch('/kontak')
      .then((res) => res.json())
      .then((data) => {
        setContacts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        showToast('Gagal memuat kontak', 'error');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadContacts();
  }, [refresh]);

  const askDelete = (c) => setConfirm({ open: true, id: c.id, nama: c.nama });

  const confirmDelete = async () => {
    try {
      await apiFetch(`/kontak/${confirm.id}`, { method: 'DELETE' });
      showToast('Kontak berhasil dihapus', 'success');
      setConfirm({ open: false, id: null, nama: '' });
      loadContacts();
    } catch {
      showToast('Gagal menghapus kontak', 'error');
    }
  };

  const filtered = contacts.filter((c) =>
    c.nama.toLowerCase().includes(search.toLowerCase()) ||
    c.alamat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-slate-800">
          Daftar Kontak <span className="text-indigo-500">({contacts.length})</span>
        </h2>
        <div className="relative">
          <input
            placeholder="🔍 Cari kontak..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none w-full sm:w-64 transition"
          />
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-slate-500 font-medium">
            {search ? 'Kontak tidak ditemukan' : 'Belum ada kontak'}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {search ? 'Coba kata kunci lain' : 'Klik tombol + di kanan bawah untuk menambah'}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-slate-100 group"
            >
              <div className="flex items-start gap-4">
                <Avatar name={c.nama} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">{c.nama}</h3>
                      <p className="text-sm text-slate-500">
                        📍 {c.alamat} · 🎂 {c.tanggal_lahir}
                      </p>
                    </div>
                    <button
                      onClick={() => askDelete(c)}
                      className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg text-sm text-rose-600 bg-rose-50 hover:bg-rose-100 transition flex-shrink-0"
                    >
                      Hapus
                    </button>
                  </div>

                  {c.phones?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.phones.map((p) => (
                        <span
                          key={p.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${JENIS_BADGE[p.jenis] || 'bg-slate-100 text-slate-700'}`}
                        >
                          <span>{p.jenis}</span>
                          <span className="opacity-50">·</span>
                          <span className="font-mono">{p.nomor_telepon}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={confirm.open}
        title="Hapus Kontak"
        message={`Yakin ingin menghapus kontak "${confirm.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ open: false, id: null, nama: '' })}
      />
    </div>
  );
}