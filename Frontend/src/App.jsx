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

import { Helmet } from 'react-helmet-async';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import { PrivateRoute, AdminRoute } from './routes';
import SeoFloatingButton from './components/SeoFloatingButton.jsx';
import DynamicSEO from './components/DynamicSEO.jsx';
import SafeBoundary from './components/SafeBoundary.jsx';
import { computeDefaultsFromDom } from './components/DynamicSEO.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

function App() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  return (
    <div className="min-h-screen bg-gray-100">
      <ScrollToTop />
      
      {/* Global DynamicSEO wrapped to prevent app crash on errors */}
      <SafeBoundary>
        <DynamicSEO type="global" identifier="auto" />
      </SafeBoundary>
      
      <Routes>
        {/* Home Page */}
        <Route path="/" element={
          <>
            {isAdmin && <SeoFloatingButton type="home" identifier="home" />}
            <Header />
            <TrendingTicker />
            <HeroSection />
            <CategorySection />
            <StateWiseSection/>
            <ContactUs />
            <FAQSection/>
            {/* <Chatbot /> */}
            <Footer />
          </>
        } />

        {/* About Us Page */}
        <Route path="/about" element={
          <>
            {isAdmin && <SeoFloatingButton type="route" identifier={window.location.pathname} defaults={computeDefaultsFromDom()} />}
            <Header />
            <TrendingTicker />
            <AboutUs />
            <Chatbot />
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
            {isAdmin && <SeoFloatingButton type="all-categories" identifier="all-categories" />}
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
        {/* <Route path="/home/state-wise" element={<StateWiseCreative />} /> */}
        {/* <Route path="/home/state-wise/maharashtra" element={<MaharashtraHelplinePage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
