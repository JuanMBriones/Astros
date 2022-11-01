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
  const backMenu = {
    'color': 'orange',
    'onClick': () => {
      setNavInfo(defaultNavInfo);
    },
  };

  let defaultNavInfo = {
    'Home': {
      'condition': 1,
      'url': '/',
      'color': 'orange',
    },
    'Profesores': {
      'condition': 1,
      'color': 'orange',
      'children': {
        'Horario & clases': {
          'url': '/views/Profesores',
          'color': 'orange',
        },
        'Agregar profesores': {
          'url': '/',
          'color': 'orange',
        },
        '←': backMenu,
      },
      'onClick': () => {
        setNavInfo(defaultNavInfo.Profesores.children);
      },
    },
    'Clases': {
      'condition': 1,
      'children': {
        'Asignar Profesores': {
          'url': '/views/ClasesProfesor',
          'color': 'orange',
        },
        'Agregar Clases': {
          'url': '/',
          'color': 'orange',
        },
        'Agregar Clases por Archivo': {
          'url': '/uploadFile',
          'color': 'orange',
        },
        '←': backMenu,
      },
      'onClick': () => {
        setNavInfo(defaultNavInfo.Clases.children);
      },
      'color': 'blue',
    },
    'Logout': {
      'condition': 1,
      'url': '/login',
      'color': 'red',
    },
  };

  const [navInfo, setNavInfo] = useState(defaultNavInfo);

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

    defaultNavInfo = Object.fromEntries(Object.entries(defaultNavInfo).filter(([key, value]) => value.condition == 1)); // for filtering
    console.log(defaultNavInfo);
    setNavInfo(defaultNavInfo);
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
