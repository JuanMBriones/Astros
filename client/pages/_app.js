import '../styles/globals.css';
import {React, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import MuiNavbar from './components/MuiNavbar';
import Login from './login';
import Footer from './components/footer';

/**
 *
 * @param {Object} Component to be rendered
 * @param {Object} pageProps to be passed to the component
 * @return {Object} The render component
 */
function MyApp({Component, pageProps}) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // setUser('test');
    if (localStorage.getItem('loginData')) {
      setUser(localStorage.getItem('loginData'));
    }
  }, []);

  return (
    <>
      <MuiNavbar />
      {
        user === undefined ?
          (
            <Login />
          ) : (
            <h1>Authenticated</h1>
          )
      }
      <Component
        {...pageProps}
      />
      <Footer />
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.object,
  pageProps: PropTypes.object,
};

export default MyApp;
