const GREETING_BY_LANG = {
  en: { morning: 'Good Morning', afternoon: 'Good Afternoon', evening: 'Good Evening' },
  hi: { morning: 'सुप्रभात', afternoon: 'नमस्कार', evening: 'शुभ संध्या' },
  gu: { morning: 'સુપ્રભાત', afternoon: 'નમસ્તે', evening: 'શુભ સાંજ' },
  mr: { morning: 'सुप्रभात', afternoon: 'नमस्कार', evening: 'शुभ संध्याकाळ' },
  kn: { morning: 'ಶುಭೋದಯ', afternoon: 'ನಮಸ್ಕಾರ', evening: 'ಶುಭ ಸಂಜೆ' },
  ta: { morning: 'காலை வணக்கம்', afternoon: 'வணக்கம்', evening: 'மாலை வணக்கம்' }
};

export const getTimeBasedGreeting = (lang = 'en') => {
  const hour = Number(
    new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      hour12: false,
    }).format(new Date())
  );
  const bundle = GREETING_BY_LANG[lang] || GREETING_BY_LANG.en;
  if (hour < 12) return bundle.morning;
  if (hour < 17) return bundle.afternoon;
  return bundle.evening;
};

export const buildGreetingMessage = (fullName, lang = 'en') => {
  const greeting = getTimeBasedGreeting(lang);
  const firstName = fullName?.trim().split(/\s+/)[0] || 'Lifesaver';
  return `${greeting}, ${firstName}! Welcome back to ONEDROP.`;
};
