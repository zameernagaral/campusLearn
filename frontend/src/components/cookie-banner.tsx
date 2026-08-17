'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed the banner
    const consent = localStorage.getItem('campuslearn_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('campuslearn_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:max-w-sm z-[100] p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Cookies & Privacy</h3>
        <button onClick={acceptCookies} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" aria-label="Close">
          <X size={16} />
        </button>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        We use strictly necessary cookies to keep you securely logged in. We do not use third-party tracking or advertising cookies. By using our site, you agree to our <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>.
      </p>
      <div className="pt-2">
        <button onClick={acceptCookies} className="btn bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs py-2 px-4 w-full flex justify-center items-center">
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
