'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase';
import { Pack } from '@/types';
import Link from 'next/link';

export default function AdminPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sponsor: '',
    imageUrl: '',
    available: true,
    order: 0
  });

  const [items, setItems] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState('');

  useEffect(() => {
    if (!isConfigured || !db) {
      setError('Firebase no està configurat');
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'packs'), orderBy('order', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const packsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Pack[];
        
        setPacks(packsData);
        setLoading(false);
      }, (err) => {
        console.error('Error carregant packs:', err);
        setError('Error connectant amb la base de dades');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error inicialitzant Firebase:', err);
      setError('Error inicialitzant la connexió amb Firebase');
      setLoading(false);
    }
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sponsor: '',
      imageUrl: '',
      available: true,
      order: packs.length
    });
    setItems([]);
    setCurrentItem('');
    setEditingPack(null);
    setShowForm(false);
  };

  const addItem = () => {
    if (currentItem.trim()) {
      setItems([...items, currentItem.trim()]);
      setCurrentItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Afegeix almenys un producte al pack');
      return;
    }
    
    const description = items.join(' • ');
    
    try {
      if (editingPack) {
        await updateDoc(doc(db, 'packs', editingPack.id), {
          ...formData,
          description,
        });
      } else {
        await addDoc(collection(db, 'packs'), {
          ...formData,
          description,
          createdAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving pack:', error);
      alert('Error al guardar el pack');
    }
  };

  const handleEdit = (pack: Pack) => {
    setFormData({
      name: pack.name,
      description: pack.description,
      sponsor: pack.sponsor,
      imageUrl: pack.imageUrl || '',
      available: pack.available,
      order: pack.order
    });
    // Convertir la descripció en array d'ítems
    const itemsArray = pack.description.split(' • ').filter(item => item.trim());
    setItems(itemsArray);
    setEditingPack(pack);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Segur que vols eliminar aquest pack?')) {
      try {
        await deleteDoc(doc(db, 'packs', id));
      } catch (error) {
        console.error('Error deleting pack:', error);
        alert('Error al eliminar el pack');
      }
    }
  };

  const toggleAvailability = async (pack: Pack) => {
    try {
      await updateDoc(doc(db, 'packs', pack.id), {
        available: !pack.available
      });
    } catch (error) {
      console.error('Error updating pack:', error);
      alert('Error al actualitzar el pack');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <img 
                src="/fedac_xarxa-color.jpg" 
                alt="Fedac Xarxa" 
                className="h-12 sm:h-14 w-auto object-contain"
              />
              <img 
                src="/Marato-tv3-logo.jpg" 
                alt="La Marató de TV3" 
                className="h-12 sm:h-14 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-0.5">
                  Administració
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Gestiona els packs del Bingo Solidari
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              ← Tornar
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {error ? (
          <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-3">Error de Configuració</h2>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <div className="bg-gray-50 rounded p-4 text-left max-w-2xl mx-auto">
              <p className="font-medium text-gray-900 text-sm mb-2">Passos per configurar Firebase:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Crea un projecte a <a href="https://console.firebase.google.com/" target="_blank" className="text-gray-900 underline">Firebase Console</a></li>
                <li>Copia les credencials al fitxer <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">.env.local</code></li>
                <li>Activa Firestore Database al projecte</li>
                <li>Reinicia el servidor amb <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">npm run dev</code></li>
              </ol>
              <p className="mt-3 text-xs text-gray-500">
                Consulta el fitxer <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">FIREBASE_SETUP.md</code> per instruccions detallades.
              </p>
            </div>
          </div>
        ) : (
        <>
        {/* Add Button */}
        <div className="mb-4 sm:mb-6">{!loading && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full sm:w-auto"
          >
            {showForm ? 'Cancel·lar' : '+ Afegir Pack'}
          </button>
        )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">
              {editingPack ? 'Editar Pack' : 'Nou Pack'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom del Pack *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  placeholder="Ex: Pack Spa i Benestar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Productes del Pack *
                </label>
                  <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentItem}
                      onChange={(e) => setCurrentItem(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      placeholder="Afegeix un producte..."
                    />
                    <button
                      type="button"
                      onClick={addItem}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      + Afegir
                    </button>
                  </div>                  {items.length > 0 && (
                    <ul className="space-y-1.5 mt-3">
                      {items.map((item, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                          <span className="text-gray-700">• {item}</span>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700 text-xs font-medium"
                          >
                            Eliminar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {items.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">Afegeix almenys un producte al pack</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Patrocinador *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sponsor}
                  onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  placeholder="Nom de l'empresa o persona"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  URL de la Imatge (opcional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  placeholder="https://exemple.com/imatge.jpg"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Puja la imatge a un servei gratuït com{' '}
                  <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:text-gray-700">Imgur</a>
                  {' '}o{' '}
                  <a href="https://www.google.com/drive/" target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:text-gray-700">Google Drive</a>
                  {' '}i enganxa l'URL aquí
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ordre
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-gray-900 rounded"
                />
                <label htmlFor="available" className="text-sm font-medium text-gray-700">
                  Pack disponible
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  type="submit"
                  disabled={items.length === 0}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {editingPack ? 'Actualitzar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
                >
                  Cancel·lar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Packs List */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">
            Packs Existents ({packs.length})
          </h2>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : packs.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-10">
              Encara no hi ha packs. Crea&apos;n un per començar!
            </p>
          ) : (
            <div className="space-y-3">
              {packs.map((pack) => (
                <div
                  key={pack.id}
                  className={`border rounded-lg p-3 sm:p-4 ${
                    pack.available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex items-start sm:items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">{pack.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          pack.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {pack.available ? 'Disponible' : 'Guanyat'}
                        </span>
                      </div>
                      <ul className="space-y-0.5 mb-2">
                        {pack.description.split(' • ').map((item, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-gray-600 flex items-start">
                            <span className="text-gray-400 mr-1.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-gray-500">
                        Patrocinat per: <span className="font-medium">{pack.sponsor}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Ordre: {pack.order}</p>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => toggleAvailability(pack)}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          pack.available
                            ? 'bg-red-100 hover:bg-red-200 text-red-700'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                      >
                        {pack.available ? 'Marcar Guanyat' : 'Marcar Disponible'}
                      </button>
                      <button
                        onClick={() => handleEdit(pack)}
                        className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(pack.id)}
                        className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </main>
  );
}
