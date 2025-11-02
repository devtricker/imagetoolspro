import { useEffect, useRef } from 'react';
import AdWrapper from './AdWrapper';

const BannerAd = () => {
  const bannerRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//www.highperformanceformat.com/f839e2417391cccab5748dac2d0db81c/invoke.js';
    script.async = true;

    const atOptions = document.createElement('script');
    atOptions.type = 'text/javascript';
    atOptions.innerHTML = `
      atOptions = {
        'key' : 'f839e2417391cccab5748dac2d0db81c',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    if (bannerRef.current) {
      bannerRef.current.appendChild(atOptions);
      bannerRef.current.appendChild(script);
      scriptLoaded.current = true;
    }

    return () => {
      if (bannerRef.current) {
        bannerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <AdWrapper>
      <div className="flex justify-center my-4">
        <div ref={bannerRef} className="banner-ad"></div>
      </div>
    </AdWrapper>
  );
};

export default BannerAd;
