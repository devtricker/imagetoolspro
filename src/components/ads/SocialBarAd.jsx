import { useEffect } from 'react';
import AdWrapper from './AdWrapper';

const SocialBarAd = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl26535103.effectivegatecpm.com/6b/ec/52/6bec52c566872bb8d545d36586267922.js';
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

export default SocialBarAd;
