
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from './useAnalytics';

export const usePageTracking = () => {
  const location = useLocation();
  const { trackVisit } = useAnalytics();

  useEffect(() => {
    // Extract referral code from URL if present
    const urlParams = new URLSearchParams(location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode) {
      // Store referral code in localStorage for later use
      localStorage.setItem('referralCode', referralCode);
      
      // Remove ref parameter from URL for cleaner experience
      const newUrl = window.location.pathname + window.location.search.replace(/[?&]ref=[^&]*/, '').replace(/^&/, '?');
      window.history.replaceState({}, '', newUrl);
    }

    // Track page visit
    trackVisit(location.pathname);
  }, [location.pathname, location.search, trackVisit]);
};
