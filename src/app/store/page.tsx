import Link from "next/link";
import { MapPin, Phone, Clock, Navigation, MessageCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function StorePage() {
  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 md:pb-12 pt-16 md:pt-24">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/store-interior.png" 
            alt="Lapitex Premium Store" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white/90 text-sm font-bold tracking-widest uppercase mb-4 border border-white/20">
              Experience Center
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">
              Visit our Flagship Offline Store
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-medium max-w-xl">
              Immerse yourself in our curated collection of premium tech. Get hands-on with laptops, components, and bespoke setups before you buy.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Info Card */}
          <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white/60 flex flex-col justify-between h-full lg:col-span-1">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Store Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">Address</h3>
                    <h3 className="text-xl font-bold text-[#2d1a26] mb-2 flex items-center gap-2">
                      <Logo className="text-xl" />
                    </h3>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      Union bank in building, Chandi vayapar bhawan,<br/>
                      W2 2nd floor, Brajkishore Path,<br/>
                      near Pillar no 15,<br/>
                      Patna, Bihar 800001
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">Opening Hours</h3>
                    <p className="text-gray-600 font-medium">Monday - Saturday: 10:30 AM - 8:00 PM</p>
                    <p className="text-gray-600 font-medium">Sunday: Closed</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">Contact</h3>
                    <div className="space-y-1.5">
                      <a href="tel:+916200144824" className="block text-gray-600 hover:text-primary font-medium transition-colors">
                        Call: +91 6200144824
                      </a>
                      <a href="https://wa.me/918809975386" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 font-medium transition-colors">
                        <MessageCircle className="w-4 h-4" /> WhatsApp: +91 8809975386
                      </a>
                      <a href="https://wa.me/918789710408" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 font-medium transition-colors">
                        <MessageCircle className="w-4 h-4" /> WhatsApp: +91 8789710408
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <a 
                href="https://maps.app.goo.gl/dTpRu4w3xWs2inDh7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Navigation className="w-5 h-5" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Map Display */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden lg:col-span-2 h-[400px] lg:h-full min-h-[500px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.6835178659174!2d85.1326462!3d25.6154388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5910709fe563%3A0x36a19dc705d1368a!2sLAPITEX%20IT%20SOLUTION!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
}
