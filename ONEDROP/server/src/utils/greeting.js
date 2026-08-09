const getTimeBasedGreeting = () => {
  const hour = Number(
    new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      hour12: false,
    }).format(new Date())
  );

  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const buildGreetingMessage = (fullName) => {
  const greeting = getTimeBasedGreeting();
  const firstName = fullName?.trim().split(/\s+/)[0] || 'Lifesaver';

  return `${greeting}, ${firstName}! Welcome back to ONEDROP.`;
};

module.exports = {
  getTimeBasedGreeting,
  buildGreetingMessage,
};
