import React from 'react';
import { Users, Target, Award, Phone, MapPin, Clock, Shield, Star, TrendingUp, Heart, CheckCircle, Calendar, Globe, Search, Zap, Eye, MessageCircle } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "SEO Expert",
      role: "Search Engine Optimization Specialist",
      expertise: "Maximum visibility and accessibility optimization",
      description: "Ensures our platform reaches those who need it most through strategic SEO implementation.",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      icon: <Search className="w-6 h-6" />
    },
    {
      name: "Content Writer & UI Designer",
      role: "Content Strategy & User Experience",
      expertise: "Informative and intuitive user experiences",
      description: "Crafts user experiences that are both informative and intuitive for seamless navigation.",
      image: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      icon: <Eye className="w-6 h-6" />
    },
    {
      name: "React Developer",
      role: "Frontend Development Specialist",
      expertise: "Robust, responsive platform development",
      description: "Builds robust, responsive platforms that deliver consistent performance across all devices.",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      icon: <Zap className="w-6 h-6" />
    },
    {
      name: "YouTube Anchor",
      role: "Multimedia Content Creator",
      expertise: "Engaging multimedia content creation",
      description: "Extends our reach through engaging multimedia content and video communications.",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      icon: <MessageCircle className="w-6 h-6" />
    }
  ];

  const coreValues = [
    {
      icon: <Shield className="w-8 h-8 text-orange-600" />,
      title: "Rigorous Verification",
      description: "Every contact number undergoes multiple verification stages by our dedicated team members to ensure 100% accuracy."
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: "Emergency Ready",
      description: "Designed for critical moments when every minute matters, delivering swift and efficient solutions."
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-600" />,
      title: "State-wise Organization",
      description: "Comprehensive geographical listing system recognizing India's diversity with locally relevant information."
    },
    {
      icon: <Heart className="w-8 h-8 text-orange-600" />,
      title: "Community Driven",
      description: "A continuously evolving resource shaped by user needs and dedicated to serving the Indian community."
    }
  ];

  const achievements = [
    { number: "June 19, 2025", label: "Founded", icon: <Calendar className="w-6 h-6" /> },
    { number: "Millions", label: "Users Served", icon: <Users className="w-6 h-6" /> },
    { number: "100%", label: "Manual Verification", icon: <CheckCircle className="w-6 h-6" /> },
    { number: "All States", label: "Coverage", icon: <MapPin className="w-6 h-6" /> }
  ];

  const services = [
    "Banking Institutions",
    "Government Departments", 
    "Healthcare Facilities",
    "Telecommunications Providers",
    "Insurance Companies",
    "Utility Services",
    "Emergency Services",
    "Educational Institutions"
  ];

  const differentiators = [
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      title: "Multiple Verification Stages",
      description: "Every piece of information undergoes rigorous verification to ensure accuracy and reliability."
    },
    {
      icon: <Star className="w-8 h-8 text-orange-600" />,
      title: "Intuitive User-Centric Design",
      description: "Navigate effortlessly even during high-stress situations with our thoughtfully designed interface."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "Comprehensive State-wise Listings",
      description: "Unique geographical organization that few competitors offer, ensuring locally relevant information."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
    

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-orange-100 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-orange-600">India Customer Help</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              India's premier destination for verified emergency contact numbers and comprehensive customer care information, 
              thoughtfully curated and presented in one accessible platform.
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-12">
              {achievements.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center text-orange-600 mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-xs lg:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Genesis Story */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Our Genesis Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Our journey began with a universally frustrating experience — the desperate search for accurate 
                  customer service numbers during emergencies. Picture this: your bank card gets blocked at midnight, 
                  your internet connection fails during an important presentation, or you need urgent government assistance, 
                  only to find yourself lost in a maze of outdated contact information.
                </p>
                <p>
                  This all-too-familiar scenario sparked the creation of India Customer Help, born from necessity 
                  and nurtured by determination. What commenced as a straightforward customer care directory has 
                  evolved into a comprehensive digital ecosystem, meticulously designed to serve the diverse needs 
                  of users across every corner of India.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white rounded-full p-4 lg:p-6 shadow-lg">
                  <Target className="w-12 h-12 lg:w-16 lg:h-16 text-orange-600" />
                </div>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 text-center mb-4">
                Born from Necessity, Nurtured by Determination
              </h3>
              <p className="text-sm lg:text-base text-gray-600 text-center">
                Transforming the way millions of Indians connect with essential services during critical moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Our Unwavering Mission</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg lg:text-xl text-gray-600 mb-6 leading-relaxed">
                To revolutionize access to vital contact information, eliminate confusion, and preserve your valuable time.
              </p>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                We envision a future where no Indian citizen struggles to find authentic contact information during crucial moments. 
                Through our services, we're building bridges between people and the assistance they need, fostering a more connected and responsive society.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">
                Building a More Connected India
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every minute matters during emergencies, and our platform is engineered to deliver solutions swiftly and efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section (replaces Specialized Services) */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We take immense pride in delivering a meticulously organized directory of state-wise and local emergency numbers, strategically designed to eliminate the chaos of searching for critical contact information.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 flex flex-col items-center hover:shadow-lg transition-shadow">
              <Phone className="w-10 h-10 text-[#F16124] mb-4" />
              <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">Emergency Contact Directory</h3>
              <p className="text-gray-600 text-center text-base">State-wise and local emergency numbers, meticulously organized for quick access during critical moments.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 flex flex-col items-center hover:shadow-lg transition-shadow">
              <Shield className="w-10 h-10 text-[#F16124] mb-4" />
              <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">Verified Accuracy</h3>
              <p className="text-gray-600 text-center text-base">Every contact number undergoes rigorous manual verification by our dedicated team members.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 flex flex-col items-center hover:shadow-lg transition-shadow">
              <Award className="w-10 h-10 text-[#F16124] mb-4" />
              <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">Comprehensive Coverage</h3>
              <p className="text-gray-600 text-center text-base">Banking, government, healthcare, telecom, insurance, utilities, and essential organizations.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 flex flex-col items-center hover:shadow-lg transition-shadow">
              <Star className="w-10 h-10 text-[#F16124] mb-4" />
              <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">User-Centric Design</h3>
              <p className="text-gray-600 text-center text-base">Intuitive interface designed for effortless navigation, even during high-stress situations.</p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-[#FFF5F0] rounded-2xl p-8 max-w-4xl w-full text-center border border-orange-100 mx-auto">
              <p className="text-gray-600 text-base lg:text-lg">
                Our platform encompasses an extensive range of services including banking institutions, government departments, healthcare facilities, telecommunications providers, insurance companies, utility services, and countless other essential organizations. Every single contact number featured on our platform undergoes rigorous manual verification by our dedicated team members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Distinguishes Us */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">What Distinguishes Us</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              While we acknowledge the existence of other platforms in this domain, India Customer Help distinguishes 
              itself through several key differentiators.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {differentiators.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border hover:shadow-md transition-shadow">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 lg:mt-16 text-center">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">Interactive Design Excellence</h3>
              <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                We present all data through carefully designed tables and interactive cards, eliminating the need for 
                endless scrolling through cluttered web pages. Our user-centric approach ensures effortless navigation 
                even during high-stress situations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These fundamental principles guide everything we do and define who we are as a platform.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Our Dynamic Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Operating remotely from the serene landscapes of Uttarakhand, our passionate four-member team brings 
              together diverse expertise and shared commitment.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 lg:p-6">
                  <div className="flex items-center mb-2">
                    <div className="text-orange-600 mr-2">{member.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  </div>
                  <p className="text-orange-600 font-medium mb-2 text-sm lg:text-base">{member.role}</p>
                  <p className="text-xs lg:text-sm text-gray-600 mb-3 font-medium">{member.expertise}</p>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 lg:mt-16 text-center">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border">
              <MapPin className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">Remote Excellence from Uttarakhand</h3>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                This collaborative approach allows us to maintain agility while delivering consistent quality across 
                all aspects of our service, bringing together the best of technology and nature's tranquility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Commitment */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Our Commitment to Community</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We champion transparent communication and actively welcome user feedback. We believe our platform 
              grows stronger through community input and user experiences.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 lg:p-8">
              <div className="text-center">
                <div className="bg-white rounded-full p-4 lg:p-6 shadow-lg inline-block mb-4">
                  <Users className="w-12 h-12 lg:w-16 lg:h-16 text-orange-600" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">
                  Continuously Evolving Resource
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Shaped by user needs and dedicated to serving the Indian community with transparency and excellence.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">We're Not Just a Directory</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We're a continuously evolving resource, shaped by user needs and dedicated to serving the Indian community. 
                  Every day, we work tirelessly to enhance our offerings, expand our database, and refine our user experience.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 lg:p-6 border">
                <h4 className="font-semibold text-gray-900 mb-2">Connect With Us</h4>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  Whether you're seeking specific information, notice missing details, or have suggestions for improvement, 
                  we encourage you to connect with us through our Contact Us page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Building a More Connected India
          </h2>
          <p className="text-lg lg:text-xl text-orange-100 mb-8 leading-relaxed">
            Your trust drives our innovation, and your satisfaction remains our ultimate benchmark for success. 
            Together, we're building a more connected, informed, and empowered India — one contact number at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-6 lg:px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Explore Our Directory
            </button>
            <button className="border-2 border-white text-white px-6 lg:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-orange-600 mr-2" />
                <span className="text-lg font-bold">India Customer Help</span>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm lg:text-base">
                India's premier destination for verified emergency contact numbers and comprehensive customer care information.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Home</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">About Us</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Categories</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Contact</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Banking</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Government</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Healthcare</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm lg:text-base">Emergency</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm lg:text-base">Uttarakhand, India</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm lg:text-base">Emergency Directory</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p className="text-sm lg:text-base">&copy; 2025 India Customer Help. All rights reserved. Founded June 19, 2025.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;