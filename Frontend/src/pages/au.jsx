import React from "react";
import { Users, Shield, PhoneCall, Globe, Star, Heart, MapPin, CheckCircle, Award, TrendingUp, Info, UserCheck, PenTool, MonitorPlay, Home } from "lucide-react";

const team = [
  {
    name: "Amit Kumar",
    role: "SEO Expert",
    icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
  },
  {
    name: "Priya Sharma",
    role: "Content Writer & UI Designer",
    icon: <PenTool className="h-6 w-6 text-pink-500" />,
  },
  {
    name: "Rahul Singh",
    role: "React Developer",
    icon: <MonitorPlay className="h-6 w-6 text-green-600" />,
  },
  {
    name: "Neha Joshi",
    role: "YouTube Anchor",
    icon: <Home className="h-6 w-6 text-orange-500" />,
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-400 via-yellow-100 to-green-200 rounded-2xl shadow-xl p-8 mb-10 border border-orange-100 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-orange-700 mb-2">About Us</h1>
            <p className="text-lg text-gray-700 font-medium mb-3">India Customer Help stands as India's premier destination for verified emergency contact numbers and comprehensive customer care information, thoughtfully curated and presented in one accessible platform.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-2 text-orange-700 font-semibold text-sm"><Shield className="h-5 w-5 text-orange-500" /> Verified Data</span>
              <span className="flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-2 text-green-700 font-semibold text-sm"><CheckCircle className="h-5 w-5 text-green-500" /> Trusted by Millions</span>
              <span className="flex items-center gap-2 bg-white border border-blue-200 rounded-full px-4 py-2 text-blue-700 font-semibold text-sm"><Globe className="h-5 w-5 text-blue-500" /> Pan-India Reach</span>
            </div>
          </div>
          <div className="flex-shrink-0 hidden md:block">
            <img src="/logo3-Photoroom.png" alt="India Customer Help Logo" className="w-32 h-32 rounded-full shadow-lg border-4 border-orange-200 bg-white" />
          </div>
        </div>

        {/* Genesis Story */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-orange-700 mb-3 flex items-center gap-2"><Info className="h-6 w-6 text-orange-500" /> Our Genesis Story</h2>
          <p className="text-gray-700 text-base mb-2">Our journey began with a universally frustrating experience — the desperate search for accurate customer service numbers during emergencies. Picture this: your bank card gets blocked at midnight, your internet connection fails during an important presentation, or you need urgent government assistance, only to find yourself lost in a maze of outdated contact information scattered across countless websites. This all-too-familiar scenario sparked the creation of India Customer Help, born from necessity and nurtured by determination.</p>
          <p className="text-gray-700 text-base">What commenced as a straightforward customer care directory has evolved into a comprehensive digital ecosystem, meticulously designed to serve the diverse needs of users across every corner of India. We recognized that in our rapidly digitalizing nation, reliable access to accurate contact information isn't just convenience — it's essential infrastructure for modern life.</p>
        </section>

        {/* Specialized Services */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-orange-700 mb-3 flex items-center gap-2"><PhoneCall className="h-6 w-6 text-orange-500" /> Our Specialized Services</h2>
          <p className="text-gray-700 text-base mb-2">We take immense pride in delivering a meticulously organized directory of state-wise and local emergency numbers, strategically designed to eliminate the chaos of searching for critical contact information. Our platform encompasses an extensive range of services including banking institutions, government departments, healthcare facilities, telecommunications providers, insurance companies, utility services, and countless other essential organizations.</p>
          <p className="text-gray-700 text-base mb-2">Every single contact number featured on our platform undergoes rigorous manual verification by our dedicated team members. This commitment to accuracy ensures that when you need help most, the information we provide is reliable and current. We maintain transparency in our operations — while we strive for perfect accuracy, we acknowledge that some numbers may occasionally become inactive when departments discontinue services after our initial listing. In such instances, we exercise patience and wait for official confirmation from the respective organization's website before making any modifications.</p>
        </section>

        {/* Mission */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-orange-700 mb-3 flex items-center gap-2"><Star className="h-6 w-6 text-yellow-500" /> Our Unwavering Mission</h2>
          <p className="text-gray-700 text-base mb-2">At the heart of India Customer Help lies a crystal-clear mission: To revolutionize access to vital contact information, eliminate confusion, and preserve your valuable time. We understand that every minute matters during emergencies, and our platform is engineered to deliver solutions swiftly and efficiently.</p>
          <p className="text-gray-700 text-base">We envision a future where no Indian citizen struggles to find authentic contact information during crucial moments. Through our services, we're building bridges between people and the assistance they need, fostering a more connected and responsive society.</p>
        </section>

        {/* What Distinguishes Us */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-orange-700 mb-3 flex items-center gap-2"><Award className="h-6 w-6 text-indigo-500" /> What Distinguishes Us</h2>
          <ul className="list-disc pl-6 text-gray-700 text-base mb-2">
            <li className="mb-1">Unwavering dedication to accuracy — every piece of information undergoes multiple verification stages.</li>
            <li className="mb-1">Intuitive, user-centric design for effortless navigation, even during high-stress situations.</li>
            <li className="mb-1">Comprehensive state-wise listing system for locally relevant information, a unique approach among competitors.</li>
            <li className="mb-1">Carefully designed tables and interactive cards, eliminating endless scrolling through cluttered web pages.</li>
          </ul>
          <p className="text-gray-700 text-base">Our geographical organization recognizes India's incredible diversity and ensures that users receive locally relevant information.</p>
        </section>

        {/* Team Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-orange-700 mb-3 flex items-center gap-2"><Users className="h-6 w-6 text-green-600" /> Our Dynamic Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white border border-orange-100 rounded-xl shadow p-5 flex flex-col items-center text-center">
                <div className="mb-2">{member.icon}</div>
                <div className="font-bold text-gray-800 text-lg">{member.name}</div>
                <div className="text-orange-600 font-medium text-sm">{member.role}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-700 text-base mt-4">Operating remotely from the serene landscapes of Uttarakhand, our passionate four-member team brings together diverse expertise and shared commitment. This collaborative approach allows us to maintain agility while delivering consistent quality across all aspects of our service.</p>
        </section>

        {/* Community Commitment */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-orange-700 mb-3 flex items-center gap-2"><Heart className="h-6 w-6 text-red-500" /> Our Commitment to Community</h2>
          <p className="text-gray-700 text-base mb-2">At India Customer Help, we champion transparent communication and actively welcome user feedback. We believe our platform grows stronger through community input and user experiences. Whether you're seeking specific information, notice missing details, or have suggestions for improvement, we encourage you to connect with us through our Contact Us page.</p>
          <p className="text-gray-700 text-base">We're not just a directory — we're a continuously evolving resource, shaped by user needs and dedicated to serving the Indian community. Every day, we work tirelessly to enhance our offerings, expand our database, and refine our user experience.</p>
        </section>

        {/* Closing Statement */}
        <div className="bg-gradient-to-r from-green-100 via-white to-orange-100 rounded-2xl shadow-lg p-6 mt-10 border border-green-100 text-center">
          <h3 className="text-xl font-bold text-orange-700 mb-2">Your trust drives our innovation, and your satisfaction remains our ultimate benchmark for success.</h3>
          <p className="text-gray-700 text-base">Together, we're building a more connected, informed, and empowered India — one contact number at a time.</p>
        </div>
      </div>
    </div>
  );
} 