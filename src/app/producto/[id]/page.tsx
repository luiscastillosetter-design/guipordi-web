"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { client, urlFor } from "@/sanity/client";
import { CartProvider, useCart } from "@/context/CartContext";
import Cart from "@/components/Cart";
import { siteConfig } from "@/config/site.config";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image: any;
}

function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      // AQUÍ ESTÁ LA CORRECCIÓN DE LA CATEGORÍA
      const query = `*[_type == "product" && id.current == $id][0] {
        "id": id.current,
        name,
        "category": category->title,
        description,
        price,
        image
      }`;
      const data = await client.fetch(query, { id });
      setProduct(data);
      setIsLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-cyan-400 font-black tracking-widest">
        CARGANDO DATOS DEL EQUIPO...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center space-y-6">
        <h1 className="text-4xl font-black text-white uppercase tracking-widest">Producto no encontrado</h1>
        <Link href="/catalogo" className="px-8 py-3 bg-cyan-400 text-black font-black uppercase tracking-widest rounded-full hover:bg-white transition">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const imageUrl = product.image ? urlFor(product.image).url() : '';

  return (
    <main className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-400 selection:text-black pt-24 pb-20">
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex justify-between items-center shadow-2xl">
        <Link href="/" className="flex items-center gap-2 sm:gap-3.5 hover:opacity-80 transition">
          <img src={siteConfig.brand.logo} alt="Logo" className="h-10 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-widest bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{siteConfig.brand.name}</span>
        </Link>
        <Link href="/catalogo" className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-cyan-400/50 text-cyan-400 font-bold text-[10px] sm:text-xs tracking-widest hover:bg-cyan-400/10 transition">
          VOLVER AL CATÁLOGO
        </Link>
      </nav>

      <section className="px-4 sm:px-8 md:px-12 max-w-6xl mx-auto mt-12">
        <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-black/40 border border-white/5 rounded-2xl p-8 flex items-center justify-center shadow-inner">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
              />
            )}
          </div>

          <div className="flex flex-col space-y-8 relative z-10">
            <div className="space-y-4">
              <span className="inline-block text-xs text-cyan-400 font-bold tracking-[0.3em] uppercase bg-cyan-950/60 border border-cyan-500/20 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wide leading-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <p className="text-4xl sm:text-5xl font-mono font-black text-white mt-4 drop-shadow-md">
                ${product.price}
              </p>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent"></div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300">Descripción del Equipo</h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent"></div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center justify-between border-2 border-white/10 rounded-xl p-2 bg-black/60 sm:w-1/3">
                <button onClick={decrement} className="px-4 py-2 text-zinc-400 hover:text-cyan-400 font-bold transition text-xl">-</button>
                <span className="font-mono text-lg font-bold text-white">{quantity}</span>
                <button onClick={increment} className="px-4 py-2 text-zinc-400 hover:text-cyan-400 font-bold transition text-xl">+</button>
              </div>

              <button 
                onClick={() => addToCart({ 
                  id: product.id, 
                  name: product.name, 
                  price: product.price, 
                  image: imageUrl, 
                  quantity: quantity 
                })} 
                className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-black py-4 sm:py-0 text-sm font-black rounded-xl hover:scale-[1.02] transition-transform tracking-widest uppercase shadow-[0_0_30px_rgba(0,240,255,0.4)]"
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProductPageWrapper() {
  return (
    <CartProvider>
      <ProductDetail />
      <Cart />
    </CartProvider>
  );
}