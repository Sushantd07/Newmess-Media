import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, User, Building2,
  CheckCircle, Globe, ArrowRight
} from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const form = new FormData();
  form.append('access_key', 'bc0eca29-2292-42cf-af3d-e99d3591135f');
  form.append('name', formData.name);
  form.append('email', formData.email);
  form.append('phone', formData.phone);
  form.append('company', formData.company);
  form.append('subject', formData.subject);
  form.append('message', formData.message);
  form.append('from_name', 'Mission Control');

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: form
  });

  const result = await response.json();

  if (result.success) {
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: ''
    });
  }

  setIsSubmitting(false);
  setTimeout(() => setIsSubmitted(false), 3000);
};


  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91-1800-123-4567',
      description: 'Mon-Fri 9AM to 6PM IST'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@newmessmedia.com',
      description: 'Response within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Mumbai, Maharashtra',
      description: 'India 400001'
    },
    {
      icon: Globe,
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Instant support online'
    }
  ];

  const subjects = [
    'General Inquiry',
    'Business Listing',
    'Technical Support',
    'Partnership',
    'Media & Press',
    'Data Correction',
    'Other'
  ];

  return (
    <section className="py-6 md:py-8 bg-gradient-to-b from-[#F5F7FA] to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Mobile Header - Compact */}
        <div className="md:hidden text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3 shadow-sm">
            <Mail className="h-3 w-3" />
            Contact Directory
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Get in Touch
          </h2>
          <p className="text-xs text-gray-600 mb-2">
            Reach out for business listings, support, or general queries
          </p>
          <div className="w-16 h-0.5 bg-orange-500 rounded-full mx-auto" />
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex text-center mb-8 flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-[15px] font-semibold mb-4 shadow-sm">
            <Mail className="h-4 w-4" />
            Contact Directory
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Get in Touch with Our <span className="text-orange-600">Contact Us</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-2">
            Reach out for business listings, support, or general queries. Our team is here to help you.
          </p>
          <div className="w-20 h-1 bg-orange-500 rounded-full mt-1 mb-1" />
        </div>

        {/* Mobile Layout - Compact Grid */}
        <div className="md:hidden space-y-4">
          {/* Contact Info - Compact Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-2">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-orange-50 transition-colors group cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <Icon className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 text-xs mb-0.5">{item.title}</h4>
                      <p className="text-orange-600 font-medium text-xs mb-0.5 truncate">{item.details}</p>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form - Compact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
            {!isSubmitted ? (
              <>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input type="hidden" name="from_name" value="India Customer Help" />
                  
                  {/* Name and Email - Side by side on mobile */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                      <div className="relative">
                        <User className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-7 pr-2 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                          placeholder="Full name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-7 pr-2 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone and Company - Side by side */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-7 pr-2 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
                      <div className="relative">
                        <Building2 className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full pl-7 pr-2 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                          placeholder="Company name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                    >
                      <option value="">Select subject</option>
                      {subjects.map((subject, index) => (
                        <option key={index} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none transition-colors resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-3 w-3" />
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-xs text-gray-600">
                  We'll get back to you within 24 hours.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors group cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <Icon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-orange-600 font-medium mb-1">{item.details}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              {!isSubmitted ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="from_name" value="India Customer Help" />
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                            placeholder="Enter company name"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-5 w-5" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 md:mt-16"
        >
        
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
