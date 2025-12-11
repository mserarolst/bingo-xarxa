'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase';
import { Pack } from '@/types';
import Link from 'next/link';
import { toast } from 'sonner';

export default function Home() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevPacksRef = useRef<Pack[]>([]);

  useEffect(() => {
    if (!isConfigured || !db) {
      setError('Firebase no està configurat. Si us plau, configura les variables d\'entorn al fitxer .env.local');
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
        
        // Detectar packs que han canviat a "guanyat"
        if (prevPacksRef.current.length > 0) {
          packsData.forEach(pack => {
            const prevPack = prevPacksRef.current.find(p => p.id === pack.id);
            if (prevPack && prevPack.available && !pack.available) {
              // El pack ha canviat de disponible a guanyat
              toast.success(`Pack guanyat: ${pack.name}`, {
                duration: 5000,
                description: `Patrocinat per ${pack.sponsor}`,
                icon: '🎉',
                style: {
                  fontSize: '20px',
                },
              });
            }
          });
        }
        
        prevPacksRef.current = packsData;
        setPacks(packsData);
        setLoading(false);
      }, (err) => {
        console.error('Error carregant packs:', err);
        setError('Error connectant amb la base de dades. Verifica la configuració de Firebase.');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error inicialitzant Firebase:', err);
      setError('Error inicialitzant la connexió amb Firebase.');
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-custom-gradient">
      {/* Header */}
      <div className="bg-transparent border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <img 
                src="/fedac_xarxa-color.jpg" 
                alt="Fedac Xarxa" 
                className="h-14 sm:h-16 md:h-20 w-auto object-contain"
              />
              <img 
                src="/Marato-tv3-logo.jpg" 
                alt="La Marató de TV3" 
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0070bc]">
                Bingo Solidari
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                La Marató de TV3
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        {error ? (
          <div className="max-w-2xl mx-auto bg-white border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-3">Error de Configuració</h2>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <div className="bg-gray-50 rounded p-4 text-left">
              <p className="font-medium text-gray-900 text-sm mb-2">Passos per configurar Firebase:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Obre el fitxer <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">.env.local</code></li>
                <li>Segueix les instruccions del fitxer <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">FIREBASE_SETUP.md</code></li>
                <li>Reinicia el servidor amb <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">npm run dev</code></li>
              </ol>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#0070bc]"></div>
            <p className="mt-3 text-sm text-gray-500">Carregant...</p>
          </div>
        ) : packs.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-lg mx-auto">
              <p className="text-lg font-medium text-gray-900 mb-2">Encara no hi ha packs disponibles</p>
              <p className="text-sm text-gray-500 mb-6">Ves al panell d&apos;administració per afegir el primer pack</p>
              <Link
                href="/admin"
                className="inline-block bg-[#0070bc] hover:bg-[#005a99] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Anar a Administració
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-[#0070bc]">
                  Packs de Regals
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  {packs.filter(p => p.available).length} disponibles de {packs.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-4">
              {packs.map((pack) => (
                <Link
                  key={pack.id}
                  href={`/pack/${pack.id}`}
                  className={`bg-white border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-pointer ${
                    pack.available
                      ? 'border-gray-200'
                      : 'border-gray-200 opacity-50'
                  }`}
                >
                  {/* Image */}
                  <div className={`h-40 flex items-center justify-center relative ${
                    pack.available 
                      ? 'bg-gray-100' 
                      : 'bg-gray-50'
                  }`}>
                    {pack.imageUrl ? (
                      <img 
                        src={pack.imageUrl} 
                        alt={pack.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-4xl text-gray-400">🎁</div>
                    )}
                    
                    {/* Status Badge */}
                    <div className={`absolute top-2 right-2 px-2.5 py-1 rounded text-xs font-medium ${
                      pack.available
                        ? 'bg-[#70ae2e] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {pack.available ? 'Disponible' : 'Guanyat'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-[#70ae2e] to-[#0070bc] bg-clip-text text-transparent">
                      {pack.name}
                    </h3>
                    <ul className="space-y-1 mb-2 sm:mb-3">
                      {pack.description.split(' • ').map((item, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-gray-600 flex items-start">
                          <span className="text-gray-400 mr-1.5 sm:mr-2 flex-shrink-0">•</span>
                          <span className="break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 sm:pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Patrocinat per <span className="font-medium text-gray-700">{pack.sponsor}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 sm:py-6 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto text-center px-4">
          <p className="text-xs sm:text-sm text-gray-600">
            Gràcies per col·laborar amb La Marató de TV3
          </p>
        </div>
      </footer>
    </main>
  );
}
