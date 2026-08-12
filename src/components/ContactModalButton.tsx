"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Phone, X } from 'lucide-react';

export default function ContactModalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="hover:text-blue-300 transition-colors font-semibold">
        Contact
      </button>

      {isOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-[#0a1128] border border-blue-500/30 rounded-3xl p-5 md:p-6 max-w-sm w-full shadow-2xl relative translate-y-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full p-2"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Phone className="text-blue-400 w-4 h-4" />
              </div>
              Contact Us
            </h3>
            
            <div className="flex flex-col gap-2">
              {[
                { name: 'Aditya Garg', phone: '99143 38648' },
                { name: 'Rishav', phone: '88267 20756' },
                { name: 'Shubh', phone: '90563 55468' },
                { name: 'Lovish Sharma', phone: '77195 24122' },
              ].map((contact, idx) => (
                <div key={idx} className="bg-white/5 rounded-2xl p-3 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-colors flex justify-between items-center group">
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{contact.name}</span>
                  <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="text-sm font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
