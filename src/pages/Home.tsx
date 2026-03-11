import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Users, ShoppingBag, MapPin, Calendar, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SplineHero from '../components/SplineHero';

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
  const difference = +new Date("2026-04-11T11:00:00") - +new Date();
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
                {[1, 2, 3, 4].map(i => (
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

        <div className="columns-2 md:columns-3 gap-6 space-y-6">
          {imagePairs.map((pair, i) => (
            <GalleryItem key={i} img1={pair.src1} img2={pair.src2} aspect={pair.aspect} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FaqItem = ({ question, answer }: { question: string, answer: React.ReactNode }) => {
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
      question: "1. What is The Hustle Hub Trade Fair?",
      answer: "The Hustle Hub Trade Fair is a student entrepreneurship event organized by the Communications Studies Department of Pentecost University. The event provides a platform for student entrepreneurs to showcase, promote, and sell their products and services, while connecting with customers and fellow innovators."
    },
    {
      question: "2. When will the trade fair take place?",
      answer: "The trade fair will take place on 11th April and activities will begin at 11:00 AM sharp."
    },
    {
      question: "3. Where will the event be held?",
      answer: "The event will be held at Pentecost University, Sowutuom campus-Accra."
    },
    {
      question: "4. Who is organizing the event?",
      answer: "The trade fair is organized by the Communications Studies Department of Pentecost University, as part of efforts to encourage student innovation, entrepreneurship, and practical business experience."
    },
    {
      question: "5. Who can participate in the trade fair?",
      answer: (
        <>
          <p className="mb-2">Participation is open to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>students</li>
            <li>small business owners</li>
            <li>industry stakeholders</li>
            <li>members of the university</li>
          </ul>
        </>
      )
    },
    {
      question: "6. What kinds of businesses or products can be exhibited?",
      answer: (
        <>
          <p className="mb-2">Participants can showcase different types of businesses such as:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>fashion and clothing</li>
            <li>food and snacks</li>
            <li>beauty and skincare products</li>
            <li>creative arts and crafts</li>
            <li>digital or tech services</li>
            <li>handmade items</li>
            <li>lifestyle products</li>
          </ul>
        </>
      )
    },
    {
      question: "7. Is the event open to the public?",
      answer: "Yes. The event is open to students, staff, and the general public who want to explore and support student businesses."
    },
    {
      question: "8. Why should I attend The Hustle Hub Trade Fair?",
      answer: (
        <>
          <p className="mb-2">Attending the trade fair allows you to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Discover innovative student businesses</li>
            <li>Support young entrepreneurs</li>
            <li>Network with creative and business-minded students</li>
            <li>Purchase unique products and services</li>
          </ul>
        </>
      )
    },
    {
      question: "9. How can I get more information about the event?",
      answer: (
        <ul className="space-y-4">
          <li className="flex flex-col">
            <span className="text-sm font-bold opacity-70 uppercase tracking-wider">Email</span>
            <a href="mailto:tossoutiti7@gmail.com" className="font-medium hover:text-[#F59E0B] transition-colors">tossoutiti7@gmail.com</a>
          </li>
          <li className="flex flex-col">
            <span className="text-sm font-bold opacity-70 uppercase tracking-wider">TikTok</span>
            <span className="font-medium">thehustlehub8</span>
          </li>
          <li className="flex flex-col">
            <span className="text-sm font-bold opacity-70 uppercase tracking-wider">Instagram</span>
            <span className="font-medium">the_hustle_hub_trade_fair</span>
          </li>
          <li className="flex flex-col">
            <span className="text-sm font-bold opacity-70 uppercase tracking-wider">Call line</span>
            <span className="font-medium">0551609424</span>
          </li>
        </ul>
      )
    },
    {
      question: "10. What makes The Hustle Hub special?",
      answer: "The Hustle Hub is more than a market — it is a hub of creativity, innovation, and student hustle, where ideas turn into real businesses and opportunities."
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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold tracking-tighter font-display text-[#4A2411]"
          >
            Get <span className="text-[#F59E0B]">Involved.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Vendor Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px] group border border-black/5"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url(/banner1.jpeg)' }}
            />
            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A2411]/95 via-[#4A2411]/80 to-[#4A2411]/40" />

            <div className="flex-grow relative z-10 flex flex-col justify-end">
              <h3 className="text-4xl font-bold font-display text-white mb-2">Call for Vendors</h3>
              <p className="text-3xl font-bold text-[#F59E0B] mb-6">GHC 600 <span className="text-lg text-white/60 font-medium">/ stand</span></p>
              <p className="text-white/80 mb-6 font-medium text-lg leading-relaxed">
                Secure your spot to showcase your products to thousands of students at the ultimate campus trade fair.
              </p>
              <div className="inline-block bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B] px-4 py-2 rounded-full text-sm font-bold mb-8 self-start backdrop-blur-sm">
                ✨ Special discount for PU Students!
              </div>
              <Link to="/register" className="bg-[#F59E0B] text-white rounded-full px-8 py-4 text-lg font-bold hover:bg-white hover:text-[#4A2411] transition-all duration-300 flex items-center justify-center gap-2 w-full hover:scale-[1.02] shadow-lg shadow-orange-500/30">
                Book a Stand <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>

          {/* Sponsor Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px] group border border-black/5"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url(/banner3.jpeg)' }}
            />
            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A2411]/95 via-[#4A2411]/80 to-[#4A2411]/40" />

            <div className="flex-grow relative z-10 flex flex-col justify-end">
              <h3 className="text-4xl font-bold font-display text-white mb-6">Call for Sponsors</h3>
              <p className="text-white/80 mb-10 font-medium text-lg leading-relaxed">
                Your support goes a long way to promote entrepreneurship, innovation, and practical business development among students.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B]/30 flex items-center justify-center">
                    <Phone size={20} className="text-[#F59E0B]" />
                  </div>
                  <span className="font-bold text-xl tracking-wide text-white">055 160 9424</span>
                </div>
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B]/30 flex items-center justify-center">
                    <Phone size={20} className="text-[#F59E0B]" />
                  </div>
                  <span className="font-bold text-xl tracking-wide text-white">059 677 0671</span>
                </div>
              </div>
              <a href="tel:0596770671" className="bg-white text-[#4A2411] rounded-full px-8 py-4 text-lg font-bold hover:bg-[#F59E0B] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 w-full hover:scale-[1.02] shadow-lg">
                Contact Us <ArrowRight size={20} />
              </a>
            </div>
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
          <a href="https://www.instagram.com/the_hustle_hub_trade_fair/" className="hover:text-[#F59E0B] transition-colors">Instagram</a>
          <a href="https://www.tiktok.com/@thehustlehub8" className="hover:text-[#F59E0B] transition-colors">Tiktok</a>
          <a href="mailto:[ebukanwora@gmail.com]" className="hover:text-[#F59E0B] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
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
