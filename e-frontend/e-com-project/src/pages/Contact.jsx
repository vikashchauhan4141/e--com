import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Simulated form submission
    console.log('Contact form submitted:', data);
    toast.success('Thank you! Our concierge will contact you within 24 hours.', {
      icon: '✉️',
      style: {
        background: '#0A0A0A',
        color: '#FAFAFA',
        borderLeft: '3px solid #9B7EC8',
        borderRadius: '0',
        fontSize: '13px',
      }
    });
    reset();
  };

  return (
    <div className="page-wrapper pt-24 bg-white">
      {/* Header Banner */}
      <div className="bg-[#E8E0F0] py-12 lg:py-16 px-6 text-center">
        <span className="section-subtitle text-[#9B7EC8]">GET IN TOUCH</span>
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A0A0A] mt-3 mb-4 md:mb-6">
          Contact Us
        </h1>
        <div className="divider mx-auto" />
        <p className="text-sm font-inter text-gray-600 max-w-xl mx-auto leading-relaxed">
          Need styling assistance? Or tracking an order? Our luxury concierge is ready to assist you.
        </p>
      </div>

      {/* Main Grid */}
      <section className="section-padding container-fluid">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Left Panel: Contact info */}
          <div className="space-y-8 lg:space-y-10">
            <div>
              <span className="section-subtitle">CONCIERGE DESK</span>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold mt-2 mb-4">We're here to help</h2>
              <p className="text-sm font-inter text-gray-500 leading-relaxed">
                Connect with our customer relationship managers, available Monday through Saturday, from 10:00 AM to 7:00 PM IST.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Phone */}
              <div className="flex gap-4 p-4 md:p-5 border border-gray-100 bg-[#FAFAFA]">
                <div className="w-10 h-10 bg-[#E8E0F0] flex items-center justify-center text-[#9B7EC8] shrink-0">
                  <Phone size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-1">Call Support</h4>
                  <p className="text-sm font-inter text-gray-700 font-medium truncate">+91 98765 43210</p>
                  <p className="text-[11px] text-gray-400 font-inter mt-1">Available 10:00 AM - 7:00 PM IST</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 p-4 md:p-5 border border-gray-100 bg-[#FAFAFA]">
                <div className="w-10 h-10 bg-[#E8E0F0] flex items-center justify-center text-[#9B7EC8] shrink-0">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-1">Email Concierge</h4>
                  <p className="text-sm font-inter text-gray-700 font-medium truncate">hello@cocofashion.in</p>
                  <p className="text-[11px] text-gray-400 font-inter mt-1">Response time: within 24 hours</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4 p-4 md:p-5 border border-gray-100 bg-[#FAFAFA]">
                <div className="w-10 h-10 bg-[#E8E0F0] flex items-center justify-center text-[#9B7EC8] shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-1">Head Office</h4>
                  <p className="text-sm font-inter text-gray-700 font-medium">Coco Fashion HQ, Bandra West, Mumbai, MH</p>
                  <p className="text-[11px] text-gray-400 font-inter mt-1">Appointments only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-gray-100 p-6 md:p-8 lg:p-10 shadow-lg"
          >
            <h3 className="font-playfair text-xl md:text-2xl font-bold mb-6 md:mb-8">Send Us A Message</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-gray-600">Full Name</label>
                <input
                  type="text"
                  placeholder="Isabelle Coco"
                  className={`input-coco ${errors.name ? 'border-red-400' : ''}`}
                  {...register('name', { required: 'Full name is required' })}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-500 font-inter flex items-center gap-1 mt-1">
                    <ShieldAlert size={12} /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-gray-600">Email Address</label>
                <input
                  type="email"
                  placeholder="isabelle@coco.com"
                  className={`input-coco ${errors.email ? 'border-red-400' : ''}`}
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-500 font-inter flex items-center gap-1 mt-1">
                    <ShieldAlert size={12} /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-gray-600">Subject</label>
                <input
                  type="text"
                  placeholder="Product Inquiry / Order Status"
                  className="input-coco"
                  {...register('subject')}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-gray-600">Your Message</label>
                <textarea
                  rows="4"
                  placeholder="Tell us what you need help with..."
                  className={`input-coco resize-none ${errors.message ? 'border-red-400' : ''}`}
                  {...register('message', { required: 'Message content is required' })}
                />
                {errors.message && (
                  <p className="text-[11px] text-red-500 font-inter flex items-center gap-1 mt-1">
                    <ShieldAlert size={12} /> {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full btn-primary justify-center gap-2 py-4"
              >
                Send Message <Send size={14} />
              </button>
            </form>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
