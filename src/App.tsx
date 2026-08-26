import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ChatView } from './components/ChatView';
import { GuidedAssistanceView } from './components/GuidedAssistanceView';
import { ServicesView } from './components/ServicesView';
import { SchemesView } from './components/SchemesView';
import { AboutView } from './components/AboutView';
import { DriveFoldersView } from './components/DriveFoldersView';
import { AuthModal } from './components/AuthModal';
import { DocumentModal } from './components/DocumentModal';
import { Footer } from './components/Footer';
import { ChatMessage, Language, StructuredAnswer, TopicItem, CategoryItem, UserProfile } from './types';
import { TRANSLATIONS } from './data/translations';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'guided' | 'chat' | 'services' | 'schemes' | 'drive' | 'about'>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCategoryTitle, setActiveCategoryTitle] = useState<string | undefined>(undefined);
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(undefined);
  const [initialVoiceInChat, setInitialVoiceInChat] = useState(false);

  // User state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Document modal state
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedDocTitle, setSelectedDocTitle] = useState<string | null>(null);
  const [selectedDocSection, setSelectedDocSection] = useState<string | undefined>(undefined);
  const [selectedDocUrl, setSelectedDocUrl] = useState<string | undefined>(undefined);

  const t = TRANSLATIONS[language];

  // Open Chat with Voice Mode active (keeps voice assistant purely in the chat box)
  const handleOpenVoiceInChat = () => {
    setActiveCategoryTitle(undefined);
    setActiveCategoryId(undefined);
    setCurrentTab('chat');
    setInitialVoiceInChat(true);
    setTimeout(() => setInitialVoiceInChat(false), 300);
  };

  // Send message to backend API /api/chat
  const handleSendMessage = async (text: string, categoryId?: string) => {
    if (!text.trim() || isLoading) return;

    const userMessageId = `msg-user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentTab('chat');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          language,
          category: categoryId || activeCategoryId
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const structuredAnswer: StructuredAnswer = {
        answer: data.answer || '',
        sourceType: data.sourceType === 'rag' ? 'DRIVE_DOCUMENT' : 'VERIFIED_WEB',
        sources: (data.sources || []).map((s: any, idx: number) => ({
          id: `src-${idx}-${Date.now()}`,
          title: s.title || 'Official Document',
          authority: s.authority || 'Government of India',
          documentName: s.title || 'Official Document',
          section: s.section || 'General Provisions',
          pageNumber: s.page || s.pageNumber,
          officialUrl: s.officialUrl || s.driveUrl || 'https://cooperation.gov.in',
          sourceType: s.sourceType === 'rag' || s.driveUrl ? 'DRIVE_DOCUMENT' : 'VERIFIED_WEB'
        })),
        followUpQuestions: data.followUpQuestions || [],
        legalDisclaimer:
          language === 'hi'
            ? 'यह जानकारी आपके गूगल ड्राइव ज्ञानकोष और आधिकारिक सरकारी स्रोतों पर आधारित है।'
            : 'This information is strictly verified from your Google Drive knowledge base and statutory portals.',
        language
      };

      const assistantMessage: ChatMessage = {
        id: `msg-assistant-${Date.now()}`,
        role: 'assistant',
        text: structuredAnswer.answer,
        structured: structuredAnswer,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `msg-error-${Date.now()}`,
        role: 'assistant',
        text: 'I apologize, an error occurred while querying the knowledge base. Please try asking again.',
        timestamp: new Date().toISOString(),
        structured: {
          answer: 'We encountered an issue querying the Google Drive knowledge base. Please check your connection or select a topic from Guided Assistance.',
          importantNotes: ['Official helplines: Kisan Call Centre 1800-180-1551, PMFBY Helpline 14447.'],
          sources: [
            {
              id: 'src-fallback',
              title: 'Ministry of Cooperation Portal',
              authority: 'Government of India',
              documentName: 'Statutory Guidelines Repository',
              section: 'General Public Information',
              officialUrl: 'https://cooperation.gov.in',
              sourceType: 'GOVERNMENT_PORTAL'
            }
          ],
          sourceType: 'GOVERNMENT_PORTAL',
          followUpQuestions: [
            'How can I become a PACS member?',
            'What is the 72-hour PMFBY crop loss reporting rule?',
            'What are cooperative member rights?'
          ],
          legalDisclaimer: 'This platform provides information and guidance based on official public records.',
          language
        }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenGuided = () => {
    setCurrentTab('guided');
  };

  const handleOpenDirectChat = () => {
    setActiveCategoryTitle(undefined);
    setActiveCategoryId(undefined);
    setCurrentTab('chat');
  };

  const handleSelectTopic = (topic: TopicItem, category: CategoryItem) => {
    const promptText = topic.prompt[language] || topic.prompt.en;
    const catTitle = category.name[language] || category.name.en;
    setActiveCategoryTitle(catTitle);
    setActiveCategoryId(category.id);
    handleSendMessage(promptText, category.id);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveCategoryTitle(undefined);
    setActiveCategoryId(undefined);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSelectDocument = (docTitle: string, section?: string, url?: string) => {
    setSelectedDocTitle(docTitle);
    setSelectedDocSection(section);
    setSelectedDocUrl(url);
    setDocModalOpen(true);
  };

  const handleBookmark = (message: ChatMessage) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(message.id)) {
        next.delete(message.id);
      } else {
        next.add(message.id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        user={user}
        openAuthModal={() => setIsAuthOpen(true)}
        onOpenVoiceMode={handleOpenVoiceInChat}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <HeroSection
              language={language}
              onAskQuestion={(q) => handleSendMessage(q)}
              onOpenGuided={handleOpenGuided}
              onOpenDirectChat={handleOpenDirectChat}
              onOpenVoiceMode={handleOpenVoiceInChat}
            />

            {/* Quick overview of key service categories on homepage */}
            <section className="py-12 bg-white max-w-7xl mx-auto px-4 sm:px-8 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 border-b border-slate-200 pb-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#0B3B60] mb-1">
                    {language === 'hi' ? 'मंत्रालय कार्यक्षेत्र एवं प्रभाग' : 'Statutory Ministry Divisions & Mandates'}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {language === 'hi' ? 'सार्वजनिक सहकारिता व कृषि सेवा प्रभाग' : 'Public Cooperative & Agricultural Service Domains'}
                  </h2>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md">
                  {language === 'hi'
                    ? 'अधिनियमों, उप-नियमों और केंद्र प्रायोजित योजनाओं की प्रामाणिक विधिक व्याख्या प्राप्त करें।'
                    : 'Access verified statutory guidance, parliamentary acts, model by-laws, and central schemes.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  id="domain-card-pacs"
                  onClick={() => {
                    setActiveCategoryTitle('PACS Services');
                    setActiveCategoryId('pacs-services');
                    handleSendMessage('How can a farmer become a member of a PACS and what services are available under Model Bye-laws?', 'pacs-services');
                  }}
                  className="p-5 rounded-xl border border-slate-300 hover:border-[#0B3B60] bg-white hover:bg-slate-50 shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#0B3B60] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Division 01
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">63k+ Societies</span>
                    </div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-[#0B3B60] transition-colors">
                      {language === 'hi' ? 'पैक्स सेवाएं व सदस्यता' : 'PACS Services & Membership'}
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {language === 'hi'
                        ? 'मतदान अधिकार, सीएससी सेवाएं, खाद-बीज वितरण और मॉडल उप-नियम 2024।'
                        : 'Voting rights, CSC services, fertilizer distribution, and Model Bye-laws 2024.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#0B3B60]">
                    <span>{language === 'hi' ? 'विधिक परामर्श लें' : 'Explore Domain'}</span>
                    <span>→</span>
                  </div>
                </div>

                <div
                  id="domain-card-pmfby"
                  onClick={() => {
                    setActiveCategoryTitle('Crop Insurance & Agriculture');
                    setActiveCategoryId('agriculture-insurance');
                    handleSendMessage('What is PMFBY crop insurance and how do I report crop loss within 72 hours?', 'agriculture-insurance');
                  }}
                  className="p-5 rounded-xl border border-slate-300 hover:border-[#0B3B60] bg-white hover:bg-slate-50 shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Division 02
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">CSS Scheme</span>
                    </div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-[#0B3B60] transition-colors">
                      {language === 'hi' ? 'पीएम फसल बीमा (PMFBY)' : 'PMFBY & Crop Insurance'}
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {language === 'hi'
                        ? '72 घंटे में नुकसान सूचना, 1.5%-2% सीमित प्रीमियम दरें और क्लेम प्रक्रिया।'
                        : '72-hour loss notification, capped premium rates (1.5%-2%), and claim procedures.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#0B3B60]">
                    <span>{language === 'hi' ? 'विधिक परामर्श लें' : 'Explore Domain'}</span>
                    <span>→</span>
                  </div>
                </div>

                <div
                  id="domain-card-mscs"
                  onClick={() => {
                    setActiveCategoryTitle('Cooperative Law & Governance');
                    setActiveCategoryId('cooperative-law');
                    handleSendMessage('What are member rights and Ombudsman grievance provisions under the MSCS Act 2023?', 'cooperative-law');
                  }}
                  className="p-5 rounded-xl border border-slate-300 hover:border-[#0B3B60] bg-white hover:bg-slate-50 shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Division 03
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">MSCS Act 2023</span>
                    </div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-[#0B3B60] transition-colors">
                      {language === 'hi' ? 'सहकारी कानून व उप-नियम' : 'Cooperative Law & By-Laws'}
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {language === 'hi'
                        ? 'धारा 30 लोकतांत्रिक मतदान, सहकारी लोकपाल और ऑडिट पारदर्शिता।'
                        : 'Section 30 democratic voting, Cooperative Ombudsman, and audit transparency.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#0B3B60]">
                    <span>{language === 'hi' ? 'विधिक परामर्श लें' : 'Explore Domain'}</span>
                    <span>→</span>
                  </div>
                </div>

                <div
                  id="domain-card-grievance"
                  onClick={() => {
                    setActiveCategoryTitle('Grievance Redressal');
                    setActiveCategoryId('grievance-redressal');
                    handleSendMessage('How can I file an official grievance or complaint against a cooperative society or bank?', 'grievance-redressal');
                  }}
                  className="p-5 rounded-xl border border-slate-300 hover:border-[#0B3B60] bg-white hover:bg-slate-50 shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Division 04
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Statutory Portal</span>
                    </div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-[#0B3B60] transition-colors">
                      {language === 'hi' ? 'शिकायत व विवाद निवारण' : 'Grievance & Dispute Resolution'}
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {language === 'hi'
                        ? 'सीआरसीएस पोर्टल पर ऑनलाइन शिकायत, धारा 84 मध्यस्थता और अपील प्रक्रिया।'
                        : 'CRCS portal filing, dispute arbitration under Section 84, and escalation.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#0B3B60]">
                    <span>{language === 'hi' ? 'विधिक परामर्श लें' : 'Explore Domain'}</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentTab === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={(text) => handleSendMessage(text)}
            onBack={() => setCurrentTab('home')}
            onNewChat={handleNewChat}
            onClearChat={handleClearChat}
            isLoading={isLoading}
            language={language}
            setLanguage={setLanguage}
            categoryTitle={activeCategoryTitle}
            onSelectDocument={handleSelectDocument}
            user={user}
            onBookmarkAnswer={handleBookmark}
            bookmarkedIds={bookmarkedIds}
            initialVoiceActive={initialVoiceInChat}
          />
        )}

        {currentTab === 'guided' && (
          <GuidedAssistanceView
            language={language}
            onSelectTopic={handleSelectTopic}
            onDirectQuestion={(q) => handleSendMessage(q)}
          />
        )}

        {currentTab === 'services' && (
          <ServicesView
            language={language}
            onAskAboutService={(serviceTitle) => {
              handleSendMessage(`Tell me the detailed application process, eligibility, and required documents for: ${serviceTitle}`);
            }}
          />
        )}

        {currentTab === 'schemes' && (
          <SchemesView
            language={language}
            onAskAboutScheme={(schemeName) => {
              handleSendMessage(`What are the key benefits, eligibility criteria, and required documents for ${schemeName}?`);
            }}
          />
        )}

        {currentTab === 'drive' && (
          <DriveFoldersView language={language} />
        )}

        {currentTab === 'about' && (
          <AboutView
            language={language}
            onOpenKnowledgeDoc={handleSelectDocument}
          />
        )}
      </main>

      {/* Auth Modal (Login / Register / Profile) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        language={language}
        user={user}
        onLogin={(loggedInUser) => setUser(loggedInUser)}
        onLogout={() => setUser(null)}
      />

      {/* Document Inspector Modal */}
      <DocumentModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        documentTitle={selectedDocTitle}
        sectionName={selectedDocSection}
        officialUrl={selectedDocUrl}
      />

      {/* Public Service Footer (Hidden on full chat view to maximize screen space) */}
      {currentTab !== 'chat' && <Footer language={language} />}
    </div>
  );
}

export default App;
