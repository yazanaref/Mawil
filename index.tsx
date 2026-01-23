import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  BookOpen, Users, FileText, Landmark, Clock, Mail, 
  ChevronRight, AlertTriangle, Globe,
  MessageSquare, X, Send, Sparkles, Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Declare process for TypeScript to avoid "Cannot find name 'process'" error
declare var process: any;

// --- INSTITUTIONAL CONFIGURATION ---

const INSTITUTION = {
  name: "Maw'il (موئل)",
  subtitle: "Institute",
  address: {
    line1: "King Abdullah Road",
    line2: "Al Mohammadiyah District",
    city: "Riyadh",
    postal: "12363",
    country: "Saudi Arabia"
  },
  email: "info@mawil.org",
  licenseNumber: "License No: [PENDING/UNDER-REVIEW]", 
  foundedYear: 2024
};

// --- Types & Interfaces ---

interface Program {
  id: string;
  title: string;
  level: string;
  duration: string;
  delivery: string;
  overview: string;
  modules: { code: string; title: string; credits: number }[];
  outcomes: string[];
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  credentials: string;
  email: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// --- Data ---

const PROGRAMS: Program[] = [
  {
    id: 'conservation-bio',
    title: 'Certificate in Conservation Biology',
    level: 'Certificate / Vocational',
    duration: '1 Academic Year',
    delivery: 'Hybrid (Fieldwork & Virtual)',
    overview: 'A rigorous scientific program focusing on biodiversity preservation, ecosystem management, and sustainable wildlife stewardship.',
    modules: [
      { code: 'BIO-101', title: 'Principles of Ecology', credits: 4 },
      { code: 'ZOO-105', title: 'Vertebrate Zoology', credits: 3 },
      { code: 'CONS-110', title: 'Field Research Methods', credits: 3 }
    ],
    outcomes: [
      'Conduct field surveys using standard ecological sampling techniques.',
      'Analyze threats to local biodiversity and propose mitigation strategies.',
      'Demonstrate proficiency in species identification and taxonomy.'
    ]
  },
  {
    id: 'marine-ecosystems',
    title: 'Advanced Seminar: Marine Ecosystems',
    level: 'Continuing Education',
    duration: '16 Weeks',
    delivery: 'Seminar / Lab',
    overview: 'An advanced specialized track for researchers focusing on marine biology, coral preservation, and aquatic life systems.',
    modules: [
      { code: 'MAR-201', title: 'Coral Reef Dynamics', credits: 2 },
      { code: 'RES-202', title: 'Marine Data Analysis', credits: 4 }
    ],
    outcomes: [
      'Develop comprehensive environmental impact assessments for marine zones.',
      'Master data collection techniques for aquatic environments.'
    ]
  }
];

const STAFF: StaffMember[] = [
  { id: 'founder', name: 'Dr. Yazan Mohammad Aref', role: 'Founder & Website Manager', department: 'Administration / Tech', credentials: 'PhD in Zoology', email: 'yazanaref@mawil.org' },
  { id: 'ops-1', name: 'Mohammad Nour Issa', role: 'Admin Assistant', department: 'Operations & Administration', credentials: 'Staff', email: 'mohammad@mawil.org' },
  { id: 'ops-2', name: 'Touleen Saidi', role: 'Admin Assistant', department: 'Operations & Administration', credentials: 'Staff', email: 'touleen@mawil.org' },
  { id: 'med-1', name: 'Sarah Abdullah Arrfdy', role: 'Graphic Designer', department: 'Media & Creative', credentials: 'Creative', email: 'sarah@mawil.org' },
  { id: 'tech-1', name: 'AbdulHakim Khan', role: 'Website Technician', department: 'Website & Development', credentials: 'Tech', email: 'abdulhakim@mawil.org' }
];

// --- AI Chatbot Component ---

const FormattedMessage = ({ content }: { content: string }) => {
  const renderLine = (line: string, index: number) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={index} className="h-2" />;

    // Basic Header detection
    if (trimmed.startsWith('###')) {
      return <h4 key={index} className="font-bold text-zinc-900 mt-3 mb-1">{trimmed.replace(/^###\s*/, '')}</h4>;
    }
    if (trimmed.startsWith('##')) {
      return <h3 key={index} className="font-bold text-zinc-900 mt-4 mb-2 border-b border-zinc-100 pb-1">{trimmed.replace(/^##\s*/, '')}</h3>;
    }

    // Basic List detection
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      return (
        <div key={index} className="flex gap-2 ml-2">
          <span className="text-zinc-400">•</span>
          <span className="flex-grow">{parseBold(trimmed.substring(2))}</span>
        </div>
      );
    }

    // Numbered List detection
    if (/^\d+\.\s/.test(trimmed)) {
      return <div key={index} className="ml-2 leading-relaxed">{parseBold(line)}</div>;
    }

    return <p key={index} className="leading-relaxed">{parseBold(line)}</p>;
  };

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-zinc-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-1">
      {content.split('\n').map((line, i) => renderLine(line, i))}
    </div>
  );
};

const MawilAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome to **Maw'il Institute (موئل)**. We are a non-profit educational institution dedicated to the advancement of Zoology and Biological Sciences through rigorous scholarship.\n\nHow can I help you today with information regarding our **academic programs**, **faculty**, or **enrollment steps**?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customMsg?: string) => {
    const userMsg = customMsg || input;
    if (!userMsg.trim() || isLoading) return;

    if (!customMsg) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        You are "Maw'il Assistant", the official AI representative for Maw'il Institute (موئل).
        INSTITUTION: Non-profit, based in Riyadh, Saudi Arabia.
        MISSION: Rigorous scientific scholarship in Zoology and Biology.
        FOUNDER: Dr. Yazan Mohammad Aref (PhD in Zoology).
        
        AVAILABLE DATA:
        - Programs: ${JSON.stringify(PROGRAMS)}
        - Staff: ${JSON.stringify(STAFF)}
        - Admission Steps: 1. Apply Online, 2. Document Review, 3. Interview, 4. Enrollment.
        
        FORMATTING RULES:
        1. ALWAYS use Markdown for structure.
        2. Use ### for subheaders.
        3. Use **bold text** for emphasis on program names, credits, or staff.
        4. Use bullet points for lists of outcomes or modules.
        5. Be professional and concise.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const aiContent = response.text || "I apologize, I'm having trouble retrieving that information. Please contact info@mawil.org for direct assistance.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a technical error. Please try again later or contact our administration at **info@mawil.org**." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "Tell me about Maw'il",
    "How to apply?",
    "View programs",
    "Faculty list"
  ];

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-[420px] h-[580px] shadow-2xl rounded-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-primary-900 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-amber-600 p-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Maw'il Assistant</h3>
                <p className="text-[10px] text-zinc-300 uppercase tracking-widest font-semibold">Institutional AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-800 p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-zinc-50 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] shadow-sm leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-primary-900 text-white rounded-tr-none' 
                  : 'bg-white border border-zinc-200 text-zinc-700 rounded-tl-none'
                }`}>
                  <FormattedMessage content={m.content} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-zinc-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-900" />
                  <span className="text-[11px] text-zinc-400 font-medium italic">Consulting academic database...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {messages.length < 3 && !isLoading && (
            <div className="px-4 py-3 bg-white border-t border-zinc-50 flex flex-wrap gap-2">
              {quickActions.map(action => (
                <button 
                  key={action}
                  onClick={() => handleSend(action)}
                  className="text-[11px] bg-zinc-50 text-zinc-600 border border-zinc-200 hover:border-primary-900 hover:text-primary-900 hover:bg-primary-50 transition-all rounded-full px-3 py-1.5 font-bold shadow-sm"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-zinc-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about programs, faculty..."
              className="flex-grow bg-zinc-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary-900 transition-all outline-none"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-primary-900 text-white p-2.5 rounded-full disabled:opacity-50 hover:bg-primary-800 transition-colors shadow-md flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary-900 text-white p-4 rounded-full shadow-2xl hover:bg-primary-800 transition-all hover:scale-110 flex items-center justify-center group relative border-2 border-white"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-full mr-4 bg-white text-zinc-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl border border-zinc-100 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
            Institutional Assistant
          </span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-primary-900 animate-pulse flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        </button>
      )}
    </div>
  );
};

// --- Components ---

const MawilLogo = ({ className }: { className?: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="Maw'il Logo Fallback">
         <circle cx="50" cy="50" r="48" fill="#E6DCC3" stroke="#20411B" strokeWidth="4" />
         <path 
           d="M30 70 L38 25 L50 50 L62 25 L70 70" 
           fill="none" 
           stroke="#20411B" 
           strokeWidth="6" 
           strokeLinecap="round" 
           strokeLinejoin="round" 
         />
      </svg>
    );
  }

  return (
    <img 
      src="/logo.png" 
      alt="Maw'il Institute Logo" 
      className={`${className} object-contain rounded-full`}
      onError={() => setError(true)}
    />
  );
};

const NavLink: React.FC<{ to: string, label: string, current: string, setRoute: (r: string) => void }> = ({ to, label, current, setRoute }) => (
  <button 
    onClick={() => { setRoute(to); window.scrollTo(0,0); }}
    className={`px-3 py-2 text-sm font-medium transition-colors ${current === to ? 'text-primary-900 border-b-2 border-primary-900' : 'text-zinc-600 hover:text-primary-800'}`}
  >
    {label}
  </button>
);

const Footer = ({ setRoute }: { setRoute: (r: string) => void }) => {
  return (
    <footer className="bg-primary-900 text-zinc-300 py-12 border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <MawilLogo className="w-12 h-12" />
             <div>
               <h3 className="text-white font-serif text-lg leading-tight">{INSTITUTION.name}</h3>
               <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{INSTITUTION.subtitle}</p>
             </div>
          </div>
          <p className="mb-4 text-zinc-400">An educational institution dedicated to rigorous scholarship in zoological and biological sciences.</p>
          <div className="text-xs text-zinc-500 space-y-1">
             <p className="font-bold text-zinc-400">Non-Profit Educational Institution</p>
             <p className="mt-2">© {new Date().getFullYear()} {INSTITUTION.name} Institution.</p>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">Governance</h4>
          <ul className="space-y-2">
            <li><button onClick={() => setRoute('/about')} className="hover:text-white">Institutional Mandate</button></li>
            <li><button onClick={() => setRoute('/governance')} className="hover:text-white">Board of Trustees</button></li>
            <li><button onClick={() => setRoute('/staff')} className="hover:text-white">Faculty Directory</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">Academics</h4>
          <ul className="space-y-2">
            <li><button onClick={() => setRoute('/programs')} className="hover:text-white">Programs & Curriculum</button></li>
            <li><button onClick={() => setRoute('/academic-model')} className="hover:text-white">Instructional Delivery</button></li>
            <li><button onClick={() => setRoute('/admissions')} className="hover:text-white">Admissions</button></li>
            <li><button onClick={() => setRoute('/policies')} className="hover:text-white">Student Policies</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">Contact</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> <span>{INSTITUTION.email}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Website Status Component ---

const WebsiteStatus = () => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end group">
     <div className="bg-white border border-zinc-200 text-zinc-800 p-4 rounded-lg shadow-2xl mb-3 max-w-xs opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto relative">
       <div className="flex items-start gap-3">
         <div className="bg-amber-100 p-2 rounded-full shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
         </div>
         <div>
            <p className="text-sm font-medium leading-relaxed">
              You are viewing the official Maw’il Institute website. Some sections are currently being updated. For official enquiries, contact info@mawil.org
            </p>
         </div>
       </div>
       <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-zinc-200 transform rotate-45"></div>
     </div>
     
     <button className="bg-primary-900 text-white px-5 py-3 rounded-full shadow-xl hover:bg-primary-800 transition-all hover:scale-105 flex items-center gap-3">
       <div className="relative">
         <Globe className="w-5 h-5" />
         <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 border-2 border-primary-900 rounded-full animate-pulse"></span>
       </div>
       <span className="font-bold text-sm tracking-wide pr-1">Site Notice</span>
     </button>
  </div>
);

// --- Pages ---

const Home = ({ setRoute }: { setRoute: (r: string) => void }) => (
  <div className="space-y-12">
    <section className="bg-primary-900 text-white py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary-900 opacity-20"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Advancing Knowledge Through Rigorous Scholarship</h1>
        <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">{INSTITUTION.name} is dedicated to providing structured educational programs and preserving our natural heritage.</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => setRoute('/programs')} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded font-medium transition-colors">View Academic Programs</button>
          <button onClick={() => setRoute('/admissions')} className="bg-transparent border border-zinc-400 hover:border-white text-white px-6 py-3 rounded font-medium transition-colors">Admissions</button>
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-100">
        <BookOpen className="w-8 h-8 text-primary-900 mb-4" />
        <h3 className="text-xl font-serif font-bold mb-2">Scientific Excellence</h3>
        <p className="text-zinc-600 mb-4">Structured curricula designed to meet rigorous learning outcomes in biological sciences.</p>
        <button onClick={() => setRoute('/academic-model')} className="text-primary-900 font-medium text-sm flex items-center hover:underline">View Model <ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-100">
        <Users className="w-8 h-8 text-primary-900 mb-4" />
        <h3 className="text-xl font-serif font-bold mb-2">Faculty & Research</h3>
        <p className="text-zinc-600 mb-4">Led by qualified instructors and subject matter experts committed to pedagogical integrity.</p>
        <button onClick={() => setRoute('/staff')} className="text-primary-900 font-medium text-sm flex items-center hover:underline">View Directory <ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-100">
        <Landmark className="w-8 h-8 text-primary-900 mb-4" />
        <h3 className="text-xl font-serif font-bold mb-2">Institutional Governance</h3>
        <p className="text-zinc-600 mb-4">Operated under a transparent governance structure with established policies and oversight.</p>
        <button onClick={() => setRoute('/governance')} className="text-primary-900 font-medium text-sm flex items-center hover:underline">View Leadership <ChevronRight className="w-4 h-4" /></button>
      </div>
    </section>
  </div>
);

const About = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">About the Institution</h1>
    <div className="prose prose-zinc max-w-none">
      <p className="lead text-xl text-zinc-600 mb-8">
        {INSTITUTION.name} is an independent non-profit educational institution established to provide structured learning opportunities in Zoology and Environmental Sciences.
      </p>
      <h3 className="text-xl font-bold mt-8 mb-4">Institutional Mandate</h3>
      <ul className="list-disc pl-6 space-y-2 mb-8">
        <li>Provide high-quality instruction in biological sciences.</li>
        <li>Foster a scholarly environment grounded in critical inquiry.</li>
        <li>Maintain rigorous assessment standards.</li>
        <li>Operate with full transparency.</li>
      </ul>
      <h3 className="text-xl font-bold mt-8 mb-4">History & Founding</h3>
      <p className="text-zinc-600">
        Established in {INSTITUTION.foundedYear} by Dr. Yazan Mohammad Aref, a distinguished PhD holder in Zoology.
      </p>
    </div>
  </div>
);

const Governance = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Governance & Leadership</h1>
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-zinc-800 mb-6">Board of Trustees</h2>
      <div className="border p-4 rounded bg-white shadow-sm border-l-4 border-l-primary-900">
        <div className="font-bold text-lg">Dr. Yazan Mohammad Aref</div>
        <div className="text-sm text-primary-900 uppercase tracking-wide font-bold">Founder & Chair of the Board</div>
        <p className="text-sm mt-2 text-zinc-600">PhD in Zoology. Established {INSTITUTION.name} in {INSTITUTION.foundedYear}.</p>
      </div>
    </div>
  </div>
);

const AcademicModel = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Academic Model & Delivery</h1>
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-bold text-zinc-800 mb-3">Instructional Delivery</h3>
        <p className="text-zinc-600">
          {INSTITUTION.name} utilizes a Hybrid delivery model. Courses are structured into modules requiring specific contact hours.
        </p>
      </section>
    </div>
  </div>
);

const Programs = ({ setRoute }: { setRoute: (r: string) => void }) => (
  <div className="max-w-6xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Academic Programs</h1>
    <div className="grid md:grid-cols-2 gap-6">
      {PROGRAMS.map(prog => (
        <div key={prog.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="text-xs font-bold text-primary-900 uppercase tracking-wider mb-2">{prog.level}</div>
          <h2 className="text-xl font-bold mb-3">{prog.title}</h2>
          <p className="text-zinc-600 mb-4 line-clamp-3">{prog.overview}</p>
          <div className="flex gap-4 text-sm text-zinc-500 mb-6">
            <div className="flex items-center gap-1"><Clock className="w-4 h-4"/> {prog.duration}</div>
            <div className="flex items-center gap-1"><Users className="w-4 h-4"/> {prog.delivery}</div>
          </div>
          <button 
            onClick={() => setRoute(`/programs/${prog.id}`)}
            className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 py-2 rounded font-medium text-sm transition-colors"
          >
            Program Details
          </button>
        </div>
      ))}
    </div>
  </div>
);

const ProgramDetail = ({ id }: { id: string }) => {
  const prog = PROGRAMS.find(p => p.id === id);
  if (!prog) return <div>Program not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded font-bold uppercase">{prog.level}</span>
        <h1 className="text-3xl font-serif font-bold text-zinc-900 mt-3 mb-4">{prog.title}</h1>
        <p className="text-lg text-zinc-600">{prog.overview}</p>
      </div>
      <h3 className="text-xl font-bold border-b pb-2 mb-4">Curriculum Structure</h3>
      <div className="space-y-3 mb-8">
        {prog.modules.map(mod => (
          <div key={mod.code} className="flex justify-between items-center bg-white border p-3 rounded">
            <div>
              <span className="text-sm font-mono text-zinc-500 mr-3">{mod.code}</span>
              <span className="font-medium">{mod.title}</span>
            </div>
            <span className="text-sm bg-zinc-100 px-2 py-1 rounded">{mod.credits} Credits</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Admissions = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Admissions & Enrollment</h1>
    <div className="bg-zinc-50 p-8 rounded border text-center">
      <h3 className="text-xl font-bold mb-4">Application Process</h3>
      <div className="flex justify-center gap-8 text-sm mb-6">
        {['Apply Online', 'Document Review', 'Interview', 'Enrollment'].map((step, i) => (
          <div key={i} className="text-center">
            <div className="w-8 h-8 bg-primary-900 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">{i+1}</div>
            <div>{step}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Policies = ({ setRoute }: { setRoute: (r: string) => void }) => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Institutional Policies</h1>
    <div className="grid md:grid-cols-2 gap-4">
      {['Academic Integrity', 'Assessment', 'Attendance', 'Privacy', 'Terms', 'Grievance', 'Nondiscrimination'].map(p => (
        <button key={p} onClick={() => setRoute(`/policies/${p.toLowerCase()}`)} className="flex items-center justify-between p-4 bg-white border rounded hover:border-primary-900 hover:bg-zinc-50 transition-all text-left group">
          <span className="font-medium group-hover:text-primary-900">{p} Policy</span>
          <FileText className="w-4 h-4 text-zinc-400 group-hover:text-primary-900" />
        </button>
      ))}
    </div>
  </div>
);

const Staff = () => (
  <div className="max-w-6xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Faculty & Staff Directory</h1>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {STAFF.map(member => (
        <div key={member.id} className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm">
          <h3 className="font-bold text-lg text-zinc-900 leading-tight mb-1">{member.name}</h3>
          <div className="text-sm font-medium text-primary-900">{member.role}</div>
          <div className="text-xs text-zinc-500 mt-3 pt-3 border-t">
            <div className="flex items-center gap-2"><Mail className="w-3 h-3"/> {member.email}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Contact = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Contact Us</h1>
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <p className="text-zinc-600">Email: {INSTITUTION.email}</p>
        <div className="mt-8 pt-8 border-t">
           <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Office</h4>
           <p className="text-zinc-800 font-medium">{INSTITUTION.name}</p>
           <p className="text-zinc-600">{INSTITUTION.address.line1}, {INSTITUTION.address.city}</p>
        </div>
      </div>
    </div>
  </div>
);

const PolicyDetail = ({ type }: { type: string }) => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 capitalize mb-8">{type} Policy</h1>
    <div className="bg-white p-8 border rounded shadow-sm">
      <p>Policy content for {type} is currently available in the institutional handbook. For direct inquiries, please contact the Office of Academic Affairs.</p>
    </div>
  </div>
);

// --- Layout ---

const Layout = ({ children, route, setRoute }: { children?: React.ReactNode, route: string, setRoute: (r: string) => void }) => (
  <div className="min-h-screen flex flex-col font-sans text-zinc-800 bg-zinc-50">
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => setRoute('/')} className="flex items-center gap-3">
           <MawilLogo className="w-10 h-10" />
           <span className="font-serif font-bold text-xl text-zinc-900">Maw'il</span>
        </button>
        <nav className="hidden md:flex gap-1">
          {['Home', 'About', 'Programs', 'Admissions', 'Contact'].map(l => (
            <NavLink key={l} to={l === 'Home' ? '/' : `/${l.toLowerCase()}`} label={l} current={route} setRoute={setRoute} />
          ))}
        </nav>
        <button onClick={() => setRoute('/admissions')} className="bg-primary-900 text-white px-4 py-2 rounded text-sm font-medium">Apply</button>
      </div>
    </header>
    <main className="flex-grow">{children}</main>
    <Footer setRoute={setRoute} />
    <WebsiteStatus />
    <MawilAssistant />
  </div>
);

const App = () => {
  const [route, setRoute] = useState('/');
  const renderPage = () => {
    if (route.startsWith('/programs/')) return <ProgramDetail id={route.split('/')[2]} />;
    if (route.startsWith('/policies/')) return <PolicyDetail type={route.split('/')[2]} />;
    switch (route) {
      case '/': return <Home setRoute={setRoute} />;
      case '/about': return <About />;
      case '/governance': return <Governance />;
      case '/academic-model': return <AcademicModel />;
      case '/programs': return <Programs setRoute={setRoute} />;
      case '/admissions': return <Admissions />;
      case '/policies': return <Policies setRoute={setRoute} />;
      case '/staff': return <Staff />;
      case '/contact': return <Contact />;
      default: return <Home setRoute={setRoute} />;
    }
  };
  return <Layout route={route} setRoute={setRoute}>{renderPage()}</Layout>;
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);