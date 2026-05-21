import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoMailOutline, 
  IoCallOutline, 
  IoLocationOutline, 
  IoTimeOutline, 
  IoSparklesOutline, 
  IoCheckmarkCircleOutline 
} from 'react-icons/io5';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
    if (!formData.message.trim()) tempErrors.message = 'Message content is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on type
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate luxury API submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-10 pb-20">
      {/* Background Soft Accent Gradient */}
      <div className="absolute top-0 inset-x-0 h-[50vh] bg-[radial-gradient(ellipse_at_top,rgba(106,81,136,0.05),transparent)] pointer-events-none" />

      <div className="max-w-container mx-auto px-6 lg:px-16 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mt-12 mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading font-semibold text-[10px] tracking-[0.25em] text-primary uppercase block mb-3"
          >
            Connect With Us
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-heading font-light text-3xl md:text-5xl tracking-wide text-ink mb-4"
          >
            Our Atelier
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-sans text-xs md:text-sm text-secondary leading-relaxed"
          >
            Whether seeking order advice, fit consultations, or a bespoke sizing reservation, our dedicated concierge team is at your disposal.
          </motion.p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-8"
          >
            
            {/* Atelier Card */}
            <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(ellipse_at_center,rgba(150,123,182,0.1),transparent)] pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              
              <div className="flex items-center gap-3 text-primary mb-6">
                <IoSparklesOutline size={18} />
                <h2 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink">Stylee Headquarters</h2>
              </div>
              
              <div className="flex flex-col gap-6 text-sm text-secondary font-sans">
                
                {/* Location */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <IoLocationOutline size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-[10px] tracking-wider uppercase text-ink mb-1">ATELIER LOCATION</h4>
                    <p className="text-xs leading-relaxed text-secondary-container">
                      Stylee Premium Atelier,<br />
                      Knowledge Park III, Greater Noida,<br />
                      Uttar Pradesh, India
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <IoMailOutline size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-[10px] tracking-wider uppercase text-ink mb-1">ELECTRONIC CARE</h4>
                    <a 
                      href="mailto:vikashchauhan414141@gmail.com" 
                      className="text-xs text-secondary-container hover:text-primary transition-colors block break-all"
                    >
                      vikashchauhan414141@gmail.com
                    </a>
                  </div>
                </div>

                {/* Helpline */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <IoCallOutline size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-[10px] tracking-wider uppercase text-ink mb-1">CONCIERGE HELPLINE</h4>
                    <a 
                      href="tel:9910484141" 
                      className="text-xs text-secondary-container hover:text-primary transition-colors block font-semibold"
                    >
                      +91 99104 84141
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <IoTimeOutline size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-[10px] tracking-wider uppercase text-ink mb-1">ATELIER HOURS</h4>
                    <p className="text-xs text-secondary-container">
                      Monday — Saturday: 10:00 AM — 7:00 PM IST<br />
                      Closed on Sundays and National Holidays
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Premium Note */}
            <div className="bg-surface-container/40 border border-outline-variant/50 p-6 rounded-lg font-sans text-xs text-secondary leading-relaxed">
              <p className="font-heading font-semibold text-[9px] tracking-widest text-primary uppercase mb-2">Bespoke Fitting Session</p>
              We welcome private physical visits to our Greater Noida showroom by appointment. Please send us an email 24 hours in advance to coordinate your private session with our sizing curators.
            </div>

          </motion.div>

          {/* Right Column: Inquiry Form / Success State */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant p-8 md:p-10 rounded-lg shadow-sm"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8">
                    <h3 className="font-heading font-light text-xl text-ink mb-2">Send an Inquiry</h3>
                    <p className="font-sans text-xs text-secondary">
                      Fill out the form below and an atelier curator will reply within 4 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input 
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="ENTER YOUR NAME"
                      />
                      <Input 
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="ENTER YOUR EMAIL"
                      />
                    </div>

                    <Input 
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      error={errors.subject}
                      placeholder="HOW CAN WE ASSIST YOU?"
                    />

                    {/* Styled Textarea matches Input component standards */}
                    <div className="w-full flex flex-col gap-1.5">
                      <label className="font-heading font-semibold text-[10px] tracking-widest uppercase text-surface-on-variant">
                        Message Content
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="WRITE YOUR MESSAGE HERE..."
                        className={`w-full px-4 py-3 bg-surface-container-lowest text-sm text-ink border border-outline-variant rounded transition-colors font-sans focus:outline-none focus:border-primary resize-none ${errors.message ? 'border-error focus:border-error' : ''}`}
                      />
                      {errors.message && (
                        <span className="text-[10px] text-error font-sans tracking-wide">
                          {errors.message}
                        </span>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full sm:w-auto py-3.5 px-10 self-end mt-4 shadow-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending Request...' : 'Send Inquiry'}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6"
                  >
                    <IoCheckmarkCircleOutline size={36} />
                  </motion.div>
                  
                  <span className="font-heading font-semibold text-[10px] tracking-[0.25em] text-primary uppercase mb-2">
                    Inquiry Received
                  </span>
                  
                  <h3 className="font-heading font-light text-2xl text-ink mb-3">
                    Thank You for Connecting
                  </h3>
                  
                  <p className="font-sans text-xs text-secondary max-w-sm leading-relaxed mb-8">
                    Your inquiry has been logged securely in our atelier records. A dedicated client support representative will review your message and email you at <span className="font-semibold text-ink break-all">{formData.email || 'your email'}</span> within 4 hours.
                  </p>

                  <Button 
                    variant="secondary" 
                    onClick={() => setSubmitted(false)}
                    className="py-3 px-8 text-xs"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

      </div>
    </div>
  );
};
