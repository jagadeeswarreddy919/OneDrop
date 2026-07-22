import emailjs from '@emailjs/browser';

export const EMAILJS_SERVICE_ID = 'service_u0cgesu';
export const EMAILJS_TEMPLATE_ID = 'template_r46hqhf';
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

/**
 * Send Welcome Greeting Email to newly registered user via EmailJS
 * @param {Object} params - { to_name, to_email, user_role, reward_points }
 */
export const sendWelcomeEmail = async (params) => {
  try {
    const templateParams = {
      to_name: params.to_name || 'Lifesaver',
      to_email: params.to_email || '',
      user_email: params.to_email || '',
      user_role: params.user_role || 'Donor',
      reward_points: params.reward_points || 50,
      message: `Welcome to ONEDROP, ${params.to_name || 'Lifesaver'}! Thank you for joining as a ${params.user_role || 'Donor'}. Your welcome reward of 50 points has been credited to your account. Together, we bridge lives through blood coordinates.`,
      subject: 'Welcome to ONEDROP! 🩸'
    };

    console.log('[EmailJS] Sending welcome greeting email to:', params.to_email);

    // 1. Try sending via EmailJS Browser SDK
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' ? EMAILJS_PUBLIC_KEY : undefined
    );

    console.log('[EmailJS] Welcome greeting email delivered successfully:', response.status, response.text);
    return { success: true, response };
  } catch (error) {
    console.warn('[EmailJS SDK Notice] Standard SDK send failed, trying HTTP gateway fallback:', error?.text || error?.message || error);

    // 2. Direct HTTP API Fallback to EmailJS API endpoint
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' ? EMAILJS_PUBLIC_KEY : undefined,
          template_params: {
            to_name: params.to_name || 'Lifesaver',
            to_email: params.to_email || '',
            user_email: params.to_email || '',
            user_role: params.user_role || 'Donor',
            reward_points: params.reward_points || 50,
            message: `Welcome to ONEDROP, ${params.to_name || 'Lifesaver'}! Thank you for joining as a ${params.user_role || 'Donor'}. Your welcome reward of 50 points has been credited.`
          }
        })
      });

      if (res.ok) {
        console.log('[EmailJS Gateway] Welcome greeting email delivered via API gateway fallback.');
        return { success: true };
      }
    } catch (fallbackErr) {
      console.error('[EmailJS Gateway Error]:', fallbackErr.message);
    }

    return { success: false, error: error?.message || error };
  }
};
