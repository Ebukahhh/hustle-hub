import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Store, User, GraduationCap, Building2, Zap, LayoutTemplate } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

type FormData = {
  vendor_type: 'PU Student' | 'External Vendor' | '';
  full_name: string;
  phone: string;
  email: string;
  student_id: string;
  business_name: string;
  industry: string;
  description: string;
  social_handles: string;
  stand_type: 'Standard Table Stand' | 'Double Table Stand' | 'Space Only (Self-setup)' | '';
  electricity_needed: boolean;
  large_equipment: string;
  amount_due: number;
};

const initialFormData: FormData = {
  vendor_type: '',
  full_name: '',
  phone: '',
  email: '',
  student_id: '',
  business_name: '',
  industry: '',
  description: '',
  social_handles: '',
  stand_type: '',
  electricity_needed: false,
  large_equipment: '',
  amount_due: 0,
};

const industries = [
  'Fashion & Apparel',
  'Food & Snacks',
  'Beauty & Cosmetics',
  'Technology / Digital Services',
  'Arts & Crafts',
  'Other'
];

const standOptions = [
  'Standard Table Stand',
  'Double Table Stand',
  'Space Only (Self-setup)'
] as const;

export default function VendorRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 5));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateForm = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVendorTypeSelect = (type: 'PU Student' | 'External Vendor') => {
    updateForm('vendor_type', type);
    updateForm('amount_due', type === 'PU Student' ? 450 : 600);
    setTimeout(handleNext, 400);
  };

  const isStep2Valid = formData.full_name && formData.phone && formData.email && (formData.vendor_type === 'External Vendor' || formData.student_id);
  const isStep3Valid = formData.business_name && formData.industry && formData.description;
  const isStep4Valid = formData.stand_type !== '';

  const handleSubmit = async () => {
    if (!agreed) {
      setError("Please agree to the terms and regulations to proceed.");
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      // 1. Insert into Supabase
      const { data: vendor, error: dbError } = await supabase
        .from('vendors')
        .insert([{
          vendor_type: formData.vendor_type,
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          student_id: formData.vendor_type === 'PU Student' ? formData.student_id : null,
          business_name: formData.business_name,
          industry: formData.industry,
          description: formData.description,
          social_handles: formData.social_handles,
          stand_type: formData.stand_type,
          electricity_needed: formData.electricity_needed,
          large_equipment: formData.large_equipment,
          amount_due: formData.amount_due,
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      // 2. Call Edge Function to init Paystack
      const { data: paystackData, error: funcError } = await supabase.functions.invoke('paystack-init', {
        body: {
          email: formData.email,
          amount: formData.amount_due,
          reference: vendor.id,
        }
      });

      if (funcError) throw funcError;

      if (paystackData?.authorization_url) {
        // Redirect to Paystack
        window.location.href = paystackData.authorization_url;
      } else {
        throw new Error(paystackData?.error || "Failed to get authorization URL from Paystack");
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold font-display text-[#4A2411] mb-4">Vendor Type</h2>
              <p className="text-lg text-[#4A2411]/70">Select your registration category to determine your pricing.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => handleVendorTypeSelect('PU Student')}
                className={`flex flex-col items-center justify-center p-10 rounded-[2rem] border-2 transition-all duration-300 group relative overflow-hidden ${
                  formData.vendor_type === 'PU Student' 
                    ? 'border-[#F59E0B] bg-[#F59E0B]/5' 
                    : 'border-[#4A2411]/10 hover:border-[#F59E0B]/50 hover:bg-[#F59E0B]/5 bg-white'
                }`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${
                  formData.vendor_type === 'PU Student' ? 'bg-[#F59E0B] text-white' : 'bg-[#4A2411]/5 text-[#4A2411] group-hover:text-[#F59E0B]'
                }`}>
                  <GraduationCap size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[#4A2411] mb-2">PU Student</h3>
                <p className="text-3xl font-bold text-[#F59E0B]">GH₵ 450</p>
                {formData.vendor_type === 'PU Student' && (
                  <motion.div layoutId="selected-check" className="absolute top-6 right-6 text-[#F59E0B]">
                    <CheckCircle2 size={28} weight="fill" />
                  </motion.div>
                )}
              </button>

              <button
                onClick={() => handleVendorTypeSelect('External Vendor')}
                className={`flex flex-col items-center justify-center p-10 rounded-[2rem] border-2 transition-all duration-300 group relative overflow-hidden ${
                  formData.vendor_type === 'External Vendor' 
                    ? 'border-[#4A2411] bg-[#4A2411]/5' 
                    : 'border-[#4A2411]/10 hover:border-[#4A2411]/50 hover:bg-[#4A2411]/5 bg-white'
                }`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${
                  formData.vendor_type === 'External Vendor' ? 'bg-[#4A2411] text-white' : 'bg-[#4A2411]/5 text-[#4A2411] group-hover:text-[#4A2411]'
                }`}>
                  <Store size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[#4A2411] mb-2">External Vendor</h3>
                <p className="text-3xl font-bold text-[#4A2411]">GH₵ 600</p>
                {formData.vendor_type === 'External Vendor' && (
                  <motion.div layoutId="selected-check" className="absolute top-6 right-6 text-[#4A2411]">
                    <CheckCircle2 size={28} weight="fill" />
                  </motion.div>
                )}
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold font-display text-[#4A2411] mb-4">Personal Info</h2>
              <p className="text-lg text-[#4A2411]/70">Tell us a bit about yourself.</p>
            </div>

            <div className="space-y-6 bg-white p-8 md:p-10 rounded-[2rem] border border-[#4A2411]/10 shadow-sm">
              <div>
                <label className="block text-sm font-bold text-[#4A2411]/70 uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => updateForm('full_name', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#4A2411]/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A2411]/70 uppercase tracking-wider mb-2">Phone Number (MoMo) *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#4A2411]/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                  placeholder="e.g. 055 123 4567"
                  required
                />
                <p className="text-xs text-[#4A2411]/50 mt-2 font-medium">Please provide your Mobile Money number for the payment prompt.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A2411]/70 uppercase tracking-wider mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#4A2411]/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <AnimatePresence>
                {formData.vendor_type === 'PU Student' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                       <label className="block text-sm font-bold text-[#4A2411]/70 uppercase tracking-wider mb-2">Student ID Number *</label>
                       <input
                         type="text"
                         value={formData.student_id}
                         onChange={(e) => updateForm('student_id', e.target.value)}
                         className="w-full bg-[#F59E0B]/5 border border-[#F59E0B]/30 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all text-[#4A2411]"
                         placeholder="e.g. PU123456"
                         required
                       />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center pt-6">
              <button onClick={handleBack} className="text-[#4A2411]/60 hover:text-[#4A2411] font-bold py-4 px-6 flex items-center gap-2 transition-colors">
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                onClick={handleNext} 
                disabled={!isStep2Valid}
                className="bg-[#4A2411] text-white rounded-full px-8 py-4 font-bold hover:bg-[#F59E0B] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-[#4A2411]"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold font-display text-[#4A2411] mb-4">Business Profile</h2>
              <p className="text-lg text-[#4A2411]/70">What are you bringing to Hustle Hub?</p>
            </div>

            <div className="space-y-6 bg-white p-8 md:p-10 rounded-[2rem] border border-[#4A2411]/10 shadow-sm">
              <div>
                <label className="block text-sm font-bold text-[#4A2411]/70 uppercase tracking-wider mb-2">Business / Brand Name *</label>
                <div className="relative">
                  <Store className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4A2411]/40" size={20} />
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => updateForm('business_name', e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#4A2411]/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A2411]/70 uppercase tracking-wider mb-2">Industry / Category *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {industries.map(ind => (
                    <button
                      key={ind}
                      onClick={() => updateForm('industry', ind)}
                      className={`text-sm md:text-base p-4 rounded-xl border text-center transition-all ${
                        formData.industry === ind
                          ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B] font-bold'
                          : 'border-[#4A2411]/10 text-[#4A2411]/70 hover:border-[#F59E0B]/50 hover:bg-[#FAFAFA]'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A2411]/70 uppercase tracking-wider mb-2">Brief Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#4A2411]/10 rounded-2xl px-6 py-4 min-h-[120px] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all resize-none"
                  placeholder="What are you selling? Describe your products/services..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A2411]/70 uppercase tracking-wider mb-2">Social Media Handles</label>
                <input
                  type="text"
                  value={formData.social_handles}
                  onChange={(e) => updateForm('social_handles', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#4A2411]/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                  placeholder="@yourbrand on IG / TikTok"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-6">
              <button onClick={handleBack} className="text-[#4A2411]/60 hover:text-[#4A2411] font-bold py-4 px-6 flex items-center gap-2 transition-colors">
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                onClick={handleNext} 
                disabled={!isStep3Valid}
                className="bg-[#4A2411] text-white rounded-full px-8 py-4 font-bold hover:bg-[#F59E0B] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-[#4A2411]"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold font-display text-[#4A2411] mb-4">Stand Requirements</h2>
              <p className="text-lg text-[#4A2411]/70">Let us know how to prepare for you.</p>
            </div>

            <div className="space-y-8 bg-white p-8 md:p-10 rounded-[2rem] border border-[#4A2411]/10 shadow-sm">
              <div>
                <label className="block text-sm font-bold text-[#4A2411]/70 uppercase tracking-wider mb-4">Preferred Stand Type *</label>
                <div className="space-y-4">
                  {standOptions.map(stand => (
                    <button
                      key={stand}
                      onClick={() => updateForm('stand_type', stand)}
                      className={`w-full flex items-center p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.stand_type === stand
                          ? 'border-[#F59E0B] bg-[#F59E0B]/5 shadow-sm'
                          : 'border-[#4A2411]/10 hover:border-[#F59E0B]/50 hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${
                        formData.stand_type === stand ? 'bg-[#F59E0B] text-white' : 'bg-[#4A2411]/5 text-[#4A2411]/50'
                      }`}>
                         <LayoutTemplate size={24} />
                      </div>
                      <span className={`text-lg font-bold ${formData.stand_type === stand ? 'text-[#4A2411]' : 'text-[#4A2411]/70'}`}>
                        {stand}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#4A2411]/10">
                <label className="block text-sm font-bold text-[#4A2411]/70 uppercase tracking-wider mb-4">Electricity Needed? *</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => updateForm('electricity_needed', true)}
                    className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 font-bold transition-all ${
                      formData.electricity_needed === true
                        ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B]'
                        : 'border-[#4A2411]/10 text-[#4A2411]/70 hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <Zap size={20} className="mr-2" /> Yes
                  </button>
                  <button
                    onClick={() => updateForm('electricity_needed', false)}
                    className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 font-bold transition-all ${
                      formData.electricity_needed === false
                        ? 'border-[#4A2411] bg-[#4A2411]/5 text-[#4A2411]'
                        : 'border-[#4A2411]/10 text-[#4A2411]/70 hover:bg-[#FAFAFA]'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A2411]/70 uppercase tracking-wider mb-2">Large Equipment? (Optional)</label>
                <textarea
                  value={formData.large_equipment}
                  onChange={(e) => updateForm('large_equipment', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#4A2411]/10 rounded-2xl px-6 py-4 min-h-[100px] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all resize-none"
                  placeholder="If you are bringing deep fryers, large displays, generators, etc. let us know."
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-6">
              <button onClick={handleBack} className="text-[#4A2411]/60 hover:text-[#4A2411] font-bold py-4 px-6 flex items-center gap-2 transition-colors">
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                onClick={handleNext} 
                disabled={!isStep4Valid}
                className="bg-[#4A2411] text-white rounded-full px-8 py-4 font-bold hover:bg-[#F59E0B] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-[#4A2411]"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold font-display text-[#4A2411] mb-4">Complete Your Order</h2>
              <p className="text-lg text-[#4A2411]/70">Review details and secure your spot.</p>
            </div>

            <div className="bg-[#4A2411] text-white p-8 md:p-12 rounded-[2rem] shadow-xl relative overflow-hidden">
               {/* Decorative background circle */}
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#F59E0B] rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>

               <h3 className="text-xl text-white/60 uppercase tracking-widest font-bold mb-8 border-b border-white/10 pb-4">Order Summary</h3>
               
               <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg opacity-80">Category</span>
                    <span className="font-bold">{formData.vendor_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg opacity-80">Stand Type</span>
                    <span className="font-bold text-right">{formData.stand_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg opacity-80">Business</span>
                    <span className="font-bold">{formData.business_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg opacity-80">Electricity</span>
                    <span className="font-bold">{formData.electricity_needed ? 'Yes' : 'No'}</span>
                  </div>
               </div>

               <div className="border-t border-white/20 pt-6 pb-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="block text-sm opacity-70 uppercase tracking-wider mb-1 font-bold">Total to Pay</span>
                    </div>
                    <div className="text-5xl font-bold font-display text-[#F59E0B]">
                      GH₵ {formData.amount_due}
                    </div>
                  </div>
               </div>

               <label className="flex items-start gap-4 cursor-pointer group mt-4">
                 <div className="mt-1 relative flex items-center justify-center">
                   <input 
                     type="checkbox" 
                     className="peer sr-only"
                     checked={agreed}
                     onChange={(e) => setAgreed(e.target.checked)}
                   />
                   <div className="w-6 h-6 border-2 border-white/30 rounded flex items-center justify-center peer-checked:bg-[#F59E0B] peer-checked:border-[#F59E0B] transition-all">
                     <CheckCircle2 size={16} className="text-[#4A2411] opacity-0 peer-checked:opacity-100" />
                   </div>
                 </div>
                 <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity leading-relaxed">
                   I agree to the Hustle Hub terms and regulations. I understand that my spot is only confirmed upon successful payment.
                 </span>
               </label>

               {error && (
                 <div className="mt-6 bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm font-medium text-center">
                   {error}
                 </div>
               )}

               <button
                 onClick={handleSubmit}
                 disabled={!agreed || submitting}
                 className="mt-8 w-full bg-[#F59E0B] text-white rounded-full px-8 py-5 text-lg font-bold hover:bg-white hover:text-[#4A2411] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[#F59E0B] disabled:hover:text-white"
               >
                 {submitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                    <>Proceed to Payment (MoMo/Card) <ArrowRight size={20} /></>
                 )}
               </button>
            </div>

            <div className="flex justify-start pt-6">
              <button 
                onClick={handleBack} 
                disabled={submitting}
                className="text-[#4A2411]/60 hover:text-[#4A2411] font-bold py-4 px-6 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <ArrowLeft size={20} /> Back
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      {/* Simple Header */}
      <header className="px-6 md:px-10 py-6 flex items-center justify-between border-b border-[#4A2411]/5 bg-white sticky top-0 z-50 shadow-sm">
        <Link to="/" className="flex items-center gap-3 group">
           <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F59E0B] text-white font-bold text-xs group-hover:scale-110 transition-transform">HH</div>
           <span className="font-bold text-[#4A2411] tracking-widest uppercase text-sm hidden sm:block">Hustle Hub</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-[#4A2411]/60 hover:text-[#F59E0B] transition-colors">
          Cancel Registration
        </Link>
      </header>

      <main className="flex-grow flex flex-col pt-12 pb-24 px-6">
        <div className="w-full max-w-2xl mx-auto">
          
          {/* Progress Bar */}
          <div className="mb-12 relative">
            <div className="flex justify-between items-center relative z-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-sm ${
                    step === i 
                      ? 'bg-[#F59E0B] text-white scale-110 ring-4 ring-[#F59E0B]/20' 
                      : step > i 
                        ? 'bg-[#4A2411] text-white' 
                        : 'bg-white text-[#4A2411]/40 border border-[#4A2411]/10'
                  }`}
                >
                  {step > i ? <CheckCircle2 size={18} /> : i}
                </div>
              ))}
            </div>
            {/* Background Track */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white border border-[#4A2411]/5 -translate-y-1/2 z-0 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#4A2411]"
                initial={{ width: '0%' }}
                animate={{ width: `${((step - 1) / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          <div className="min-h-[500px]">
             <AnimatePresence mode="wait">
               {renderStep()}
             </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
