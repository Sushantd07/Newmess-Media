import React from 'react';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MapPin, Globe, Facebook, Twitter, Instagram, Linkedin,
  Shield, Clock, Users, Building2, Heart, Star, ArrowRight, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about', isInternal: true },
      { name: 'Our Mission', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press & Media', href: '#' },
      { name: 'Contact Us', href: '/contact', isInternal: true }
    ],
    services: [
      { name: 'Business Directory', href: '#' },
      { name: 'Toll-Free Numbers', href: '#' },
      { name: 'Emergency Services', href: '#' },
      { name: 'Verification Services', href: '#' },
      { name: 'API Access', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'FAQ', href: '#' },
      { name: 'Report Issue', href: '#' },
      { name: 'Data Correction', href: '#' },
      { name: 'Feedback', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Disclaimer', href: '#' },
      { name: 'Data Protection', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const trustIndicators = [
    { icon: Shield, text: '99.9% Verified Data', color: 'text-green-500', iconProps: { className: 'bg-transparent', style: { background: 'none' } } },
    { icon: Clock, text: 'Updated Daily', color: 'text-blue-500', iconProps: { className: 'bg-transparent', style: { background: 'none' } } },
    { icon: Users, text: '10M+ Trusted Users', color: 'text-orange-500', iconProps: { className: 'bg-transparent', style: { background: 'none' } } }
  ];

  return (
    <footer className="bg-gray-900 text-white py-5 pb-24 md:pb-5">
      {/* Trust Indicators Bar */}
      {/* <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white">
              <Heart className="h-5 w-5 text-orange-200" />
              <span className="font-semibold">Trusted by millions of Indians for authentic business information</span>
            </div>
            <div className="flex items-center gap-6">
              {trustIndicators.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={`flex items-center gap-2 ${item.color}`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-green-600 p-2 rounded-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Newmess Media</h3>
              </div>
              <p className="text-gray-400 mb-4">
                India's Most Trusted Business Directory. Connecting millions of Indians with verified toll-free numbers and authentic business information since 2022.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">+91-1800-123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">support@newmessmedia.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Mumbai, Maharashtra, India</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Globe className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Available 24/7 Online</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="col-span-1 lg:col-span-1"
            >
              <h4 className="text-white font-semibold mb-4 capitalize">
                {category === 'company' ? 'Company' : 
                 category === 'services' ? 'Services' :
                 category === 'support' ? 'Support' : 'Legal'}
              </h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.isInternal ? (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center gap-1 group"
                      >
                        {link.name}
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center gap-1 group"
                      >
                        {link.name}
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

       

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>© {currentYear} Newmess Media. All rights reserved.</span>
            
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Building2 className="h-4 w-4 text-blue-500" />
                <span>50,000+ Businesses</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;