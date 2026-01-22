import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Shield, BookOpen, Users, FileText, Landmark, Phone, 
  MapPin, Clock, Mail, ChevronRight, AlertTriangle, 
  CheckCircle, XCircle, Globe, GraduationCap, Scale, Lock,
  Heart, Info
} from 'lucide-react';

// --- INSTITUTIONAL CONFIGURATION (EDIT THIS SECTION FOR COMPLIANCE) ---
// Google Workspace for Education requires accurate physical presence data.

const INSTITUTION = {
  name: "Maw'il (موئل)",
  subtitle: "Institute",
  // IMPORTANT: Google Verification checks this against Maps. Use your real office address.
  address: {
    line1: "King Abdullah Road",
    line2: "Al Mohammadiyah District",
    city: "Riyadh",
    postal: "12363",
    country: "Saudi Arabia"
  },
  // IMPORTANT: Email domain must match the website domain for verification.
  email: "info@mawil.org",
  // IMPORTANT: Add your Ministry of Education or Non-Profit License number here.
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

// --- Data Placeholders (Strict Compliance: Zoology/Conservation Track) ---

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
  // Governance / Admin
  { id: 'founder', name: 'Dr. Yazan Mohammad Aref', role: 'Founder & Website Manager', department: 'Administration / Tech', credentials: 'PhD in Zoology', email: 'yazanaref@mawil.org' },
  
  // Operations
  { id: 'ops-1', name: 'Mohammad Nour Issa', role: 'Admin Assistant', department: 'Operations & Administration', credentials: 'Staff', email: 'mohammad@mawil.org' },
  { id: 'ops-2', name: 'Touleen Saidi', role: 'Admin Assistant', department: 'Operations & Administration', credentials: 'Staff', email: 'touleen@mawil.org' },
  { id: 'ops-3', name: 'Mareen Lamfon', role: 'Volunteers Coordinator', department: 'Operations & Administration', credentials: 'Staff', email: 'mareen@mawil.org' },

  // Community & Outreach
  { id: 'comm-1', name: 'Mohsen Alkhowildi', role: 'WhatsApp Community Manager', department: 'Community & Outreach', credentials: 'Staff', email: 'mohsen@mawil.org' },
  { id: 'comm-2', name: 'Alice Dawood Almohammed', role: 'School Outreach Lead', department: 'Community & Outreach', credentials: 'Staff', email: 'alice@mawil.org' },
  { id: 'comm-3', name: 'Layan Amin', role: 'School Outreach Lead', department: 'Community & Outreach', credentials: 'Staff', email: 'layan@mawil.org' },

  // Webinars & Events
  { id: 'web-1', name: 'Elaf Khalil', role: 'Event Coordinator', department: 'Webinars & Events', credentials: 'Staff', email: 'elaf@mawil.org' },
  { id: 'web-2', name: 'Zainab Mohamed Hazary', role: 'Event Coordinator', department: 'Webinars & Events', credentials: 'Staff', email: 'zainab@mawil.org' },
  { id: 'web-3', name: 'Hana Selim', role: 'Webinar Host/Moderator', department: 'Webinars & Events', credentials: 'Staff', email: 'hana@mawil.org' },
  { id: 'web-4', name: 'Haale Ayesha Khan', role: 'Webinar Host/Moderator', department: 'Webinars & Events', credentials: 'Staff', email: 'haale@mawil.org' },

  // Content & Education
  { id: 'cont-1', name: 'Sarah Algodairy', role: 'Content Coordinator', department: 'Content & Education', credentials: 'Staff', email: 'sarahalgodairy@mawil.org' },
  { id: 'cont-2', name: 'Aseel Hassan Alsuhabi', role: 'Wildlife Research Lead', department: 'Content & Education', credentials: 'Researcher', email: 'aseel@mawil.org' },
  { id: 'cont-3', name: 'Malak Hani', role: 'Wildlife Research Lead', department: 'Content & Education', credentials: 'Researcher', email: 'malak@mawil.org' },
  { id: 'cont-4', name: 'Fatimah Hejji', role: 'Marine Life Research Lead', department: 'Content & Education', credentials: 'Researcher', email: 'fatimah@mawil.org' },

  // Media & Creative
  { id: 'med-1', name: 'Sarah Abdullah Arrfdy', role: 'Graphic Designer', department: 'Media & Creative', credentials: 'Creative', email: 'sarah@mawil.org' },
  { id: 'med-2', name: 'Aljoory Al Taha', role: 'Graphic Designer', department: 'Media & Creative', credentials: 'Creative', email: 'aljoory@mawil.org' },
  { id: 'med-3', name: 'Noor Talal Bokhamsin', role: 'Digital Artist', department: 'Media & Creative', credentials: 'Creative', email: 'noor@mawil.org' },
  { id: 'med-4', name: 'Najd Sami Alkhashan', role: 'Digital Artist', department: 'Media & Creative', credentials: 'Creative', email: 'najd@mawil.org' },
  { id: 'med-5', name: 'Mohammed Sameer Alqassimi', role: 'Content Creator', department: 'Media & Creative', credentials: 'Creative', email: 'mohammed@mawil.org' },
  { id: 'med-6', name: 'Jana Mohammed Al-Yami', role: 'Assistant Content Creator', department: 'Media & Creative', credentials: 'Creative', email: 'janaal-yami@mawil.org' },
  { id: 'med-7', name: 'Leen Hussam Rafik Haj Bakri', role: 'Video Editor', department: 'Media & Creative', credentials: 'Creative', email: 'leen@mawil.org' },

  // Social Media
  { id: 'soc-1', name: 'Jana Mohamed Tameesh', role: 'Social Media Manager', department: 'Social Media & Comms', credentials: 'Staff', email: 'jana@mawil.org' },
  { id: 'soc-2', name: 'Lujain Al-anazi', role: 'Social Media Assistant', department: 'Social Media & Comms', credentials: 'Staff', email: 'lujain@mawil.org' },
  { id: 'soc-3', name: 'Raya Ali', role: 'Social Media Assistant', department: 'Social Media & Comms', credentials: 'Staff', email: 'raya@mawil.org' },
  { id: 'soc-4', name: 'Maha Khan', role: 'Copywriter', department: 'Social Media & Comms', credentials: 'Staff', email: 'maha@mawil.org' },

  // Tech
  { id: 'tech-1', name: 'AbdulHakim Khan', role: 'Website Technician', department: 'Website & Development', credentials: 'Tech', email: 'abdulhakim@mawil.org' },
  { id: 'tech-2', name: 'Omer Hijazi', role: 'Website Technician & Game Designer', department: 'Website & Development', credentials: 'Tech', email: 'omer@mawil.org' },

  // Partnerships
  { id: 'part-1', name: 'Tulay Ayman Al-Maghrabi', role: 'Public Relations Manager', department: 'Partnerships', credentials: 'Manager', email: 'tulay@mawil.org' },
  { id: 'part-2', name: 'Mazen Abdulaziz Alghamdi', role: 'Outreach Lead', department: 'Partnerships', credentials: 'Lead', email: 'mazen@mawil.org' },
  { id: 'part-3', name: 'Aleezay Arsalan', role: 'Outreach Lead', department: 'Partnerships', credentials: 'Lead', email: 'aleezay@mawil.org' },
];

const POLICY_CONTENT: Record<string, { title: string; content: React.ReactNode }> = {
  'academic-integrity': {
    title: 'Academic Integrity Policy',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-2">1. Principle of Honest Scholarship</h3>
          <p>Maw'il Institute is dedicated to the highest standards of academic honesty. All members of the community are expected to create and present their own work and to attribute all sources used in intellectual production.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">2. Definitions of Academic Misconduct</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Plagiarism:</strong> Representing another's work, words, or ideas as one's own without proper attribution.</li>
            <li><strong>Cheating:</strong> Using unauthorized materials during examinations or assessments.</li>
            <li><strong>Fabrication:</strong> Falsifying data, citations, or information.</li>
            <li><strong>Unauthorized Collaboration:</strong> Working with others on assignments designated as individual work.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">3. Disciplinary Procedures</h3>
          <p>Violations are reviewed by the Academic Committee. Sanctions may range from:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Failling grade for the assignment (Zero).</li>
            <li>Failling grade for the course.</li>
            <li>Academic Probation.</li>
            <li>Expulsion from the Institute for repeated offenses.</li>
          </ul>
        </section>
      </div>
    )
  },
  'assessment': {
    title: 'Assessment & Grading Policy',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-2">1. Grading System</h3>
          <p>Student performance is evaluated based on the following scale:</p>
          <div className="overflow-x-auto mt-2 border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="px-4 py-2 text-left">Grade</th>
                  <th className="px-4 py-2 text-left">Percentage</th>
                  <th className="px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t"><td className="px-4 py-2 font-bold">A</td><td className="px-4 py-2">90-100%</td><td className="px-4 py-2">Excellent</td></tr>
                <tr className="border-t"><td className="px-4 py-2 font-bold">B</td><td className="px-4 py-2">80-89%</td><td className="px-4 py-2">Good</td></tr>
                <tr className="border-t"><td className="px-4 py-2 font-bold">C</td><td className="px-4 py-2">70-79%</td><td className="px-4 py-2">Satisfactory</td></tr>
                <tr className="border-t"><td className="px-4 py-2 font-bold">D</td><td className="px-4 py-2">60-69%</td><td className="px-4 py-2">Passing</td></tr>
                <tr className="border-t"><td className="px-4 py-2 font-bold">F</td><td className="px-4 py-2">0-59%</td><td className="px-4 py-2">Fail</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">2. Submission of Work</h3>
          <p>Assignments must be submitted via the Learning Management System (LMS) by the stated deadline. Late submissions are subject to a 10% grade reduction per day, up to three days. Submissions later than three days are not accepted without a documented medical or emergency excuse.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">3. Appeals</h3>
          <p>Students may appeal a grade within 7 days of its posting by submitting a written request to the Registrar, detailing the grounds for the appeal.</p>
        </section>
      </div>
    )
  },
  'attendance': {
    title: 'Attendance & Participation',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-2">1. Attendance Requirements</h3>
          <p>Regular attendance is a core academic requirement. Students are expected to attend all scheduled classes, seminars, and laboratory sessions.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">2. Minimum Attendance Threshold</h3>
          <p>To receive credit for a course, a student must maintain a minimum attendance rate of <strong>80%</strong>. Students falling below this threshold will receive an automatic 'F' grade, barring exceptional circumstances approved by the Director of Academic Affairs.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">3. Excused Absences</h3>
          <p>Absences may be excused for medical emergencies, compassionate leave, or official institutional representation. Documentation (e.g., medical certificate) must be submitted to the Registrar within 48 hours of return.</p>
        </section>
      </div>
    )
  },
  'privacy': {
    title: 'Student Privacy & Data Protection',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-2">1. Commitment to Privacy</h3>
          <p>Maw'il is committed to protecting the privacy of student records. We adhere to international best practices regarding data minimization and security.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">2. Data Collection & Use</h3>
          <p>We collect personal information solely for educational administration, including enrollment, assessment, and academic record-keeping. We do not sell, trade, or rent student personal identification information to third parties.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">3. Access to Records</h3>
          <p>Students have the right to inspect and review their education records maintained by the school. Requests should be submitted in writing to the Registrar's office and will be fulfilled within 30 days.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">4. Directory Information</h3>
          <p>The institution may disclose "directory information" (name, dates of attendance, degrees conferred) without consent, unless a student formally requests a hold on such release.</p>
        </section>
      </div>
    )
  },
  'terms': {
    title: 'Terms of Use & Acceptable Use Policy',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-2">1. Educational Purpose</h3>
          <p>Institutional accounts (email, LMS access) and technology resources are provided exclusively for educational and administrative purposes supporting the mission of Maw'il.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">2. Prohibited Activities</h3>
          <p>Users may not use institutional resources for:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Commercial activity or personal financial gain.</li>
            <li>Harassment, bullying, or hate speech.</li>
            <li>Accessing or distributing illegal or obscene material.</li>
            <li>Compromising the security of the network or other users' accounts.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">3. Account Termination</h3>
          <p>The institution reserves the right to suspend or terminate access to technology resources for violations of this policy or upon the conclusion of enrollment/employment.</p>
        </section>
      </div>
    )
  },
  'grievance': {
    title: 'Grievance & Appeals Procedures',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-2">1. Purpose</h3>
          <p>Maw'il provides a fair and transparent process for students to seek resolution of academic or administrative disputes.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">2. Informal Resolution</h3>
          <p>Students are encouraged to first attempt to resolve the issue directly with the faculty member or staff person involved through constructive dialogue.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">3. Formal Complaint</h3>
          <p>If informal resolution fails, a student may file a formal written complaint to the Office of Academic Affairs. The complaint must detail the nature of the grievance, the evidence, and the desired outcome.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">4. Review Committee</h3>
          <p>A Grievance Committee, typically composed of one administrator and two faculty members, will review the complaint, conduct necessary interviews, and issue a written decision within 15 business days. The decision of the Committee is final.</p>
        </section>
      </div>
    )
  },
  'nondiscrimination': {
    title: 'Non-Discrimination Policy',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-2">1. Policy Statement</h3>
          <p>Maw'il Institute admits students of any race, color, national and ethnic origin to all the rights, privileges, programs, and activities generally accorded or made available to students at the school. It does not discriminate on the basis of race, color, national and ethnic origin in administration of its educational policies, admissions policies, scholarship and loan programs, and athletic and other school-administered programs.</p>
        </section>
        <section>
          <h3 className="text-xl font-bold mb-2">2. Inclusive Environment</h3>
          <p>We are dedicated to creating a supportive and inclusive scholarly community where diverse perspectives are valued as essential to the pursuit of knowledge.</p>
        </section>
      </div>
    )
  }
};

// --- Components ---

const MawilLogo = ({ className }: { className?: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    // Fallback SVG (Beige/Green Emblem with 'M') for when image is missing
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

const NavLink = ({ to, label, current, setRoute }: { to: string, label: string, current: string, setRoute: (r: string) => void }) => (
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
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-primary-800 flex flex-wrap gap-6 justify-center text-xs text-zinc-500">
        <button onClick={() => setRoute('/policies/nondiscrimination')}>Non-Discrimination Policy</button>
        <button onClick={() => setRoute('/policies/privacy')}>Privacy Policy</button>
        <button onClick={() => setRoute('/policies/terms')}>Terms of Service</button>
        <button onClick={() => setRoute('/policies/grievance')}>Grievance Procedures</button>
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
              You are viewing the official Maw’il Institute website. Some sections are currently being updated as new institutional information is published. For official enquiries, contact info@mawil.org
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
        {INSTITUTION.name} is an independent non-profit educational institution established to provide structured learning opportunities in Zoology and Environmental Sciences. We are committed to academic integrity, institutional transparency, and the educational advancement of our student body.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4">Institutional Mandate</h3>
      <p>Our mandate is to:</p>
      <ul className="list-disc pl-6 space-y-2 mb-8">
        <li>Provide accessible, high-quality instruction through structured academic programs in biological sciences.</li>
        <li>Foster a scholarly environment grounded in critical inquiry, observation, and ethical responsibility.</li>
        <li>Maintain rigorous assessment standards to ensure student competency in scientific methods.</li>
        <li>Operate with full transparency in governance and administration as a public-benefit entity.</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-4">History & Founding</h3>
      <p className="text-zinc-600">
        Established in {INSTITUTION.foundedYear} by Dr. Yazan Mohammad Aref, a distinguished PhD holder in Zoology, {INSTITUTION.name} was founded with a vision to cultivate deep expertise in the biological sciences. Dr. Aref's leadership continues to guide the institution toward academic excellence.
      </p>
    </div>
  </div>
);

const Governance = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Governance & Leadership</h1>
    
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-zinc-800 mb-6">Board of Trustees</h2>
      <div className="grid md:grid-cols-1 gap-6">
        <div className="border p-4 rounded bg-white shadow-sm border-l-4 border-l-primary-900">
          <div className="font-bold text-lg">Dr. Yazan Mohammad Aref</div>
          <div className="text-sm text-primary-900 uppercase tracking-wide font-bold">Founder & Chair of the Board</div>
          <p className="text-sm mt-2 text-zinc-600">PhD in Zoology. Established {INSTITUTION.name} in {INSTITUTION.foundedYear} to advance biological and zoological sciences through structured education.</p>
        </div>
      </div>
    </div>

    <div className="mb-12">
      <h2 className="text-2xl font-bold text-zinc-800 mb-6">Organizational Structure</h2>
      <div className="bg-zinc-50 p-8 rounded border border-zinc-200">
        <div className="flex flex-col items-center gap-4">
           <div className="bg-primary-900 text-white px-6 py-3 rounded-lg font-bold shadow-md">Board of Trustees & Founder</div>
           <div className="h-6 w-0.5 bg-zinc-300"></div>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full text-center">
             {[
               'Community & Outreach', 'Webinars & Events',
               'Media & Creative', 'Social Media & Comms', 'Website & Tech', 'Partnerships'
             ].map(dept => (
               <div key={dept} className="bg-white border p-3 rounded text-xs font-bold text-zinc-700 shadow-sm">
                 {dept}
               </div>
             ))}
           </div>
        </div>
        <p className="text-xs text-zinc-400 mt-6 text-center italic">Organizational Hierarchy valid as of 2026</p>
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
          {INSTITUTION.name} utilizes a Hybrid delivery model. Courses are structured into modules requiring specific contact hours. Students access learning materials via our secure Learning Management System (LMS) and participate in scheduled field workshops.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-zinc-800 mb-3">Assessment Philosophy</h3>
        <p className="text-zinc-600">
          Student progress is measured through a combination of formative and summative assessments, including written examinations, research papers, and oral presentations. A minimum passing grade of 60% is required for certification.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-zinc-800 mb-3">Academic Calendar</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-100 text-zinc-700 font-bold">
              <tr>
                <th className="p-3 border-b">Term</th>
                <th className="p-3 border-b">Start Date</th>
                <th className="p-3 border-b">End Date</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b">Fall 2026</td>
                <td className="p-3 border-b">September 1, 2026</td>
                <td className="p-3 border-b">December 15, 2026</td>
                <td className="p-3 border-b text-primary-700 font-medium">Enrolling</td>
              </tr>
              <tr>
                <td className="p-3 border-b">Spring 2027</td>
                <td className="p-3 border-b">January 15, 2027</td>
                <td className="p-3 border-b">May 20, 2027</td>
                <td className="p-3 border-b text-primary-700 font-medium">Enrolling</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500 mt-2">* Dates are subject to administrative change.</p>
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

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-zinc-50 p-4 rounded border">
          <div className="text-xs text-zinc-500 uppercase">Duration</div>
          <div className="font-medium">{prog.duration}</div>
        </div>
        <div className="bg-zinc-50 p-4 rounded border">
          <div className="text-xs text-zinc-500 uppercase">Delivery Mode</div>
          <div className="font-medium">{prog.delivery}</div>
        </div>
        <div className="bg-zinc-50 p-4 rounded border">
          <div className="text-xs text-zinc-500 uppercase">Prerequisites</div>
          <div className="font-medium">High School Diploma or Eqv.</div>
        </div>
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

      <h3 className="text-xl font-bold border-b pb-2 mb-4">Learning Outcomes</h3>
      <ul className="list-disc pl-5 space-y-2 mb-8 text-zinc-700">
        {prog.outcomes.map((outcome, i) => (
          <li key={i}>{outcome}</li>
        ))}
      </ul>
    </div>
  );
};

const Admissions = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Admissions & Enrollment</h1>
    
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <div>
        <h3 className="text-xl font-bold mb-4">Entry Requirements</h3>
        <ul className="list-disc pl-5 space-y-2 text-zinc-600 text-sm">
          <li>Completed Application Form</li>
          <li>Valid Government ID</li>
          <li>Previous Academic Transcripts</li>
          <li>Proficiency in language of instruction</li>
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Tuition & Fees</h3>
        <p className="text-zinc-600 text-sm mb-4">
          Tuition structures vary by program. Please refer to the specific program guide or contact the Bursar's office.
        </p>
      </div>
    </div>

    <div className="bg-zinc-50 p-8 rounded border text-center">
      <h3 className="text-xl font-bold mb-4">Application Process</h3>
      <div className="flex justify-center gap-8 text-sm mb-6">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-900 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
          <div>Apply Online</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-900 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
          <div>Document Review</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-900 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
          <div>Interview</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-900 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">4</div>
          <div>Enrollment</div>
        </div>
      </div>
      <button className="bg-primary-900 text-white px-8 py-3 rounded font-medium hover:bg-primary-800 transition-colors">Begin Application</button>
    </div>
  </div>
);

const Policies = ({ setRoute }: { setRoute: (r: string) => void }) => {
  const policies = [
    { name: 'Academic Integrity', path: '/policies/academic-integrity' },
    { name: 'Assessment & Grading', path: '/policies/assessment' },
    { name: 'Attendance & Participation', path: '/policies/attendance' },
    { name: 'Student Privacy (GDPR/FERPA)', path: '/policies/privacy' },
    { name: 'Terms of Use', path: '/policies/terms' },
    { name: 'Grievance & Appeals', path: '/policies/grievance' },
    { name: 'Non-Discrimination', path: '/policies/nondiscrimination' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Institutional Policies</h1>
      <p className="text-zinc-600 mb-8">
        {INSTITUTION.name} is governed by a comprehensive set of policies ensuring fair treatment, academic rigor, and institutional transparency. All students and faculty are required to adhere to these standards.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {policies.map(p => (
          <button key={p.path} onClick={() => setRoute(p.path)} className="flex items-center justify-between p-4 bg-white border rounded hover:border-primary-900 hover:bg-zinc-50 transition-all text-left group">
            <span className="font-medium group-hover:text-primary-900">{p.name}</span>
            <FileText className="w-4 h-4 text-zinc-400 group-hover:text-primary-900" />
          </button>
        ))}
      </div>
    </div>
  );
};

const PolicyDetail = ({ type }: { type: string }) => {
  const policy = POLICY_CONTENT[type];
  
  if (!policy) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-zinc-900">Policy Not Found</h2>
        <p className="text-zinc-600">The requested policy document could not be located.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-serif font-bold text-zinc-900">{policy.title}</h1>
        <p className="text-sm text-zinc-500 mt-2">Last Updated: August 2024 | Authority: Office of Academic Affairs</p>
      </div>
      <div className="prose prose-zinc max-w-none bg-white p-8 border rounded shadow-sm">
        {policy.content}
      </div>
    </div>
  );
};

const Staff = () => {
  const departments = Array.from(new Set(STAFF.map(s => s.department)));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Faculty & Staff Directory</h1>
      <p className="text-zinc-600 mb-12 max-w-3xl">
        Our institution is supported by a dedicated team of administrators, educators, and researchers committed to the advancement of zoological sciences and student success.
      </p>
      
      <div className="space-y-12">
        {departments.map(dept => (
          <div key={dept}>
            <h2 className="text-xl font-bold text-zinc-800 mb-6 border-b border-zinc-200 pb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-900" />
              {dept}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {STAFF.filter(s => s.department === dept).map(member => (
                <div key={member.id} className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-zinc-900 leading-tight mb-1">{member.name}</h3>
                    <div className="text-sm font-medium text-primary-900">{member.role}</div>
                  </div>
                  
                  <div className="space-y-2 text-xs text-zinc-500 border-t border-zinc-100 pt-3">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>{member.credentials}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 shrink-0" />
                      <a href={`mailto:${member.email}`} className="hover:text-primary-900 hover:underline transition-colors truncate">{member.email}</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Contact = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Contact Us</h1>
    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-zinc-900 mb-2">Contact Information</h3>
          <p className="text-zinc-600">Email: {INSTITUTION.email}</p>
        </div>
      </div>
      <div className="bg-zinc-50 p-6 rounded border">
        <h3 className="font-bold text-zinc-900 mb-4">Send an Inquiry</h3>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Name</label>
            <input type="text" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Email</label>
            <input type="email" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Message</label>
            <textarea className="w-full border rounded p-2 h-32"></textarea>
          </div>
          <button className="bg-primary-900 text-white px-6 py-2 rounded text-sm font-medium">Send Message</button>
        </form>
      </div>
    </div>
  </div>
);

// --- Layout & Router ---

const Layout = ({ children, route, setRoute }: { children?: React.ReactNode, route: string, setRoute: (r: string) => void }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-zinc-800 bg-zinc-50">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setRoute('/')} className="flex items-center gap-3">
             <MawilLogo className="w-10 h-10" />
            <div className="flex flex-col items-start leading-none">
              <span className="font-serif font-bold text-xl text-zinc-900 tracking-tight">Maw'il</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">{INSTITUTION.subtitle}</span>
            </div>
          </button>
          
          <nav className="hidden md:flex gap-1">
            <NavLink to="/" label="Home" current={route} setRoute={setRoute} />
            <NavLink to="/about" label="About" current={route} setRoute={setRoute} />
            <NavLink to="/programs" label="Programs" current={route} setRoute={setRoute} />
            <NavLink to="/admissions" label="Admissions" current={route} setRoute={setRoute} />
            <NavLink to="/contact" label="Contact" current={route} setRoute={setRoute} />
          </nav>

          <button onClick={() => setRoute('/admissions')} className="bg-primary-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary-800 transition-colors">
            Apply Now
          </button>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>

      <Footer setRoute={setRoute} />
      <WebsiteStatus />
    </div>
  );
};

const App = () => {
  const [route, setRoute] = useState('/');
  
  // Simple client-side router
  const renderPage = () => {
    // Handle parameterized routes first
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
      case '/contact': return <Contact />;
      case '/staff': return <Staff />;
      default: return <Home setRoute={setRoute} />;
    }
  };

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0,0);
  }, [route]);

  return (
    <Layout route={route} setRoute={setRoute}>
      {renderPage()}
    </Layout>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);