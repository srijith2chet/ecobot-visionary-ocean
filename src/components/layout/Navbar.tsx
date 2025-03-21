
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Detection', path: '/detection' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'AI Insights', path: '/ai-insights' },
    { name: 'Community', path: '/community' },
  ];

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 px-4 md:px-8',
        isScrolled ? 'bg-ocean-dark/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-aqua flex items-center justify-center">
            <span className="text-ocean-dark font-bold text-lg">E</span>
          </div>
          <span className="text-aqua font-bold text-xl">EcoBot</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {navigationItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="text-white/80 hover:text-aqua transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-white/80 hover:text-aqua transition-colors duration-200">
            Login
          </Link>
          <Link 
            to="/register" 
            className="button-outlined py-2 px-4 text-sm"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white/80 hover:text-aqua transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-ocean-dark/95 backdrop-blur-md border-t border-white/10 animate-fade-in">
          <div className="px-4 py-5 space-y-3">
            {navigationItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className="block text-white/80 hover:text-aqua py-2 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
              <Link 
                to="/login" 
                className="block text-white/80 hover:text-aqua py-2 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="button-outlined w-full text-center py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
