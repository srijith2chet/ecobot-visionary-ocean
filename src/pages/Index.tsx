
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UploadComponent from '@/components/detection/UploadComponent';
import ResultsDisplay from '@/components/detection/ResultsDisplay';
import { DetectionResult } from '@/types/detection';
import { setupModelIntegration } from '@/services/detectionService';
import { ArrowDown, Database, Cpu, BarChart3, Globe } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Initialize the detection model integration
    setupModelIntegration();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDetectionComplete = (results: DetectionResult[], imageUrl: string) => {
    setDetectionResults(results);
    setProcessedImage(imageUrl);
  };

  const handleError = (error: string) => {
    toast.error('Error', { description: error });
  };

  const handleReset = () => {
    setDetectionResults([]);
    setProcessedImage(null);
  };

  return (
    <div className="min-h-screen bg-ocean text-white overflow-hidden">
      {/* Background effects */}
      <div className="blob left-[-15%] top-[20%]"></div>
      <div className="blob right-[-10%] top-[50%]"></div>
      <div className="water-effect"></div>
      
      <Navbar />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-ocean-light/30 text-aqua mb-6 animate-fade-in">
              <span className="text-sm font-medium">AI-Powered Ocean Conservation</span>
            </div>
            <h1 className="heading-xl mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Detect Ocean Plastic with <br className="hidden md:inline" />
              <span className="text-aqua">Advanced AI</span>
            </h1>
            <p className="body-text text-white/70 max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              EcoBot uses computer vision and deep learning to identify and classify sea plastic waste,
              helping researchers and conservationists monitor and combat ocean pollution.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <a href="#detection" className="button-primary">Try Detection Now</a>
              <a href="#learn-more" className="button-outlined">Learn More</a>
            </div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-pulse">
              <div className="flex flex-col items-center cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                <span className="text-sm mb-2">Scroll to Explore</span>
                <ArrowDown size={20} />
              </div>
            </div>
          </div>
        </section>
        
        {/* Detection Section */}
        <section id="detection" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-ocean-light/30 text-aqua mb-4">
                <span className="text-sm font-medium">AI Detection</span>
              </div>
              <h2 className="heading-lg mb-4">Plastic Detection & Classification</h2>
              <p className="body-text text-white/70 max-w-2xl mx-auto">
                Upload satellite, drone, or underwater images to detect plastic waste using our advanced AI model.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              {detectionResults.length === 0 ? (
                <UploadComponent
                  onDetectionComplete={handleDetectionComplete}
                  onError={handleError}
                />
              ) : (
                <ResultsDisplay
                  results={detectionResults}
                  imageUrl={processedImage as string}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="learn-more" className="py-20 px-4 bg-ocean-dark">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 rounded-full bg-ocean-light/30 text-aqua mb-4">
                <span className="text-sm font-medium">Features</span>
              </div>
              <h2 className="heading-lg mb-4">How EcoBot Works</h2>
              <p className="body-text text-white/70 max-w-2xl mx-auto">
                Our platform combines cutting-edge AI with user-friendly tools to help detect and monitor ocean plastic pollution.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Cpu className="w-10 h-10 text-aqua" />,
                  title: 'Advanced AI',
                  description: 'Powered by YOLOv4 deep learning model trained on thousands of ocean plastic images'
                },
                {
                  icon: <Database className="w-10 h-10 text-aqua" />,
                  title: 'Classification',
                  description: 'Accurately identifies bottles, fishing nets, microplastics, and general waste'
                },
                {
                  icon: <Globe className="w-10 h-10 text-aqua" />,
                  title: 'Location Mapping',
                  description: 'Maps detected plastic locations based on image metadata for real-time monitoring'
                },
                {
                  icon: <BarChart3 className="w-10 h-10 text-aqua" />,
                  title: 'Analytics',
                  description: 'Generates insights and reports on plastic pollution trends and hotspots'
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="glass-panel p-6 flex flex-col items-center text-center hover:border-aqua/30 transition-all duration-300"
                >
                  <div className="mb-5">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-2xl border border-white/10">
            <div className="text-center">
              <h2 className="heading-lg mb-6">Ready to Join the Fight Against Ocean Plastic?</h2>
              <p className="body-text text-white/70 mb-8">
                Sign up today to access all features and contribute to cleaner oceans through data-driven conservation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#detection" className="button-primary">Try Detection Now</a>
                <button className="button-outlined">Sign Up for Free</button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Scroll to top button */}
      <button 
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-aqua text-ocean-dark z-50 shadow-lg transition-all duration-300 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowDown className="w-5 h-5 transform rotate-180" />
      </button>
    </div>
  );
};

export default Index;
