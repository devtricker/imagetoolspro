import { useEffect, useRef } from 'react';
import AdWrapper from './AdWrapper';

const NativeBannerAd = () => {
  const containerRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl26554274.effectivegatecpm.com/ed8b749d1c069f29a2b90dfac9f4ad19/invoke.js';

    if (containerRef.current && containerRef.current.parentNode) {
      containerRef.current.parentNode.insertBefore(script, containerRef.current);
      scriptLoaded.current = true;
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <AdWrapper>
      <div className="flex justify-center my-4">
        <div 
          id="container-ed8b749d1c069f29a2b90dfac9f4ad19" 
          ref={containerRef}
          className="native-banner-ad"
        ></div>
      </div>
    </AdWrapper>
  );
};

export default NativeBannerAd;
