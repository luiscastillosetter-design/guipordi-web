"use client";
import { useState, useEffect, Suspense, useDeferredValue } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import productsDataRaw from "@/data/products.json";
import { CartProvider, useCart } from "@/context/CartContext";
import Cart from "@/components/Cart";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
}

const productsData = productsDataRaw as Product[];

function CatalogoContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  const searchParams = useSearchParams();

  // 1. Evita que la interfaz se congele mientras el usuario escribe rápido
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  // 2. Control de carga: Empezamos mostrando solo 40 productos
  const [visibleCount, setVisibleCount] = useState(40);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchTerm(q);
    } else {
      setSearchTerm("");
    }
  }, [searchParams]);

  // Si el usuario cambia su búsqueda, reiniciamos la vista a los primeros 40
  useEffect(() => {
    setVisibleCount(40);
  }, [deferredSearchTerm]);

  // Filtrado ultra seguro: Evita errores si algún producto no tiene nombre
  const filteredProducts = productsData.filter((product) => {
    const name = product?.name || "";
    const category = product?.category || "";
    const term = deferredSearchTerm.trim().toLowerCase();
    return name.toLowerCase().includes(term) || category.toLowerCase().includes(term);
  });

  // Extraemos solo la cantidad permitida para no asfixiar el navegador
  const currentProducts = filteredProducts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 40);
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-400 selection:text-black pt-24 pb-20">
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex justify-between items-center shadow-2xl">
        <Link href="/" className="flex items-center gap-2 sm:gap-3.5 hover:opacity-80 transition">
          <img 
            src={siteConfig.brand.logo} 
            alt="Logo" 
            className="h-10 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]" 
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-widest bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {siteConfig.brand.name}
          </span>
        </Link>
        <Link href="/" className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-cyan-400/50 text-cyan-400 font-bold text-[10px] sm:text-xs tracking-widest hover:bg-cyan-400/10 transition">
          VOLVER AL INICIO
        </Link>
      </nav>

      <section className="px-4 sm:px-8 md:px-12 max-w-7xl mx-auto mt-12">
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Catálogo Completo
          </h1>
          <p className="text-zinc-400 text-sm">Encuentra equipos, repuestos y herramientas al instante.</p>
        </div>

        <div className="max-w-2xl mx-auto mb-16 relative">
          <input
            type="text"
            placeholder="Buscar por nombre, modelo o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/80 border border-cyan-500/50 rounded-full px-8 py-5 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all text-sm sm:text-base font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-400/60 transition-all duration-300 group">
                <div>
                  <div className="h-48 sm:h-52 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-xl mb-6 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain z-10 p-2 mix-blend-screen"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950/60 border border-cyan-500/20 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-bold mt-3 text-white line-clamp-2">{product.name}</h3>
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed line-clamp-3">{product.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xl font-extrabold text-white font-mono">${product.price}</span>
                  <button 
                    onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })}
                    className="px-4 py-2 bg-white text-black font-extrabold rounded-lg text-xs hover:bg-cyan-400 transition shadow"
                  >
                    AÑADIR
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-zinc-400 text-lg">No se encontraron productos con ese término.</p>
            </div>
          )}
        </div>

        {/* Botón de Cargar Más si aún quedan productos por mostrar */}
        {visibleCount < filteredProducts.length && (
          <div className="mt-16 flex justify-center">
            <button 
              onClick={handleLoadMore}
              className="px-10 py-4 bg-transparent border border-cyan-400 text-cyan-400 font-black text-sm uppercase tracking-widest rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300"
            >
              CARGAR MÁS RESULTADOS
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default function CatalogoPage() {
  return (
    <CartProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#030712] flex items-center justify-center text-cyan-400 font-black tracking-widest">CARGANDO...</div>}>
        <CatalogoContent />
      </Suspense>
      <Cart />
    </CartProvider>
  );
}