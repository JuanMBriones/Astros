/* eslint-disable require-jsdoc */
/* eslint-disable react/prop-types */
import React from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import styles from '../../styles/Landing.module.css';
import Typed from 'react-typed';
import Stack from '@mui/material/Stack';

const anchors = ['firstPage', 'secondPage', 'thirdPage'];
const bannerStrings = [
  'Sistema de inscripciones para profesores',
  'Inscripciones de clases y profesores',
];


/**
 * @return {Object} The render component
 */
export default function Landing() {
  return (
    <ReactFullpage
      anchors={anchors}
      navigation
      navigationTooltips={anchors}
      sectionsColor={['#282c34', '#ff5f45', '#0798ec']}
      onLeave={(origin, destination, direction) => {
        console.log('onLeave event', {origin, destination, direction});
      }}
      className={styles.landing}
      render={({state, fullpageApi}) => {
        console.log('render prop change', state, fullpageApi); // eslint-disable-line no-console

        return (
          <div>
            <div className="section"
              style={{
                height: '100vh',
              }}
            >
              <Stack direction="row" spacing={2}>
                <Typed
                  strings={bannerStrings}
                  typeSpeed={40}
                  backSpeed={50}
                  loop
                  style={{
                    fontSize: '5rem',
                    color: 'white',
                  }}
                />
              </Stack>
            </div>

            {/* Seccion 2 */}
            <div className='h-screen md:flex justify-between py-20 px-10 bg-gradient-to-r from-indigo-500 to-blue-500 text-indigo-100'>
              {/* MidPage izquierdo*/}
              <div className='md:w-1/2 mb-10 md:mb-0'>
                <h2 className='text-2xl md:text-4xl lg:text-5xl text-white mb-9'>Bienvenido al sistema de inscripciones para profesores</h2>
                <p className='md:text-2xl lg:text-2xl mb-10'>Espíritu emprendedor con sentido humano</p>

                <a href='/../login' className='inline-block py-3 px-14 text-yellow-700 bg-yellow-400 hover:bg-yellow-300 hover:text-yellow-800 rounded transition ease-in duration-150'>Login</a>

              </div>
              {/* MidPage derecho */}
              <div className='md:w-1/2'>
                <img src="https://tec.mx/sites/default/files/2017-06/colegiaturas.jpg" alt="Profesores" className="w-full rounded shadow-2xl"></img>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};
