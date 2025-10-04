'use client'

import { useEffect, useState } from "react";
import { ChefHat, Home, ArrowLeft, Coffee, Croissant } from "lucide-react";

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center px-4 py-8">
      {/* Floating bakery icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Croissant className="absolute top-20 left-10 text-amber-200 w-8 h-8 animate-bounce" style={{animationDelay: '0s'}} />
        <Coffee className="absolute top-32 right-20 text-amber-300 w-6 h-6 animate-bounce" style={{animationDelay: '1s'}} />
        <ChefHat className="absolute bottom-32 left-20 text-orange-200 w-10 h-10 animate-bounce" style={{animationDelay: '2s'}} />
        <Croissant className="absolute bottom-20 right-10 text-red-200 w-7 h-7 animate-bounce" style={{animationDelay: '0.5s'}} />
      </div>

      <div className={`max-w-2xl mx-auto text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Main 404 Content */}
        <div className="bg-white/80 backdrop-blur-xs rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/20">
          {/* Chef Hat Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
              <ChefHat className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
          </div>

          {/* 404 Title */}
          <div className="mb-8">
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold bg-linear-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <div className="w-24 h-1 bg-linear-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Oops! This Recipe Went Missing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto">
              Looks like this page got lost in the kitchen! Don't worry, our chefs are working on finding it.
              In the meantime, let's get you back to our delicious menu.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/"
              className="group inline-flex items-center justify-center px-8 py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-amber-600 hover:to-orange-600 w-full sm:w-auto"
            >
              <Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Back to Home
            </a>
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-gray-200 hover:border-amber-300 w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Go Back
            </button>
          </div>

          {/* Additional Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Or explore our delicious options:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/menu" className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 hover:underline">
                Our Menu
              </a>
              <span className="text-gray-300">•</span>
              <a href="/about" className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 hover:underline">
                About Us
              </a>
              <span className="text-gray-300">•</span>
              <a href="/contact" className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 hover:underline">
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-amber-500">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;