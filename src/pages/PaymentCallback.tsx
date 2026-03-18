import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle2, XCircle, Loader2, Home, ArrowRight } from 'lucide-react';

type PaymentStatus = 'loading' | 'confirmed' | 'pending' | 'failed';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [vendorName, setVendorName] = useState('');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        // Poll Supabase to check if the webhook has updated the status
        const { data, error } = await supabase
          .from('vendors')
          .select('payment_status, full_name')
          .eq('reference_id', reference)
          .single();

        if (error || !data) {
          console.error('Error checking payment status:', error);
          setStatus('failed');
          return;
        }

        setVendorName(data.full_name);

        if (data.payment_status === 'confirmed') {
          setStatus('confirmed');
        } else if (data.payment_status === 'failed') {
          setStatus('failed');
        } else {
          setStatus('pending');
          // Retry in 3 seconds — the webhook may not have fired yet
          setTimeout(checkPaymentStatus, 3000);
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setStatus('failed');
      }
    };

    checkPaymentStatus();
  }, [reference]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg text-center">

        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#F59E0B] text-white font-bold text-sm group-hover:scale-110 transition-transform">HH</div>
          <span className="font-bold text-[#4A2411] tracking-widest uppercase text-sm">Hustle Hub</span>
        </Link>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="bg-white p-12 rounded-[2rem] border border-[#4A2411]/10 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-6">
              <Loader2 size={40} className="text-[#F59E0B] animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-[#4A2411] mb-3 font-display">Verifying Payment...</h2>
            <p className="text-[#4A2411]/60">Please wait while we confirm your payment with Paystack.</p>
          </div>
        )}

        {/* Pending State (webhook hasn't fired yet) */}
        {status === 'pending' && (
          <div className="bg-white p-12 rounded-[2rem] border border-[#F59E0B]/30 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-6">
              <Loader2 size={40} className="text-[#F59E0B] animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-[#4A2411] mb-3 font-display">Processing Payment...</h2>
            <p className="text-[#4A2411]/60 mb-2">Your payment is being processed. This may take a moment.</p>
            <p className="text-sm text-[#4A2411]/40">We're waiting for confirmation from Paystack...</p>
          </div>
        )}

        {/* Success State */}
        {status === 'confirmed' && (
          <div className="bg-white p-12 rounded-[2rem] border border-green-200 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#4A2411] mb-3 font-display">Payment Confirmed! 🎉</h2>
            {vendorName && (
              <p className="text-lg text-[#4A2411]/80 mb-2">Welcome aboard, <strong>{vendorName}</strong>!</p>
            )}
            <p className="text-[#4A2411]/60 mb-6">Your vendor registration is now complete. A confirmation email has been sent to your inbox.</p>
            
            <div className="bg-[#4A2411] text-white p-6 rounded-2xl mb-8">
              <h3 className="text-[#F59E0B] font-bold mb-2">What's Next?</h3>
              <p className="text-sm text-white/80">Check your email for event details, stall setup instructions, and the official vendor packet.</p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#F59E0B] text-white rounded-full px-8 py-4 font-bold hover:bg-[#4A2411] transition-all duration-300 shadow-lg"
            >
              <Home size={20} /> Back to Home <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Failed State */}
        {status === 'failed' && (
          <div className="bg-white p-12 rounded-[2rem] border border-red-200 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#4A2411] mb-3 font-display">Payment Issue</h2>
            <p className="text-[#4A2411]/60 mb-6">We couldn't verify your payment. This could mean the payment was cancelled or there was a network issue.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#4A2411] text-white rounded-full px-8 py-4 font-bold hover:bg-[#F59E0B] transition-all duration-300"
              >
                Try Again
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#4A2411] border-2 border-[#4A2411]/20 rounded-full px-8 py-4 font-bold hover:border-[#F59E0B] transition-all duration-300"
              >
                <Home size={20} /> Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
