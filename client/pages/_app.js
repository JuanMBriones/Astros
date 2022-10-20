import '../styles/globals.css';
import {React, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import MuiNavbar from './components/MuiNavbar';
import Login from './login';

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
    localStorage.setItem('user', 'test');
    if (localStorage.getItem('user')) {
      setUser(localStorage.getItem('user'));
    }
  }, []);

  return (
    <>
      <MuiNavbar />
      {
        user !== undefined ?
          <Login /> :
          <h1>Test</h1>
      }
      <Component
        {...pageProps}
      />
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.object,
  pageProps: PropTypes.object,
};

export default MyApp;
