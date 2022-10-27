/* eslint-disable react/prop-types */
import React from 'react';
import ReactFullpage from '@fullpage/react-fullpage';

const anchors = ['firstPage', 'secondPage', 'thirdPage'];

/**
 * @return {Object} The render component
 * @param {Object} hideNavbarFooter
 * @param {Object} setHideNavbarFooter
 */
export default function Landing(hideNavbarFooter, setHideNavbarFooter) {
  // get props
  // get page props
  // const setHideNavbarFooter = props;
  // setHideNavbarFooter(true);
  // setHideNavbarFooter(true);
  console.log(hideNavbarFooter);

  return (
    <ReactFullpage
      anchors={anchors}
      navigation
      navigationTooltips={anchors}
      sectionsColor={['#282c34', '#ff5f45', '#0798ec']}
      onLeave={(origin, destination, direction) => {
        console.log('onLeave event', {origin, destination, direction});
      }}
      render={({state, fullpageApi}) => {
        console.log('render prop change', state, fullpageApi); // eslint-disable-line no-console

        return (
          <ReactFullpage.Wrapper>
            <div className="section">
              <p>Section 1 (welcome to fullpage.js)</p>
              <button onClick={() => fullpageApi.moveSectionDown()}>
                Click me to move down
              </button>
            </div>
            <div className="section">
              <p>Section 2</p>
            </div>
            <div className="section">
              <p>Section 3</p>
            </div>
          </ReactFullpage.Wrapper>
        );
      }}
    />
  );
};
