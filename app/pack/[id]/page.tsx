'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase';
import { Pack } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PackDetail() {
  const params = useParams();
  const id = params.id as string;
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured || !db) {
      setError('Firebase no està configurat');
      setLoading(false);
      return;
    }

    const fetchPack = async () => {
      try {
        const docRef = doc(db, 'packs', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPack({
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate() || new Date()
          } as Pack);
        } else {
          setError('Pack no trobat');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error carregant pack:', err);
        setError('Error carregant el pack');
        setLoading(false);
      }
    };

    fetchPack();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-custom-gradient">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#0070bc]"></div>
            <p className="mt-3 text-sm text-gray-500">Carregant...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !pack) {
    return (
      <main className="min-h-screen bg-custom-gradient">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error || 'Pack no trobat'}</p>
            <Link href="/" className="mt-4 inline-block text-[#0070bc] hover:underline">
              Tornar a l'inici
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-custom-gradient">
      {/* Header */}
      <div className="bg-transparent border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="text-[#0070bc] hover:text-[#005a99] font-medium flex items-center gap-2">
              <span>←</span> Tornar
            </Link>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#0070bc]">
                Bingo Solidari
              </h1>
              <p className="text-sm text-gray-600">
                La Marató de TV3
              </p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
          {/* Status Badge */}
          <div className="p-4 flex justify-end">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              pack.available
                ? 'bg-[#70ae2e] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {pack.available ? 'Disponible' : 'Guanyat'}
            </span>
          </div>

          {/* Image */}
          {pack.imageUrl && (
            <div className="w-full h-64 sm:h-96 bg-gray-100 flex items-center justify-center">
              <img 
                src={pack.imageUrl} 
                alt={pack.name}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Pack Details */}
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-[#70ae2e] to-[#0070bc] bg-clip-text text-transparent">
              {pack.name}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contingut del pack:</h3>
                <ul className="space-y-2">
                  {pack.description.split(' • ').map((item, idx) => (
                    <li key={idx} className="text-base text-gray-700 flex items-start">
                      <span className="text-[#70ae2e] mr-3 text-xl flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-base text-gray-600">
                  <span className="font-semibold text-gray-900">Patrocinat per:</span>{' '}
                  <span className="text-[#0070bc] font-medium">{pack.sponsor}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-block bg-[#0070bc] hover:bg-[#005a99] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Veure tots els packs
          </Link>
        </div>
      </div>
    </main>
  );
}
