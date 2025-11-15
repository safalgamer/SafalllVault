
import React, { useState } from 'react';

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // --- How to integrate EmailJS ---
    // 1. Sign up at https://www.emailjs.com/
    // 2. Create an email service and a template.
    // 3. Find your Service ID, Template ID, and Public Key.
    // 4. Install the EmailJS library: `npm install @emailjs/browser`
    // 5. Uncomment and configure the code below:

    /*
    import emailjs from '@emailjs/browser';

    emailjs.send(
      'YOUR_SERVICE_ID', 
      'YOUR_TEMPLATE_ID', 
      formData, 
      'YOUR_PUBLIC_KEY'
    )
    .then((response) => {
       console.log('SUCCESS!', response.status, response.text);
       setStatus('sent');
       setFormData({ name: '', email: '', message: '' });
    }, (err) => {
       console.log('FAILED...', err);
       setStatus('error');
    });
    */

    // This is a mock submission for demonstration purposes.
    console.log('Form data submitted:', formData);
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000); // Reset form status after 3 seconds
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
      <h2 className="text-2xl font-bold text-center mb-6">Send Feedback</h2>
      {status === 'sent' ? (
        <p className="text-center text-green-400">Thank you! Your message has been sent.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <textarea name="message" id="message" rows={4} required value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"></textarea>
          </div>
          <button type="submit" disabled={status === 'sending'} className="w-full px-4 py-3 bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
   