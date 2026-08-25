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
  Info
} from 'lucide-react';
import { ChatMessage, Language, SourceItem, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';

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
  bookmarkedIds
}) => {
  const t = TRANSLATIONS[language];
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, 'helpful' | 'unhelpful'>>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  const handleFeedback = (messageId: string, type: 'helpful' | 'unhelpful') => {
    setFeedbackMap(prev => ({ ...prev, [messageId]: type }));
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t.micUnsupported);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Voice input error:', e);
      setIsListening(false);
    }
  };

  return (
    <div id="chat-view-container" className="flex flex-col h-[calc(100vh-65px)] bg-slate-50">
      {/* Top chat action header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 shrink-0 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            id="chat-back-btn"
            onClick={onBack}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
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

        {/* Chat Actions */}
        <div className="flex items-center gap-2">
          <button
            id="chat-new-btn"
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.newChat}</span>
          </button>
          <button
            id="chat-clear-btn"
            onClick={onClearChat}
            className="p-1.5 text-xs text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
              Every answer is verified against official Acts, Model Bye-laws, and Ministry guidelines with exact citations.
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

        {messages.map((msg) => (
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
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-5 sm:p-6 max-w-3xl w-full shadow-sm space-y-4">
                  {/* Trust source indicator badge */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                      <span>
                        {msg.structured?.sourceType === 'GOVERNMENT_PORTAL'
                          ? t.sourceBadgeGov
                          : msg.structured?.sourceType === 'VERIFIED_WEB'
                          ? t.sourceBadgeWeb
                          : t.sourceBadgeKnowledge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(msg.id, msg.structured?.answer || msg.text)}
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
                            <span>{t.copyAnswer}</span>
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
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <span>{t.answerLabel}</span>
                    </h4>
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
                        {msg.structured.sources.map((src, sIdx) => (
                          <div
                            key={src.id || sIdx}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-slate-700 shrink-0" />
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
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => onSelectDocument(src.documentName || src.title, src.section, src.officialUrl)}
                                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-300 text-xs transition-colors shadow-2xs"
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
                        ))}
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
        ))}

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

      {/* Fixed bottom input box */}
      <div className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-sm">
        <div className="max-w-4xl mx-auto">
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

            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                type="button"
                id="chat-mic-btn"
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors ${
                  isListening ? 'bg-red-50 text-red-600 animate-pulse' : ''
                }`}
                title="Speak question"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                id="chat-send-btn"
                disabled={!inputText.trim() || isLoading}
                className="p-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          <div className="mt-1.5 text-center text-[11px] text-slate-400">
            Official knowledge-grounded assistant • Multi-State Co-operative Societies Act & Model PACS Bye-laws
          </div>
        </div>
      </div>
    </div>
  );
};
