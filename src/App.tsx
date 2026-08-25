import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ChatView } from './components/ChatView';
import { GuidedAssistanceView } from './components/GuidedAssistanceView';
import { ServicesView } from './components/ServicesView';
import { SchemesView } from './components/SchemesView';
import { AboutView } from './components/AboutView';
import { AuthModal } from './components/AuthModal';
import { DocumentModal } from './components/DocumentModal';
import { Footer } from './components/Footer';
import { ChatMessage, Language, StructuredAnswer, TopicItem, CategoryItem, UserProfile } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'guided' | 'chat' | 'services' | 'schemes' | 'about'>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCategoryTitle, setActiveCategoryTitle] = useState<string | undefined>(undefined);
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(undefined);

  // User state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Document modal state
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedDocTitle, setSelectedDocTitle] = useState<string | null>(null);
  const [selectedDocSection, setSelectedDocSection] = useState<string | undefined>(undefined);
  const [selectedDocUrl, setSelectedDocUrl] = useState<string | undefined>(undefined);

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
      const timeoutId = setTimeout(() => controller.abort(), 16000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          language,
          categoryId: categoryId || activeCategoryId
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const structuredAnswer: StructuredAnswer = await response.json();

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
        text: 'I apologize, an error occurred while verifying the knowledge base. Please try asking again.',
        timestamp: new Date().toISOString(),
        structured: {
          answer: 'We encountered a momentary issue querying the knowledge base. Please check your question or select a topic from Guided Assistance.',
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
            />

            {/* Quick overview of key service categories on homepage */}
            <section className="py-14 bg-white max-w-7xl mx-auto px-4 sm:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Public Cooperative & Agricultural Service Domains
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  Access plain-language statutory guidance, acts, by-laws, and government schemes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div
                  onClick={() => {
                    setActiveCategoryTitle('PACS Services');
                    setActiveCategoryId('pacs-services');
                    handleSendMessage('How can a farmer become a member of a PACS and what services are available under Model Bye-laws?', 'pacs-services');
                  }}
                  className="p-6 rounded-2xl border border-slate-200 hover:border-slate-400 bg-white hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">01</div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-slate-700 transition-colors">
                      PACS Services & Membership
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Voting rights, CSC services, fertilizer distribution, and Model Bye-laws 2023.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-800">
                    <span>Explore Domain →</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveCategoryTitle('Crop Insurance & Agriculture');
                    setActiveCategoryId('agriculture-insurance');
                    handleSendMessage('What is PMFBY crop insurance and how do I report crop loss within 72 hours?', 'agriculture-insurance');
                  }}
                  className="p-6 rounded-2xl border border-slate-200 hover:border-slate-400 bg-white hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">02</div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-slate-700 transition-colors">
                      PMFBY & Crop Insurance
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      72-hour loss notification, capped premium rates (1.5%-2%), and claim procedures.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-800">
                    <span>Explore Domain →</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveCategoryTitle('Cooperative Law & Governance');
                    setActiveCategoryId('cooperative-law');
                    handleSendMessage('What are member rights and Ombudsman grievance provisions under the MSCS Act 2023?', 'cooperative-law');
                  }}
                  className="p-6 rounded-2xl border border-slate-200 hover:border-slate-400 bg-white hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">03</div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-slate-700 transition-colors">
                      Cooperative Law & By-Laws
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Section 30 democratic voting, Cooperative Ombudsman, and audit transparency.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-800">
                    <span>Explore Domain →</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveCategoryTitle('Grievance Redressal');
                    setActiveCategoryId('grievance-redressal');
                    handleSendMessage('How can I file an official grievance or complaint against a cooperative society or bank?', 'grievance-redressal');
                  }}
                  className="p-6 rounded-2xl border border-slate-200 hover:border-slate-400 bg-white hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">04</div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-slate-700 transition-colors">
                      Grievance Redressal
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      CRCS portal filing, dispute arbitration under Section 84, and escalation procedures.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-800">
                    <span>Explore Domain →</span>
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
