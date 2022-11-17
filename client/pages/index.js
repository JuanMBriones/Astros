import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
// import Landing from './views/Landing';
// import Landing from './views/Landing';

/**
 * @return {Object} The render component
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, []);

  return <></>;
};
