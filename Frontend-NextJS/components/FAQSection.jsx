import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, Shield, Clock } from 'lucide-react';

const faqs = [
  {
    question: "What is India Customer Help?",
    answer: "India Customer Help is a trusted directory for verified helpline numbers, emergency contacts, and customer support for businesses and services across India."
  },
  {
    question: "How do I find a helpline number for a company or service?",
    answer: "Use our search bar or browse by category or state to quickly find verified helpline and customer support numbers for companies, government services, and more."
  },
  {
    question: "Are the numbers on India Customer Help verified?",
    answer: "Yes, all numbers are regularly checked and verified by our team to ensure accuracy and reliability."
  },
  {
    question: "How can I report an incorrect or outdated number?",
    answer: "If you find an incorrect or outdated number, please use the 'Report' button next to the listing or contact us directly. We appreciate your help in keeping our directory up to date!"
  },
  {
    question: "Is India Customer Help free to use?",
    answer: "Yes, our platform is completely free for all users. You can access helpline numbers and emergency contacts without any charges."
  },
  // Added FAQs
  {
    question: "How quickly can I expect a response after submitting a query?",
    answer: "Our support team strives to respond to all queries within 24 hours. For urgent issues, please use the phone number provided on our Contact page."
  },
  {
    question: "Can I request to add a new company or service to the directory?",
    answer: "Yes! If you don't find a company or service listed, you can request its addition by contacting us through the form or email. Our team will review and update the directory accordingly."
  },
  {
    question: "Is my personal information safe when I contact you?",
    answer: "Absolutely. We use secure protocols and never share your information with third parties without your consent."
  }
];

const features = [
  { icon: Shield, title: "100% Verified", desc: "All numbers verified regularly" },
  { icon: Clock, title: "24/7 Access", desc: "Available round the clock" },
  { icon: Phone, title: "Instant Connect", desc: "Direct calling support" }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative py-24 bg-gradient-to-br from-orange-50/50 via-white to-rose-50/30 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.08),transparent_50%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-5 py-3 rounded-full text-sm font-semibold shadow-sm">
                <HelpCircle className="w-4 h-4" />
                Frequently Asked Questions
              </div>
              
              <h2 className="text-4xl lg:text-4xl font-black text-gray-900 leading-tight">
                Your Trusted Source for 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600">
                  Customer Helplines
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Find verified helpline numbers, emergency contacts, and customer support for companies and services across India. Our mission is to make help accessible, reliable, and easy to find for everyone.
              </p>
            </div>

            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div> */}

            <div className="pt-4">
              <a 
                href="/contact" 
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Contact Support
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 shadow-xl border border-orange-100">
              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen 
                          ? 'bg-gradient-to-r from-orange-50 to-rose-50 border-orange-200 shadow-md' 
                          : 'bg-white/80 border-gray-200 hover:border-orange-200 hover:shadow-sm'
                      }`}
                    >
                      <button
                        className={`w-full flex items-center justify-between py-4 px-4 text-left focus:outline-none transition-all duration-300 ${
                          isOpen ? 'text-orange-700' : 'text-gray-800 hover:text-orange-600'
                        }`}
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${idx}`}
                      >
                        <span className="text-lg font-semibold pr-4">{faq.question}</span>
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen 
                            ? 'bg-gradient-to-r from-orange-500 to-rose-500 shadow-lg' 
                            : 'bg-gray-100 hover:bg-orange-100'
                        }`}>
                          <ChevronDown 
                            className={`w-5 h-5 transition-all duration-300 ${
                              isOpen ? 'rotate-180 text-white' : 'text-gray-600'
                            }`}
                          />
                        </div>
                      </button>
                      
                      <div
                        id={`faq-panel-${idx}`}
                        className={`px-6 transition-all duration-300 ease-in-out ${
                          isOpen 
                            ? 'max-h-96 pb-6 opacity-100' 
                            : 'max-h-0 overflow-hidden opacity-0'
                        }`}
                        aria-hidden={!isOpen}
                      >
                        <div className="pt-2 pb-2">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
