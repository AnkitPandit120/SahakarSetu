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
  HelpCircle
} from 'lucide-react';
import { ChatMessage, Language, SourceItem, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PortalSpeaker, getLanguageCode } from '../utils/speechUtils';

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
  initialVoiceActive = false
}) => {
  const t = TRANSLATIONS[language];
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // In-Chat Voice Mode State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceInterim, setVoiceInterim] = useState('');
  const [waveTick, setWaveTick] = useState(0);
  const [showVoiceTemplates, setShowVoiceTemplates] = useState(false);

  const [feedbackMap, setFeedbackMap] = useState<Record<string, 'helpful' | 'unhelpful'>>({});
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.95);

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

  // Equalizer animation ticker during voice recording
  useEffect(() => {
    let interval: any;
    if (isVoiceActive) {
      interval = setInterval(() => {
        setWaveTick(prev => (prev + 1) % 1000);
      }, 70);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVoiceActive]);

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
  }, [messages, isLoading, isVoiceActive, voiceInterim]);

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

  // Start in-chat live voice recording
  const startVoiceMode = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t.micUnsupported);
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }

      PortalSpeaker.stop(); // Stop speaker so assistant doesn't talk over user
      const recognition = new SpeechRecognition();
      recognition.lang = getLanguageCode(language);
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      setVoiceTranscript('');
      setVoiceInterim('');
      setIsVoiceActive(true);

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript + ' ';
          } else {
            interim += res[0].transcript;
          }
        }

        if (final) {
          setVoiceTranscript(prev => (prev ? prev + ' ' + final : final).trim());
        }
        setVoiceInterim(interim);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setIsVoiceActive(false);
          alert('Microphone access was denied. Please allow microphone permissions in your browser.');
        }
      };

      recognition.onend = () => {
        // Auto restart if still in voice active mode
        // Only keep active if user didn't explicitly close
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Could not start recognition:', e);
      setIsVoiceActive(false);
    }
  };

  // Stop recording and preserve text in input
  const stopVoiceMode = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    const combined = (voiceTranscript + ' ' + voiceInterim).trim();
    if (combined) {
      setInputText(combined);
    }
    setIsVoiceActive(false);
    setVoiceInterim('');
    setVoiceTranscript('');
    setShowVoiceTemplates(false);
  };

  // Send captured voice question immediately
  const handleSendVoiceQuery = () => {
    const combined = (voiceTranscript + ' ' + voiceInterim).trim() || inputText.trim();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    setIsVoiceActive(false);
    setVoiceInterim('');
    setVoiceTranscript('');
    setShowVoiceTemplates(false);

    if (combined && !isLoading) {
      onSendMessage(combined);
      setInputText('');
    }
  };

  // Get user display name for voice greeting
  const userName = user?.name ? user.name.split(' ')[0] : 'friend';

  return (
    <div id="chat-view-container" className="flex flex-col h-[calc(100vh-65px)] bg-slate-50">
      {/* Top chat action header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 shrink-0 flex items-center justify-between shadow-2xs flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            id="chat-back-btn"
            onClick={onBack}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={t.backBtn}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
              {categoryTitle || t.chatHeading}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Verified Government RAG Grounded</span>
            </div>
          </div>
        </div>

        {/* Chat Actions & Voice Controls */}
        <div className="flex items-center gap-2">
          {/* Live In-Chat Voice Assistant Trigger */}
          <button
            id="chat-open-voice-modal-btn"
            onClick={() => {
              if (isVoiceActive) {
                stopVoiceMode();
              } else {
                startVoiceMode();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-2xs cursor-pointer ${
              isVoiceActive
                ? 'bg-emerald-600 text-white border border-emerald-700 animate-pulse'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
            }`}
            title="Toggle in-chat voice assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isVoiceActive ? 'Listening...' : t.voiceModeBtn}</span>
          </button>

          {/* Auto-Speak Toggle */}
          <button
            id="chat-toggle-autospeak-btn"
            onClick={() => setAutoSpeakEnabled(!autoSpeakEnabled)}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
              autoSpeakEnabled
                ? 'bg-slate-900 text-white border-slate-900 font-medium'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title={autoSpeakEnabled ? 'Auto-speak enabled' : 'Enable auto-speak'}
          >
            {autoSpeakEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span>{autoSpeakEnabled ? 'Auto-Voice: ON' : 'Auto-Voice: OFF'}</span>
          </button>

          {/* New Chat */}
          <button
            id="chat-new-conversation-btn"
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title={t.newChat}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{t.newChat}</span>
          </button>

          {/* Clear Chat */}
          <button
            id="chat-clear-conversation-btn"
            onClick={onClearChat}
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
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
                        {msg.structured?.sourceType === 'DRIVE_DOCUMENT' ? (
                          <div className="flex items-center gap-1 text-emerald-700 font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>Google Drive RAG Grounded</span>
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

                        <div className="space-y-2">
                          {msg.structured.sources.map((src, sIdx) => {
                            const isDriveDoc = src.sourceType === 'DRIVE_DOCUMENT' || src.authority?.toLowerCase().includes('drive');
                            return (
                              <div
                                key={src.id || sIdx}
                                className={`border rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                                  isDriveDoc
                                    ? 'bg-emerald-50/70 border-emerald-200'
                                    : 'bg-slate-50 border-slate-200'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                    {isDriveDoc ? (
                                      <span className="p-1 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px] uppercase tracking-wide">
                                        Google Drive Doc
                                      </span>
                                    ) : (
                                      <FileText className="w-4 h-4 text-slate-700 shrink-0" />
                                    )}
                                    <span>{src.documentName || src.title}</span>
                                  </div>
                                  <div className="text-slate-600">
                                    <strong>Authority:</strong> {src.authority}
                                  </div>
                                  {src.section && (
                                    <div className="text-slate-700">
                                      <strong>{t.sectionLabel}:</strong> {src.section}
                                      {src.pageNumber && <span className="ml-2 text-slate-500">({src.pageNumber})</span>}
                                    </div>
                                  )}
                                  {src.snippet && (
                                    <p className="text-[11px] text-slate-500 bg-white/70 p-1.5 rounded border border-slate-200 line-clamp-2 italic">
                                      "{src.snippet}"
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => onSelectDocument(src.documentName || src.title, src.section, src.officialUrl)}
                                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-300 text-xs transition-colors shadow-2xs cursor-pointer"
                                  >
                                    {t.viewDocument}
                                  </button>
                                  {src.officialUrl && (
                                    <a
                                      href={src.officialUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-300 transition-colors shadow-2xs"
                                      title={t.openOfficialSource}
                                    >
                                      <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
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

                    {/* 5. Legal Disclaimer & Feedback Bar */}
                    <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t.legalDisclaimer}</span>
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

      {/* Bottom input area: Smoothly toggles between Standard Text input and Fluent Audio Bar */}
      <div className={`border-t transition-all p-4 shrink-0 shadow-sm ${
        isVoiceActive ? 'bg-[#0f1117] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto">
          {isVoiceActive ? (
            /* Live Audio Input UI matching user screenshot */
            <div className="w-full flex flex-col items-center py-2 animate-fade-in">
              {/* Header Title: "The mic is yours, [Name]" */}
              <h3 className="text-lg sm:text-2xl font-light text-slate-100 tracking-tight mb-2 text-center select-none">
                The mic is yours, {userName}
              </h3>

              {/* Real-time transcription feedback */}
              <div className="min-h-[24px] mb-3 text-center px-4 max-w-xl">
                {voiceTranscript || voiceInterim ? (
                  <p className="text-xs sm:text-sm font-medium text-blue-300 bg-slate-900/80 px-3.5 py-1 rounded-full border border-blue-500/30 truncate shadow-inner">
                    "{voiceTranscript ? voiceTranscript + ' ' : ''}{voiceInterim}"
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    {language === 'hi'
                      ? 'स्पष्ट रूप से अपना प्रश्न बोलें...'
                      : language === 'mr'
                      ? 'आपला प्रश्न स्पष्टपणे बोला...'
                      : language === 'bn'
                      ? 'আপনার প্রশ্নটি স্পষ্টভাবে বলুন...'
                      : 'Speak your question clearly...'}
                  </p>
                )}
              </div>

              {/* Quick Suggestion Templates Popover */}
              {showVoiceTemplates && (
                <div className="w-full max-w-xl mb-3 bg-[#181a20] border border-slate-700 rounded-2xl p-3 shadow-xl">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>Quick Voice Prompts</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'How to register a new PACS cooperative?',
                      'What are KCC loan eligibility rules?',
                      'Tell me about Model PACS bye-laws',
                      'What is PM-Kisan cooperative subsidy?'
                    ].map((template, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setVoiceTranscript(template);
                          setShowVoiceTemplates(false);
                        }}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors text-left"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dark Pill Audio Bar */}
              <div className="w-full max-w-2xl bg-[#181a20] border border-slate-700/80 rounded-full py-2.5 px-4 sm:px-5 flex items-center justify-between shadow-2xl">
                {/* Left: Plus (+) Button */}
                <button
                  type="button"
                  id="voice-bar-plus-btn"
                  onClick={() => setShowVoiceTemplates(!showVoiceTemplates)}
                  className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                  title="Quick prompt templates"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Center: Dotted line & Animated Sound Waveform Bars */}
                <div className="flex-1 flex items-center justify-center px-2 sm:px-4 overflow-hidden">
                  {/* Left dots */}
                  <div className="hidden sm:flex items-center gap-1 text-slate-500 font-mono text-xs select-none tracking-tighter shrink-0">
                    <span>••••••••••••</span>
                  </div>

                  {/* Equalizer Audio Frequency Bars */}
                  <div className="flex items-center justify-center gap-[3px] h-7 mx-3">
                    {[0.35, 0.6, 0.9, 1.0, 0.7, 0.95, 0.45, 0.85, 0.65, 1.0, 0.8, 0.9, 0.5, 0.75, 0.4].map((factor, i) => {
                      const height = 5 + Math.abs(Math.sin((waveTick * 0.35) + i * 0.65)) * 18 * factor;
                      return (
                        <span
                          key={i}
                          className="w-[2.5px] sm:w-[3px] bg-slate-300 rounded-full transition-all duration-75"
                          style={{ height: `${Math.max(5, height)}px` }}
                        />
                      );
                    })}
                  </div>

                  {/* Right dots */}
                  <div className="hidden sm:flex items-center gap-1 text-slate-500 font-mono text-xs select-none tracking-tighter shrink-0">
                    <span>••••••••••••</span>
                  </div>
                </div>

                {/* Right Action Buttons: Stop (■) & Send (↑) */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Stop / Cancel Recording Button */}
                  <button
                    type="button"
                    id="voice-bar-stop-btn"
                    onClick={stopVoiceMode}
                    className="w-9 h-9 rounded-full bg-[#2a2d36] hover:bg-[#343842] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    title="Stop recording"
                  >
                    <Square className="w-3.5 h-3.5 fill-white text-white" />
                  </button>

                  {/* Submit / Send Voice Query Button */}
                  <button
                    type="button"
                    id="voice-bar-send-btn"
                    onClick={handleSendVoiceQuery}
                    className="w-9 h-9 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                    title="Send audio question"
                  >
                    <ArrowUp className="w-4 h-4 text-white stroke-[2.5]" />
                  </button>
                </div>
              </div>

              <div className="mt-2 text-center text-[11px] text-slate-400 select-none">
                Tap the blue arrow to ask, or the square button to cancel
              </div>
            </div>
          ) : (
            /* Standard text input form with audio mic trigger button */
            <div>
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  id="chat-user-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.askPlaceholder}
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-slate-500 focus:bg-white text-slate-900 rounded-xl py-3.5 pl-4 pr-24 text-sm sm:text-base outline-none transition-all"
                />

                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    id="chat-mic-btn"
                    onClick={startVoiceMode}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Speak question (Live Voice Mode)"
                  >
                    <Mic className="w-4 h-4 text-slate-600 hover:text-blue-600" />
                  </button>

                  <button
                    type="submit"
                    id="chat-send-btn"
                    disabled={!inputText.trim() || isLoading}
                    className="p-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
              <div className="mt-1.5 text-center text-[11px] text-slate-400">
                Official knowledge-grounded assistant • Multi-State Co-operative Societies Act & Model PACS Bye-laws
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
