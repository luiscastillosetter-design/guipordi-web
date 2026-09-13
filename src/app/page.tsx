"use client";
import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/config/site.config";
import ScrollVideoHero from "@/components/ScrollVideoHero";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import Cart from "@/components/Cart";
import { client, urlFor } from "@/sanity/client";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image: any; 
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-300 group">
      <div>
        <div className="relative w-full aspect-square max-w-[400px] max-h-[400px] mx-auto mb-6 flex flex-col items-center justify-center overflow-hidden bg-transparent">
          <img 
            src={urlFor(product.image).url()} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-contain z-10 transition-transform duration-500 group-hover:scale-105" 
            onError={(e) => { e.currentTarget.style.display = 'none'; }} 
          />
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
              image: urlFor(product.image).url(), 
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

function HomeContent() {
  const router = useRouter();
  const { 
    storeName, 
    logoUrl, 
    whatsappLink, 
    phone, 
    email, 
    address, 
    instagram, 
    tiktok, 
    facebook, 
    linkedin, 
    heroTitle, 
    heroSubtitle 
  } = useSettings();
  
  const [homeSearch, setHomeSearch] = useState("");
  const [showScrollTip, setShowScrollTip] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchSanityData = async () => {
      const query = `*[_type == "product"] { "id": id.current, name, "category": category->title, description, price, image }`;
      const sanityData = await client.fetch(query);
      const filtered = sanityData.reduce((acc: Product[], current: Product) => {
        const categoryCount = acc.filter((p) => p.category === current.category).length;
        if (categoryCount < 3) acc.push(current);
        return acc;
      }, []);
      setFeaturedProducts(filtered);
    };
    fetchSanityData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTip(window.scrollY < 150);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.volume = 0.4;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsAudioPlaying(true)).catch(console.error);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearch.trim() !== "") {
      router.push(`/catalogo?q=${encodeURIComponent(homeSearch)}`);
    }
  };

  const advantages = [
    { title: "Cero Combustible", description: "Funcionamiento 100% a batería. Sin gasolina, sin humo y sin ruidos molestos.", image: "/images/ventaja-1.jpg" },
    { title: "Carga Inteligente", description: "Sistemas optimizados para red eléctrica, adaptados a la realidad del país.", image: "/images/ventaja-2.jpg" },
    { title: "Garantía y Respaldo", description: "Equipos de alta durabilidad diseñados para proteger tus equipos del hogar.", image: "/images/ventaja-3.jpg" },
  ];

  return (
    <main className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-400 selection:text-black relative">
      <audio ref={audioRef} src="/music/tech-house.mp3" loop preload="auto" />
      <button onClick={toggleAudio} className={`fixed bottom-6 left-6 z-[60] p-4 rounded-full border shadow-2xl transition-all duration-300 backdrop-blur-md ${isAudioPlaying ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-black/50 border-white/10 text-zinc-500 hover:text-white'}`}>
        {isAudioPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 animate-pulse"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.71-1.59-1.59V9.84c0-.88.71-1.59 1.59-1.59h2.24z" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.71-1.59-1.59V9.84c0-.88.71-1.59 1.59-1.59h2.24z" /></svg>
        )}
      </button>

      <AnimatePresence>
        {showScrollTip && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 15, 0] }} exit={{ opacity: 0, y: -20 }} transition={{ y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }} className="absolute top-[75vh] sm:top-[85vh] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            <span className="text-cyan-400 text-[10px] font-black tracking-[0.4em] uppercase">Desliza</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-cyan-400"><rect width="10" height="16" x="7" y="4" rx="5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4" /></svg>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-2 sm:gap-3.5">
          <img src={logoUrl} alt={`Logo ${storeName}`} className="h-10 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-widest bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{storeName}</span>
        </div>
        <div className="hidden lg:flex gap-8 text-xs font-semibold tracking-widest text-zinc-300">
          <a href="#" className="hover:text-cyan-400 transition">INICIO</a>
          <a href="#catalogo" className="hover:text-cyan-400 transition">CATÁLOGO</a>
          <a href="#tecnologia" className="hover:text-cyan-400 transition">VENTAJAS</a>
          <a href="#contacto" className="hover:text-cyan-400 transition">CONTACTO</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/catalogo" className="lg:hidden px-3 py-2 sm:px-5 sm:py-3 rounded-full border border-cyan-400 text-cyan-400 font-bold text-[10px] sm:text-sm tracking-widest hover:bg-cyan-400/10 transition">CATÁLOGO</Link>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 sm:px-7 sm:py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-[10px] sm:text-sm tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.4)] transition transform hover:scale-105">CONTACTO</a>
        </div>
      </nav>

      <ScrollVideoHero 
        videoSrc={siteConfig.hero.video}
        badge={siteConfig.hero.badge}
        category={siteConfig.hero.category}
        title={heroTitle || siteConfig.hero.title}
        subtitle={heroSubtitle || siteConfig.hero.subtitle}
        catalogLink="/catalogo" 
        whatsappLink={whatsappLink}
        whatsappText={siteConfig.hero.whatsappButtonText}
        aidaSequence={siteConfig.hero.aidaSequence}
      />

      <section id="catalogo" className="py-24 sm:py-28 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto relative z-20">
        <div className="text-center mb-10 space-y-4">
          <span className="text-cyan-400 text-xs tracking-[0.25em] font-bold uppercase">Tecnología Sin Cortes</span>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Productos Destacados</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
        </div>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16 relative">
          <input type="text" placeholder="Busca tu producto aquí y presiona Enter..." value={homeSearch} onChange={(e) => setHomeSearch(e.target.value)} className="w-full bg-zinc-900/80 border border-cyan-500/50 rounded-full px-8 py-5 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all text-sm sm:text-base font-medium" />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-500 text-black px-6 py-2.5 rounded-full font-bold text-xs tracking-widest hover:bg-white transition">BUSCAR</button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <Link href="/catalogo" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-sm sm:text-base uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] hover:scale-105 transition-all duration-300">
            Ver Catálogo Completo
          </Link>
        </div>
      </section>

      <section id="tecnologia" className="py-24 sm:py-28 bg-black/90 border-y border-cyan-500/30 px-4 sm:px-8 md:px-12 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-cyan-400 text-xs tracking-[0.25em] font-bold uppercase">¿Por qué elegirnos?</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-cyan-400 bg-clip-text text-transparent">Ventajas Competitivas</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full shadow-[0_0_15px_rgba(0,240,255,0.7)]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((service, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: 80 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.3, ease: "easeOut" }} className="group relative h-96 rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:shadow-[0_0_45px_rgba(0,240,255,0.6)] hover:border-cyan-400 transition-all duration-500">
                <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/70 to-transparent opacity-95 group-hover:opacity-85 transition-opacity" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-left space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/30 border border-cyan-400 flex items-center justify-center text-cyan-300 font-mono font-bold text-sm backdrop-blur-md mb-2 shadow-[0_0_15px_rgba(0,240,255,0.5)]">0{index + 1}</div>
                  <h4 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors uppercase tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{service.title}</h4>
                  <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-24 sm:py-28 max-w-5xl mx-auto px-4 text-center space-y-12">
        <div className="space-y-3">
          <span className="text-cyan-400 text-xs tracking-widest uppercase font-bold">Atención Comercial 24/7</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider">Asistencia Inmediata</h2>
          <p className="text-zinc-400 text-sm">Contáctanos directamente o visítanos para asesorarte con el equipo ideal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-6 rounded-2xl bg-zinc-900/80 border border-cyan-500/20 hover:border-cyan-400 transition-all flex flex-col items-center space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            </div>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">WhatsApp</span>
            <span className="text-cyan-400 font-mono text-sm font-bold">Escríbenos</span>
          </a>

          <a href={`tel:${phone}`} className="p-6 rounded-2xl bg-zinc-900/80 border border-cyan-500/20 hover:border-cyan-400 transition-all flex flex-col items-center space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
            </div>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Llámanos</span>
            <span className="text-white font-mono text-sm font-bold">{phone}</span>
          </a>

          <a href={`mailto:${email}`} className="p-6 rounded-2xl bg-zinc-900/80 border border-cyan-500/20 hover:border-cyan-400 transition-all flex flex-col items-center space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Correo</span>
            <span className="text-white font-mono text-xs font-bold break-all">{email}</span>
          </a>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 bg-black/95 px-4 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt={storeName} className="h-10 w-auto object-contain" />
              <span className="text-xl font-black tracking-widest text-white">{storeName}</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              {address}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Navegación</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/" className="hover:text-cyan-400 transition">Inicio</Link></li>
              <li><Link href="/catalogo" className="hover:text-cyan-400 transition">Catálogo Completo</Link></li>
              <li><a href="#tecnologia" className="hover:text-cyan-400 transition">Ventajas</a></li>
              <li><a href="#contacto" className="hover:text-cyan-400 transition">Contacto</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Contacto Directo</h4>
            <p className="text-xs text-zinc-400">Tel: <span className="text-white font-mono">{phone}</span></p>
            <p className="text-xs text-zinc-400">Email: <span className="text-white font-mono">{email}</span></p>
            <p className="text-xs text-zinc-400">Dir: <span className="text-white">{address}</span></p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Síguenos en Redes</h4>
            <div className="flex flex-wrap gap-3">
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-cyan-400 text-zinc-300 hover:text-cyan-400 transition" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {tiktok && (
                <a href={tiktok} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-cyan-400 text-zinc-300 hover:text-cyan-400 transition" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-cyan-400 text-zinc-300 hover:text-cyan-400 transition" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-cyan-400 text-zinc-300 hover:text-cyan-400 transition" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {storeName}. Todos los derechos reservados.</p>
          <p className="mt-2 sm:mt-0">Esta página fue creada por <a href="https://telotengosolutions.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">telotengosolutions.com</a></p>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <SettingsProvider>
      <CartProvider>
        <HomeContent />
        <Cart />
      </CartProvider>
    </SettingsProvider>
  );
}