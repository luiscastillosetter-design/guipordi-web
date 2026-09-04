"use client";
import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/config/site.config";
import ScrollVideoHero from "@/components/ScrollVideoHero";
import { motion, AnimatePresence } from "framer-motion";
import productsDataRaw from "@/data/products.json";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

// Filtro estricto: Solo Inversores
const featuredKeywords = ["INVERSOR"];
const featuredProducts = productsData.filter((product) =>
  featuredKeywords.some((keyword) => product.name.toUpperCase().includes(keyword))
).slice(0, 8);

function HomeContent() {
  const { addToCart } = useCart();
  const router = useRouter();
  const [homeSearch, setHomeSearch] = useState("");
  
  // Estados para el UX Inmersivo (Scroll y Audio)
  const [showScrollTip, setShowScrollTip] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Configuración del track Tech House
    audioRef.current = new Audio('/music/tech-house.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    // Detectar scroll para ocultar la flecha
    const handleScroll = () => {
      setShowScrollTip(window.scrollY < 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleAudio = () => {
    if (isAudioPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.log("Bloqueo de navegador:", e));
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearch.trim() !== "") {
      router.push(`/catalogo?q=${encodeURIComponent(homeSearch)}`);
    }
  };

  const advantages = [
    {
      title: "Cero Combustible",
      description: "Funcionamiento 100% a batería. Sin gasolina, sin humo y sin ruidos molestos.",
      image: "/images/ventaja-1.jpg",
    },
    {
      title: "Carga Inteligente",
      description: "Sistemas optimizados para red eléctrica, adaptados a la realidad del país.",
      image: "/images/ventaja-2.jpg",
    },
    {
      title: "Garantía y Respaldo",
      description: "Equipos de alta durabilidad diseñados para proteger tus equipos del hogar.",
      image: "/images/ventaja-3.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-400 selection:text-black relative">
      
      {/* Botón flotante de Audio */}
      <button 
        onClick={toggleAudio}
        className={`fixed bottom-6 left-6 z-40 p-4 rounded-full border shadow-2xl transition-all duration-300 backdrop-blur-md ${isAudioPlaying ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-black/50 border-white/10 text-zinc-500 hover:text-white'}`}
      >
        {isAudioPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 animate-pulse"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.71-1.59-1.59V9.84c0-.88.71-1.59 1.59-1.59h2.24z" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.71-1.59-1.59V9.84c0-.88.71-1.59 1.59-1.59h2.24z" /></svg>
        )}
      </button>

      {/* Flecha Animada de Scroll (Teletransportada visualmente al Hero) */}
      <AnimatePresence>
        {showScrollTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 15, 0] }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
            className="absolute top-[85vh] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
          >
            <span className="text-cyan-400 text-[10px] font-black tracking-[0.4em] uppercase">Desliza</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-cyan-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25v-4.332c0-.66-.527-1.288-1.229-1.49l-6.52-1.89a2.25 2.25 0 00-1.5 0l-6.52 1.89A1.75 1.75 0 002.5.918v4.332m15.75 0V15a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 15V5.25m15.75 0a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 5.25m15.75 0v11.25m-15.75 0V5.25m0 11.25c0 1.242 1.008 2.25 2.25 2.25h11.25c1.242 0 2.25-1.008 2.25-2.25" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-2 sm:gap-3.5">
          <img 
            src={siteConfig.brand.logo} 
            alt="Logo Guipordi" 
            className="h-10 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]" 
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-widest bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {siteConfig.brand.name}
          </span>
        </div>

        <div className="hidden lg:flex gap-8 text-xs font-semibold tracking-widest text-zinc-300">
          <a href="#" className="hover:text-cyan-400 transition">INICIO</a>
          <a href="#catalogo" className="hover:text-cyan-400 transition">CATÁLOGO</a>
          <a href="#tecnologia" className="hover:text-cyan-400 transition">VENTAJAS</a>
          <a href="#contacto" className="hover:text-cyan-400 transition">CONTACTO</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <a 
            href="#catalogo" 
            className="lg:hidden px-3 py-2 sm:px-5 sm:py-3 rounded-full border border-cyan-400 text-cyan-400 font-bold text-[10px] sm:text-sm tracking-widest hover:bg-cyan-400/10 transition"
          >
            CATÁLOGO
          </a>
          <a 
            href={siteConfig.hero.whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 sm:px-7 sm:py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-[10px] sm:text-sm tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.4)] transition transform hover:scale-105"
          >
            CONTACTO
          </a>
        </div>
      </nav>

      <ScrollVideoHero 
        videoSrc={siteConfig.hero.video}
        badge={siteConfig.hero.badge}
        category={siteConfig.hero.category}
        title={siteConfig.hero.title}
        subtitle={siteConfig.hero.subtitle}
        catalogLink="#catalogo"
        whatsappLink={siteConfig.hero.whatsappLink}
        whatsappText={siteConfig.hero.whatsappButtonText}
        aidaSequence={siteConfig.hero.aidaSequence}
      />

      <section id="catalogo" className="py-24 sm:py-28 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto relative z-20">
        <div className="text-center mb-10 space-y-4">
          <span className="text-cyan-400 text-xs tracking-[0.25em] font-bold uppercase">Tecnología Sin Cortes</span>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Productos Destacados
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
        </div>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16 relative">
          <input
            type="text"
            placeholder="Busca tu producto aquí y presiona Enter..."
            value={homeSearch}
            onChange={(e) => setHomeSearch(e.target.value)}
            className="w-full bg-zinc-900/80 border border-cyan-500/50 rounded-full px-8 py-5 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all text-sm sm:text-base font-medium"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-500 text-black px-6 py-2.5 rounded-full font-bold text-xs tracking-widest hover:bg-white transition">
            BUSCAR
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-300 group"
            >
              <div>
                <div className="h-48 sm:h-52 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-xl mb-6 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain z-10 p-2 mix-blend-screen transition-opacity duration-300"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                
                <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950/60 border border-cyan-500/20 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold mt-3 text-white group-hover:text-cyan-300 transition line-clamp-2">{product.name}</h3>
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
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link 
            href="/catalogo" 
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-sm sm:text-base uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] hover:scale-105 transition-all duration-300"
          >
            Ver Catálogo Completo
          </Link>
        </div>
      </section>

      <section id="tecnologia" className="py-24 sm:py-28 bg-black/90 border-y border-cyan-500/30 px-4 sm:px-8 md:px-12 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-cyan-400 text-xs tracking-[0.25em] font-bold uppercase">¿Por qué elegirnos?</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-cyan-400 bg-clip-text text-transparent">
              Ventajas Competitivas
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full shadow-[0_0_15px_rgba(0,240,255,0.7)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.3, ease: "easeOut" }}
                className="group relative h-96 rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:shadow-[0_0_45px_rgba(0,240,255,0.6)] hover:border-cyan-400 transition-all duration-500"
              >
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/70 to-transparent opacity-95 group-hover:opacity-85 transition-opacity" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-left space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/30 border border-cyan-400 flex items-center justify-center text-cyan-300 font-mono font-bold text-sm backdrop-blur-md mb-2 shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                    0{index + 1}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors uppercase tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {service.title}
                  </h4>
                  <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-24 sm:py-28 max-w-4xl mx-auto px-4 text-center space-y-8">
        <div className="space-y-3">
          <span className="text-cyan-400 text-xs tracking-widest uppercase font-bold">Atención Comercial 24/7</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider">Asistencia Inmediata por WhatsApp</h2>
          <p className="text-zinc-400 text-sm">Contáctanos directamente para asesorarte con la planta o respaldo ideal para tu espacio.</p>
        </div>

        <div className="p-8 rounded-3xl bg-zinc-900/80 border border-cyan-500/20 shadow-[0_0_40px_rgba(0,240,255,0.1)] inline-block w-full max-w-xl space-y-4">
          <p className="text-cyan-400 font-mono text-xl font-bold">Guipordi 24/7</p>
          <p className="text-zinc-300 text-sm">{siteConfig.contact.email}</p>
          <div className="pt-2">
            <a 
              href={siteConfig.hero.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3.5 bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-white transition"
            >
              CONTÁCTANOS POR WHATSAPP
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-white/10 text-center text-xs text-zinc-500 px-4">
        <p>© {new Date().getFullYear()} {siteConfig.brand.name}. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <HomeContent />
      <Cart />
    </CartProvider>
  );
}