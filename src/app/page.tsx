"use client";
import { siteConfig } from "@/config/site.config";
import ScrollVideoHero from "@/components/ScrollVideoHero";
import { motion } from "framer-motion";
import productsDataRaw from "@/data/products.json";
import Link from "next/link";
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

function HomeContent() {
  const { addToCart } = useCart();

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
    <main className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-400 selection:text-black">
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-2 sm:gap-3.5">
          <img 
            src={siteConfig.brand.logo} 
            alt="Logo Guipordi" 
            className="h-10 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes(".jpg")) {
                target.src = "/images/logo.jpg";
              } else {
                target.style.display = 'none';
              }
            }}
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
        <div className="text-center mb-16 space-y-4">
          <span className="text-cyan-400 text-xs tracking-[0.25em] font-bold uppercase">Tecnología Sin Cortes</span>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Productos Destacados
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {productsData.slice(0, 8).map((product) => (
            <div 
              key={product.id} 
              className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-300 group"
            >
              <div>
                <div className="h-48 sm:h-52 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-xl mb-6 flex flex-col items-center justify-center text-zinc-500 group-hover:text-cyan-400 transition border border-white/5 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain z-10 p-2 mix-blend-screen transition-opacity duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null; 
                      target.src = siteConfig.brand.logo || "/images/logo.jpg";
                      target.className = "absolute inset-0 w-1/2 h-1/2 m-auto object-contain z-10 opacity-10 filter grayscale";
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400">GUIPORDI UNIT</span>
                    <span className="text-sm font-bold mt-2 text-zinc-600 text-center px-2 line-clamp-2">{product.name}</span>
                  </div>
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