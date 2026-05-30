import React from 'react';

function formatDonationDate(date) {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function buildDonorId(user) {
  const d = user?.lastDonationDate ? new Date(user.lastDonationDate) : new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(2);
  const suffix = (user?._id?.slice(-2) || '01').toUpperCase();
  return `RAKT${dd}${mm}${yy}${suffix}`;
}

function donationsCount(user) {
  const pts = user?.rewardPoints || 0;
  if (pts >= 300) return 3;
  if (pts >= 150) return 2;
  return 1;
}

const RaktsetuLogo = () => (
  <div className="flex flex-col items-center select-none pointer-events-none mb-1">
    <svg viewBox="0 0 100 100" className="h-16 w-16" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoDropGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c1272d" />
          <stop offset="100%" stopColor="#8d1b1f" />
        </linearGradient>
      </defs>
      {/* Droplet */}
      <path 
        d="M50 5 C50 5, 82 42, 82 66 A 32 32 0 0 1 18 66 C 18 42, 50 5, 50 5 Z" 
        fill="url(#logoDropGrad)" 
      />
      {/* White cupping hands */}
      <path 
        d="M 30 70 C 35 84, 65 84, 70 70 C 66 74, 58 76, 50 76 C 42 76, 34 74, 30 70 Z" 
        fill="white" 
      />
      <path 
        d="M 31 70 C 35 60, 42 64, 45 68 M 69 70 C 65 60, 58 64, 55 68" 
        stroke="white" 
        strokeWidth="4" 
        strokeLinecap="round" 
        fill="none" 
      />
      {/* Red Heart cradled in center */}
      <path 
        d="M50 62 C50 62, 45 56, 45 52.5 A 4 4 0 0 1 52.5 49 A 4 4 0 0 1 60 52.5 C60 56, 50 62, 50 62 Z" 
        fill="#c1272d" 
      />
    </svg>
    <span className="text-2xl font-extrabold tracking-[0.12em] text-slate-800 uppercase font-sans -mt-0.5">Raktsetu</span>
    <span className="text-[7.5px] font-bold text-slate-400 tracking-[0.25em] uppercase font-sans -mt-0.5">Bridging Lives, Building Hope</span>
  </div>
);

const PresentedRibbon = () => (
  <div className="relative inline-block my-3 select-none">
    <svg viewBox="0 0 320 36" className="w-[280px] h-9 mx-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Swallowtail Left Shadow fold */}
      <path d="M 15 8 L 30 18 L 15 28 L 35 28 L 35 8 Z" fill="#8d1b1f" />
      {/* Swallowtail Right Shadow fold */}
      <path d="M 305 8 L 290 18 L 305 28 L 285 28 L 285 8 Z" fill="#8d1b1f" />
      {/* Ribbon Body */}
      <rect x="30" y="4" width="260" height="24" fill="#c1272d" />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] z-10 -mt-1 shadow-sm font-sans">
      PROUDLY PRESENTED TO
    </span>
  </div>
);

const CornerDecorator = ({ className, style }) => (
  <svg 
    className={`absolute w-12 h-12 text-[#c1272d]/80 pointer-events-none z-20 ${className || ''}`} 
    style={style} 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M 5 95 L 5 5 L 95 5" />
    <path d="M 12 95 L 12 12 L 95 12" strokeWidth="0.75" opacity="0.7" />
    {/* Swirl flourishes inside the angle */}
    <path d="M 5 5 C 15 15, 20 30, 15 40 C 10 48, 0 45, 5 35 C 10 25, 25 10, 35 5" strokeWidth="1.25" />
    <circle cx="22" cy="22" r="2.5" fill="currentColor" />
  </svg>
);

const DevagudiSignature = () => (
  <svg viewBox="0 0 120 40" className="h-10 mx-auto my-1 text-slate-700 fill-none stroke-current select-none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 25 C25 20, 30 5, 22 5 C15 5, 12 25, 28 25 C44 25, 52 5, 45 5 C38 5, 30 30, 50 25 C70 20, 80 10, 75 10 C70 10, 65 30, 85 25 C105 20, 110 15, 105 15" />
    <path d="M25 22 C45 22, 70 20, 95 20" strokeWidth="1" opacity="0.8" />
  </svg>
);

const PatnamSignature = () => (
  <svg viewBox="0 0 120 40" className="h-10 mx-auto my-1 text-slate-700 fill-none stroke-current select-none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 12 C25 15, 25 32, 22 32 C19 32, 17 8, 30 18 C43 28, 55 12, 50 12 C45 12, 40 32, 58 28 C76 24, 85 15, 80 15 C75 15, 70 30, 95 24 C110 20, 115 15, 110 15" />
    <path d="M38 22 C58 22, 80 20, 100 20" strokeWidth="1" opacity="0.8" />
  </svg>
);

const RedHeartbeatDivider = () => (
  <div className="flex flex-col items-center mb-2 select-none">
    <svg viewBox="0 0 140 40" className="h-8 w-24 text-[#c1272d]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Left pulse wave */}
      <path d="M 10 20 H 45 L 50 8 L 55 32 L 60 14 L 64 25 L 68 20 H 70" />
      {/* Heart shape centered */}
      <path d="M70 23 C70 23, 65 18, 65 15 A 3 3 0 0 1 70 12 A 3 3 0 0 1 75 15 C75 18, 70 23, 70 23 Z" fill="currentColor" stroke="none" />
      {/* Right pulse wave */}
      <path d="M 72 20 H 74 L 78 8 L 83 32 L 88 14 L 92 25 L 96 20 H 130" />
    </svg>
  </div>
);

const AppreciationCertificate = ({ user }) => {
  const donorId = buildDonorId(user);
  const donationDate = formatDonationDate(user?.lastDonationDate);
  const totalDonations = donationsCount(user);

  return (
    <div
      className="print-certificate-area relative w-full max-w-[820px] mx-auto bg-white text-[#1e293b] overflow-hidden min-h-[580px] shadow-2xl rounded-2xl border border-slate-200/50"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(193,39,45,0.012) 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Curved organic swooshes on top-left and bottom-right corners */}
      {/* Top-Left Swoosh */}
      <svg className="absolute -top-1 -left-1 w-48 h-48 pointer-events-none z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 L 140 0 C 110 50, 50 110, 0 140 Z" fill="#c1272d" />
        <path d="M 0 0 L 110 0 C 85 40, 40 85, 0 110 Z" fill="#8d1b1f" opacity="0.9" />
        <path d="M 0 0 L 70 0 C 50 25, 25 50, 0 70 Z" fill="#e11d48" opacity="0.7" />
      </svg>
      {/* Bottom-Right Swoosh */}
      <svg className="absolute -bottom-1 -right-1 w-48 h-48 pointer-events-none z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 200 200 L 60 200 C 90 150, 150 90, 200 60 Z" fill="#c1272d" />
        <path d="M 200 200 L 90 200 C 115 160, 160 115, 200 90 Z" fill="#8d1b1f" opacity="0.9" />
        <path d="M 200 200 L 130 200 C 150 175, 175 150, 200 130 Z" fill="#e11d48" opacity="0.7" />
      </svg>

      {/* Faint Background Watermark Droplets */}
      <div className="absolute top-[38%] left-10 opacity-[0.035] pointer-events-none z-0 select-none">
        <svg viewBox="0 0 100 100" className="w-32 h-32" fill="#c1272d">
          <path d="M50 5 C50 5, 82 42, 82 66 A 32 32 0 0 1 18 66 C 18 42, 50 5, 50 5 Z" />
        </svg>
      </div>
      <div className="absolute top-[38%] right-10 opacity-[0.035] pointer-events-none z-0 select-none">
        <svg viewBox="0 0 100 100" className="w-32 h-32" fill="#c1272d">
          <path d="M50 5 C50 5, 82 42, 82 66 A 32 32 0 0 1 18 66 C 18 42, 50 5, 50 5 Z" />
        </svg>
      </div>

      {/* Elegant Classical Double Frame Borders */}
      <div className="absolute border border-[#c1272d]/50 pointer-events-none z-10" style={{ top: '16px', left: '16px', right: '16px', bottom: '16px' }} />
      <div className="absolute border-2 border-[#c1272d]/25 pointer-events-none z-10" style={{ top: '22px', left: '22px', right: '22px', bottom: '22px' }} />
      
      {/* Elegant Corner Decorative flourishes */}
      <CornerDecorator style={{ top: '22px', left: '22px' }} />
      <CornerDecorator style={{ top: '22px', right: '22px' }} className="transform rotate-90" />
      <CornerDecorator style={{ bottom: '22px', left: '22px' }} className="transform -rotate-90" />
      <CornerDecorator style={{ bottom: '22px', right: '22px' }} className="transform rotate-180" />

      {/* Content Area */}
      <div className="relative z-10 px-8 py-12 md:px-12 md:py-14 text-center">
        
        {/* Header Section */}
        <div className="mb-4 pt-4">
          <RaktsetuLogo />
          
          {/* flanked by long horizontal lines */}
          <div className="flex items-center justify-center gap-4 mt-6 select-none">
            <span className="h-[1.5px] w-12 bg-gradient-to-r from-transparent to-[#c1272d]/70" />
            <h1
              className="text-4xl md:text-5xl font-black text-[#c1272d] tracking-[0.2em] uppercase leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Certificate
            </h1>
            <span className="h-[1.5px] w-12 bg-gradient-to-l from-transparent to-[#c1272d]/70" />
          </div>

          <p className="text-xs md:text-sm font-bold tracking-[0.25em] text-slate-500 uppercase mt-2 font-sans">
            Of Appreciation
          </p>

          {/* —— ♦ —— Red Dot/Diamond Divider */}
          <div className="flex items-center justify-center gap-3 mt-3 select-none">
            <span className="h-[1.25px] w-16 bg-gradient-to-r from-transparent to-[#c1272d]/60" />
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-[#c1272d] stroke-current fill-current">
              <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
            </svg>
            <span className="h-[1.25px] w-16 bg-gradient-to-l from-transparent to-[#c1272d]/60" />
          </div>
        </div>

        {/* Presented to Ribbon block */}
        <PresentedRibbon />

        {/* Recipient Cursive Name */}
        <h1
          className="text-5xl md:text-6xl text-[#c1272d] mt-2 mb-1 leading-none select-text"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          {user?.fullName || 'Valued Donor'}
        </h1>

        {/* Elegant hollow red diamond line divider below name */}
        <div className="flex items-center justify-center gap-3 my-3.5 select-none">
          <span className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#c1272d]/50" />
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#c1272d] stroke-current fill-none" strokeWidth="2">
            <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
          </svg>
          <span className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#c1272d]/50" />
        </div>

        {/* Statement Body Text */}
        <p className="max-w-xl mx-auto text-sm md:text-[15px] text-slate-600 leading-relaxed font-serif px-2 mt-4">
          In sincere appreciation of your generous blood donation and{' '}
          <span className="text-[#c1272d] font-bold">selfless contribution</span> towards
          saving lives. Your act of kindness brings hope and makes a real difference in the lives
          of many.
        </p>

        {/* Slogan Statement with flanking lines */}
        <div className="flex items-center justify-center gap-4 mt-5 select-none font-sans text-xs font-black uppercase tracking-widest text-[#c1272d]">
          <span className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[#c1272d]" />
          <span>YOU DONATE BLOOD, YOU SAVE LIVES</span>
          <span className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[#c1272d]" />
        </div>

        {/* Symmetrical 4-Column Metrics Row */}
        <div className="grid grid-cols-4 gap-1 mt-8 max-w-2xl mx-auto items-center">
          
          {/* Col 1: Blood Group */}
          <div className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 100 100" className="w-8.5 h-8.5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="dropMetricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff4d4d" />
                  <stop offset="100%" stopColor="#c1272d" />
                </linearGradient>
              </defs>
              <path d="M50 12 C50 12, 78 48, 78 70 A 28 28 0 0 1 22 70 C 22 48, 50 12, 50 12 Z" fill="url(#dropMetricGrad)" />
            </svg>
            <p className="text-[7.5px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">Blood Group</p>
            <p className="text-sm font-black text-[#c1272d]">{user?.bloodGroup || 'O+'}</p>
          </div>

          {/* Col 2: Donation Date */}
          <div className="flex flex-col items-center gap-1 border-l border-slate-200/80">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#c1272d]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            <p className="text-[7.5px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">Donation Date</p>
            <p className="text-[11px] md:text-xs font-black text-[#c1272d] leading-none mt-0.5">{donationDate}</p>
          </div>

          {/* Col 3: Donations Made (Heart Cluster Icon) */}
          <div className="flex flex-col items-center gap-1 border-l border-slate-200/80">
            <svg viewBox="0 0 100 100" className="w-8.5 h-8.5 text-[#c1272d]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              {/* Central Heart */}
              <path d="M 50 64 C 50 64, 40 52, 40 44 A 8 8 0 0 1 50 36 A 8 8 0 0 1 60 44 C 60 52, 50 64, 50 64 Z" />
              {/* Left Heart */}
              <path d="M 34 58 C 34 58, 26 49, 26 42 A 6 6 0 0 1 34 36 A 6 6 0 0 1 42 42 C 42 49, 34 58, 34 58 Z" opacity="0.75" />
              {/* Right Heart */}
              <path d="M 66 58 C 66 58, 58 49, 58 42 A 6 6 0 0 1 66 36 A 6 6 0 0 1 74 42 C 74 49, 66 58, 66 58 Z" opacity="0.75" />
            </svg>
            <p className="text-[7.5px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">Donations Made</p>
            <p className="text-sm font-black text-[#c1272d]">{totalDonations}</p>
          </div>

          {/* Col 4: Donor ID (ID Card Icon) */}
          <div className="flex flex-col items-center gap-1 border-l border-slate-200/80">
            <svg viewBox="0 0 24 24" className="w-8.5 h-8.5 text-[#c1272d]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
              {/* Photo Box */}
              <rect x="6" y="8" width="5" height="5" strokeWidth="1.5" />
              {/* Card lines */}
              <line x1="13" y1="9" x2="18" y2="9" />
              <line x1="13" y1="13" x2="18" y2="13" />
              {/* Small Heart in top-right */}
              <path d="M 17 6.5 C 17 6.5, 16 5, 16 4 A 1 1 0 0 1 17 3 A 1 1 0 0 1 18 4 C 18 5, 17 6.5, 17 6.5 Z" fill="currentColor" stroke="none" />
            </svg>
            <p className="text-[7.5px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">Donor ID</p>
            <p className="text-[9.5px] md:text-[10px] font-black text-[#c1272d] leading-none mt-0.5">{donorId}</p>
          </div>

        </div>

        {/* Signatures Section */}
        <div className="flex justify-between items-end max-w-lg mx-auto mt-10 px-4">
          
          {/* Left Signee */}
          <div className="text-center">
            <DevagudiSignature />
            <div className="w-28 border-t border-slate-300 mx-auto" />
            <p className="text-[10px] font-bold text-slate-800 mt-1.5">Devagudi Jagadeeswar Reddy</p>
            <p className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-widest">Founder, RAKTSETU</p>
          </div>

          {/* Center Heartbeat-Heart divider */}
          <RedHeartbeatDivider />

          {/* Right Signee */}
          <div className="text-center">
            <PatnamSignature />
            <div className="w-28 border-t border-slate-300 mx-auto" />
            <p className="text-[10px] font-bold text-slate-800 mt-1.5">Patnam Chinmaya Nanda</p>
            <p className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-widest">Co-Founder, RAKTSETU</p>
          </div>

        </div>

        {/* Footer Quote */}
        <p className="text-[10px] text-slate-400 mt-6 italic font-serif select-none">
          Thank you for being a hero. Your blood gives someone a second chance at life.
        </p>

      </div>
    </div>
  );
};

export default AppreciationCertificate;
