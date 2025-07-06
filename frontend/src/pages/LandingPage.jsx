// frontend/src/pages/LandingPage.jsx

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, Users, FileCheck2, Eye, ShieldCheck, ArrowRight, Sun, Moon 
} from 'lucide-react';
import Auth from '../components/Authentication/Auth';
import ReusableModal from '../components/miscellaneous/ReusableModal';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState('login');
  
  const [landingTheme, setLandingTheme] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/chats');
    }
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (tab) => {
    setInitialTab(tab);
    setIsAuthModalOpen(true);
  };
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(landingTheme);
  }, [landingTheme]);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    { icon: Users, title: "Group & Private Chats", description: "Connect with individuals or create group conversations for seamless collaboration." },
    { icon: FileCheck2, title: "Rich Media Sharing", description: "Share images, videos, and documents securely with instant delivery." },
    { icon: Eye, title: "Real-Time Presence", description: "See when messages are read and who's online for better communication flow." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-md border-b border-slate-200 dark:border-slate-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <MessageSquare className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">NexChat</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setLandingTheme(landingTheme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Toggle theme"
              >
                {landingTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button onClick={() => openAuthModal('login')} className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold px-4 py-2">Login</button>
              <button onClick={() => openAuthModal('signup')} className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-transform duration-200 hover:scale-105 shadow-sm font-semibold">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-sky-400/5 to-indigo-600/5 dark:from-indigo-900/10 dark:via-sky-900/10 dark:to-indigo-800/10"></div>
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tighter">
              Your Conversation,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">
                Instantly Connected.
              </span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              NexChat offers a seamless, secure, and feature-rich platform for both one-on-one chats and group collaboration.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <button onClick={() => openAuthModal('signup')} className="bg-indigo-600 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center space-x-2 text-lg font-semibold mx-auto">
                <span>Get Started for Free</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything You Need to Connect</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Powerful features designed for productive conversations.</p>
          </motion.div>
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-700">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Security Section */}
      <section id="security" className="py-24 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
            <div className="inline-block p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-3xl mb-6">
              <ShieldCheck className="h-10 w-10 text-brand-primary" />
            </div>
            <h2 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Your Privacy, Our Priority</h2>
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">Built with security at its core, NexChat uses modern authentication and secure connections to keep your conversations private.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-sky-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Join the Conversation?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">Start connecting with your team and friends today. It's free to get started.</p>
            <button onClick={() => openAuthModal('signup')} className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-8 py-4 rounded-xl shadow-lg hover:bg-slate-50 transition-all transform hover:scale-105 text-lg font-semibold">
              <span>Sign Up Now</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-800 dark:bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>© {new Date().getFullYear()} NexChat. All rights reserved.</p>
        </div>
      </footer>

      {/* Authentication Modal */}
      <ReusableModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Welcome to NexChat"
        theme={landingTheme}
      >
        <Auth 
          initialTab={initialTab} 
          authTheme={landingTheme}
        />
      </ReusableModal>
    </div>
  );
};

export default LandingPage;