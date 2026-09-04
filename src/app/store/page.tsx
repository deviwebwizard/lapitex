import Link from "next/link";
import { MapPin, Phone, Clock, Navigation, MessageCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import prisma from "@/lib/prisma";
import { mergeContact, safeUrl, whatsappUrl } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

function SocialIcon({ type, className }: { type: "instagram" | "facebook" | "youtube"; className?: string }) {
  const paths = {
    instagram: "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm8.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    facebook: "M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.7.3-1 1-1Z",
    youtube: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z",
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={className}><path d={paths[type]} fill="currentColor" /></svg>;
}

export default async function StorePage() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "CONTACT_INFO" } });
  const contact = mergeContact(setting ? JSON.parse(setting.value) : undefined);
  const mapsUrl = safeUrl(contact.googleMapsAddress, "https://maps.app.goo.gl/7SVrjsUaYGACSe967");
  const embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.6835178659174!2d85.1326462!3d25.6154388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5910709fe563%3A0x36a19dc705d1368a!2sLAPITEX%20IT%20SOLUTION!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";
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
                      {contact.address.split("\n").map((line) => <span key={line} className="block">{line}</span>)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">Opening Hours</h3>
                    <p className="text-gray-600 font-medium">Monday - Saturday: {contact.mondaySaturdayHours}</p>
                    <p className="text-gray-600 font-medium">Sunday: {contact.sundayHours}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">Contact</h3>
                    <div className="space-y-1.5">
                      <a href={whatsappUrl(contact.whatsapp1)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 font-medium transition-colors">
                        <MessageCircle className="w-4 h-4" /> WhatsApp: {contact.whatsapp1}
                      </a>
                      <a href={whatsappUrl(contact.whatsapp2)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 font-medium transition-colors">
                        <MessageCircle className="w-4 h-4" /> WhatsApp: {contact.whatsapp2}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <a 
                href={mapsUrl}
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
              src={embedUrl}
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

        {/* Social Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <a
            href={safeUrl(contact.instagram, "#")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-2xl bg-white/85 border border-pink-100 px-6 py-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <span className="font-bold text-gray-800">Instagram</span>
            <SocialIcon type="instagram" className="w-7 h-7 text-pink-500" />
          </a>
          <a
            href={safeUrl(contact.facebook, "#")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-2xl bg-white/85 border border-blue-100 px-6 py-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <span className="font-bold text-gray-800">Facebook</span>
            <SocialIcon type="facebook" className="w-7 h-7 text-blue-600" />
          </a>
          <a
            href={safeUrl(contact.youtube, "#")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-2xl bg-white/85 border border-red-100 px-6 py-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <span className="font-bold text-gray-800">YouTube</span>
            <SocialIcon type="youtube" className="w-7 h-7 text-red-600" />
          </a>
        </div>
      </div>
    </div>
  );
}
