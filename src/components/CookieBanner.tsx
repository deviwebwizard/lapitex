"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (status: "allow" | "deny") => {
    localStorage.setItem("cookieConsent", status);
    setIsVisible(false);
    if (status === "deny") {
      console.log("Cookies denied");
    } else {
      console.log("Cookies allowed");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-4xl mx-auto clay-card p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border border-pink-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-6 h-6 text-[#e1467c]" />
          </div>
          <div>
            <h3 className="font-bold text-[#2d1a26] text-lg tracking-tight mb-1">
              We Value Your Privacy
            </h3>
            <p className="text-sm text-[#4a1a2e]/60 font-medium">
              We use cookies to enhance your browsing experience and keep you securely logged in. 
              By clicking "Allow", you consent to our use of cookies.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
          <button 
            onClick={() => handleConsent("deny")}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-full border border-pink-200 text-sm font-bold text-[#4a1a2e]/60 hover:bg-pink-50 transition-colors"
          >
            Deny
          </button>
          <button 
            onClick={() => handleConsent("allow")}
            className="flex-1 sm:flex-none clay-btn px-8 py-2.5 rounded-full text-sm font-bold text-white shadow-md shadow-[#e1467c]/20 hover:shadow-lg hover:shadow-[#e1467c]/30 transition-all"
          >
            Allow
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#4a1a2e]/40 hover:bg-pink-50 hover:text-[#e1467c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
