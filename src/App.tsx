import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Users, ShoppingBag, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import SplineHero from './components/SplineHero';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-6 flex justify-between items-center pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto backdrop-blur-xl bg-white/60 px-4 py-2 rounded-full border border-white/50 shadow-sm">
        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white p-1 shadow-sm">
          {/* Using a placeholder for the logo. The user can replace src with their actual logo path */}
          <div className="w-full h-full bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold text-xs">HH</div>
        </div>
        <span className="font-bold text-[#4A2411] tracking-widest uppercase text-sm pr-2">Hustle Hub</span>
      </div>
    </nav>
  );
};

const calculateTimeLeft = () => {
  const difference = +new Date("2025-04-15T09:00:00") - +new Date(); // Updated target year to 2025
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
              <span className="text-6xl md:text-8xl font-bold tracking-tighter font-display text-[#4A2411]">{value.toString().padStart(2, '0')}</span>
              <span className="text-sm md:text-base uppercase tracking-widest text-[#F59E0B] mt-2 font-bold">{unit}</span>
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
      <div className="absolute inset-0 bg-[#4A2411]/80 rounded-[3rem] md:rounded-[5rem]" aria-hidden="true" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6 font-display">
              Empowering Student <span className="text-[#F59E0B]">Entrepreneurs.</span>
            </h2>
            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              Organized by the Communications Studies Department of Pentecost University, Hustle Hub is more than just a market—it's a launchpad for the next generation of business leaders.
            </p>
            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl inline-flex border border-white/10 backdrop-blur-sm">
              <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://picsum.photos/seed/face${i}/100/100`} className="w-14 h-14 rounded-full border-4 border-[#4A2411] object-cover" alt="Student" referrerPolicy="no-referrer" />
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
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4 hover:bg-[#F59E0B] hover:border-[#F59E0B] transition-all duration-300 group">
              <ShoppingBag className="w-10 h-10 text-[#F59E0B] group-hover:text-white transition-colors" />
              <div>
                <h3 className="text-4xl font-bold font-display">50+</h3>
                <p className="text-white/60 group-hover:text-white/90 font-medium mt-1">Student Vendors</p>
              </div>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4 translate-y-8 hover:bg-[#F59E0B] hover:border-[#F59E0B] transition-all duration-300 group">
              <Users className="w-10 h-10 text-[#F59E0B] group-hover:text-white transition-colors" />
              <div>
                <h3 className="text-4xl font-bold font-display">2k+</h3>
                <p className="text-white/60 group-hover:text-white/90 font-medium mt-1">Expected Attendees</p>
              </div>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4 hover:bg-[#F59E0B] hover:border-[#F59E0B] transition-all duration-300 group">
              <TrendingUp className="w-10 h-10 text-[#F59E0B] group-hover:text-white transition-colors" />
              <div>
                <h3 className="text-4xl font-bold font-display">100%</h3>
                <p className="text-white/60 group-hover:text-white/90 font-medium mt-1">Campus Hustle</p>
              </div>
            </div>
            <div className="p-8 bg-[#F59E0B] text-white rounded-3xl flex flex-col gap-4 translate-y-8 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
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
      <motion.img 
        src={img1} 
        alt={`Hustle Hub Vibe ${index + 1} A`} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        loading="lazy"
        decoding="async"
        initial={{ opacity: 1 }}
        animate={{ opacity: showFirst ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.img 
        src={img2} 
        alt={`Hustle Hub Vibe ${index + 1} B`} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0 }}
        animate={{ opacity: showFirst ? 0 : 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[#F59E0B]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-10" />
    </motion.div>
  );
};

const GallerySection = () => {
  const imagePairs = [
    { src1: "/gallery/gallery-1.webp", src2: "/gallery/gallery-1b.webp", aspect: "aspect-[4/5]" },
    { src1: "/gallery/gallery-2.webp", src2: "/gallery/gallery-2b.webp", aspect: "aspect-square" },
    { src1: "/gallery/gallery-3.webp", src2: "/gallery/gallery-3b.webp", aspect: "aspect-[2/3]" },
    { src1: "/gallery/gallery-4.webp", src2: "/gallery/gallery-4b.webp", aspect: "aspect-[4/5]" },
    { src1: "/gallery/gallery-5.webp", src2: "/gallery/gallery-5b.webp", aspect: "aspect-[4/5]" },
    { src1: "/gallery/gallery-6.webp", src2: "/gallery/gallery-6b.webp", aspect: "aspect-square" },
  ];

  return (
    <section className="py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter font-display text-[#4A2411] leading-none">
            The <br className="hidden md:block" />Vibe.
          </h2>
          <p className="text-[#4A2411]/60 max-w-sm text-left md:text-right text-lg font-medium">
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

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#4A2411]/10 rounded-3xl bg-white/50 backdrop-blur-sm overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 md:p-8 text-left focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
        aria-expanded={isOpen}
      >
        <span className="text-xl md:text-2xl font-bold font-display text-[#4A2411] pr-4">{question}</span>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#F59E0B] text-white' : 'bg-[#4A2411]/5 text-[#4A2411] hover:bg-[#F59E0B]/20'}`}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 md:px-8 pb-8 text-[#4A2411]/70 text-lg leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqSection = () => {
  const faqs = [
    {
      question: "Who can attend Hustle Hub 2026?",
      answer: "Hustle Hub is open to everyone! While it is organized by the Pentecost University Comm. Studies Department, students from all departments, local entrepreneurs, and the general public are highly encouraged to attend, network, and shop."
    },
    {
      question: "How do I register as a student vendor?",
      answer: "Scroll down to the 'Join the Hustle' section and fill out your name and email. Once submitted, our team will email you the official vendor registration packet with stall details and pricing."
    },
    {
      question: "Is there an entry fee for attendees?",
      answer: "General admission for attendees is completely free! Come support student businesses, enjoy the music, and experience the vibe without worrying about an entrance fee."
    },
    {
      question: "What kind of products/services will be there?",
      answer: "You'll find a massive variety of student-run businesses ranging from fashion, customized merch, food and beverages, tech accessories, digital services, and much more."
    }
  ];

  return (
    <section className="py-24 px-6 md:px-10 bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] font-bold text-sm tracking-widest uppercase mb-6"
          >
            Got Questions?
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter font-display text-[#4A2411] mb-6"
          >
            F.A.Q
          </motion.h2>
        </div>
        
        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <FaqItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  return (
    <section className="py-24 px-6 md:px-10 pb-32">
      <div className="max-w-7xl mx-auto bg-[#4A2411] rounded-[3rem] text-white relative flex flex-col md:flex-row overflow-hidden shadow-2xl border border-white/10">
        
        {/* Left Side: Full Image */}
        <div className="md:w-1/2 relative bg-[#FAFAFA] flex items-center justify-center p-8 min-h-[400px]">
          <img 
            src="/cta-bg.webp" 
            alt="Hustle Hub Team" 
            className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Right Side: CTA Content */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center items-center md:items-start text-center md:text-left z-10 relative">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#F59E0B] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>
          
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
              className="bg-white/5 border border-white/10 rounded-full px-8 py-5 text-lg focus:outline-none focus:border-[#F59E0B] transition-colors w-full placeholder:text-white/30 text-white backdrop-blur-md"
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-white/5 border border-white/10 rounded-full px-8 py-5 text-lg focus:outline-none focus:border-[#F59E0B] transition-colors w-full placeholder:text-white/30 text-white backdrop-blur-md"
            />
            <button className="bg-[#F59E0B] text-white rounded-full px-10 py-5 text-lg font-bold hover:bg-white hover:text-[#4A2411] transition-all duration-300 flex items-center justify-center gap-2 w-full mt-2 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-[1.02]">
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
    <footer className="bg-[#4A2411] text-white/50 py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#F59E0B] font-bold font-display text-sm">HH</div>
          <span className="font-bold text-white tracking-widest uppercase text-sm">Hustle Hub</span>
        </div>
        
        <div className="text-sm text-center md:text-left font-medium">
          &copy; 2026 Pentecost University Communications Studies Department. All rights reserved.
        </div>
        
        <div className="flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-[#F59E0B] transition-colors">Instagram</a>
          <a href="#" className="hover:text-[#F59E0B] transition-colors">Twitter</a>
          <a href="#" className="hover:text-[#F59E0B] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#4A2411] font-sans selection:bg-[#F59E0B] selection:text-white">
      <Navbar />
      <main>
        <SplineHero />
        <CountdownSection />
        <CredibilitySection />
        <GallerySection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
