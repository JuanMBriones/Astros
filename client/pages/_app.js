import '../styles/globals.css';
import {React, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import MuiNavbar from './components/MuiNavbar';
import Login from './login';
import Footer from './components/Footer';
import {useRouter} from 'next/router';

/**
 *
 * @param {Object} Component to be rendered
 * @param {Object} pageProps to be passed to the component
 * @return {Object} The render component
 */
function MyApp({Component, pageProps}) {
  const [hideNavbarFooter, setHideNavbarFooter] = useState(false);
  const [user, setUser] = useState(undefined);
  const {asPath} = useRouter();

  useEffect(() => {
    if (asPath === '/') {
      setHideNavbarFooter(true);
    }
    // setUser('test');

    if (localStorage.getItem('loginData')) {
      setUser(localStorage.getItem('loginData'));
    }
  }, []);

  return (
    <>
      {
        !hideNavbarFooter ? (
          <MuiNavbar />
        ) : null
      }
      <Component
        {...pageProps}
      />
      {
        !hideNavbarFooter ? (
          <Footer />
        ) : null
      }
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.object,
  pageProps: PropTypes.object,
};

export default MyApp;
