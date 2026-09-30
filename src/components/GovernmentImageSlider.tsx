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
  ArrowUpRight
} from 'lucide-react';
import { Language } from '../types';

export interface SlideItem {
  id: string;
  image: string;
  dignitaryHi: string;
  dignitaryEn: string;
  roleHi: string;
  roleEn: string;
  quoteHi: string;
  quoteEn: string;
  occasionHi: string;
  occasionEn: string;
  tagHi: string;
  tagEn: string;
  query: string;
}

export const SLIDES_DATA: SlideItem[] = [
  {
    id: 'pm-modi',
    image: '/images/modi_portrait.jpg',
    dignitaryHi: 'श्री नरेन्द्र मोदी',
    dignitaryEn: 'Shri Narendra Modi',
    roleHi: 'माननीय प्रधानमंत्री, भारत सरकार',
    roleEn: "Hon'ble Prime Minister of India",
    quoteHi: 'भारत में COOPERATIVES, हमारे DAIRY SECTOR को.... हमारी RURAL ECONOMY को एक नई शक्ति दे रहे हैं।',
    quoteEn: 'In India, cooperatives are giving new strength to our dairy sector and our rural economy.',
    occasionHi: 'वर्ल्ड फूड इंडिया कार्यक्रम / सहकार से समृद्धि विज़न',
    occasionEn: 'World Food India / Sahakar Se Samriddhi Vision',
    tagHi: 'राष्ट्रीय सहकारिता संकल्प',
    tagEn: 'National Cooperative Vision',
    query: 'प्रधानमंत्री पैक्स कंप्यूटरीकरण और डेयरी सहकारिता योजना के क्या मुख्य बिंदु हैं?'
  },
  {
    id: 'cm-yogi',
    image: '/images/yogi_portrait.jpg',
    dignitaryHi: 'श्री योगी आदित्यनाथ',
    dignitaryEn: 'Shri Yogi Adityanath',
    roleHi: 'माननीय मुख्यमंत्री, उत्तर प्रदेश',
    roleEn: "Hon'ble Chief Minister, Uttar Pradesh",
    quoteHi: 'सहकारिता किसानों की आत्मनिर्भरता का मजबूत आधार है। प्रदेश की 7,000+ बी-पैक्स को आधुनिक बनाकर पारदर्शी साख दी जा रही है।',
    quoteEn: 'Cooperatives are the cornerstone of farmer self-reliance. Over 7,000 B-PACS are computerized for transparent rural credit.',
    occasionHi: 'उत्तर प्रदेश बी-पैक्स सुदृढ़ीकरण व ग्रामीण साख मिशन',
    occasionEn: 'UP B-PACS Modernization & Rural Credit Mission',
    tagHi: 'राज्य सहकारिता पहल',
    tagEn: 'State Cooperative Reform',
    query: 'उत्तर प्रदेश बी-पैक्स कंप्यूटरीकरण और किसान ऋण योजना की मुख्य विशेषताएं क्या हैं?'
  },
  {
    id: 'minister-amit-shah',
    image: '/images/amit_shah_portrait.jpg',
    dignitaryHi: 'श्री अमित शाह',
    dignitaryEn: 'Shri Amit Shah',
    roleHi: 'माननीय केंद्रीय गृह एवं सहकारिता मंत्री',
    roleEn: "Hon'ble Union Minister of Cooperation",
    quoteHi: 'मॉडल पैक्स उप-नियम 2024 और राष्ट्रीय सहकारिता डेटाबेस से देश की हर पंचायत में बहुउद्देशीय सहकारी समिति सक्रिय होगी।',
    quoteEn: 'Model PACS Bye-Laws 2024 and the National Database will empower every Panchayat with a vibrant multipurpose cooperative.',
    occasionHi: 'सहकारिता मंत्रालय, भारत सरकार',
    occasionEn: 'Ministry of Cooperation, Government of India',
    tagHi: 'विधिक व विनियामक सुधार',
    tagEn: 'Statutory Policy Reforms',
    query: 'मॉडल पैक्स उप-नियम 2024 और मल्टी-स्टेट सहकारी समिति संशोधन अधिनियम 2023 के प्रमुख नियम क्या हैं?'
  },
  {
    id: 'pacs-empowerment',
    image: '/images/pacs_farmer_cooperative.jpg',
    dignitaryHi: 'पैक्स एवं डिजिटल किसान केंद्र',
    dignitaryEn: 'PACS & Digital Farmer Network',
    roleHi: '63,000+ प्राथमिक कृषि साख समितियां (PACS)',
    roleEn: '63,000+ Primary Agricultural Credit Societies',
    quoteHi: 'पैक्स अब केवल ऋण समिति नहीं, बल्कि कॉमन सर्विस सेंटर (CSC), उर्वरक, बीज, अनाज भंडारण और 300+ नागरिक सेवाओं का केंद्र हैं।',
    quoteEn: 'PACS now serve as Common Service Centres (CSC), delivering seeds, fertilizers, storage, and 300+ public e-services.',
    occasionHi: 'केंद्रीय प्रायोजित पैक्स डिजिटलीकरण योजना',
    occasionEn: 'Centrally Sponsored PACS Modernization Scheme',
    tagHi: 'डिजिटल सहकारिता तंत्र',
    tagEn: 'Digital Rural Infrastructure',
    query: 'पैक्स (PACS) कॉमन सर्विस सेंटर (CSC) सेवाओं और उर्वरक वितरण के नियम क्या हैं?'
  }
];

interface GovernmentImageSliderProps {
  language: Language;
  onSelectQuery?: (query: string) => void;
}

export const GovernmentImageSlider: React.FC<GovernmentImageSliderProps> = ({
  language,
  onSelectQuery
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<number>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 5500; // 5.5 seconds per slide

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES_DATA.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
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

  const currentSlide = SLIDES_DATA[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: 'easeOut' }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      transition: { duration: 0.35, ease: 'easeIn' }
    })
  };

  return (
    <div
      id="govt-hero-image-slider"
      className="relative bg-slate-950/80 border border-white/25 rounded-2xl overflow-hidden shadow-2xl text-white flex flex-col justify-between h-full min-h-[380px] sm:min-h-[420px] group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* 1. Full-Bleed Photographic Slide Showcase */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex flex-col justify-between"
          >
            {/* Background High-Resolution Image */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={currentSlide.image}
                alt={language === 'hi' ? currentSlide.dignitaryHi : currentSlide.dignitaryEn}
                className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.05]"
              />
              {/* Dual-direction gradient overlays for optimal legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent" />
            </div>

            {/* Top Floating Badge & Play/Pause Control */}
            <div className="relative z-10 flex items-center justify-between p-3.5 sm:p-4">
              <div className="inline-flex items-center gap-1.5 bg-[#0B3B60]/85 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs shadow-md">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  {language === 'hi' ? currentSlide.tagHi : currentSlide.tagEn}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/15 text-slate-200">
                  0{currentIndex + 1} / 0{SLIDES_DATA.length}
                </span>
                <button
                  type="button"
                  id="slider-toggle-play-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause auto-slider' : 'Play auto-slider'}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-slate-200 hover:text-white transition-colors cursor-pointer border border-white/15"
                  title={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Bottom Floating Leader Info, Quote & Action Query */}
            <div className="relative z-10 p-4 sm:p-5 space-y-2.5">
              <div>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? currentSlide.occasionHi : currentSlide.occasionEn}</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight mt-0.5 drop-shadow-sm">
                  {language === 'hi' ? currentSlide.dignitaryHi : currentSlide.dignitaryEn}
                </h3>
                <p className="text-xs text-slate-200 font-medium leading-snug">
                  {language === 'hi' ? currentSlide.roleHi : currentSlide.roleEn}
                </p>
              </div>

              {/* Leader Statement / Quote Box */}
              <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/20 relative shadow-lg">
                <Quote className="w-5 h-5 text-amber-400/40 absolute top-2 right-2 pointer-events-none" />
                <p className="text-xs sm:text-[13px] font-medium text-slate-100 leading-relaxed italic pr-4">
                  &ldquo;{language === 'hi' ? currentSlide.quoteHi : currentSlide.quoteEn}&rdquo;
                </p>
              </div>

              {/* Action Query Button */}
              {onSelectQuery && (
                <button
                  type="button"
                  id={`slider-explore-btn-${currentSlide.id}`}
                  onClick={() => onSelectQuery(currentSlide.query)}
                  className="w-full flex items-center justify-between gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer group/btn"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                    <span className="truncate">
                      {language === 'hi' ? 'संबंधित नियम व योजना विवरण पूछें' : 'Inquire Related Statutory Norms'}
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-950 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform shrink-0" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Sleek Bottom Navigation Bar */}
      <div className="px-4 py-2 bg-black/70 backdrop-blur-md border-t border-white/15 flex items-center justify-between z-20">
        <button
          type="button"
          id="slider-prev-btn"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {SLIDES_DATA.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              id={`slider-dot-${idx}`}
              onClick={() => handleGoTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 transition-all rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-amber-400 shadow-2xs'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          id="slider-next-btn"
          onClick={handleNext}
          aria-label="Next slide"
          className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
