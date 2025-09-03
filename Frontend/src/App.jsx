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


import AllCategories from './pages/AllCategories.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import CompanyPage from './pages/CompanyPage.jsx';
import StateWiseSection from './components/StateWiseSection';
import MaharashtraHelplinePage from './pages/MaharashtraHelpline';
import StateDetail from './pages/StateDetail.jsx';
import StatewiseList from './pages/StatewiseList.jsx';
import AboutUs from './pages/AboutUs.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ContactNumbersAdmin from './pages/ContactNumbersAdmin.jsx';
import SitemapPage from './pages/SitemapPage.jsx';

import { Helmet } from 'react-helmet-async';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import { PrivateRoute, AdminRoute } from './routes';
import SeoFloatingButton from './components/SeoFloatingButton.jsx';
import DynamicSEO from './components/DynamicSEO-Safe.jsx';
import SafeBoundary from './components/SafeBoundary.jsx';
import { computeDefaultsFromDom } from './components/DynamicSEO.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import SeoDebugger from './components/SeoDebugger.jsx';
import AuthDebugger from './components/AuthDebugger.jsx';
import MobileBottomNav from './components/MobileBottomNav.jsx';
import Listing from './pages/Listing.jsx';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function App({ seoData }) {
  const { role, user, loading } = useAuth();
  const email = (user?.email || '').toLowerCase();
  const fallbackAdmin = ['indiacustomerhelp05@gmail.com', 'newmess1231@gmail.com', 'abhishekuniyal282@gmail.com'].includes(email);
  const showAdminUI = !!user && (role === 'admin' || fallbackAdmin);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Global: after login via redirect, if we land on /login while authenticated, send user to destination
  useEffect(() => {
    if (loading) return;
    if (location.pathname === '/login' && user) {
      const email = (user?.email || '').toLowerCase();
      const fallbackAdmin = ['indiacustomerhelp05@gmail.com', 'newmess1231@gmail.com', 'abhishekuniyal282@gmail.com'].includes(email);
      const target = role === 'admin' || fallbackAdmin ? '/admin' : '/profile';
      console.log('[App] Global auth redirect from /login to', target, 'role:', role, 'email:', email);
      navigate(target, { replace: true });
    }
  }, [location.pathname, user, role, loading, navigate]);
  
  // Log SSR data if provided
  if (seoData) {
    console.log('[App] SSR SEO data received:', seoData);
  }
  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden pb-16 md:pb-0">
      <ScrollToTop />
      
      {/* Global DynamicSEO wrapped to prevent app crash on errors */}
      <SafeBoundary>
        <DynamicSEO type="global" identifier="auto" ssrData={seoData} />
      </SafeBoundary>
      
      {/* SEO Debugger - uncomment for debugging */}
      {/* <SeoDebugger /> */}
      
      {/* Auth Debugger - uncomment for debugging */}
      {/* <AuthDebugger /> */}
      
      <Routes>
        {/* Home Page */}
        <Route path="/" element={
          <div className="overflow-x-hidden">
            {!loading && showAdminUI && <SeoFloatingButton type="home" identifier="home" />}
            <Header />
            <TrendingTicker />
            <HeroSection />
            <CategorySection />
            <StateWiseSection/>
            <ContactUs />
            <FAQSection/>
            {/* <Chatbot /> */}
            <Footer />
          </div>
        } />

        {/* About Us Page */}
        <Route path="/about" element={
          <>
            {!loading && showAdminUI && <SeoFloatingButton type="route" identifier={window.location.pathname} />}
            <Header />
            <TrendingTicker />
            <AboutUs />
            <Chatbot />
            <Footer />
          </>
        } />

        {/* Sitemap Page */}
        <Route path="/sitemap" element={
          <>
            <Header />
            <TrendingTicker />
            <SitemapPage />
            <Footer />
          </>
        } />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard - any logged in user */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <>
                <Header />
                <TrendingTicker />
                <Dashboard />
                <Footer />
              </>
            </PrivateRoute>
          }
        />

        {/* Profile - default for regular users after login */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <>
                <Header />
                <TrendingTicker />
                <Profile />
                <Footer />
              </>
            </PrivateRoute>
          }
        />

        {/* Admin Panel */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        {/* Contact Numbers Admin Panel */}
        <Route
          path="/admin/contact-numbers"
          element={
            <AdminRoute>
              <ContactNumbersAdmin />
            </AdminRoute>
          }
        />



        {/* Statewise Pages */}
        <Route path="/statewise-numbers" element={
          <>
            <Header />
            <TrendingTicker />
            <StatewiseList />
            <Footer />
          </>
        } />
        <Route path="/state/:stateId" element={
          <>
            <Header />
            <TrendingTicker />
            <StateDetail />
            <Footer />
          </>
        } />

        {/* All Categories Page */}
        <Route path="/category" element={
          <>
            {!loading && showAdminUI && <SeoFloatingButton type="all-categories" identifier="all-categories" />}
            <Header />
            <TrendingTicker />
            <AllCategories />
            <Footer />
          </>
        } />

        {/* Company Page - SEO-friendly tab routes (MUST come before category route) */}
        <Route path="/category/:categoryId/:companySlug/contactnumber" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />
        <Route path="/category/:categoryId/:companySlug/complain" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />
        <Route path="/category/:categoryId/:companySlug/quickhelp" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />
        <Route path="/category/:categoryId/:companySlug/videoguide" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />
        <Route path="/category/:categoryId/:companySlug/overview" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />

        {/* Company Page - main company route (MUST come before category route) */}
        <Route path="/category/:categoryId/:companySlug" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />
        
        {/* Company Page - shows individual company under a subcategory and category */}
        <Route path="/category/:categoryId/:subcategoryId/:companySlug" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />

        {/* Category Page - shows all companies under a category (MUST come last) */}
        <Route path="/category/:categoryId" element={
          <>
            <Header />
            <TrendingTicker />
            <CategoryPage />
            <Footer />
          </>
        } />

        {/* Dynamic Company Page Routes - for consolidated subcategory structure */}
        <Route path="/company/:companyId" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />
        <Route path="/company/:companyId/contactnumber" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />
        <Route path="/company/:companyId/complain" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />
        <Route path="/company/:companyId/quickhelp" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />
        <Route path="/company/:companyId/videoguide" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />
        <Route path="/company/:companyId/overview" element={
          <>
            <Header />
            <TrendingTicker />
            <CompanyPage />
            <Footer />
          </>
        } />
        {/* Listing entry */}
        <Route path="/home/listing" element={
          <>
            <Header />
            <TrendingTicker />
            <Listing />
            <Footer />
          </>
        } />
        {/* <Route path="/home/state-wise" element={<StateWiseCreative />} /> */}
        {/* <Route path="/home/state-wise/maharashtra" element={<MaharashtraHelplinePage />} /> */}
      </Routes>
      {/* Global mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default App;
