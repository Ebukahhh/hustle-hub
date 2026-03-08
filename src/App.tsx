import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, TrendingUp, Users, ShoppingBag, QrCode } from 'lucide-react';
import SplineHero from './components/SplineHero';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-6 flex justify-between items-center pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto backdrop-blur-xl bg-white/60 px-4 py-2 rounded-full border border-white/50 shadow-sm">
        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white p-1 shadow-sm">
          {/* Using a placeholder for the logo. The user can replace src with their actual logo path */}
          <div className="w-full h-full bg-[#FF0066] rounded-full flex items-center justify-center text-white font-bold text-xs">HH</div>
        </div>
        <span className="font-bold text-[#1A1A1A] tracking-widest uppercase text-sm pr-2">Hustle Hub</span>
      </div>
    </nav>
  );
};

const calculateTimeLeft = () => {
  const difference = +new Date("2026-11-15T09:00:00") - +new Date();
  let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-24 px-6 md:px-10 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Object.entries(timeLeft).map(([unit, value], index) => (
            <motion.div 
              key={unit} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl bg-white/60 border border-white/80 shadow-xl backdrop-blur-xl"
            >
              <span className="text-6xl md:text-8xl font-bold tracking-tighter font-display text-[#1A1A1A]">{value.toString().padStart(2, '0')}</span>
              <span className="text-sm md:text-base uppercase tracking-widest text-[#FF0066] mt-2 font-bold">{unit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CredibilitySection = () => {
  return (
    <section
      className="py-32 px-6 md:px-10 text-white rounded-[3rem] md:rounded-[5rem] mx-4 md:mx-10 my-10 shadow-2xl relative overflow-hidden"
      style={{
        backgroundImage: 'url(/credibility-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/70 rounded-[3rem] md:rounded-[5rem]" aria-hidden="true" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6 font-display">
              Empowering Student <span className="text-[#FF0066]">Entrepreneurs.</span>
            </h2>
            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              Organized by the Communications Studies Department of Pentecost University, Hustle Hub is more than just a market—it's a launchpad for the next generation of business leaders.
            </p>
            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl inline-flex border border-white/10 backdrop-blur-sm">
              <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://picsum.photos/seed/face${i}/100/100`} className="w-14 h-14 rounded-full border-4 border-[#1A1A1A] object-cover" alt="Student" referrerPolicy="no-referrer" />
                 ))}
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-bold text-xl">500+ Students</span>
                <span className="text-sm text-white/60 font-medium">Already registered</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4 md:gap-6"
          >
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4 hover:bg-[#FF0066] hover:border-[#FF0066] transition-all duration-300 group">
              <ShoppingBag className="w-10 h-10 text-[#FF0066] group-hover:text-white transition-colors" />
              <div>
                <h3 className="text-4xl font-bold font-display">50+</h3>
                <p className="text-white/60 group-hover:text-white/90 font-medium mt-1">Student Vendors</p>
              </div>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4 translate-y-8 hover:bg-[#FF0066] hover:border-[#FF0066] transition-all duration-300 group">
              <Users className="w-10 h-10 text-[#FF0066] group-hover:text-white transition-colors" />
              <div>
                <h3 className="text-4xl font-bold font-display">2k+</h3>
                <p className="text-white/60 group-hover:text-white/90 font-medium mt-1">Expected Attendees</p>
              </div>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4 hover:bg-[#FF0066] hover:border-[#FF0066] transition-all duration-300 group">
              <TrendingUp className="w-10 h-10 text-[#FF0066] group-hover:text-white transition-colors" />
              <div>
                <h3 className="text-4xl font-bold font-display">100%</h3>
                <p className="text-white/60 group-hover:text-white/90 font-medium mt-1">Campus Hustle</p>
              </div>
            </div>
            <div className="p-8 bg-[#FF0066] text-white rounded-3xl flex flex-col gap-4 translate-y-8 shadow-[0_0_30px_rgba(255,0,102,0.3)]">
              <Sparkles className="w-10 h-10 text-white" />
              <div>
                <h3 className="text-xl font-bold font-display leading-tight">Pentecost University</h3>
                <p className="text-white/80 text-sm mt-2">Comm. Studies Dept.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const GalleryItem = ({ img1, img2, aspect, index }: { key?: number | string, img1: string, img2: string, aspect: string, index: number }) => {
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowFirst(false);
      const interval = setInterval(() => {
        setShowFirst(prev => !prev);
      }, 4000);
      return () => clearInterval(interval);
    }, index * 1000 + 2000); // Stagger the initial transition
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: (index % 3) * 0.15, duration: 0.7, ease: "easeOut" }}
      className={`break-inside-avoid rounded-3xl overflow-hidden relative group shadow-xl ${aspect}`}
    >
      <img 
        src={img1} 
        alt={`Hustle Hub Vibe ${index + 1} A`} 
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${showFirst ? 'opacity-100' : 'opacity-0'}`} 
        referrerPolicy="no-referrer" 
      />
      <img 
        src={img2} 
        alt={`Hustle Hub Vibe ${index + 1} B`} 
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${showFirst ? 'opacity-0' : 'opacity-100'}`} 
        referrerPolicy="no-referrer" 
      />
      <div className="absolute inset-0 bg-[#FF0066]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-10" />
    </motion.div>
  );
};

const GallerySection = () => {
  const imagePairs = [
    { src1: "/gallery/gallery-1.jpg", src2: "/gallery/gallery-1b.jpg", aspect: "aspect-[4/5]" },
    { src1: "/gallery/gallery-2.jpg", src2: "/gallery/gallery-2b.jpg", aspect: "aspect-square" },
    { src1: "/gallery/gallery-3.jpg", src2: "/gallery/gallery-3b.jpg", aspect: "aspect-[2/3]" },
    { src1: "/gallery/gallery-4.jpg", src2: "/gallery/gallery-4b.jpg", aspect: "aspect-[4/5]" },
    { src1: "/gallery/gallery-5.jpg", src2: "/gallery/gallery-5b.jpg", aspect: "aspect-[4/5]" },
    { src1: "/gallery/gallery-6.jpg", src2: "/gallery/gallery-6b.jpg", aspect: "aspect-square" },
  ];

  return (
    <section className="py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter font-display text-[#1A1A1A] leading-none">
            The <br className="hidden md:block" />Vibe.
          </h2>
          <p className="text-[#1A1A1A]/60 max-w-sm text-left md:text-right text-lg font-medium">
            A sneak peek into what awaits you at Hustle Hub 2026. Student creativity, networking, and pure hustle.
          </p>
        </div>
        
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {imagePairs.map((pair, i) => (
            <GalleryItem key={i} img1={pair.src1} img2={pair.src2} aspect={pair.aspect} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  return (
    <section className="py-24 px-6 md:px-10 pb-32">
      <div className="max-w-7xl mx-auto bg-[#1A1A1A] rounded-[3rem] text-white relative flex flex-col md:flex-row overflow-hidden shadow-2xl border border-white/10">
        
        {/* Left Side: Full Image */}
        <div className="md:w-1/2 relative bg-[#F6F4F7] flex items-center justify-center p-8 min-h-[400px]">
          <img 
            src="/cta-bg.jpg" 
            alt="Hustle Hub Team" 
            className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Right Side: CTA Content */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center items-center md:items-start text-center md:text-left z-10 relative">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF0066] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12vw] md:text-[6rem] font-bold tracking-tighter leading-none mb-6 font-display"
          >
            Join the<br/>Hustle.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70 mb-10 max-w-md font-medium"
          >
            Secure your spot as a vendor or attendee today.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4 w-full"
          >
            <input 
              type="text" 
              placeholder="Your Name" 
              className="bg-white/5 border border-white/10 rounded-full px-8 py-5 text-lg focus:outline-none focus:border-[#FF0066] transition-colors w-full placeholder:text-white/30 text-white backdrop-blur-md"
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-white/5 border border-white/10 rounded-full px-8 py-5 text-lg focus:outline-none focus:border-[#FF0066] transition-colors w-full placeholder:text-white/30 text-white backdrop-blur-md"
            />
            <button className="bg-[#FF0066] text-white rounded-full px-10 py-5 text-lg font-bold hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 flex items-center justify-center gap-2 w-full mt-2 shadow-[0_0_30px_rgba(255,0,102,0.4)] hover:scale-[1.02]">
              Register Now <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white/50 py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#FF0066] font-bold font-display text-sm">HH</div>
          <span className="font-bold text-white tracking-widest uppercase text-sm">Hustle Hub</span>
        </div>
        
        <div className="text-sm text-center md:text-left font-medium">
          &copy; 2026 Pentecost University Communications Studies Department. All rights reserved.
        </div>
        
        <div className="flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-[#FF0066] transition-colors">Instagram</a>
          <a href="#" className="hover:text-[#FF0066] transition-colors">Twitter</a>
          <a href="#" className="hover:text-[#FF0066] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#F6F4F7] text-[#1A1A1A] font-sans selection:bg-[#FF0066] selection:text-white">
      <Navbar />
      <main>
        <SplineHero />
        <CountdownSection />
        <CredibilitySection />
        <GallerySection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
