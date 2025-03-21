
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, GitHub, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ocean-dark pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-aqua flex items-center justify-center">
                <span className="text-ocean-dark font-bold text-lg">E</span>
              </div>
              <span className="text-aqua font-bold text-xl">EcoBot</span>
            </div>
            <p className="text-white/70 mb-6">
              AI-powered solution for detecting and classifying ocean plastic waste using computer vision and deep learning.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-aqua transition-colors">
                <GitHub size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-aqua transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-aqua transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-aqua transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Detection', 'Analytics', 'AI Insights', 'Community'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-white/70 hover:text-aqua flex items-center transition-colors">
                    <ChevronRight size={16} className="mr-1" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Model Training', 'Ocean Data', 'Publications'].map((item) => (
                <li key={item}>
                  <Link to={`/resources/${item.toLowerCase().replace(' ', '-')}`} className="text-white/70 hover:text-aqua flex items-center transition-colors">
                    <ChevronRight size={16} className="mr-1" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Subscribe</h3>
            <p className="text-white/70 mb-4">
              Join our newsletter to get updates on ocean conservation and our technology.
            </p>
            <form className="mb-6">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-ocean-light/50 border border-white/10 rounded-md py-2 pl-3 pr-12 text-white/90 focus:outline-none focus:ring-2 focus:ring-aqua"
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1 bottom-1 px-3 bg-aqua text-ocean-dark rounded-md hover:bg-aqua-light transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} EcoBot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
