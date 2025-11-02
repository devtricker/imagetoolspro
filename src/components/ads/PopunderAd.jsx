import { useEffect } from 'react';
import AdWrapper from './AdWrapper';

const PopunderAd = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl26554245.effectivegatecpm.com/9a/05/78/9a05787efb9cda1432a99aed5b47d10a.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <AdWrapper>
      {null}
    </AdWrapper>
  );
};

export default PopunderAd;
