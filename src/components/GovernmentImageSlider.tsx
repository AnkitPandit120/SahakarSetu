import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Quote,
  Sparkles,
  Landmark,
  ArrowUpRight,
  Mic,
  PhoneCall,
  Radio,
  Calendar,
  Share2,
  HelpCircle,
  Activity,
  MessageSquare,
  Building2,
  TreePine,
  CheckCircle2,
  Compass,
  Wifi,
  Gift,
  Users,
  Smartphone,
  Award
} from 'lucide-react';
import { Language } from '../types';
import { GOV_SLIDES, SlideItem, LEADER_IMAGES } from '../data/slides';

interface GovernmentImageSliderProps {
  language: Language;
  onSelectQuery?: (query: string) => void;
  onOpenDirectChat?: () => void;
  onOpenGuided?: () => void;
}

export const GovernmentImageSlider: React.FC<GovernmentImageSliderProps> = ({
  language,
  onSelectQuery,
  onOpenDirectChat,
  onOpenGuided
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<number>(1);
  const [showShareToast, setShowShareToast] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 6000; // 6 seconds per slide

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % GOV_SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + GOV_SLIDES.length) % GOV_SLIDES.length);
  };

  const handleGoTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto slide effect
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPlaying]);

  const currentSlide = GOV_SLIDES[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] }
    })
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SahakarSetu - National Cooperative Portal',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  return (
    <div
      id="govt-full-banner-carousel"
      className="relative w-full bg-[#081830] overflow-hidden select-none border-b-2 border-amber-400 shadow-md group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* 1. Main Slide Viewport */}
      <div className="relative w-full min-h-[380px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[480px] flex items-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* RENDER SLIDE BY TYPE */}

            {/* --- SLIDE TYPE 0A: SAHAKAR SE SAMRIDDHI (MATCHING USER BANNER 2) --- */}
            {currentSlide.type === 'sahakar-samriddhi' && (
              <div className="w-full h-full bg-[#fdfdfd] text-slate-900 flex flex-col justify-between relative overflow-hidden">
                {/* Single Official Government Ministry of Cooperation Banner Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  <img
                    src={LEADER_IMAGES.cooperationBanner}
                    alt="Ministry of Cooperation Government Banner"
                    className="w-full h-full object-cover object-center opacity-40 filter saturate-115 contrast-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/80" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/60" />
                </div>

                {/* Subtle warm ambient tint */}
                <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-amber-200/30 via-orange-100/15 to-transparent pointer-events-none z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-4 md:py-6 z-10">
                  {/* Top: Tri-Emblem Header (G20, Ministry of Cooperation, Azadi Ka Amrit Mahotsav) */}
                  <div className="flex items-center justify-center gap-6 sm:gap-12 border-b border-slate-200/70 pb-2">
                    {/* G20 Logo */}
                    <div className="flex items-center gap-1.5">
                      <div className="text-center">
                        <div className="text-sm sm:text-base font-black tracking-tighter text-slate-900 leading-none">
                          <span className="text-amber-500">G</span>
                          <span className="text-emerald-600">2</span>
                          <span className="text-blue-600">0</span>
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                          भारत 2023 INDIA
                        </div>
                      </div>
                    </div>

                    <div className="h-6 w-px bg-slate-300 hidden sm:block" />

                    {/* Ministry of Cooperation Official Emblem */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0.5 bg-white shadow-xs border border-amber-300 flex items-center justify-center">
                        {/* Hands Emblem Chakra */}
                        <div className="relative w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-amber-400 via-white to-emerald-500 p-1">
                          <Building2 className="w-4 h-4 text-[#0B3B60]" />
                        </div>
                      </div>
                      <div className="text-left hidden xs:block">
                        <div className="text-[10px] sm:text-[11px] font-black text-slate-900 leading-tight">
                          सहकारिता मंत्रालय
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-bold text-slate-600">
                          Ministry of Cooperation, Govt. of India
                        </div>
                      </div>
                    </div>

                    <div className="h-6 w-px bg-slate-300 hidden sm:block" />

                    {/* 75 Azadi Ka Amrit Mahotsav */}
                    <div className="flex items-center gap-1.5">
                      <div className="text-center">
                        <div className="text-sm sm:text-base font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-slate-800 to-[#138808]">
                          75<span className="text-xs font-semibold text-slate-700 ml-0.5">th</span>
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-bold text-slate-600 tracking-tight leading-tight">
                          Azadi Ka Amrit Mahotsav
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Main Stage: Modi on Left, Hindi 3D Typography in Center, Amit Shah on Right */}
                  <div className="my-auto flex items-center justify-between gap-2 sm:gap-6 pt-5 sm:pt-8 md:pt-10 pb-2">
                    {/* Left: PM Narendra Modi Portrait Frame */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="relative w-32 h-44 sm:w-44 sm:h-60 md:w-52 md:h-72 rounded-2xl overflow-hidden shadow-2xl border-3 border-amber-500/90 bg-gradient-to-b from-amber-50 to-orange-100 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/30 group/modi">
                        <img
                          src={LEADER_IMAGES.modi}
                          alt="Government of India"
                          className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.04] transition-transform duration-500 group-hover/modi:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Center: Iconic "सहकार से समृद्धि" 3D Typography */}
                    <div className="flex-1 text-center px-2 space-y-2 sm:space-y-3">
                      {/* Calligraphy styled headline */}
                      <div className="inline-block py-1 sm:py-2">
                        <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none drop-shadow-md">
                          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ff781f] via-[#e65c00] to-[#b34700] drop-shadow-sm font-serif">
                            सहकार
                          </span>
                        </div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 my-0.5 sm:my-1">
                          से
                        </div>
                        <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none drop-shadow-md">
                          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#16a34a] via-[#15803d] to-[#14532d] drop-shadow-sm font-serif">
                            समृद्धि
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-slate-700 max-w-md mx-auto hidden sm:block">
                        {language === 'hi' ? currentSlide.quoteHi : currentSlide.quoteEn}
                      </p>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        <button
                          type="button"
                          id="btn-sahakar-samriddhi-query"
                          onClick={() => onSelectQuery && onSelectQuery(currentSlide.query)}
                          className="px-4 py-2 bg-[#0B3B60] hover:bg-[#07263f] text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>{language === 'hi' ? 'सहकार से समृद्धि विज़न पूछें' : 'Inquire Cooperative Vision'}</span>
                        </button>
                        {onOpenDirectChat && (
                          <button
                            type="button"
                            onClick={onOpenDirectChat}
                            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'एआई सहकार मित्र' : 'AI Sahayak'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right: Union Minister Amit Shah Portrait Frame */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="relative w-32 h-44 sm:w-44 sm:h-60 md:w-52 md:h-72 rounded-2xl overflow-hidden shadow-2xl border-3 border-emerald-600/90 bg-gradient-to-b from-emerald-50 to-teal-100 transition-all duration-300 hover:scale-105 hover:shadow-emerald-600/30 group/amit">
                        <img
                          src={LEADER_IMAGES.amitShah}
                          alt="Ministry of Cooperation"
                          className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.04] transition-transform duration-500 group-hover/amit:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Strip */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1.5 border-t border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'hi' ? 'सहकारिता मंत्रालय • भारत सरकार' : 'Ministry of Cooperation • Govt of India'}</span>
                    </div>
                    <span className="font-semibold text-slate-700">cooperation.gov.in</span>
                  </div>
                </div>
              </div>
            )}

            {/* --- SLIDE TYPE 0B: CRCS SAHARA PORTAL (MATCHING USER BANNER 4) --- */}
            {currentSlide.type === 'crcs-sahara' && (
              <div className="w-full h-full bg-[#111827] text-white flex flex-col justify-between relative overflow-hidden">
                {/* Split Panoramic Photo Composition with Angled Orange Chevron Divider */}
                <div className="absolute inset-0 flex flex-col md:flex-row w-full h-full">
                  {/* Left Half: Launch on Stage with Amit Shah & Dignitaries */}
                  <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden bg-slate-950">
                    <img
                      src={LEADER_IMAGES.amitShah}
                      alt="CRCS Sahara Portal Launch Ceremony"
                      className="w-full h-full object-cover object-center filter brightness-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
                    
                    <div className="absolute top-4 left-4 sm:left-8 z-10">
                      <div className="inline-flex items-center gap-1.5 bg-black/60 border border-amber-400/50 px-3 py-1 rounded-full text-xs font-bold text-amber-300 backdrop-blur-md">
                        <Landmark className="w-3.5 h-3.5" />
                        <span>सहकारिता मंत्रालय • Ministry of Cooperation</span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 sm:left-8 z-10 max-w-sm">
                      <h4 className="text-base sm:text-lg font-black text-white leading-tight">
                        केंद्रीय पंजीयक - सहारा रिफंड पोर्टल
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
                        सहकारिता मंत्रालय, भारत सरकार
                      </p>
                    </div>
                  </div>

                  {/* Center Angled Saffron Divider matching screenshot */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-16 h-full z-20 pointer-events-none">
                    <div className="w-full h-full bg-gradient-to-b from-amber-500 via-orange-500 to-amber-600 -skew-x-12 shadow-2xl opacity-95 flex items-center justify-center border-x-2 border-white/40">
                      <div className="rotate-90 text-[10px] font-black tracking-widest text-slate-950 uppercase whitespace-nowrap">
                        CRCS PORTAL
                      </div>
                    </div>
                  </div>

                  {/* Right Half: Citizen Beneficiaries Greeting / Namaste */}
                  <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden bg-slate-900">
                    <img
                      src={LEADER_IMAGES.citizenBeneficiary}
                      alt="Citizens and Cooperative Members"
                      className="w-full h-full object-cover object-center filter brightness-95"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/50 to-transparent" />

                    <div className="absolute top-4 right-4 sm:right-8 z-10 text-right">
                      <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-400/50 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>100% पारदर्शी डिजिटल रिफंड</span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 sm:right-8 z-10 max-w-sm text-right">
                      <h4 className="text-base sm:text-lg font-black text-amber-300 leading-tight">
                        प्रत्यक्ष बैंक खाता अंतरण (DBT)
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-200 mt-1">
                        सहकारी जमाकर्ताओं के वैध दावों का त्वरित सत्यापन एवं पारदर्शी भुगतान
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Centered Action Card */}
                <div className="relative z-30 max-w-2xl mx-auto px-4 py-4 w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/70 backdrop-blur-md rounded-2xl border border-amber-400/60 shadow-2xl my-auto">
                  <div className="text-center sm:text-left">
                    <div className="text-xs font-bold text-amber-300">
                      Central Registrar of Cooperative Societies (CRCS)
                    </div>
                    <div className="text-sm sm:text-base font-black text-white">
                      {language === 'hi' ? currentSlide.dignitaryHi : currentSlide.dignitaryEn}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      id="btn-crcs-sahara-query"
                      onClick={() => onSelectQuery && onSelectQuery(currentSlide.query)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'रिफंड प्रक्रिया जानें' : 'Check Refund Steps'}</span>
                    </button>
                    {onOpenDirectChat && (
                      <button
                        type="button"
                        onClick={onOpenDirectChat}
                        className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        {language === 'hi' ? 'पूछें' : 'Ask'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative z-30 w-full bg-slate-950/90 border-t border-white/10 px-6 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>सहकारिता मंत्रालय • सहकार से समृद्धि</span>
                  <span className="text-amber-400 font-bold">mocrefund.crcs.gov.in</span>
                </div>
              </div>
            )}

            {/* --- SLIDE TYPE 1: MANN KI BAAT --- */}
            {currentSlide.type === 'mann-ki-baat' && (
              <div className="w-full h-full bg-gradient-to-r from-[#071739] via-[#0d2859] to-[#143d82] text-white flex flex-col justify-between relative overflow-hidden">
                {/* Subtle Geometric & Sound Wave Background Accent */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto w-full h-full flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 lg:px-16 py-6 md:py-8 z-10 gap-6">
                  {/* Left Side: Citizen / Photo Strip Montage */}
                  <div className="hidden lg:flex items-center gap-3 shrink-0">
                    <div className="relative w-36 h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 -rotate-2">
                      <img
                        src={LEADER_IMAGES.modi}
                        alt="National Broadcast"
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="relative w-28 h-60 rounded-2xl overflow-hidden shadow-xl border border-white/20 rotate-3">
                      <img
                        src={LEADER_IMAGES.farmerSugarcane}
                        alt="Jan Bhagidari"
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col justify-end p-2">
                        <span className="text-[9px] font-bold text-emerald-300">Jan Bhagidari</span>
                      </div>
                    </div>
                  </div>

                  {/* Center / Main Content Area: Mann Ki Baat typography */}
                  <div className="flex-1 max-w-2xl text-center md:text-left space-y-3">
                    <div className="inline-flex items-center gap-2 bg-blue-900/80 border border-blue-400/40 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-sky-200 shadow-sm">
                      <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                      <span className="tracking-wide">
                        {language === 'hi' ? 'आकाशवाणी राष्ट्रीय संवाद' : 'All India Radio National Broadcast'}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base md:text-lg font-medium text-sky-100 tracking-wide">
                      {language === 'hi'
                        ? 'राष्ट्रीय संवाद में अपने विचार व सुझाव साझा करें'
                        : 'Share your ideas & Suggestions for'}
                    </h3>

                    {/* Stylized "Mann Ki Baat" Big Heading matching screenshot */}
                    <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 sm:gap-4 my-1">
                      <div className="relative inline-flex items-center">
                        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 font-serif drop-shadow-md">
                          Mann<br className="hidden sm:block" /> Ki Baat
                        </div>
                        {/* Microphone vector badge */}
                        <div className="ml-3 sm:ml-4 flex flex-col items-center justify-center p-2.5 bg-sky-950/80 border border-sky-400/50 rounded-2xl shadow-inner">
                          <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-sky-300 animate-bounce" />
                          <div className="flex items-center gap-0.5 mt-1">
                            <span className="w-1 h-3 bg-sky-400 rounded-full animate-pulse"></span>
                            <span className="w-1 h-5 bg-sky-300 rounded-full animate-pulse"></span>
                            <span className="w-1 h-2 bg-sky-400 rounded-full animate-pulse"></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-base sm:text-lg md:text-xl font-bold text-amber-300">
                      {language === 'hi' ? '30 अगस्त 2026 को प्रसारित' : 'on 30th August 2026'}
                    </div>

                    <div className="pt-2 border-t border-blue-500/30 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs sm:text-sm font-bold text-white">
                        <div className="flex items-center gap-1.5 bg-rose-600/90 px-3 py-1 rounded-md shadow-sm">
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Dial 1800 11 7800 (Toll-Free)</span>
                        </div>
                        <span className="text-sky-200 font-normal hidden sm:inline">or share via portal</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-sky-200/90">
                        {currentSlide.datesText}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                      <button
                        type="button"
                        id="btn-mann-ki-baat-query"
                        onClick={() => onSelectQuery && onSelectQuery(currentSlide.query)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'सहकारिता सुझाव व प्रश्न पूछें' : 'Inquire Cooperative Suggestions'}</span>
                      </button>

                      {onOpenDirectChat && (
                        <button
                          type="button"
                          onClick={onOpenDirectChat}
                          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-sky-300" />
                          <span>{language === 'hi' ? 'एआई सहकार मित्र चैट' : 'Open AI Sahayak'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- SLIDE TYPE 2: VIBRANT VILLAGES PROGRAMME --- */}
            {currentSlide.type === 'vibrant-villages' && (
              <div className="w-full h-full bg-[#fcfcfd] text-slate-900 flex flex-col justify-between relative overflow-hidden">
                {/* Mountain Graphic at Bottom matching screenshot */}
                <div className="absolute bottom-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-t from-emerald-800/15 via-emerald-600/5 to-transparent pointer-events-none flex items-end">
                  <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 text-emerald-800/20 fill-current">
                    <path d="M0,120 L0,60 L150,20 L300,70 L450,15 L600,65 L750,10 L900,55 L1050,25 L1200,70 L1200,120 Z" />
                  </svg>
                </div>

                <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-6 md:py-8 z-10">
                  {/* Top: Official Ministry Emblems Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-6">
                      {/* Ministry of Home Affairs */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800 fill-current">
                            <path d="M50 8 C40 8 32 14 32 24 C32 30 36 35 40 38 L40 46 C34 46 28 50 28 58 L28 72 C28 76 32 80 36 80 L64 80 C68 80 72 76 72 72 L72 58 C72 50 66 46 60 46 L60 38 C64 35 68 30 68 24 C68 14 60 8 50 8 Z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-[11px] font-bold text-slate-900 leading-tight">गृह मंत्रालय</div>
                          <div className="text-[9px] font-extrabold text-slate-700 tracking-wider">MINISTRY OF HOME AFFAIRS</div>
                        </div>
                      </div>

                      <div className="h-6 w-px bg-slate-300 hidden sm:block" />

                      {/* Department of Border Management */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800 fill-current">
                            <path d="M50 8 C40 8 32 14 32 24 C32 30 36 35 40 38 L40 46 C34 46 28 50 28 58 L28 72 C28 76 32 80 36 80 L64 80 C68 80 72 76 72 72 L72 58 C72 50 66 46 60 46 L60 38 C64 35 68 30 68 24 C68 14 60 8 50 8 Z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-[11px] font-bold text-slate-900 leading-tight">GOVERNMENT OF INDIA</div>
                          <div className="text-[9px] font-extrabold text-slate-700 tracking-wider">सीमा प्रबंधन विभाग / DEPT OF BORDER MANAGEMENT</div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FF9933]">National Portal</span>
                      <span className="text-xs font-extrabold text-slate-800">india.gov.in</span>
                    </div>
                  </div>

                  {/* Main Center Area: Vibrant Villages Logo & Typography */}
                  <div className="my-auto flex flex-col md:flex-row items-center justify-between gap-6 py-4">
                    <div className="flex items-center gap-6">
                      {/* Vibrant Villages Round Logo Motif */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-dashed border-emerald-600/60 p-2 flex flex-col items-center justify-center bg-emerald-50 shadow-md shrink-0">
                        <TreePine className="w-10 h-10 text-emerald-700" />
                        <span className="text-[9px] font-black text-emerald-900 tracking-tighter uppercase mt-0.5">
                          Vibrant Villages
                        </span>
                      </div>

                      {/* Main Title typography with Orange & Green branding */}
                      <div>
                        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                          <span className="text-[#FF9933] block">Vibrant</span>
                          <span className="text-[#138808] block mt-1">Villages</span>
                          <span className="text-slate-900 block text-2xl sm:text-3xl md:text-4xl font-extrabold mt-1">
                            Programme
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-lg mt-2">
                          {language === 'hi' ? currentSlide.quoteHi : currentSlide.quoteEn}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                      <button
                        type="button"
                        id="btn-vibrant-villages-query"
                        onClick={() => onSelectQuery && onSelectQuery(currentSlide.query)}
                        className="px-5 py-2.5 bg-[#0B3B60] hover:bg-[#07263f] text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Compass className="w-4 h-4 text-amber-300" />
                        <span>{language === 'hi' ? 'सीमावर्ती पैक्स योजनाएं देखें' : 'Border Cooperative Schemes'}</span>
                      </button>

                      {onOpenGuided && (
                        <button
                          type="button"
                          onClick={onOpenGuided}
                          className="px-5 py-2 bg-white border border-slate-300 hover:border-[#0B3B60] text-slate-800 hover:text-[#0B3B60] font-semibold rounded-lg text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>{language === 'hi' ? 'अधिनियम व नियम नेविगेटर' : 'Acts Navigator'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bottom Strip: india.gov.in branding */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'hi' ? '100% केंद्र प्रायोजित कार्यक्रम' : 'Centrally Sponsored Border Programme'}</span>
                    </div>
                    <span className="font-semibold text-slate-700">india.gov.in</span>
                  </div>
                </div>
              </div>
            )}

            {/* --- SLIDE TYPE: DIGITAL INDIA (MATCHING USER BANNER 1 - p10.webp) --- */}
            {currentSlide.type === 'digital-india' && (
              <div className="w-full h-full bg-[#f8fbff] text-slate-900 flex flex-col justify-between relative overflow-hidden">
                {/* Subtle digital circuit/matrix binary background pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#0284c710_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-sky-100/60 via-blue-50/40 to-transparent pointer-events-none z-0" />

                {/* Saffron bottom accent bar matching the uploaded image */}
                <div className="absolute bottom-0 inset-x-0 h-4 bg-[#f97316] z-20" />

                <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-3 sm:py-5 z-10">
                  {/* Top Header: Ministry of Electronics & IT + Digital India Logo + 11 Years Logo */}
                  <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                    {/* Left: MeitY & Digital India */}
                    <div className="flex items-center gap-3 sm:gap-6">
                      {/* Lion Capital MeitY Logo */}
                      <div className="flex items-center gap-2">
                        <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-slate-800" />
                        <div className="text-left">
                          <div className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none">
                            Ministry of
                          </div>
                          <div className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none">
                            Electronics and
                          </div>
                          <div className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none">
                            Information Technology
                          </div>
                          <div className="text-[7px] sm:text-[8px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                            Government of India
                          </div>
                        </div>
                      </div>

                      <div className="h-6 w-px bg-slate-300 hidden sm:block" />

                      {/* Digital India Logo */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#FF9933] via-white to-[#138808] p-0.5 shadow-2xs flex items-center justify-center">
                          <Wifi className="w-3.5 h-3.5 text-[#0056b3]" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs sm:text-sm font-black text-[#0056b3] leading-none">
                            Digital India
                          </div>
                          <div className="text-[7px] sm:text-[8px] font-semibold text-slate-600">
                            Power To Empower
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: 11 Years of Digital India Logo */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="text-right hidden xs:block">
                        <div className="text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                          Celebrating
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-bold text-slate-700">
                          Years of
                        </div>
                      </div>
                      <div className="flex items-center font-black tracking-tighter">
                        <span className="text-2xl sm:text-3xl md:text-4xl text-[#FF9933] leading-none">11</span>
                        <div className="ml-1 text-left">
                          <div className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase leading-tight">Digital</div>
                          <span className="text-base sm:text-xl font-black text-[#138808] leading-none">India</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Main Stage: Quote on Left + Modi Portrait on Right */}
                  <div className="my-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 py-2 sm:py-4">
                    {/* Left: Typography Quote matching p10.webp */}
                    <div className="flex-1 text-center md:text-left space-y-2 sm:space-y-3 max-w-2xl relative">
                      {/* Big decorative quotes */}
                      <Quote className="w-10 h-10 sm:w-14 sm:h-14 text-sky-200/80 -mb-4 -ml-2 pointer-events-none" />

                      <div className="space-y-1">
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black italic tracking-tight text-[#ea580c]">
                          Digital India
                        </h2>
                        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold italic text-slate-800 tracking-tight leading-tight">
                          means opportunity for all, facility for all and participation of all
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
                        <button
                          type="button"
                          id="btn-digital-india-query"
                          onClick={() => onSelectQuery && onSelectQuery(currentSlide.query)}
                          className="px-4 py-2 bg-[#0056b3] hover:bg-[#004085] text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>{language === 'hi' ? 'डिजिटल सहकारिता सेवाएं पूछें' : 'Explore Digital India Schemes'}</span>
                        </button>
                        {onOpenDirectChat && (
                          <button
                            type="button"
                            onClick={onOpenDirectChat}
                            className="px-3.5 py-2 bg-white border border-sky-300 hover:border-sky-500 text-sky-900 font-bold rounded-lg text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                            <span>{language === 'hi' ? 'एआई सहकार मित्र' : 'AI Sahayak'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right: Prime Minister Narendra Modi Portrait with Circular Backdrop */}
                    <div className="shrink-0 flex items-center justify-center relative">
                      {/* Circular glowing aura matching banner */}
                      <div className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full bg-gradient-to-tr from-sky-200/60 via-blue-100/40 to-white flex items-center justify-center p-2 shadow-inner">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-xl relative">
                          <img
                            src={LEADER_IMAGES.modi}
                            alt="Hon'ble Prime Minister Narendra Modi"
                            className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03]"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom strip text */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2">
                    <span className="font-semibold text-slate-700">digitalindia.gov.in • meity.gov.in</span>
                    <span>Power To Empower • Digital Governance</span>
                  </div>
                </div>
              </div>
            )}

            {/* --- SLIDE TYPE: E-UPAHAAR PRESIDENTIAL GIFTS AUCTION 2026 (MATCHING USER BANNER 2 - p7.png) --- */}
            {currentSlide.type === 'e-upahaar' && (
              <div className="w-full h-full bg-[#faf4ec] text-slate-900 flex flex-col justify-between relative overflow-hidden">
                {/* Traditional Madhubani/Warli Folk Art pattern background */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#8c4839_1.2px,transparent_1.2px)] [background-size:28px_28px]" />

                {/* Bottom Terracotta Border with tribal chevron patterns */}
                <div className="absolute bottom-0 inset-x-0 h-10 sm:h-12 bg-[#8a493c] text-amber-100 flex items-center justify-center px-4 overflow-hidden z-20">
                  <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase opacity-80 whitespace-nowrap">
                    &gt;&gt;&lt;&lt;&omicron;&gt;&gt;&lt;&lt;&omicron;&gt;&gt;&lt;&lt;&omicron;&gt;&gt;&lt;&lt;&omicron;&gt;&gt;&lt;&lt;&omicron;&gt;&gt;&lt;&lt;&omicron;&gt;&gt;&lt;&lt;&omicron;&gt;&gt;&lt;&lt;&omicron;&gt;&gt;&lt;&lt;&omicron;&gt;&gt;&lt;&lt;&omicron;&gt;&gt;&lt;&lt;&omicron;&gt;&gt;
                  </div>
                </div>

                <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-3 sm:py-5 z-10">
                  {/* Top: Rashtrapati Bhavan Emblem + MyGov Logo */}
                  <div className="flex items-center justify-between border-b border-[#e5d5c5] pb-2">
                    {/* Rashtrapati Bhavan */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-amber-300 flex items-center justify-center p-1">
                        <Building2 className="w-5 h-5 text-[#8a493c]" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-black text-slate-900 font-serif leading-none">
                          राष्ट्रपति भवन
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-bold text-slate-700 tracking-wider">
                          RASHTRAPATI BHAVAN
                        </div>
                      </div>
                    </div>

                    {/* MyGov Logo */}
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs sm:text-base font-black text-[#1b75bb] leading-none">
                          my<span className="text-[#84c441]">GOV</span>
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-bold text-slate-700">
                          मेरी सरकार
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Main Stage: Title + Traditional Artifacts Montage */}
                  <div className="my-auto flex flex-col md:flex-row items-center justify-between gap-4 py-2">
                    {/* Left & Center: Title Typography matching p7.png */}
                    <div className="text-center md:text-left space-y-2 max-w-xl">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif italic text-[#8a493c]">
                          e-Upahaar
                        </span>
                        <span className="bg-[#205167] text-white px-3 py-0.5 rounded-md font-sans font-black text-2xl sm:text-3xl md:text-4xl tracking-tight shadow-xs">
                          Presidential
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#8a493c] tracking-tight">
                        Gifts Auction 2026
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {language === 'hi' ? currentSlide.quoteHi : currentSlide.quoteEn}
                      </p>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
                        <button
                          type="button"
                          id="btn-e-upahaar-query"
                          onClick={() => onSelectQuery && onSelectQuery(currentSlide.query)}
                          className="px-4 py-2 bg-[#8a493c] hover:bg-[#723b30] text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Gift className="w-3.5 h-3.5 text-amber-300" />
                          <span>{language === 'hi' ? 'ई-उपहार नीलामी विवरण देखें' : 'Explore e-Upahaar Auction'}</span>
                        </button>
                        {onOpenDirectChat && (
                          <button
                            type="button"
                            onClick={onOpenDirectChat}
                            className="px-3.5 py-2 bg-[#205167] hover:bg-[#183f50] text-white font-bold rounded-lg text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-sky-200" />
                            <span>{language === 'hi' ? 'मायगॉव सहायता पूछें' : 'Ask MyGov Sahayak'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right: Traditional Handcrafted Artifacts / Gifts Presentation */}
                    <div className="shrink-0 flex items-center justify-center gap-2 sm:gap-4">
                      {/* Brass Nandi / Sacred Cow Card */}
                      <div className="flex flex-col items-center bg-white/80 backdrop-blur-xs p-2 sm:p-3 rounded-2xl border border-amber-200/80 shadow-md">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-amber-100 to-amber-50 flex items-center justify-center p-2 border border-amber-300">
                          <Award className="w-10 h-10 sm:w-14 sm:h-14 text-amber-700" />
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-800 mt-1.5 text-center">
                          पीतल कलाकृति (Brass Nandi)
                        </span>
                      </div>

                      {/* Tribal Art Memento Card */}
                      <div className="flex flex-col items-center bg-white/80 backdrop-blur-xs p-2 sm:p-3 rounded-2xl border border-amber-200/80 shadow-md">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-orange-100 to-amber-50 flex items-center justify-center p-2 border border-orange-300">
                          <Gift className="w-10 h-10 sm:w-14 sm:h-14 text-[#8a493c]" />
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-800 mt-1.5 text-center">
                          जनजातीय स्मृति-चिह्न (Tribal Art)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom strip */}
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pb-3">
                    <span className="font-semibold text-slate-800">rashtrapatibhavan.gov.in • mygov.in</span>
                    <span>सहभागिता व पारदर्शिता • Citizen Auction</span>
                  </div>
                </div>
              </div>
            )}

            {/* --- SLIDE TYPE: START-UP VILLAGE ENTREPRENEURSHIP PROGRAMME (MATCHING USER BANNER 3 - p5.jpg) --- */}
            {currentSlide.type === 'svep-programme' && (
              <div className="w-full h-full bg-[#fffbf7] text-slate-900 flex flex-col justify-between relative overflow-hidden">
                {/* Background warm contours */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-50/70 via-amber-50/40 to-transparent pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-3 sm:py-5 z-10">
                  {/* Top Header: Ministry of Social Justice & Empowerment */}
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-slate-800" />
                      <div className="text-left">
                        <div className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none">
                          Ministry of Social Justice &
                        </div>
                        <div className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none">
                          Empowerment
                        </div>
                        <div className="text-[7px] sm:text-[8px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                          Government of India
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-slate-700">
                      <span className="text-xs font-bold text-[#FF9933]">National Portal:</span>
                      <span className="text-xs font-black text-slate-900">india.gov.in</span>
                    </div>
                  </div>

                  {/* Center Main Stage: Red/Navy Bold Title on Left + Photo Grid on Right */}
                  <div className="my-auto flex flex-col md:flex-row items-center justify-between gap-6 py-2">
                    {/* Left: Bold Title typography matching p5.jpg */}
                    <div className="text-center md:text-left space-y-2 max-w-lg">
                      <div className="space-y-1">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#dc2626] leading-none tracking-tight">
                          Start-up Village
                        </h2>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1e1b4b] leading-none tracking-tight">
                          Entrepreneurship
                        </h2>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1e1b4b] leading-none tracking-tight">
                          Programme
                        </h2>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
                        {language === 'hi' ? currentSlide.quoteHi : currentSlide.quoteEn}
                      </p>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
                        <button
                          type="button"
                          id="btn-svep-query"
                          onClick={() => onSelectQuery && onSelectQuery(currentSlide.query)}
                          className="px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-amber-300" />
                          <span>{language === 'hi' ? 'ग्रामीण स्टार्टअप योजनाएं जानें' : 'Explore SVEP Rural Startups'}</span>
                        </button>
                        {onOpenDirectChat && (
                          <button
                            type="button"
                            onClick={onOpenDirectChat}
                            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-rose-300" />
                            <span>{language === 'hi' ? 'एआई सहकार मित्र' : 'AI Sahayak'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right: Rural Women Entrepreneurs & Village SHG Photo Montage */}
                    <div className="shrink-0 flex items-center gap-3">
                      {/* Main Mobile App SHG Card */}
                      <div className="relative w-44 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border-3 border-rose-300/80 bg-slate-900">
                        <img
                          src={LEADER_IMAGES.citizenBeneficiary}
                          alt="Rural Women Entrepreneurs"
                          className="w-full h-full object-cover object-center filter brightness-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2 inset-x-2 bg-black/70 backdrop-blur-md rounded-lg p-1.5 text-center text-white">
                          <div className="text-[10px] sm:text-xs font-bold text-amber-300">
                            महिला स्वयं सहायता समूह (SHG)
                          </div>
                          <div className="text-[8px] sm:text-[9px] text-slate-200">
                            डिजिटल आजीविका एवं उद्यमिता
                          </div>
                        </div>
                      </div>

                      {/* Small floating training camp cards */}
                      <div className="hidden sm:flex flex-col gap-2.5">
                        <div className="w-28 h-28 rounded-xl overflow-hidden shadow-md border-2 border-white/80 bg-slate-100">
                          <img
                            src={LEADER_IMAGES.farmerSugarcane}
                            alt="Village SHG Training Camp"
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="w-28 h-28 rounded-xl overflow-hidden shadow-md border-2 border-white/80 bg-slate-100">
                          <img
                            src={LEADER_IMAGES.cooperationBanner}
                            alt="Rural Enterprise Training"
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom strip */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-rose-100">
                    <span className="font-semibold text-slate-700">socialjustice.gov.in • rural.gov.in</span>
                    <span>अंत्योदय से आत्मनिर्भरता • Rural Enterprise Mission</span>
                  </div>
                </div>
              </div>
            )}

            {/* --- SLIDE TYPE: DIGNITARIES / LEADERS (FALLBACK / OTHER) --- */}
            {(currentSlide.type === 'leader' || currentSlide.type === 'pacs') && (
              <div className={`w-full h-full ${currentSlide.bannerBg || 'bg-[#0B3B60]'} text-white flex flex-col justify-between relative overflow-hidden`}>
                {/* Background ambient lighting */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#ffffff15,transparent_60%)] pointer-events-none" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto w-full h-full flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 lg:px-16 py-6 md:py-8 z-10 gap-6">
                  {/* Left / Center Text & Quote Information */}
                  <div className="flex-1 max-w-2xl space-y-3 text-center md:text-left">
                    {/* Tag badge */}
                    <div className="inline-flex items-center gap-2 bg-black/40 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-300 shadow-sm">
                      <Landmark className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? currentSlide.tagHi : currentSlide.tagEn}</span>
                    </div>

                    {/* Occasion / Ministry context */}
                    <div className="text-xs sm:text-sm font-semibold text-slate-300 tracking-wide uppercase">
                      {language === 'hi' ? currentSlide.occasionHi : currentSlide.occasionEn}
                    </div>

                    {/* Dignitary Name */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                      {language === 'hi' ? currentSlide.dignitaryHi : currentSlide.dignitaryEn}
                    </h2>

                    {/* Role / Designation */}
                    <div className="text-xs sm:text-sm font-bold text-amber-300/90">
                      {language === 'hi' ? currentSlide.roleHi : currentSlide.roleEn}
                    </div>

                    {/* Dignitary Quote Box */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3.5 sm:p-4 relative shadow-lg text-left">
                      <Quote className="w-6 h-6 text-amber-400/40 absolute top-2 right-3 pointer-events-none" />
                      <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed italic pr-6">
                        &ldquo;{language === 'hi' ? currentSlide.quoteHi : currentSlide.quoteEn}&rdquo;
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                      <button
                        type="button"
                        id={`btn-leader-query-${currentSlide.id}`}
                        onClick={() => onSelectQuery && onSelectQuery(currentSlide.query)}
                        className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {language === 'hi'
                            ? (currentSlide.primaryActionLabelHi || 'संबंधित योजना विवरण पूछें')
                            : (currentSlide.primaryActionLabelEn || 'Inquire Related Scheme')}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {onOpenDirectChat && (
                        <button
                          type="button"
                          onClick={onOpenDirectChat}
                          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                          <span>{language === 'hi' ? 'एआई सहकार मित्र' : 'AI Sahayak'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Portrait Image with Official Golden Border Frame */}
                  {currentSlide.image && (
                    <div className="relative shrink-0 flex items-center justify-center">
                      <div className="relative w-44 h-56 sm:w-56 sm:h-72 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400/80 bg-slate-900 group-hover:scale-[1.01] transition-transform">
                        <img
                          src={currentSlide.image}
                          alt="Government Initiative"
                          className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.04]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 2. Carousel Left / Right Navigation Buttons (Circular matching screenshot) */}
        <button
          type="button"
          id="banner-prev-slide-btn"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-slate-50 text-rose-600 border-2 border-rose-200 shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          id="banner-next-slide-btn"
          onClick={handleNext}
          aria-label="Next slide"
          className="absolute right-3 sm:right-6 md:right-14 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-slate-50 text-rose-600 border-2 border-rose-200 shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* 3. Right Floating Quick Actions Bar (Matching screenshot right toolbar) */}
        <div className="hidden md:flex flex-col items-center gap-1.5 absolute right-2.5 top-1/2 -translate-y-1/2 z-30 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-2xl">
          <button
            type="button"
            id="floating-chat-btn"
            onClick={onOpenDirectChat}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title={language === 'hi' ? 'एआई सहकार मित्र' : 'AI Sahayak Chat'}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="floating-help-btn"
            onClick={onOpenGuided}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title={language === 'hi' ? 'अधिनियम व नियम नेविगेटर' : 'Acts Navigator'}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="floating-calendar-btn"
            onClick={() => onSelectQuery && onSelectQuery('What are the upcoming election, audit, and AGM schedules under MSCS Act?')}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title={language === 'hi' ? 'वार्षिक कैलेंडर व समय सीमा' : 'Statutory Calendar'}
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="floating-share-btn"
            onClick={handleShare}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title={language === 'hi' ? 'पोर्टल शेयर करें' : 'Share Portal'}
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="floating-status-btn"
            onClick={() => onSelectQuery && onSelectQuery('Show me official national cooperative database statistics.')}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title={language === 'hi' ? 'पोर्टल स्थिति व आंकड़े' : 'Portal Analytics'}
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Bottom Sleek Ticker & Slide Indicators Bar */}
      <div className="w-full bg-[#051329] border-t border-white/15 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-white z-20">
        {/* Left: Play/Pause and Current Slide Index */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="banner-toggle-play"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[11px] font-mono font-bold text-slate-300">
            0{currentIndex + 1} / 0{GOV_SLIDES.length}
          </span>
        </div>

        {/* Center: Slide Name Ticker (Matching screenshot label e.g. "Vibrant Villages Programme") */}
        <div className="text-xs font-bold text-amber-300 truncate max-w-xs sm:max-w-md text-center">
          {language === 'hi' ? currentSlide.dignitaryHi : currentSlide.dignitaryEn}
        </div>

        {/* Right: Pagination Indicators (Dashes and Dots matching screenshot) */}
        <div className="flex items-center gap-1.5">
          {GOV_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              id={`banner-dot-${idx}`}
              onClick={() => handleGoTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 transition-all rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-rose-500 shadow-sm'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B3B60] text-white px-4 py-2 rounded-lg shadow-2xl border border-amber-400 text-xs font-bold animate-bounce">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
};
