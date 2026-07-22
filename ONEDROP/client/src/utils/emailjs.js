import emailjs from '@emailjs/browser';

export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_u0cgesu';
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_fbkwwbo';
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

/**
 * Send Blood Request Alert email to a matched donor via EmailJS (template_fbkwwbo)
 * @param {Object} params - { to_name, to_email, blood_group, patient_name, hospital_name, units_required, city, contact_phone }
 */
export const sendBloodRequestAlertEmail = async (params) => {
  try {
    const templateParams = {
      to_name: params.to_name || 'Lifesaver',
      to_email: params.to_email || '',
      user_email: params.to_email || '',
      blood_group: params.blood_group || 'Urgent',
      patient_name: params.patient_name || 'Patient',
      hospital_name: params.hospital_name || 'Hospital',
      units_required: params.units_required || 1,
      city: params.city || '',
      contact_phone: params.contact_phone || '',
      message: `🚨 URGENT BLOOD REQUEST ALERT! Patient ${params.patient_name || 'in need'} urgently requires ${params.units_required || 1} unit(s) of ${params.blood_group || ''} blood at ${params.hospital_name || 'a nearby hospital'}${params.city ? ' in ' + params.city : ''}. Contact: ${params.contact_phone || 'ONEDROP App'}. Please open your ONEDROP app to respond!`,
      subject: `🚨 Urgent ${params.blood_group || 'Blood'} Request Alert - ONEDROP`
    };

    console.log('[EmailJS] Sending Blood Request Alert email to:', params.to_email);

    // 1. Try sending via EmailJS Browser SDK
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' ? EMAILJS_PUBLIC_KEY : undefined
    );

    console.log('[EmailJS] Blood Request Alert delivered to:', params.to_email);
    return { success: true, response };
  } catch (error) {
    console.warn('[EmailJS SDK Notice] Alert send failed via SDK, trying API gateway fallback:', error?.text || error?.message || error);

    // 2. Direct HTTP API Fallback
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' ? EMAILJS_PUBLIC_KEY : undefined,
          template_params: {
            to_name: params.to_name || 'Lifesaver',
            to_email: params.to_email || '',
            user_email: params.to_email || '',
            blood_group: params.blood_group || 'Urgent',
            patient_name: params.patient_name || 'Patient',
            hospital_name: params.hospital_name || 'Hospital',
            units_required: params.units_required || 1,
            city: params.city || '',
            contact_phone: params.contact_phone || '',
            message: `🚨 URGENT BLOOD REQUEST ALERT! Patient ${params.patient_name || 'in need'} urgently requires ${params.units_required || 1} unit(s) of ${params.blood_group || ''} blood at ${params.hospital_name || 'a nearby hospital'}. Contact: ${params.contact_phone || 'ONEDROP App'}.`
          }
        })
      });

      if (res.ok) {
        console.log('[EmailJS Gateway] Blood Request Alert delivered via API gateway fallback.');
        return { success: true };
      }
    } catch (fallbackErr) {
      console.error('[EmailJS Gateway Error]:', fallbackErr.message);
    }

    return { success: false, error: error?.message || error };
  }
};

