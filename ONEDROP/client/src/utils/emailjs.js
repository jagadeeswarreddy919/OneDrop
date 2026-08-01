import emailjs from '@emailjs/browser';

export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_u0cgesu';
export const EMAILJS_WELCOME_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_WELCOME_TEMPLATE_ID || 'template_r46hqhf';
export const EMAILJS_ALERT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ALERT_TEMPLATE_ID || 'template_fbkwwbo';
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '8UH1zz6oDW4iYsTn4';

export const EMAILJS_FEEDBACK_SERVICE_ID = import.meta.env.VITE_EMAILJS_FEEDBACK_SERVICE_ID || 'service_yzwpm2g';
export const EMAILJS_FEEDBACK_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_FEEDBACK_TEMPLATE_ID || 'template_pf439ua';
export const EMAILJS_FEEDBACK_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_FEEDBACK_PUBLIC_KEY || 'aJGnqjWBX-inDhyUy';

// Initialize EmailJS Browser SDK
try {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    console.log('[EmailJS] Initialized with Public Key:', EMAILJS_PUBLIC_KEY);
  }
} catch (initErr) {
  console.warn('[EmailJS Init Warning]:', initErr);
}

/**
 * Send Welcome Greeting Email to newly registered user via EmailJS (template_r46hqhf)
 * @param {Object} params - { to_name, to_email, user_role, reward_points }
 */
export const sendWelcomeEmail = async (params) => {
  if (!params.to_email) {
    console.warn('[EmailJS] Skipping welcome email: No recipient email provided.');
    return { success: false, error: 'No recipient email' };
  }

  try {
    const templateParams = {
      to_name: params.to_name || 'Lifesaver',
      name: params.to_name || 'Lifesaver',
      to_email: params.to_email,
      user_email: params.to_email,
      email: params.to_email,
      user_role: params.user_role || 'Donor',
      role: params.user_role || 'Donor',
      reward_points: params.reward_points || 50,
      points: params.reward_points || 50,
      from_name: 'ONEDROP Lifesaver Network',
      from_email: 'onedroplifesaver@gmail.com',
      message: `Welcome to ONEDROP, ${params.to_name || 'Lifesaver'}! Thank you for joining as a ${params.user_role || 'Donor'}. Your welcome reward of 50 points has been credited to your account. Together, we bridge lives through blood coordinates.`,
      subject: 'Welcome to ONEDROP! 🩸'
    };

    console.log('[EmailJS] Sending welcome greeting email to:', params.to_email, 'Service:', EMAILJS_SERVICE_ID, 'Welcome Template:', EMAILJS_WELCOME_TEMPLATE_ID);

    // 1. Try sending via EmailJS Browser SDK using Welcome Template (template_r46hqhf)
    if (EMAILJS_PUBLIC_KEY) {
      try {
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_WELCOME_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );
        console.log('[EmailJS SDK] Welcome email delivered successfully via template_r46hqhf:', response.status, response.text);
        return { success: true, response };
      } catch (welcomeErr) {
        console.warn('[EmailJS SDK Notice] Primary welcome template (template_r46hqhf) notice, attempting secondary alert template fallback:', welcomeErr?.text || welcomeErr?.message || welcomeErr);
        // Fallback to EMAILJS_ALERT_TEMPLATE_ID
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_ALERT_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );
        console.log('[EmailJS SDK Fallback] Welcome email delivered via alert template:', response.status, response.text);
        return { success: true, response };
      }
    }

    // 2. Direct HTTP API Fallback
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_WELCOME_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY || undefined,
        template_params: templateParams
      })
    });

    const resText = await res.text();
    if (res.ok) {
      console.log('[EmailJS API Gateway] Welcome email delivered successfully:', resText);
      return { success: true };
    } else {
      console.error(`[EmailJS API Error ${res.status}]:`, resText);
      return { success: false, error: resText };
    }
  } catch (error) {
    console.error('[EmailJS Failure]:', error?.text || error?.message || error);
    return { success: false, error: error?.message || error };
  }
};

/**
 * Send Blood Request Alert email to a matched donor via EmailJS (template_fbkwwbo)
 * @param {Object} params - { to_name, to_email, blood_group, patient_name, hospital_name, units_required, city, contact_phone }
 */
export const sendBloodRequestAlertEmail = async (params) => {
  if (!params.to_email) {
    console.warn('[EmailJS] Skipping Blood Request Alert: Target donor has no email address configured.');
    return { success: false, error: 'Target donor has no email address' };
  }

  try {
    const templateParams = {
      to_name: params.to_name || 'Lifesaver',
      to_email: params.to_email,
      user_email: params.to_email,
      blood_group: params.blood_group || 'Urgent',
      patient_name: params.patient_name || 'Patient',
      hospital_name: params.hospital_name || 'Hospital',
      units_required: params.units_required || 1,
      city: params.city || '',
      contact_phone: params.contact_phone || '',
      from_name: 'ONEDROP Lifesaver Network',
      from_email: 'onedroplifesaver@gmail.com',
      message: `🚨 URGENT BLOOD REQUEST ALERT! Patient ${params.patient_name || 'in need'} urgently requires ${params.units_required || 1} unit(s) of ${params.blood_group || ''} blood at ${params.hospital_name || 'a nearby hospital'}${params.city ? ' in ' + params.city : ''}. Contact: ${params.contact_phone || 'ONEDROP App'}. Please open your ONEDROP app to respond!`,
      subject: `🚨 Urgent ${params.blood_group || 'Blood'} Request Alert - ONEDROP`
    };

    console.log('[EmailJS] Dispatching Blood Request Alert email to:', params.to_email, 'Service:', EMAILJS_SERVICE_ID, 'Alert Template:', EMAILJS_ALERT_TEMPLATE_ID);

    // 1. Try sending via EmailJS SDK if public key is configured
    if (EMAILJS_PUBLIC_KEY) {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_ALERT_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      console.log('[EmailJS SDK] Blood Request Alert delivered successfully:', response.status, response.text);
      return { success: true, response };
    }

    // 2. Direct HTTP API Fallback
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_ALERT_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY || undefined,
        template_params: templateParams
      })
    });

    const resText = await res.text();
    if (res.ok) {
      console.log('[EmailJS API Gateway] Blood Request Alert delivered successfully:', resText);
      return { success: true };
    } else {
      console.error(`[EmailJS API Error ${res.status}]:`, resText);
      return { success: false, error: resText };
    }
  } catch (error) {
    console.error('[EmailJS Alert Failure]:', error?.text || error?.message || error);
    return { success: false, error: error?.message || error };
  }
};

/**
 * Send Contact & Feedback email via EmailJS (service_yzwpm2g / template_pf439ua)
 * @param {Object} params - { user_email, email, from_name, name, message, subject }
 */
export const sendContactFeedbackEmail = async (params) => {
  if (!params.message && !params.feedback_message) {
    console.warn('[EmailJS Feedback] Skipping: Message body is empty.');
    return { success: false, error: 'Empty message' };
  }

  const messageText = params.message || params.feedback_message || '';
  const senderEmail = params.email || params.user_email || 'visitor@onedrop.org';
  const senderName = params.from_name || params.name || senderEmail;

  try {
    const templateParams = {
      from_name: senderName,
      name: senderName,
      to_name: 'ONEDROP Support Team',
      from_email: senderEmail,
      user_email: senderEmail,
      email: senderEmail,
      message: messageText,
      feedback_message: messageText,
      subject: params.subject || 'New Contact & Feedback Submission - ONEDROP'
    };

    console.log('[EmailJS Feedback] Dispatching feedback email using Service:', EMAILJS_FEEDBACK_SERVICE_ID, 'Template:', EMAILJS_FEEDBACK_TEMPLATE_ID);

    // 1. Try sending via EmailJS SDK
    if (EMAILJS_FEEDBACK_PUBLIC_KEY) {
      try {
        const response = await emailjs.send(
          EMAILJS_FEEDBACK_SERVICE_ID,
          EMAILJS_FEEDBACK_TEMPLATE_ID,
          templateParams,
          EMAILJS_FEEDBACK_PUBLIC_KEY
        );
        console.log('[EmailJS Feedback SDK] Delivered successfully:', response.status, response.text);
        return { success: true, response };
      } catch (sdkErr) {
        console.warn('[EmailJS Feedback SDK Warning], fallback to API gateway:', sdkErr?.text || sdkErr?.message || sdkErr);
      }
    }

    // 2. Direct HTTP API Fallback
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_FEEDBACK_SERVICE_ID,
        template_id: EMAILJS_FEEDBACK_TEMPLATE_ID,
        user_id: EMAILJS_FEEDBACK_PUBLIC_KEY,
        template_params: templateParams
      })
    });

    const resText = await res.text();
    if (res.ok) {
      console.log('[EmailJS Feedback API Gateway] Delivered successfully:', resText);
      return { success: true };
    } else {
      console.error(`[EmailJS Feedback API Error ${res.status}]:`, resText);
      return { success: false, error: resText };
    }
  } catch (error) {
    console.error('[EmailJS Feedback Failure]:', error?.text || error?.message || error);
    return { success: false, error: error?.message || error };
  }
};


