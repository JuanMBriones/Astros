import '../styles/globals.css';
import {React} from 'react';
import PropTypes from 'prop-types';

/**
 *
 * @param {Object} Component to be rendered
 * @param {Object} pageProps to be passed to the component
 * @return {Object} The render component
 */
function MyApp({Component, pageProps}) {
  return (
    <Component
      {...pageProps}
    />
  );
}

MyApp.propTypes = {
  Component: PropTypes.object,
  pageProps: PropTypes.object,
};

export default MyApp;
