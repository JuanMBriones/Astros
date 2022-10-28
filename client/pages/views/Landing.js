/* eslint-disable require-jsdoc */
/* eslint-disable react/prop-types */
import React from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import styles from '../../styles/Landing.module.css';
import Typed from 'react-typed';
import Stack from '@mui/material/Stack';
import Image from 'next/image';

const anchors = ['firstPage', 'secondPage', 'thirdPage'];
const bannerStrings = [
  'Crea un horario nuevo 🚀',
  'Organiza tu vida en el Tec ✨',
  'Una vida sin problemas de horarios 🤩',
];

class MySection extends React.Component {
  render() {
    return (
      <div className="section">
        <h3>{this.props.content}</h3>
        <h3>{this.props.content}</h3>
      </div>
    );
  }
}

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
            <MySection className={styles.landing} content={'Keep going!'} />
            <MySection className={styles.landing} content={'Slide up!'} />
          </div>
        );
      }}
    />
  );
};
