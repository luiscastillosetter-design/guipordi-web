"use client";
import { siteConfig } from "@/config/site.config";
import ScrollVideoHero from "@/components/ScrollVideoHero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-400 selection:text-black">
      {/* Navbar superior con Logo grande y botón CONTACTO */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 md:px-12 py-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3.5">
          <img 
            src={siteConfig.brand.logo} 
            alt="Logo Guipordi" 
            className="h-12 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes(".jpg")) {
                target.src = "/images/logo.jpg";
              } else {
                target.style.display = 'none';
              }
            }}
          />
          <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-widest bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {siteConfig.brand.name}
          </span>
        </div>

        <div className="hidden lg:flex gap-8 text-xs font-semibold tracking-widest text-zinc-300">
          <a href="#" className="hover:text-cyan-400 transition">INICIO</a>
          <a href="#catalogo" className="hover:text-cyan-400 transition">CATÁLOGO</a>
          <a href="#tecnologia" className="hover:text-cyan-400 transition">VENTAJAS</a>
          <a href="#contacto" className="hover:text-cyan-400 transition">CONTACTO</a>
        </div>

        <a 
          href={siteConfig.hero.whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs sm:text-sm tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] transition transform hover:scale-105"
        >
          CONTACTO
        </a>
      </nav>

      {/* Hero Scrollytelling AIDA */}
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

      {/* Catálogo de Soluciones Energéticas */}
      <section id="catalogo" className="py-24 sm:py-28 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto relative z-20">
        <div className="text-center mb-16 space-y-4">
          <span className="text-cyan-400 text-xs tracking-[0.25em] font-bold uppercase">Tecnología Sin Cortes</span>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Catálogo de Soluciones
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {siteConfig.products.map((product) => (
            <div 
              key={product.id} 
              className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-300 group"
            >
              <div>
                <div className="h-48 sm:h-52 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-xl mb-6 flex flex-col items-center justify-center text-zinc-500 group-hover:text-cyan-400 transition border border-white/5 relative overflow-hidden">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400">GUIPORDI UNIT</span>
                  <span className="text-sm font-bold mt-2 text-white text-center px-2">{product.name}</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950/60 border border-cyan-500/20 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold mt-3 text-white group-hover:text-cyan-300 transition">{product.name}</h3>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{product.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xl font-extrabold text-white font-mono">{product.price}</span>
                <a 
                  href={siteConfig.hero.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white text-black font-extrabold rounded-lg text-xs hover:bg-cyan-400 transition shadow"
                >
                  COTIZAR
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Ventajas */}
      <section id="tecnologia" className="py-20 sm:py-24 bg-black/60 border-y border-white/10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {siteConfig.services.map((service, index) => (
            <div key={index} className="p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-cyan-500/40 transition">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg">
                0{index + 1}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{service.title}</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sección Contacto */}
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