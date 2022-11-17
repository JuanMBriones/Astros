import '../styles/globals.css';
import {React, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
// import MuiNavbar from './components/MuiNavbar';
// import Login from './login';
import Footer from './components/Footer';
import {useRouter} from 'next/router';
import AnimatedNav from './components/NavBar/AnimatedNav';
import axios from 'axios';

/**
   * getSanitizedPath - Sanitizes the path to remove the query params
   * @param {*} urlPath
   * @return {String}
   */
function getSanitizedPath(urlPath) {
  return urlPath.split('#')[0].split('?')[0];
}

/**
 *
 * @param {Object} Component to be rendered
 * @param {Object} pageProps to be passed to the component
 * @return {Object} The render component
 */
function MyApp({Component, pageProps}) {
  const [hideNavbarFooter, setHideNavbarFooter] = useState(false);
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userNomina, setUserNomina] = useState('L00000000');
  const barLabels = ['Home', 'About', 'Contact', 'Blog', 'Support'];
  const backMenu = {
    'color': 'orange',
    'onClick': () => {
      setNavInfo(defaultNavInfo);
    },
  };


  const defaultNavInfo = {
    'Home': {
      'condition': 1,
      'url': '/',
      'color': 'orange',
    },
    'Mi Horario': {
      'condition': getSanitizedPath(useRouter().asPath) !== '/login',
      'url': `/views/Horario?professor=${userNomina}`,
      'color': 'orange',
    },
    'Profesores': {
      'condition': isAdmin,
      'color': 'orange',
      'children': {
        'Horario & clases': {
          'url': '/views/Profesores',
          'color': 'orange',
        },
        'Agregar profesores': {
          'condition': isAdmin? 1 : 0,
          'url': '/newProfe',
          'color': 'orange',
        },
        'Agregar profesores con archivo': {
          'condition': isAdmin? 1 : 0,
          'url': '/uploadProfe',
          'color': 'orange',
        },
        '←': backMenu,
      },
      'onClick': () => {
        setNavInfo(defaultNavInfo.Profesores.children);
      },
    },
    'Clases': {
      'condition': isAdmin,
      'children': {
        'Asignar Clases': {
          'url': '/views/Clases',
          'color': 'orange',
        },
        'Agregar Clases': {
          'url': '/newClase',
          'color': 'orange',
        },
        'Agregar Clases por Archivo': {
          'url': '/uploadClase',
          'color': 'orange',
        },
        '←': backMenu,
      },
      'onClick': () => {
        console.log(defaultNavInfo);

        setNavInfo(defaultNavInfo.Clases.children);
      },
      'color': 'blue',
    },
    'Logout': {
      'condition': getSanitizedPath(useRouter().asPath) !== '/login',
      'onClick': async () => {
        await localStorage.removeItem('professor');
        await localStorage.removeItem('loginData');
        await router.push('/login');
      },
      'url': '/login',
      'color': 'red',
    },
  };

  useEffect(() => {
    const profInfo = localStorage.getItem('professor');
    if (profInfo) {
      const profInfoJson = JSON.parse(profInfo);
      setUserNomina(profInfoJson.profe.nomina);
      axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/isAdmin/`,
        data: {
          nomina: profInfoJson.profe.nomina,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.data.message === 'Profesor is admin') {
          setIsAdmin(true);
          console.log('POWER🤑');

          console.log(navInfo);
          const newNavInfo = defaultNavInfo;
          newNavInfo['Clases']['condition'] = 1;
          newNavInfo['Profesores']['condition'] = 1;
          newNavInfo['Mi Horario']['condition'] = 1;
          newNavInfo['Mi Horario']['url'] = `/views/Horario?professor=${profInfoJson.profe.nomina}`;

          console.log(newNavInfo);
          setNavInfo(newNavInfo);
        } else {
          setIsAdmin(false);
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log('not logged in');
    }
  }, []);

  const [navInfo, setNavInfo] = useState(defaultNavInfo);

  const {asPath} = useRouter();
  // barLabels.forEach((key, i) => (navInfo[key] = colors[i]));

  useEffect(() => {
    console.log('asPath', asPath);
    const rawUrl = getSanitizedPath(asPath);
    if (rawUrl === '/') {
      setHideNavbarFooter(true);
    }
    // setUser('test');

    if (localStorage.getItem('loginData')) {
      setUser(localStorage.getItem('loginData'));

      console.log('user', user);
      console.log(localStorage.getItem('loginData'));
    }

    let auxNav = defaultNavInfo;
    auxNav = Object.fromEntries(Object.entries(defaultNavInfo).filter(([key, value]) => value.condition == 1)); // for filtering

    setNavInfo(auxNav);
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
