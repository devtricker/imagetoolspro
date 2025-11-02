import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';

const AdWrapper = ({ children }) => {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState('free');

  useEffect(() => {
    if (!user) {
      setUserPlan('free');
      return;
    }

    const userRef = ref(database, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.plan) {
        setUserPlan(data.plan);
      } else {
        setUserPlan('free');
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Don't show ads to premium users
  if (userPlan === 'premium') {
    return null;
  }

  // Show ads to free users and non-logged-in users
  return <>{children}</>;
};

export default AdWrapper;
