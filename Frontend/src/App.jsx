// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection.jsx';
import CategorySection from './components/CategoryGrid';
import TrendingTicker from './components/TrendingTicker';
import ContactUs from './components/ContactUs';
import ScrollToTop from './components/ScrollToTop';
import FAQSection from './components/FAQSection.jsx'
import Chatbot from './components/Chatbot.jsx';
import MobileNavigation from './components/MobileNavigation.jsx';


import AllCategories from './pages/AllCategories.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import CompanyPage from './pages/CompanyPage.jsx';
import StateWiseSection from './components/StateWiseSection';
import MaharashtraHelplinePage from './pages/MaharashtraHelpline';
import AboutUs from './pages/AboutUs.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import CanvaEditorTest from './pages/CanvaEditorTest.jsx';
import LiveEditorTest from './pages/LiveEditorTest.jsx';
import InlineEditorTest from './pages/InlineEditorTest.jsx';
import LivePageDebugTest from './pages/LivePageDebugTest.jsx';
import ErrorTestPage from './pages/ErrorTestPage.jsx';
import TinyMCETest from './pages/TinyMCETest.jsx';
import ICICIContentTest from './pages/ICICIContentTest.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <ScrollToTop />
      
      <Routes>
        {/* Home Page */}
        <Route path="/" element={
          <>
            <Header />
            <TrendingTicker />
            <HeroSection />
            <CategorySection />
            <StateWiseSection/>
            <ContactUs />
            <FAQSection/>
            {/* <Chatbot /> */}
            <Footer />
            <MobileNavigation />
          </>
        } />

        {/* About Us Page */}
        <Route path="/about" element={
          <>
            <Header />
            <TrendingTicker />
            <AboutUs />
            <Chatbot />
            <Footer />
            <MobileNavigation />
          </>
        } />

        {/* Admin Panel */}
        <Route path="/admin/*" element={<AdminPanel />} />

        {/* Canva Editor Test */}
        <Route path="/canva-editor-test" element={<CanvaEditorTest />} />

        {/* Live Editor Test */}
        <Route path="/live-editor-test" element={<LiveEditorTest />} />

        {/* Inline Editor Test */}
        <Route path="/inline-editor-test" element={<InlineEditorTest />} />

        {/* Live Page Debug Test */}
        <Route path="/live-page-debug-test" element={<LivePageDebugTest />} />

        {/* Error Test Page */}
        <Route path="/error-test" element={<ErrorTestPage />} />

        {/* TinyMCE Test Page */}
        <Route path="/tinymce-test" element={<TinyMCETest />} />

        {/* ICICI Content Test Page */}
        <Route path="/icici-content-test" element={<ICICIContentTest />} />

        {/* All Categories Page */}
        <Route path="/category" element={
          <>
            <Header />
            <TrendingTicker />
            <AllCategories />
            <Footer />
            <MobileNavigation />
          </>
        } />

        {/* Company Page - SEO-friendly tab routes (MUST come before category route) */}
        <Route path="/category/:categoryId/:companySlug/contactnumber" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />
        <Route path="/category/:categoryId/:companySlug/complain" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />
        <Route path="/category/:categoryId/:companySlug/quickhelp" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />
        <Route path="/category/:categoryId/:companySlug/videoguide" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />
        <Route path="/category/:categoryId/:companySlug/overview" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />

        {/* Company Page - main company route (MUST come before category route) */}
        <Route path="/category/:categoryId/:companySlug" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />
        
        {/* Company Page - shows individual company under a subcategory and category */}
        <Route path="/category/:categoryId/:subcategoryId/:companySlug" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />

        {/* Category Page - shows all companies under a category (MUST come last) */}
        <Route path="/category/:categoryId" element={
          <>
            <Header />
            <TrendingTicker />
            <CategoryPage />
            <Footer />
            <MobileNavigation />
          </>
        } />

        {/* Dynamic Company Page Routes - for consolidated subcategory structure */}
        <Route path="/company/:companyId" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />
        <Route path="/company/:companyId/contactnumber" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />
        <Route path="/company/:companyId/complain" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />
        <Route path="/company/:companyId/quickhelp" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />
        <Route path="/company/:companyId/videoguide" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />
        <Route path="/company/:companyId/overview" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
            <MobileNavigation />
          </>
        } />
        {/* <Route path="/home/state-wise" element={<StateWiseCreative />} /> */}
        {/* <Route path="/home/state-wise/maharashtra" element={<MaharashtraHelplinePage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
