
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-ocean text-white overflow-hidden flex flex-col">
      {/* Background effects */}
      <div className="blob left-[-20%] top-[30%]"></div>
      <div className="blob right-[-10%] top-[60%]"></div>
      
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 text-center z-10">
        <div className="max-w-lg">
          <div className="glass-panel p-10 border border-white/10">
            <h1 className="text-8xl font-bold text-aqua mb-6">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-white/70 mb-8">
              The page you are looking for might have been removed or is temporarily unavailable.
            </p>
            <Link to="/" className="button-primary inline-flex items-center">
              <Home className="mr-2" size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
