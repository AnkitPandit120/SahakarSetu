import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  RefreshCw,
  Settings,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  ExternalLink,
  BookOpen,
  Radio,
  Sliders,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PortalSpeaker } from '../utils/speechUtils';

interface SpeechToSpeechModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenChatWithQuery?: (query: string) => void;
}

type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface VoiceOption {
  id: string;
  name: string;
  gender: string;
  accent: string;
  recommendedFor: string;
}

export const SpeechToSpeechModal: React.FC<SpeechToSpeechModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  onOpenChatWithQuery
}) => {
  const t = TRANSLATIONS[language];
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);
  const [lastDisclaimer, setLastDisclaimer] = useState<string | null>(null);
  const [isInternetFallback, setIsInternetFallback] = useState<boolean>(false);
  const [lastSources, setLastSources] = useState<Array<{ title: string; authority: string; page?: string | number }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [continuousMode, setContinuousMode] = useState(true);
  const [selectedVoiceId, setSelectedVoiceId] = useState('EXAVITQu4vr4xnSDxMaL');
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [testStatus, setTestStatus] = useState<{
    testing: boolean;
    success?: boolean;
    latencyMs?: number;
    message?: string;
  }>({ testing: false });

  // Web Speech Recognition ref
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isComponentMounted = useRef(true);

  // Load available voices & test status on mount
  useEffect(() => {
    isComponentMounted.current = true;
    fetch('/api/speech/status')
      .then(res => res.json())
      .then(data => {
        if (data.voices) {
          setVoices(data.voices);
        }
        if (data.defaultVoiceId) {
          setSelectedVoiceId(data.defaultVoiceId);
        }
      })
      .catch(err => console.warn('Could not fetch voice status:', err));

    return () => {
      isComponentMounted.current = false;
      stopListening();
      PortalSpeaker.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Initialize Speech Recognition
  const initRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      setVoiceState('error');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    // Language code mapping
    const langCodes: Record<Language, string> = {
      hi: 'hi-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      en: 'en-IN'
    };
    recognition.lang = langCodes[language] || 'hi-IN';

    recognition.onstart = () => {
      setVoiceState('listening');
      setErrorMessage(null);
      setTranscript('');
      setInterimTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (interim) setInterimTranscript(interim);
      if (final) {
        setTranscript(final);
        setInterimTranscript('');
        handleQuerySubmission(final);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        if (voiceState === 'listening') {
          setVoiceState('idle');
        }
      } else if (event.error !== 'aborted') {
        setErrorMessage(`Microphone error: ${event.error}`);
        setVoiceState('error');
      }
    };

    recognition.onend = () => {
      if (voiceState === 'listening') {
        // If stopped without final text, return to idle
        if (!transcript && !interimTranscript) {
          setVoiceState('idle');
        }
      }
    };

    return recognition;
  };

  // Start active microphone capture and audio visualizer
  const startListening = async () => {
    PortalSpeaker.stop();
    setErrorMessage(null);
    setTranscript('');
    setInterimTranscript('');

    try {
      // Initialize audio analyzer for visualizer if possible
      if (!audioContextRef.current && (window.AudioContext || (window as any).webkitAudioContext)) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && audioContextRef.current && analyserRef.current) {
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        if (!mediaStreamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
        }
      }
    } catch (e) {
      console.warn('Could not setup audio visualizer analyzer:', e);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
    }

    const rec = initRecognition();
    if (rec) {
      recognitionRef.current = rec;
      try {
        rec.start();
        setVoiceState('listening');
      } catch (err: any) {
        console.warn('Could not start recognition:', err);
        setErrorMessage('Failed to access microphone. Please check permissions.');
        setVoiceState('error');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    if (voiceState === 'listening') {
      setVoiceState('idle');
    }
  };

  // Submit recognized speech to backend RAG & trigger ElevenLabs TTS
  const handleQuerySubmission = async (queryText: string) => {
    if (!queryText.trim()) return;

    setVoiceState('thinking');
    stopListening();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get an answer from the assistant.');
      }

      const data = await response.json();
      setLastAnswer(data.answer);
      setLastSources(data.sources || []);
      setIsInternetFallback(!!data.isInternetFallback || data.sourceType === 'web');
      setLastDisclaimer(data.disclaimer || null);

      // Speak response using ElevenLabs via PortalSpeaker
      setVoiceState('speaking');
      await PortalSpeaker.speak(
        data.answer,
        language,
        undefined,
        1.0,
        () => {
          // Finished speaking
          if (isComponentMounted.current) {
            setVoiceState('idle');
            // If continuous mode is enabled, start listening for follow-up
            if (continuousMode) {
              setTimeout(() => {
                if (isComponentMounted.current && voiceState !== 'speaking') {
                  startListening();
                }
              }, 600);
            }
          }
        },
        (err) => {
          console.warn('Playback error:', err);
          if (isComponentMounted.current) {
            setVoiceState('idle');
          }
        }
      );
    } catch (err: any) {
      console.error('Voice query error:', err);
      setErrorMessage(err.message || 'Something went wrong processing your question.');
      setVoiceState('error');
    }
  };

  // Run live ElevenLabs API test
  const handleTestElevenLabs = async () => {
    setTestStatus({ testing: true });
    PortalSpeaker.stop();

    try {
      const res = await fetch('/api/speech/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceId: selectedVoiceId,
          language
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus({
          testing: false,
          success: true,
          latencyMs: data.latencyMs,
          message: `Live ElevenLabs test successful! Generated ${Math.round(data.audioBytes / 1024)} KB in ${data.latencyMs}ms.`
        });

        // Play the returned test audio
        if (data.audioBase64) {
          const audio = new Audio(data.audioBase64);
          audio.play();
        }
      } else {
        setTestStatus({
          testing: false,
          success: false,
          message: data.details || data.error || 'ElevenLabs test failed'
        });
      }
    } catch (err: any) {
      setTestStatus({
        testing: false,
        success: false,
        message: err.message || 'Network error connecting to ElevenLabs API'
      });
    }
  };

  // Stop currently speaking audio
  const handleStopSpeaking = () => {
    PortalSpeaker.stop();
    setVoiceState('idle');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200/80 rounded-3xl shadow-2xl overflow-hidden text-slate-900 flex flex-col max-h-[88vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Clean White Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                {language === 'hi' ? 'लाइव वॉइस असिस्टेंट' : 'Live Speech-to-Speech'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'hi'
                  ? 'सहकारी नियमों व पैक्स की जानकारी बोलकर पूछें'
                  : 'Speak naturally to consult statutory cooperative guidance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Interactive Stage */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-b from-white via-slate-50/40 to-slate-50/80">
          {/* Animated Visualizer Sphere & Waves */}
          <div className="relative flex items-center justify-center my-4">
            {/* Outer pulsating rings */}
            {voiceState === 'listening' && (
              <>
                <div className="absolute w-44 h-44 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-ping duration-1000" />
                <div className="absolute w-36 h-36 rounded-full bg-emerald-500/15 border border-emerald-500/30 animate-pulse" />
              </>
            )}
            {voiceState === 'speaking' && (
              <>
                <div className="absolute w-44 h-44 rounded-full bg-indigo-500/10 border border-indigo-500/20 animate-ping duration-700" />
                <div className="absolute w-36 h-36 rounded-full bg-indigo-500/15 border border-indigo-500/30 animate-pulse" />
              </>
            )}
            {voiceState === 'thinking' && (
              <div className="absolute w-36 h-36 rounded-full bg-amber-500/10 border border-amber-500/20 animate-spin" />
            )}

            {/* Central Mic/Speaker Orb */}
            <button
              onClick={() => {
                if (voiceState === 'speaking') {
                  handleStopSpeaking();
                } else if (voiceState === 'listening') {
                  stopListening();
                } else {
                  startListening();
                }
              }}
              className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 cursor-pointer shadow-md ${
                voiceState === 'listening'
                  ? 'bg-emerald-600 text-white ring-8 ring-emerald-500/20 shadow-emerald-500/25'
                  : voiceState === 'speaking'
                  ? 'bg-indigo-600 text-white ring-8 ring-indigo-500/20 shadow-indigo-500/25'
                  : voiceState === 'thinking'
                  ? 'bg-amber-500 text-white ring-8 ring-amber-500/20 shadow-amber-500/25'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200/90 shadow-sm hover:border-slate-300'
              }`}
            >
              {voiceState === 'listening' && <Mic className="w-7 h-7 animate-pulse text-white" />}
              {voiceState === 'speaking' && <Volume2 className="w-7 h-7 animate-pulse text-white" />}
              {voiceState === 'thinking' && <RefreshCw className="w-7 h-7 animate-spin text-white" />}
              {voiceState === 'idle' && <Mic className="w-7 h-7 text-slate-700" />}
              {voiceState === 'error' && <MicOff className="w-7 h-7 text-rose-500" />}

              <span className={`text-[10px] font-bold tracking-wider uppercase mt-1 ${
                voiceState === 'idle' ? 'text-slate-500' : 'text-white'
              }`}>
                {voiceState === 'listening'
                  ? 'Listening'
                  : voiceState === 'speaking'
                  ? 'Speaking'
                  : voiceState === 'thinking'
                  ? 'Processing'
                  : 'Tap to Talk'}
              </span>
            </button>
          </div>

          {/* Real-time Dynamic Soundwave Visualizer Bars */}
          <div className="flex items-center justify-center gap-1.5 h-6 my-2">
            {[...Array(14)].map((_, i) => {
              const isActive = voiceState === 'listening' || voiceState === 'speaking';
              const heights = [
                'h-2', 'h-3.5', 'h-5', 'h-6', 'h-4', 'h-6', 'h-5', 'h-3.5',
                'h-5', 'h-6', 'h-4', 'h-3.5', 'h-2', 'h-1.5'
              ];
              const colorClass =
                voiceState === 'speaking'
                  ? 'bg-indigo-500'
                  : voiceState === 'listening'
                  ? 'bg-emerald-500'
                  : 'bg-slate-200';

              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${colorClass} ${
                    isActive ? `${heights[i % heights.length]} animate-pulse` : 'h-1.5 opacity-60'
                  }`}
                  style={{
                    animationDelay: `${(i * 0.08).toFixed(2)}s`
                  }}
                />
              );
            })}
          </div>

          {/* User Live Transcript Bubble */}
          {(transcript || interimTranscript) && (
            <div className="w-full max-w-md mt-3 p-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 shadow-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 mb-0.5">
                <Mic className="w-3 h-3 text-emerald-600" />
                <span>{language === 'hi' ? 'आपका प्रश्न' : 'You asked'}:</span>
              </div>
              <p className="font-medium text-slate-900 text-xs sm:text-sm leading-relaxed">
                {transcript}
                <span className="text-slate-400 italic ml-1">{interimTranscript}</span>
              </p>
            </div>
          )}

          {/* Assistant Grounded Answer Bubble */}
          {lastAnswer && voiceState !== 'thinking' && (
            <div className="w-full max-w-md mt-3 p-4 rounded-2xl bg-white border border-slate-200/90 text-sm text-slate-800 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'hi' ? 'सहकार सेतु उत्तर' : 'Statutory Answer'}:</span>
                </div>
                {voiceState === 'speaking' && (
                  <button
                    onClick={handleStopSpeaking}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Pause className="w-2.5 h-2.5 text-slate-500" />
                    Stop Voice
                  </button>
                )}
              </div>

              <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto pr-1">
                {lastAnswer}
              </p>

              {/* Web / Internet Fallback Disclaimer */}
              {isInternetFallback && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-tight">
                    {lastDisclaimer ||
                      (language === 'hi'
                        ? 'यह जानकारी वेब स्रोतों से ली गई है। कृपया संबंधित कानून या सरकारी विभाग (cooperation.gov.in) से पुनः जांच अवश्य करें।'
                        : 'Sourced from public web search. Please recheck with the official law or governing body.')}
                  </p>
                </div>
              )}

              {/* Citations Badges */}
              {lastSources.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {language === 'hi' ? 'स्रोत:' : 'Sources:'}
                  </span>
                  {lastSources.map((src, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                    >
                      {src.title} (p. {src.page || '1'})
                    </span>
                  ))}
                </div>
              )}

              {/* Switch to Chat view button */}
              {onOpenChatWithQuery && transcript && (
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => {
                      onOpenChatWithQuery(transcript);
                      onClose();
                    }}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'चैट में जारी रखें' : 'Continue in text chat'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error Message if any */}
          {errorMessage && (
            <div className="w-full max-w-md mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Quick Starter Prompts for Voice */}
          {!transcript && !lastAnswer && voiceState === 'idle' && (
            <div className="w-full max-w-md mt-4 space-y-2 text-center">
              <p className="text-[11px] text-slate-400 font-medium">
                {language === 'hi' ? 'सुझाए गए प्रश्न (माइक पर टैप करके पूछें):' : 'Suggested questions:'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {(language === 'hi'
                  ? [
                      'पैक्स में सदस्य कैसे बनें?',
                      'फसल बीमा 72 घंटे का क्या नियम है?',
                      'कस्टम हायरिंग सेंटर कैसे शुरू करें?'
                    ]
                  : [
                      'How to become a member of PACS?',
                      'What is the 72-hour crop insurance rule?',
                      'What are the voting rights in cooperatives?'
                    ]
                ).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTranscript(prompt);
                      handleQuerySubmission(prompt);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs transition-all text-left cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Minimal Clean White Footer Controls */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">{language === 'hi' ? 'भाषा:' : 'Language:'}</span>
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200/70">
              {[
                { code: 'hi', label: 'हिन्दी' },
                { code: 'en', label: 'English' },
                { code: 'mr', label: 'मराठी' },
                { code: 'bn', label: 'বাংলা' }
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => onLanguageChange(l.code as Language)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    language === l.code
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {voiceState === 'speaking' ? (
              <button
                onClick={handleStopSpeaking}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                Mute
              </button>
            ) : voiceState === 'listening' ? (
              <button
                onClick={stopListening}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <MicOff className="w-3.5 h-3.5" />
                Done
              </button>
            ) : (
              <button
                onClick={startListening}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'hi' ? 'बोलें' : 'Speak'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
