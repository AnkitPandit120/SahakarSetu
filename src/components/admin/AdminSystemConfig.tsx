import React from 'react';
import {
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Key,
  Server,
  Database,
  Cpu,
  Globe,
  Radio,
  FileCheck,
  Download,
  Image as ImageIcon
} from 'lucide-react';

interface AdminSystemConfigProps {
  language: 'en' | 'hi';
  driveStats: any;
}

export const AdminSystemConfig: React.FC<AdminSystemConfigProps> = ({
  language,
  driveStats
}) => {
  const isHi = language === 'hi';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Model & AI Telemetry Card */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-700" />
          <h3 className="text-base font-bold text-slate-900">
            {isHi ? 'सिस्टम स्वास्थ्य एवं एआई मॉडल मेट्रिक्स' : 'System Health & AI Model Telemetry'}
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          {isHi
            ? 'सहकार सेतु पोर्टल द्वारा उपयोग किए जा रहे वैधानिक एआई इंजनों का वास्तविक समय स्थिति विवरण:'
            : 'Real-time telemetry and engine benchmarks for statutory RAG processing:'}
        </p>

        <div className="space-y-2.5 pt-2 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-600 font-medium">
              {isHi ? 'एआई जनरेटिव मॉडल इंजन:' : 'Generative AI Engine:'}
            </span>
            <span className="font-mono text-indigo-900 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
              models/gemini-2.5-flash
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-600 font-medium">
              {isHi ? 'एंबेडेड वेक्टर डाइमेंशन:' : 'Embedding Vector Dimensions:'}
            </span>
            <span className="font-mono text-sky-900 font-bold bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
              768 Dim (text-embedding-004)
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-600 font-medium">
              {isHi ? 'वेब सर्च ग्राउंडिंग फ़ॉलबैक:' : 'Web Search Grounding Fallback:'}
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isHi ? 'सक्रिय (अस्वीकरण के साथ)' : 'Active (with Statutory Disclaimer)'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-600 font-medium">
              {isHi ? 'प्रशासनिक सुरक्षा प्रमाणीकरण:' : 'Admin Security Authentication:'}
            </span>
            <span className="text-slate-900 font-bold flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              {isHi ? '3-फैक्टर नोडल सुरक्षा पास' : '3-Factor Nodal Security Pass'}
            </span>
          </div>
        </div>
      </div>

      {/* Environment & Security Configuration */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-700" />
          <h3 className="text-base font-bold text-slate-900">
            {isHi ? 'प्रशासनिक पर्यावरण सेटिंग्स' : 'Administrative Environment & Security Config'}
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          {isHi
            ? 'सुरक्षित पर्यावरण चर एवं सर्वर-साइड क्रेडेंशियल स्थिति:'
            : 'Secured environment variable declarations and server-side keys:'}
        </p>

        <div className="space-y-3 pt-2 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">GEMINI_API_KEY</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isHi ? 'सर्वर-साइड सुरक्षित' : 'Protected'}
              </span>
            </div>
            <div className="text-slate-500 font-mono text-[11px]">
              {isHi ? 'Google GenAI SDK (Node.js Express Backend) में सुरक्षित' : 'Encrypted server-side proxy • Hidden from client'}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">GOOGLE_DRIVE_FOLDER_ID</span>
              <span className="text-amber-800 font-mono font-bold text-[11px]">
                {driveStats?.folderId || '1_sahakar_rag_acts'}
              </span>
            </div>
            <div className="text-slate-500 text-[11px]">
              {isHi ? 'मंत्रालय ड्राइव कंसोल द्वारा प्रबंधित' : 'Managed via Ministry Nodal Console'}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">ADMIN_SESSION_TOKEN</span>
              <span className="text-indigo-800 font-mono font-bold text-[11px]">
                SHA-256 JWT Tokenized
              </span>
            </div>
            <div className="text-slate-500 text-[11px]">
              {isHi
                ? 'नोडल अधिकारियों के लिए विशिष्ट यूज़रनेम, पासवर्ड व सुरक्षा कोड'
                : 'Session duration: 24 hours with automatic credential invalidation'}
            </div>
          </div>
        </div>
      </div>

      {/* Media & Image Assets Archive Card */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs space-y-4 lg:col-span-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isHi ? 'प्रोजेक्ट मीडिया व चित्र पुरालेख' : 'Project Media & Image Assets Archive'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi
                  ? 'सहकार सेतु के सभी 13 चित्र, बैनर और उपयोग विवरण (README Catalog) एक ज़िप पैकेज में।'
                  : 'All 13 project images, banners, portraits and documentation catalog bundled in a ZIP archive.'}
              </p>
            </div>
          </div>
          <a
            href="/api/download-images"
            download="sahakarsetu_all_images.zip"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{isHi ? 'सभी चित्र डाउनलोड करें (.ZIP)' : 'Download All Images (.ZIP)'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
