"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { CartProvider, useCart } from "@/context/CartContext";
import Cart from "@/components/Cart";
import { client, urlFor } from "@/sanity/client";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image: any;
}

// Nueva interfaz para traer las categorías directamente de Sanity
interface SanityCategory {
  title: string;
  image: any;
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const imageUrl = product.image ? urlFor(product.image).url() : '';

  return (
    <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-300 group">
      <div>
        <div className="relative w-full aspect-square max-w-[400px] max-h-[400px] mx-auto mb-6 flex flex-col items-center justify-center overflow-hidden bg-transparent">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-contain z-10 transition-transform duration-500 group-hover:scale-105" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
          )}
        </div>
        <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950/60 border border-cyan-500/20 px-3 py-1 rounded-full">
          {product.category}
        </span>
        <h3 className="text-lg font-bold mt-3 text-white group-hover:text-cyan-300 transition line-clamp-2">
          {product.name}
        </h3>
        <p className="text-zinc-400 text-xs mt-2 leading-relaxed line-clamp-3">
          {product.description}
        </p>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-3">
        <span className="text-xl font-extrabold text-white font-mono">${product.price}</span>
        
        <div className="flex items-center justify-between border border-white/20 rounded-lg p-1 bg-black/50">
          <button onClick={decrement} className="px-4 py-1 text-zinc-400 hover:text-cyan-400 font-bold transition text-lg">-</button>
          <span className="font-mono text-sm font-bold text-white">{quantity}</span>
          <button onClick={increment} className="px-4 py-1 text-zinc-400 hover:text-cyan-400 font-bold transition text-lg">+</button>
        </div>

        <div className="flex gap-2 w-full mt-1">
          <Link 
            href={`/producto/${product.id}`} 
            className="flex-1 text-center py-2.5 text-[10px] sm:text-xs font-bold border border-cyan-500/50 rounded-lg hover:bg-cyan-500/20 text-cyan-300 transition tracking-widest uppercase"
          >
            Ver Detalle
          </Link>
          <button 
            onClick={() => addToCart({ 
              id: product.id, 
              name: product.name, 
              price: product.price, 
              image: imageUrl, 
              quantity: quantity 
            })} 
            className="flex-1 bg-white text-black py-2.5 text-[10px] sm:text-xs font-extrabold rounded-lg hover:bg-cyan-400 transition tracking-widest uppercase shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}

function CatalogoContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("TODAS");
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesData, setCategoriesData] = useState<SanityCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      
      // Promesa paralela: Buscar productos y categorías al mismo tiempo
      const productsQuery = `*[_type == "product"] {
        "id": id.current,
        name,
        "category": category->title,
        description,
        price,
        image
      }`;
      
      const categoriesQuery = `*[_type == "category"] {
        title,
        image
      }`;

      const [sanityProducts, sanityCategories] = await Promise.all([
        client.fetch(productsQuery),
        client.fetch(categoriesQuery)
      ]);
      
      const sortedData = sanityProducts.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
      setProducts(sortedData);
      setCategoriesData(sanityCategories);
      
      setIsLoading(false);
    };

    fetchCatalog();
    const q = searchParams.get("q");
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const filteredProducts = products.filter((product) => {
    const catName = product.category ? product.category.toUpperCase() : "";
    
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          catName.includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "TODAS" || catName === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-400 selection:text-black pt-24 pb-20">
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex justify-between items-center shadow-2xl">
        <Link href="/" className="flex items-center gap-2 sm:gap-3.5 hover:opacity-80 transition">
          <img src={siteConfig.brand.logo} alt="Logo" className="h-10 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-widest bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{siteConfig.brand.name}</span>
        </Link>
        <Link href="/" className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-cyan-400/50 text-cyan-400 font-bold text-[10px] sm:text-xs tracking-widest hover:bg-cyan-400/10 transition">
          VOLVER AL INICIO
        </Link>
      </nav>

      <section className="px-4 sm:px-8 md:px-12 max-w-7xl mx-auto mt-12">
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-3xl sm:text-5xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Catálogo Completo
          </h1>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Buscar por nombre o modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 border border-cyan-500/50 rounded-full px-8 py-5 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all text-sm sm:text-base font-medium"
            />
          </div>
        </div>

        {/* TARJETAS HORIZONTALES CONECTADAS DIRECTO A SANITY */}
        {!isLoading && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Filtra por Categoría</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tarjeta estática maestra para "TODAS" */}
              <button 
                onClick={() => setActiveCategory("TODAS")}
                className={`relative h-40 sm:h-48 rounded-2xl overflow-hidden group border transition-all duration-300 shadow-xl ${activeCategory === "TODAS" ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_30px_rgba(0,240,255,0.3)]' : 'border-white/10 hover:border-cyan-500/50'}`}
              >
                <img 
                  src="/images/cat-todas.jpg" 
                  alt="Todas las categorías"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-50"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                />
                <div className={`absolute inset-0 transition-colors duration-500 ${activeCategory === "TODAS" ? 'bg-cyan-900/40' : 'bg-black/60 group-hover:bg-black/40'}`} />
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-widest drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] transition-colors ${activeCategory === "TODAS" ? 'text-cyan-300' : 'text-white group-hover:text-cyan-100'}`}>
                    Todas
                  </h3>
                </div>
              </button>

              {/* Tarjetas dinámicas generadas desde Sanity */}
              {categoriesData.map((cat) => (
                <button 
                  key={cat.title}
                  onClick={() => setActiveCategory(cat.title?.toUpperCase())}
                  className={`relative h-40 sm:h-48 rounded-2xl overflow-hidden group border transition-all duration-300 shadow-xl ${activeCategory === cat.title?.toUpperCase() ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_30px_rgba(0,240,255,0.3)]' : 'border-white/10 hover:border-cyan-500/50'}`}
                >
                  {cat.image && (
                    <img 
                      src={urlFor(cat.image).url()} 
                      alt={`Categoría ${cat.title}`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-50"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                    />
                  )}
                  <div className={`absolute inset-0 transition-colors duration-500 ${activeCategory === cat.title?.toUpperCase() ? 'bg-cyan-900/40' : 'bg-black/60 group-hover:bg-black/40'}`} />
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                    <h3 className={`text-xl sm:text-2xl font-black uppercase tracking-widest drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] transition-colors ${activeCategory === cat.title?.toUpperCase() ? 'text-cyan-300' : 'text-white group-hover:text-cyan-100'}`}>
                      {cat.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* REJILLA DE PRODUCTOS */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <AnimatePresence>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-zinc-400 text-lg">No se encontraron equipos bajo estos criterios.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </main>
  );
}

export default function CatalogoPage() {
  return (
    <CartProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#030712] flex items-center justify-center text-cyan-400 font-black tracking-widest">CARGANDO BASE DE DATOS...</div>}>
        <CatalogoContent />
      </Suspense>
      <Cart />
    </CartProvider>
  );
}