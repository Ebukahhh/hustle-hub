import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import VendorRegistration from './pages/VendorRegistration';
import PaymentCallback from './pages/PaymentCallback';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<VendorRegistration />} />
        <Route path="/payment-callback" element={<PaymentCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

