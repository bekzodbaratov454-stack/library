import React, { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, ImagePlus, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { booksApi } from '../../../api/books.api';
import { getImageUrl } from '../../../api/client';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { Spinner } from '../../../components/ui/Spinner';
import type { Book, CreateBookDto, UpdateBookDto } from '../../../types';
import './AdminTabs.css';

const EMPTY_BOOK: CreateBookDto = {
  title: '', author: '', publishedYear: new Date().getFullYear(),
  description: '', genre: '', pages: undefined, language: '', availableCopies: 0,
};

export const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [form, setForm] = useState<CreateBookDto>(EMPTY_BOOK);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [coverBookId, setCoverBookId] = useState<string | null>(null);

  const load = () => {
    booksApi.getAll()
      .then(({ data }) => setBooks(data))
      .catch(() => toast.error('Yuklab bo\'lmadi'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditBook(null);
    setForm(EMPTY_BOOK);
    setModalOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditBook(book);
    setForm({
      title: book.title, author: book.author, publishedYear: book.publishedYear,
      description: book.description || '', genre: book.genre || '',
      pages: book.pages, language: book.language || '',
      availableCopies: book.availableCopies,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.author) { toast.error('Nom va muallif kiritilishi shart'); return; }
    setSaving(true);
    try {
      if (editBook) {
        const { data } = await booksApi.update(editBook._id, form as UpdateBookDto);
        setBooks(prev => prev.map(b => b._id === editBook._id ? data : b));
        toast.success('Kitob yangilandi');
      } else {
        const { data } = await booksApi.create(form);
        setBooks(prev => [data, ...prev]);
        toast.success('Kitob qo\'shildi');
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xato');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Kitobni o\'chirish?')) return;
    setDeletingId(id);
    try {
      await booksApi.remove(id);
      setBooks(prev => prev.filter(b => b._id !== id));
      toast.success('O\'chirildi');
    } catch {
      toast.error('O\'chirishda xato');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCoverClick = (bookId: string) => {
    setCoverBookId(bookId);
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !coverBookId) return;
    setUploadingId(coverBookId);
    try {
      const { data } = await booksApi.uploadCover(coverBookId, file);
      setBooks(prev => prev.map(b => b._id === coverBookId ? data : b));
      toast.success('Muqova yangilandi');
    } catch {
      toast.error('Yuklashda xato');
    } finally {
      setUploadingId(null);
      setCoverBookId(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const setField = (k: keyof CreateBookDto, v: any) => setForm(f => ({ ...f, [k]: v }));

  if (loading) return <Spinner center />;

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Kitoblar ({books.length})</h2>
        <Button icon={<Plus size={16} />} onClick={openCreate}>Kitob qo'shish</Button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />

      {books.length === 0 ? (
        <div className="admin-empty"><BookOpen size={40} /><p>Kitoblar yo'q</p></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Muqova</th>
                <th>Kitob</th>
                <th>Muallif</th>
                <th>Janr</th>
                <th>Yil</th>
                <th>Nusxa</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book._id}>
                  <td>
                    <div className="admin-book-cover" onClick={() => handleCoverClick(book._id)}>
                      {book.coverImage ? (
                        <img src={getImageUrl(book.coverImage)!} alt={book.title} />
                      ) : (
                        <BookOpen size={16} />
                      )}
                      {uploadingId === book._id
                        ? <div className="admin-book-cover__overlay"><span className="book-card__btn-spinner" /></div>
                        : <div className="admin-book-cover__overlay"><ImagePlus size={14} /></div>
                      }
                    </div>
                  </td>
                  <td>
                    <span className="admin-book-title">{book.title}</span>
                  </td>
                  <td>{book.author}</td>
                  <td>{book.genre ? <Badge variant="gold" size="sm">{book.genre}</Badge> : '—'}</td>
                  <td className="mono">{book.publishedYear}</td>
                  <td className="mono">{book.availableCopies}</td>
                  <td>
                    <Badge variant={book.availableCopies > 0 ? 'green' : 'red'} size="sm">
                      {book.availableCopies > 0 ? 'Mavjud' : 'Band'}
                    </Badge>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Button size="sm" variant="outline" icon={<Pencil size={14} />} onClick={() => openEdit(book)}>
                        Tahrirlash
                      </Button>
                      <Button
                        size="sm" variant="danger"
                        icon={<Trash2 size={14} />}
                        loading={deletingId === book._id}
                        onClick={() => handleDelete(book._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editBook ? 'Kitobni tahrirlash' : 'Yangi kitob'}
        width={600}
      >
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form__grid">
            <Input label="Kitob nomi *" value={form.title} onChange={e => setField('title', e.target.value)} />
            <Input label="Muallif *" value={form.author} onChange={e => setField('author', e.target.value)} />
            <Input label="Nashr yili *" type="number" value={form.publishedYear} onChange={e => setField('publishedYear', +e.target.value)} />
            <Input label="Nusxalar soni *" type="number" value={form.availableCopies} onChange={e => setField('availableCopies', +e.target.value)} />
            <Input label="Janr" value={form.genre || ''} onChange={e => setField('genre', e.target.value)} />
            <Input label="Til" value={form.language || ''} onChange={e => setField('language', e.target.value)} />
            <Input label="Sahifalar" type="number" value={form.pages || ''} onChange={e => setField('pages', e.target.value ? +e.target.value : undefined)} />
          </div>
          <div className="admin-form__field">
            <label className="field__label">Tavsif</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.description || ''}
              onChange={e => setField('description', e.target.value)}
              placeholder="Kitob haqida qisqacha..."
            />
          </div>
          <div className="admin-form__actions">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Bekor qilish</Button>
            <Button type="submit" loading={saving} icon={editBook ? <Pencil size={14} /> : <Plus size={14} />}>
              {editBook ? 'Saqlash' : 'Qo\'shish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};