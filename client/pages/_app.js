import '../styles/globals.css';
import {React, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
// import MuiNavbar from './components/MuiNavbar';
// import Login from './login';
import Footer from './components/Footer';
import {useRouter} from 'next/router';
import AnimatedNav from './components/NavBar/AnimatedNav';

/**
 *
 * @param {Object} Component to be rendered
 * @param {Object} pageProps to be passed to the component
 * @return {Object} The render component
 */
function MyApp({Component, pageProps}) {
  const [hideNavbarFooter, setHideNavbarFooter] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(undefined);
  const barLabels = ['Home', 'About', 'Contact', 'Blog', 'Support'];
  const navInfo = {
    'Home': {
      'url': '/',
      'color': 'orange',
    },
    'About': {
      'url': '/about',
      'color': 'blue',
    },
    'Contact': {
      'url': '/contact',
      'color': 'purple',
    },
    'Blog': {
      'url': '/blog',
      'color': 'green',
    },
    'Support': {
      'url': '/support',
      'color': 'red',
    },
  };
  const {asPath} = useRouter();
  // barLabels.forEach((key, i) => (navInfo[key] = colors[i]));

  useEffect(() => {
    if (asPath === '/') {
      setHideNavbarFooter(true);
    }
    setUser('test');

    if (localStorage.getItem('loginData')) {
      setUser(localStorage.getItem('loginData'));
    }
  }, []);

  return (
    <>
      {
        !hideNavbarFooter ? (
          <AnimatedNav barLabels={barLabels} navInfo={navInfo} />
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
