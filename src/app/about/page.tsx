import Image from "next/image";
import { Shield, Leaf, Target, Award } from "lucide-react";
import { OurStoryCarousel } from "@/components/OurStoryCarousel";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000" 
            alt="Office workspace" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-6">
            Redefining Refurbished.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
            We believe premium technology shouldn't cost the earth. High performance, rigorous testing, and a commitment to sustainability.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded with a simple vision: to make high-end computing accessible to everyone while reducing electronic waste. Lapitex started in a small workshop repairing discarded enterprise laptops.
              </p>
              <p>
                Today, we are a leading provider of premium refurbished IT solutions. We don't just sell used computers; we completely re-engineer them. Every device that passes through our doors is subjected to a military-grade 50-point diagnostic test.
              </p>
              <p>
                Whether you're a student looking for your first Mac, or an enterprise outfitting a new department, Lapitex delivers uncompromised quality at a fraction of the retail price.
              </p>
            </div>
          </div>
          <OurStoryCarousel />
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Core Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <Shield className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Uncompromised Quality</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Every component is tested, cleaned, and verified to ensure it meets our strict performance standards.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <Leaf className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Sustainability First</h3>
              <p className="text-gray-500 text-sm leading-relaxed">By extending the life of electronics, we actively reduce e-waste and lower the carbon footprint of computing.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <Target className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Customer Focus</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Transparent grading, honest pricing, and dedicated post-sale support for absolute peace of mind.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <Award className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Industry Expertise</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Our technicians are certified professionals with years of experience in enterprise hardware.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
