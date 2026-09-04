import prisma from "@/lib/prisma";
import { mergeAbout } from "@/lib/siteContent";
import { Shield, Leaf, Target, Award } from "lucide-react";
import { OurStoryCarousel } from "@/components/OurStoryCarousel";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "ABOUT_PAGE" } });
  const content = mergeAbout(setting ? JSON.parse(setting.value) : undefined);
  const icons = [Shield, Leaf, Target, Award];
  return <div className="bg-background min-h-screen">
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden"><div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000" alt="Office workspace" className="w-full h-full object-cover opacity-20" /><div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background" /></div><div className="relative z-10 text-center px-4 max-w-4xl mx-auto"><h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-6">{content.heroTitle}</h1><p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">{content.heroSubtitle}</p></div></section>
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"><div className="grid md:grid-cols-2 gap-16 items-center"><div><h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">{content.storyTitle}</h2><div className="space-y-4 text-gray-600 leading-relaxed">{content.storyBody.map((text, i) => <p key={i}>{text}</p>)}</div></div><OurStoryCarousel images={content.images} /></div></section>
    <section className="py-24 bg-white border-y border-gray-100"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-16"><h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Core Values</h2></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">{content.coreValues.slice(0, 4).map((value, i) => { const Icon = icons[i]; return <div className="text-center" key={`${value.title}-${i}`}><div className="mx-auto h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100"><Icon className="h-8 w-8 text-primary" strokeWidth={1.5} /></div><h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{value.description}</p></div>; })}</div></div></section>
  </div>;
}
