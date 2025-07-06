
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  FileCheck2, 
  Eye, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: Users,
      title: "Group & Private Chats",
      description: "Connect with individuals or create group conversations for seamless collaboration."
    },
    {
      icon: FileCheck2,
      title: "Rich Media Sharing",
      description: "Share images, PDFs, and files securely with instant delivery and preview."
    },
    {
      icon: Eye,
      title: "Read Receipts & Presence",
      description: "See when messages are read and who's online for better communication flow."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up in seconds with our streamlined registration process."
    },
    {
      number: "02",
      title: "Find Your People",
      description: "Instantly search and connect with friends, colleagues, and collaborators."
    },
    {
      number: "03",
      title: "Start the Conversation",
      description: "Enjoy unlimited, real-time messaging with all the features you need."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-slate-900">Pulse</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#security" className="text-slate-600 hover:text-slate-900 transition-colors">Security</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/auth" className="text-slate-600 hover:text-slate-900 transition-colors">
                Login
              </Link>
              <Link 
                to="/auth" 
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-sky-400/10 to-indigo-600/10"></div>
        <motion.div 
          style={{ y: heroY }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="text-center">
            <motion.h1 
              {...fadeInUp}
              className="text-5xl md:text-7xl font-bold text-slate-900 mb-6"
            >
              Your Conversation,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-400">
                {" "}in Real-Time
              </span>
            </motion.h1>
            
            <motion.p 
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
              className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Pulse offers a seamless, secure, and feature-rich platform for both one-on-one chats 
              and group collaboration. Connect instantly, share freely.
            </motion.p>

            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link 
                to="/auth" 
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center space-x-2 text-lg font-semibold"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a 
                href="#features" 
                className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl hover:border-slate-400 transition-colors text-lg font-semibold"
              >
                See Features
              </a>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="mt-16 relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto overflow-hidden border border-slate-200/50">
              <div className="h-12 bg-slate-100 flex items-center px-4 border-b border-slate-200">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 text-center text-sm text-slate-600 font-medium">
                  Pulse Chat
                </div>
              </div>
              <div className="p-6 h-80 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Beautiful Interface</h3>
                  <p className="text-slate-600">Clean, modern design that puts conversations first</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Connect
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to make your conversations more engaging and productive.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Seamless from Start to Finish
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Getting started with Pulse is simple and intuitive. Join thousands of users 
                who have made the switch to better communication.
              </p>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                    className="flex items-start space-x-4"
                  >
                    <div className="bg-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="text-slate-800 font-medium">Account Created</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-sky-600" />
                    </div>
                    <span className="text-slate-800 font-medium">Connected with Team</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-slate-800 font-medium">First Conversation Started</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="text-center"
          >
            <div className="bg-slate-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="h-10 w-10 text-indigo-600" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Your Privacy, Our Priority
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
              Built with security at its core, Pulse uses JWT-based authentication and 
              encrypted connections to keep your conversations private and secure.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center space-x-4 p-6 bg-slate-50 rounded-2xl">
                <Lock className="h-8 w-8 text-indigo-600" />
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900 mb-1">End-to-End Security</h3>
                  <p className="text-slate-600">Your messages are encrypted and protected</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-6 bg-slate-50 rounded-2xl">
                <ShieldCheck className="h-8 w-8 text-indigo-600" />
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900 mb-1">Secure Authentication</h3>
                  <p className="text-slate-600">JWT-based login keeps accounts safe</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-sky-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Join the Conversation?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Start connecting with your team, friends, and colleagues today. 
              It's free to get started.
            </p>
            <Link 
              to="/auth" 
              className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-slate-50 transition-all transform hover:scale-105 text-lg font-semibold"
            >
              <span>Sign Up Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-8 w-8 text-indigo-400" />
                <span className="text-2xl font-bold">Pulse</span>
              </div>
              <p className="text-slate-400">
                Real-time communication that brings people together.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Pulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
