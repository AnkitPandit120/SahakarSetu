import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Mic,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Bookmark,
  BookmarkCheck,
  Building,
  Info,
  Volume2,
  VolumeX,
  Sparkles,
  Plus,
  Square,
  ArrowUp,
  HelpCircle,
  Radio,
  Headphones,
  Share2
} from 'lucide-react';
import { ChatMessage, Language, SourceItem, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PortalSpeaker, getLanguageCode } from '../utils/speechUtils';
import { WhatsAppShareModal } from './WhatsAppShareModal';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  onNewChat: () => void;
  onClearChat: () => void;
  isLoading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  categoryTitle?: string;
  onSelectDocument: (docTitle: string, section?: string, url?: string) => void;
  user: UserProfile | null;
  onBookmarkAnswer: (message: ChatMessage) => void;
  bookmarkedIds: Set<string>;
  initialVoiceActive?: boolean;
  onOpenSpeechToSpeech?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  onBack,
  onNewChat,
  onClearChat,
  isLoading,
  language,
  setLanguage,
  categoryTitle,
  onSelectDocument,
  user,
  onBookmarkAnswer,
  bookmarkedIds,
  initialVoiceActive = false,
  onOpenSpeechToSpeech
}) => {
  const t = TRANSLATIONS[language];
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // In-Chat Voice-to-Text Dictation State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const baseInputTextRef = useRef<string>('');

  const [feedbackMap, setFeedbackMap] = useState<Record<string, 'helpful' | 'unhelpful'>>({});
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.95);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppModalMessages, setWhatsAppModalMessages] = useState<ChatMessage[] | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const lastSpokenMessageIdRef = useRef<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  // Auto-start voice if requested via initial prop
  useEffect(() => {
    if (initialVoiceActive) {
      startVoiceMode();
    }
  }, [initialVoiceActive]);

  // Subscribe to global speech events
  useEffect(() => {
    const unsubscribe = PortalSpeaker.subscribe((speaking, activeId) => {
      setCurrentlySpeakingId(speaking ? (activeId || 'active') : null);
    });
    return () => {
      unsubscribe();
      PortalSpeaker.stop();
      stopVoiceMode();
    };
  }, []);

  // Auto-speak new assistant messages if enabled
  useEffect(() => {
    if (autoSpeakEnabled && messages.length > 0 && !isLoading) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && lastMsg.id !== lastSpokenMessageIdRef.current) {
        lastSpokenMessageIdRef.current = lastMsg.id;
        const textToRead = lastMsg.structured?.answer || lastMsg.text;
        if (textToRead) {
          PortalSpeaker.speak(textToRead, language, lastMsg.id, speechSpeed);
        }
      }
    }
  }, [messages, autoSpeakEnabled, isLoading, language, speechSpeed]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleSpeak = (msgId: string, textToRead: string) => {
    if (currentlySpeakingId === msgId) {
      PortalSpeaker.stop();
    } else {
      PortalSpeaker.speak(textToRead, language, msgId, speechSpeed);
    }
  };

  const handleFeedback = (messageId: string, type: 'helpful' | 'unhelpful') => {
    setFeedbackMap(prev => ({ ...prev, [messageId]: type }));
  };

  const handleOpenWhatsAppFullChat = () => {
    setWhatsAppModalMessages(messages);
    setIsWhatsAppModalOpen(true);
  };

  const handleOpenWhatsAppSingleAnswer = (msg: ChatMessage) => {
    // Find the user question right before this assistant answer if available
    const msgIndex = messages.findIndex(m => m.id === msg.id);
    const relatedUserMsg = msgIndex > 0 && messages[msgIndex - 1].role === 'user' ? messages[msgIndex - 1] : null;
    const targetSet = relatedUserMsg ? [relatedUserMsg, msg] : [msg];
    setWhatsAppModalMessages(targetSet);
    setIsWhatsAppModalOpen(true);
  };

  // Voice-to-Text Inline Dictation Handlers
  const startVoiceMode = () => {
    setMicError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError(language === 'hi' ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।' : 'Voice input is not supported in this browser.');
      setTimeout(() => setMicError(null), 4000);
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }

      PortalSpeaker.stop(); // Stop speaker so assistant doesn't speak over user dictation
      const recognition = new SpeechRecognition();
      recognition.lang = getLanguageCode(language);
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Capture currently typed text as base prefix
      baseInputTextRef.current = inputText;
      setIsVoiceActive(true);

      let accumulatedFinal = '';

      recognition.onresult = (event: any) => {
        let interim = '';
        let currentFinal = '';

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            currentFinal += res[0].transcript + ' ';
          } else {
            interim += res[0].transcript;
          }
        }

        accumulatedFinal = currentFinal;
        const base = baseInputTextRef.current ? baseInputTextRef.current.trim() : '';
        const spoken = (accumulatedFinal + interim).trim();
        const fullText = base ? `${base} ${spoken}` : spoken;
        setInputText(fullText);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition event:', e.error);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setIsVoiceActive(false);
          setMicError(language === 'hi' ? 'माइक्रोफ़ोन अनुमति की आवश्यकता है।' : 'Microphone permission denied. Please allow microphone access.');
          setTimeout(() => setMicError(null), 4000);
        } else if (e.error === 'no-speech') {
          // Quietly handled without crashing
        } else if (e.error !== 'aborted') {
          setIsVoiceActive(false);
        }
      };

      recognition.onend = () => {
        setIsVoiceActive(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Could not start recognition:', e);
      setIsVoiceActive(false);
      setMicError(language === 'hi' ? 'वॉइस इनपुट शुरू करने में त्रुटि।' : 'Could not initialize voice input.');
      setTimeout(() => setMicError(null), 4000);
    }
  };

  const stopVoiceMode = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    setIsVoiceActive(false);
  };

  const handleToggleVoiceMode = () => {
    if (isVoiceActive) {
      stopVoiceMode();
    } else {
      startVoiceMode();
    }
  };

  // Get user display name for voice greeting
  const userName = user?.name ? user.name.split(' ')[0] : 'friend';

  return (
    <div id="chat-view-container" className="flex flex-col h-[calc(100vh-65px)] bg-slate-50">
      {/* Top chat action header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            id="chat-back-btn"
            onClick={onBack}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title={t.backBtn}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
              {categoryTitle || t.chatHeading}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-[11px] font-medium text-slate-500">Verified Legal RAG</span>
            </div>
          </div>
        </div>

        {/* Minimalist Chat Header Actions */}
        <div className="flex items-center gap-2">
          {/* Send Full Chat on WhatsApp Button */}
          <button
            id="chat-whatsapp-share-btn"
            onClick={handleOpenWhatsAppFullChat}
            disabled={messages.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all cursor-pointer ${
              messages.length > 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 font-bold shadow-2xs'
                : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
            }`}
            title={language === 'hi' ? 'पूरी बातचीत व्हाट्सएप पर भेजें' : 'Send full chat transcript on WhatsApp'}
          >
            {/* WhatsApp Logo Icon */}
            <svg className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366] shrink-0" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.953 1.18-.175.2-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.63-.928-2.234-.244-.588-.493-.508-.677-.518-.175-.01-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.11.15.2 2.122 3.24 5.14 4.544.718.31 1.278.495 1.716.634.721.23 1.378.197 1.897.12.577-.087 1.78-.727 2.03-1.43.251-.703.251-1.304.176-1.43-.075-.126-.276-.201-.577-.351zM12.04 2C6.545 2 2.08 6.465 2.08 11.96c0 1.838.497 3.562 1.365 5.05L2 22l5.147-1.352a9.92 9.92 0 004.893 1.272c5.495 0 9.96-4.465 9.96-9.96S17.535 2 12.04 2zm0 18.173a8.21 8.21 0 01-4.19-1.144l-.3-.178-3.115.818.832-3.036-.195-.312a8.22 8.22 0 01-1.262-4.36c0-4.54 3.693-8.233 8.23-8.233 4.537 0 8.23 3.693 8.23 8.233 0 4.54-3.693 8.232-8.23 8.232z" />
            </svg>
            <span className="hidden sm:inline font-bold">{language === 'hi' ? 'व्हाट्सएप' : 'WhatsApp'}</span>
          </button>

          {/* Auto-Speak Toggle */}
          <button
            id="chat-toggle-autospeak-btn"
            onClick={() => setAutoSpeakEnabled(!autoSpeakEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all cursor-pointer ${
              autoSpeakEnabled
                ? 'bg-slate-900 text-white border-slate-900 font-medium'
                : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title={autoSpeakEnabled ? 'Auto-Voice response: ON' : 'Auto-Voice response: OFF'}
          >
            {autoSpeakEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoSpeakEnabled ? 'Voice Reply: ON' : 'Voice Reply: OFF'}</span>
          </button>

          {/* New Chat */}
          <button
            id="chat-new-conversation-btn"
            onClick={onNewChat}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title={t.newChat}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Clear Chat */}
          <button
            id="chat-clear-conversation-btn"
            onClick={onClearChat}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
            title={t.clearChat}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message conversation stream */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 max-w-4xl w-full mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              Ask any question about Cooperative Laws, PACS, or Schemes
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Every answer is verified against official Acts, Model Bye-laws, and Ministry guidelines with exact citations and voice playback.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              <button
                onClick={() => onSendMessage('What are the rights of a cooperative member under Section 30?')}
                className="text-xs bg-white border border-slate-200 hover:border-slate-400 px-3.5 py-2 rounded-full text-slate-700 hover:text-slate-900 shadow-2xs transition-all"
              >
                What are member rights under Section 30?
              </button>
              <button
                onClick={() => onSendMessage('What is the 72 hour PMFBY crop loss reporting rule?')}
                className="text-xs bg-white border border-slate-200 hover:border-slate-400 px-3.5 py-2 rounded-full text-slate-700 hover:text-slate-900 shadow-2xs transition-all"
              >
                What is the 72 hour PMFBY crop loss rule?
              </button>
              <button
                onClick={() => onSendMessage('How can I become a PACS voting member?')}
                className="text-xs bg-white border border-slate-200 hover:border-slate-400 px-3.5 py-2 rounded-full text-slate-700 hover:text-slate-900 shadow-2xs transition-all"
              >
                How can I become a PACS member?
              </button>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isThisSpeaking = currentlySpeakingId === msg.id;
          const textToSpeak = msg.structured?.answer || msg.text;

          return (
            <div key={msg.id} className="space-y-3">
              {/* User Message */}
              {msg.role === 'user' && (
                <div className="flex justify-end">
                  <div className="bg-slate-900 text-white rounded-2xl rounded-tr-xs px-4 py-3 max-w-xl text-sm leading-relaxed shadow-sm">
                    {msg.text}
                  </div>
                </div>
              )}

              {/* AI Assistant Structured Response */}
              {msg.role === 'assistant' && (
                <div className="flex justify-start">
                  <div className={`bg-white border rounded-2xl rounded-tl-xs p-5 sm:p-6 max-w-3xl w-full shadow-sm space-y-4 transition-all ${
                    isThisSpeaking ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}>
                    {/* Trust source indicator & Audio Controls bar */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                        {msg.structured?.sourceType === 'DRIVE_DOCUMENT' || msg.structured?.sourceType === 'KNOWLEDGE_BASE' ? (
                          <div className="flex items-center gap-1 text-emerald-700 font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>{language === 'hi' ? 'सत्यापित वैधानिक ज्ञानकोष' : 'Statutory Knowledge Base'}</span>
                          </div>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                            <span>
                              {msg.structured?.sourceType === 'GOVERNMENT_PORTAL'
                                ? t.sourceBadgeGov
                                : msg.structured?.sourceType === 'VERIFIED_WEB'
                                ? t.sourceBadgeWeb
                                : t.sourceBadgeKnowledge}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Audio Speak / Stop Button */}
                        <button
                          id={`msg-audio-speak-btn-${msg.id}`}
                          onClick={() => handleToggleSpeak(msg.id, textToSpeak)}
                          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                            isThisSpeaking
                              ? 'bg-emerald-700 text-white shadow-xs animate-pulse'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                          title={isThisSpeaking ? t.stopReading : t.readAloud}
                        >
                          {isThisSpeaking ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              <span>{t.stopReading}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{t.readAloud}</span>
                            </>
                          )}
                        </button>

                        {/* WhatsApp share single answer button */}
                        <button
                          onClick={() => handleOpenWhatsAppSingleAnswer(msg)}
                          className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 p-1.5 rounded hover:bg-emerald-50 transition-colors"
                          title={language === 'hi' ? 'यह उत्तर व्हाट्सएप पर भेजें' : 'Share this answer on WhatsApp'}
                        >
                          <svg className="w-3.5 h-3.5 fill-current text-[#25D366]" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.953 1.18-.175.2-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.63-.928-2.234-.244-.588-.493-.508-.677-.518-.175-.01-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.11.15.2 2.122 3.24 5.14 4.544.718.31 1.278.495 1.716.634.721.23 1.378.197 1.897.12.577-.087 1.78-.727 2.03-1.43.251-.703.251-1.304.176-1.43-.075-.126-.276-.201-.577-.351zM12.04 2C6.545 2 2.08 6.465 2.08 11.96c0 1.838.497 3.562 1.365 5.05L2 22l5.147-1.352a9.92 9.92 0 004.893 1.272c5.495 0 9.96-4.465 9.96-9.96S17.535 2 12.04 2zm0 18.173a8.21 8.21 0 01-4.19-1.144l-.3-.178-3.115.818.832-3.036-.195-.312a8.22 8.22 0 01-1.262-4.36c0-4.54 3.693-8.233 8.23-8.233 4.537 0 8.23 3.693 8.23 8.233 0 4.54-3.693 8.232-8.23 8.232z" />
                          </svg>
                          <span className="hidden sm:inline text-[11px] font-semibold text-emerald-800">WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, textToSpeak)}
                          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 p-1.5 rounded hover:bg-slate-100 transition-colors"
                          title={t.copyAnswer}
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-medium">{t.copied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{t.copyAnswer}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onBookmarkAnswer(msg)}
                          className="p-1.5 text-xs text-slate-500 hover:text-amber-600 rounded hover:bg-slate-100 transition-colors"
                          title="Bookmark this response"
                        >
                          {bookmarkedIds.has(msg.id) ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-600" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 1. Answer Section */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <span>{t.answerLabel}</span>
                        </h4>
                        {isThisSpeaking && (
                          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                            Playing audio in {language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : language === 'bn' ? 'Bengali' : 'English'}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                        {msg.structured?.answer || msg.text}
                      </p>
                    </div>

                    {/* 2. Important Conditions / Exceptions */}
                    {msg.structured?.importantNotes && msg.structured.importantNotes.length > 0 && (
                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
                        <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>{t.importantLabel}</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-amber-950">
                          {msg.structured.importantNotes.map((note, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="font-bold text-amber-700">•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 3. Verified Statutory Sources & Citations */}
                    {msg.structured?.sources && msg.structured.sources.length > 0 && (
                      <div className="border-t border-slate-100 pt-4 space-y-2.5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>{t.sourceLabel}</span>
                        </h4>

                        <div className="space-y-1.5">
                          {msg.structured.sources.map((src, sIdx) => {
                            const isDriveDoc = src.sourceType === 'DRIVE_DOCUMENT' || src.authority?.toLowerCase().includes('drive');
                            return (
                              <div
                                key={src.id || sIdx}
                                className={`border rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                                  isDriveDoc
                                    ? 'bg-emerald-50/70 border-emerald-200'
                                    : 'bg-slate-50/90 border-slate-200'
                                }`}
                              >
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <div className="font-semibold text-slate-900 text-xs sm:text-[13px] flex items-center gap-1.5 leading-snug">
                                    <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                    <span className="truncate">{src.documentName || src.title}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                    <span><strong>Authority:</strong> {src.authority}</span>
                                    {src.section && (
                                      <span>
                                        • <strong>{t.sectionLabel}:</strong> {src.section}
                                        {src.pageNumber && <span className="ml-1 text-slate-500">({src.pageNumber})</span>}
                                      </span>
                                    )}
                                  </div>
                                  {src.snippet && (
                                    <p className="text-[10px] text-slate-500 bg-white/80 p-1 rounded border border-slate-200 line-clamp-2 italic mt-0.5">
                                      "{src.snippet}"
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                  <button
                                    onClick={() => onSelectDocument(src.documentName || src.title, src.section, src.officialUrl)}
                                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-medium rounded-md border border-slate-300 text-[11px] transition-colors shadow-2xs cursor-pointer"
                                  >
                                    {t.viewDocument}
                                  </button>
                                  {src.officialUrl && (
                                    <a
                                      href={src.officialUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1 bg-white hover:bg-slate-100 text-slate-800 rounded-md border border-slate-300 transition-colors shadow-2xs"
                                      title={t.openOfficialSource}
                                    >
                                      <ExternalLink className="w-3 h-3 text-slate-600" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 4. Suggested Follow-Up Questions */}
                    {msg.structured?.followUpQuestions && msg.structured.followUpQuestions.length > 0 && (
                      <div className="border-t border-slate-100 pt-3 space-y-2">
                        <div className="text-xs font-semibold text-slate-500">
                          {t.suggestedFollowUp}:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.structured.followUpQuestions.map((fq, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => onSendMessage(fq)}
                              className="text-xs bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-400 px-3.5 py-1.5 rounded-full transition-colors text-left shadow-2xs"
                            >
                              {fq}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. Legal Disclaimer & Recheck Governing Body Notice */}
                    {msg.structured?.isInternetFallback && (
                      <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3 text-xs text-amber-950 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <div className="font-bold text-amber-900 flex items-center gap-1.5">
                            <span>{language === 'hi' ? 'इंटरनेट/वेब स्रोत आधारित उत्तर - आधिकारिक निकाय से पुनः जांच अवश्य करें' : 'Web/Internet Sourced Answer - Statutory Recheck Advisory'}</span>
                          </div>
                          <p className="text-[12px] leading-relaxed text-amber-900/90">
                            {msg.structured.legalDisclaimer ||
                              (language === 'hi'
                                ? 'यह उत्तर स्थानीय वैधानिक ज्ञानकोष में उपलब्ध न होने के कारण सार्वजनिक वेब स्रोतों से लिया गया है। कृपया किसी भी विधिक, प्रशासनिक या वित्तीय कदम से पूर्व संबंधित अधिनियम, राजपत्र अथवा सक्षम सरकारी प्राधिकरण (जैसे सहकारिता मंत्रालय / राज्य सहकारी निबंधक) से पुनः जांच (Recheck) अवश्य करें।'
                                : 'This response was retrieved from public internet/web sources as it was not present in the local repository. Please recheck with the official law, gazette, or competent governing body before acting.')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Standard Legal Disclaimer & Feedback Bar */}
                    <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {msg.structured?.isInternetFallback
                            ? (language === 'hi'
                                ? 'सूचना: किसी भी निर्णय से पहले आधिकारिक सरकारी राजपत्र या वैधानिक प्राधिकरण से परामर्श लें।'
                                : 'Note: Please verify with official statutory authorities or gazette notifications.')
                            : (msg.structured?.legalDisclaimer || t.legalDisclaimer)}
                        </span>
                      </div>

                      {/* Helpful / Not Helpful Feedback */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <span className="text-slate-400">Feedback:</span>
                        <button
                          onClick={() => handleFeedback(msg.id, 'helpful')}
                          className={`p-1 rounded transition-colors ${
                            feedbackMap[msg.id] === 'helpful' ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-100 text-slate-500'
                          }`}
                          title={t.helpful}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'unhelpful')}
                          className={`p-1 rounded transition-colors ${
                            feedbackMap[msg.id] === 'unhelpful' ? 'bg-red-100 text-red-800' : 'hover:bg-slate-100 text-slate-500'
                          }`}
                          title={t.unhelpful}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 max-w-md shadow-xs flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-slate-600 font-medium">{t.searchingDatabase}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom input area: Clean, minimalist text bar with Left Speech-to-Speech button */}
      <div className="border-t transition-all px-4 py-3 shrink-0 bg-white border-slate-200">
        <div className="max-w-3xl mx-auto">
          {/* Inline Mic Notification */}
          {micError && (
            <div className="mb-2 p-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{micError}</span>
              </div>
              <button
                type="button"
                onClick={() => setMicError(null)}
                className="text-amber-600 hover:text-amber-900 text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input Form with Left Speech-to-Speech Icon button and Right Send controls */}
          <div>
            <div className="flex items-center gap-2">
              {/* Left Side: Speech-to-Speech Full Overlay Trigger */}
              {onOpenSpeechToSpeech && (
                <button
                  type="button"
                  id="chat-speech-to-speech-left-btn"
                  onClick={onOpenSpeechToSpeech}
                  className="h-11 px-3 sm:px-3.5 flex items-center gap-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 hover:text-emerald-950 transition-all active:scale-95 cursor-pointer shrink-0 shadow-2xs group"
                  title={language === 'hi' ? 'स्पीच-टू-स्पीच लाइव वॉइस (फुल स्क्रीन)' : 'Speech-to-Speech Live Voice Assistant'}
                >
                  <Radio className="w-4 h-4 text-emerald-600 animate-pulse group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold hidden sm:inline">
                    {language === 'hi' ? 'स्पीच-टू-स्पीच' : 'Live Voice'}
                  </span>
                </button>
              )}

              {/* Main Input Form */}
              <form onSubmit={handleSubmit} className="relative flex-1 flex items-center">
                <input
                  id="chat-user-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isVoiceActive
                      ? (language === 'hi' ? 'सुन रहा हूँ... बोलें' : 'Listening... Speak now')
                      : t.askPlaceholder
                  }
                  disabled={isLoading}
                  className={`w-full bg-slate-50 focus:bg-white border text-slate-900 placeholder:text-slate-400 rounded-2xl py-3 pl-4 pr-22 text-sm outline-none transition-all ${
                    isVoiceActive
                      ? 'border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50/20'
                      : 'border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100'
                  }`}
                />

                <div className="absolute right-1.5 flex items-center gap-1">
                  {/* Dictation / Inline Mic button */}
                  <button
                    type="button"
                    id="chat-mic-btn"
                    onClick={handleToggleVoiceMode}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isVoiceActive
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 animate-pulse ring-2 ring-rose-300'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={
                      isVoiceActive
                        ? (language === 'hi' ? 'बोलना बंद करें' : 'Stop voice typing')
                        : (language === 'hi' ? 'बोलकर टाइप करें' : 'Voice to text')
                    }
                  >
                    {isVoiceActive ? (
                      <Square className="w-3.5 h-3.5 fill-current text-rose-600" />
                    ) : (
                      <Mic className="w-4 h-4 text-slate-600" />
                    )}
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    id="chat-send-btn"
                    disabled={!inputText.trim() || isLoading}
                    className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition-all shadow-xs cursor-pointer"
                    title="Send message"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-1.5 text-center text-[11px] text-slate-400">
              Official statutory knowledge • Multi-State Co-operative Societies Act & Model PACS Bye-laws
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Full Chat / Answer Share Modal */}
      <WhatsAppShareModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        messages={whatsAppModalMessages || messages}
        language={language}
        user={user}
      />
    </div>
  );
};
