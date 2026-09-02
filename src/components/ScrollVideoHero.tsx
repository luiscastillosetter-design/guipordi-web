"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/config/site.config";

interface AidaStep {
  headline: string;
  text: string;
}

interface ScrollVideoProps {
  videoSrc: string;
  badge: string;
  category: string;
  title: string;
  subtitle: string;
  catalogLink: string;
  whatsappLink: string;
  whatsappText: string;
  aidaSequence: AidaStep[];
}

export default function ScrollVideoHero({
  videoSrc,
  badge,
  category,
  title,
  subtitle,
  catalogLink,
  whatsappLink,
  whatsappText,
  aidaSequence,
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateVideoTime = (latest: number) => {
      if (video.duration && !isNaN(video.duration)) {
        video.currentTime = latest * video.duration;
      }
    };

    const unsubscribe = scrollYProgress.on("change", updateVideoTime);
    return () => unsubscribe();
  }, [scrollYProgress]);

  // El texto inicial se desvanece y se elimina completamente del flujo de renderizado (display: none)
  const initialTextOpacity = useTransform(scrollYProgress, [0, 0.05, 0.06], [1, 0, 0], { clamp: true });
  const initialTextDisplay = useTransform(scrollYProgress, [0, 0.06], ["block", "none"]);

  // Fases AIDA estrictamente separadas para evitar cualquier cruce
  const step1Opacity = useTransform(scrollYProgress, [0.15, 0.22, 0.32], [0, 1, 0], { clamp: true });
  const step2Opacity = useTransform(scrollYProgress, [0.35, 0.42, 0.52], [0, 1, 0], { clamp: true });
  const step3Opacity = useTransform(scrollYProgress, [0.55, 0.62, 0.72], [0, 1, 0], { clamp: true });
  const step4Opacity = useTransform(scrollYProgress, [0.75, 0.82, 0.95], [0, 1, 1], { clamp: true });

  const containerScale = useTransform(scrollYProgress, [0.95, 1], [1, 1.05]);

  return (
    <div ref={containerRef} className="relative h-[450vh] bg-[#030712]">
      <motion.div style={{ scale: containerScale }} className="sticky top-0 h-screen w-full overflow-hidden flex items-end">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-125"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 z-10" />

        {/* 1. BLOQUE INICIAL: Desaparece por completo y se apaga su display */}
        <motion.div 
          style={{ opacity: initialTextOpacity, display: initialTextDisplay }}
          className="absolute bottom-6 left-6 md:left-12 z-20 max-w-xl text-left space-y-4 pb-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-cyan-400 font-extrabold bg-cyan-950/80 border border-cyan-500/40 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              {badge}
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-300 font-semibold hidden sm:inline">
              {category}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)] leading-none">
            {title}
          </h1>

          <p className="text-zinc-100 text-base sm:text-lg md:text-xl font-normal leading-relaxed drop-shadow max-w-lg">
            {subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a 
              href={catalogLink} 
              className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-sm uppercase tracking-widest rounded-full shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:bg-white transition transform hover:scale-105"
            >
              {siteConfig.hero.ctaCatalog}
            </a>
            
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-7 py-4 border border-cyan-500/50 bg-black/70 backdrop-blur-md text-cyan-300 font-extrabold text-sm uppercase tracking-widest rounded-full hover:bg-cyan-500/20 hover:border-cyan-400 transition flex items-center gap-2.5 shadow-xl"
            >
              <span className="text-lg">💬</span> {whatsappText}
            </a>
          </div>
        </motion.div>

        {/* 2. FRASES AIDA SECUENCIALES */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-6 pointer-events-none">
          <motion.div style={{ opacity: step1Opacity }} className="absolute text-center max-w-3xl space-y-4 pointer-events-auto">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight uppercase text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
              {aidaSequence[0].headline}
            </h2>
            <p className="text-zinc-100 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto font-normal leading-relaxed drop-shadow">
              {aidaSequence[0].text}
            </p>
          </motion.div>

          <motion.div style={{ opacity: step2Opacity }} className="absolute text-center max-w-3xl space-y-4 pointer-events-auto">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight uppercase text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
              {aidaSequence[1].headline}
            </h2>
            <p className="text-zinc-100 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto font-normal leading-relaxed drop-shadow">
              {aidaSequence[1].text}
            </p>
          </motion.div>

          <motion.div style={{ opacity: step3Opacity }} className="absolute text-center max-w-3xl space-y-4 pointer-events-auto">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight uppercase text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
              {aidaSequence[2].headline}
            </h2>
            <p className="text-zinc-100 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto font-normal leading-relaxed drop-shadow">
              {aidaSequence[2].text}
            </p>
          </motion.div>

          <motion.div style={{ opacity: step4Opacity }} className="absolute text-center max-w-3xl space-y-5 pointer-events-auto">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight uppercase text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
              {aidaSequence[3].headline}
            </h2>
            <p className="text-zinc-100 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto font-normal leading-relaxed drop-shadow">
              {aidaSequence[3].text}
            </p>
            <div className="pt-3">
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 bg-cyan-400 text-black font-black text-sm uppercase tracking-widest rounded-full shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:bg-white transition transform hover:scale-105"
              >
                CONTÁCTANOS VÍA WHATSAPP
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}